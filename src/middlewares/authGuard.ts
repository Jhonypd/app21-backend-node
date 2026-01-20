import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Claims, ClaimsAuthSala } from "../lib/jwt";
import { sessaoUsuarioService } from "../services/auth/sessao-usuario.service";
import { refreshTokenService } from "../services/auth/refresh-token.service";
import { pessoaService } from "../services/pessoas/pessoa.service";
import { respostaErro } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: Claims;
      sala?: ClaimsAuthSala;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET as string;

// ==================== FUNÇÕES AUXILIARES ====================

/**
 * Processa e valida o token de sala (opcional)
 */
function processarTokenSala(tokenSala: string): ClaimsAuthSala | null {
  try {
    return jwt.verify(tokenSala, jwtSecret) as ClaimsAuthSala;
  } catch (error) {
    console.warn("Token de sala inválido, ignorando:", error);
    return null;
  }
}

/**
 * Valida os dados da pessoa (inativo, email confirmado, etc)
 */
async function validarPessoa(usuarioId: string, res: Response): Promise<any> {
  const pessoa = await pessoaService.obterDadosConta(usuarioId);

  if (!pessoa) {
    res.status(401).json(
      respostaErro({
        mensagem: "Usuário não encontrado.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
    return null;
  }

  if (pessoa.inativo) {
    res
      .status(403)
      .json(respostaErro({ mensagem: "Usuário inativo.", codigoRetorno: 403 }));
    return null;
  }

  if (!pessoa.email_confirmado) {
    res.status(403).json(
      respostaErro({
        mensagem: "E-mail não confirmado.",
        codigoRetorno: 403,
      }),
    );
    return null;
  }

  return pessoa;
}

/**
 * Tenta fazer refresh automático do token
 */
async function tentarRefreshAutomatico(
  refreshToken: string | undefined,
  res: Response,
): Promise<{
  claims: Claims;
  novosTokens: { access: string; refresh: string };
} | null> {
  if (!refreshToken) {
    res.status(401).json(
      respostaErro({
        mensagem: "Sessão expirada. Faça login novamente.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
    return null;
  }

  try {
    const resultado = await refreshTokenService.refresh(refreshToken);
    const claims = jwt.verify(resultado.tokenAcesso.token, jwtSecret) as Claims;

    return {
      claims,
      novosTokens: {
        access: resultado.tokenAcesso.token,
        refresh: resultado.refreshToken.token,
      },
    };
  } catch (error) {
    console.error("Erro ao fazer refresh automático:", error);
    res.status(401).json(
      respostaErro({
        mensagem: "Sessão expirada. Faça login novamente.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
    return null;
  }
}

// ==================== MIDDLEWARE PRINCIPAL ====================

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ==================== 1. EXTRAÇÃO DOS TOKENS ====================
  const authHeader = req.headers.authorization;
  const tokenSala = req.headers["x-token-sala"] as string | undefined;
  const refreshToken = req.headers["x-refresh-token"] as string | undefined;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json(
        respostaErro({ mensagem: "Token não informado.", codigoRetorno: 401 }),
      );
  }

  try {
    // ==================== 2. VERIFICAÇÃO DO TOKEN ====================
    const decoded = jwt.verify(token, jwtSecret) as Claims;

    // ==================== 3. VALIDAÇÃO DA SESSÃO ====================
    const sessaoUsuario = await sessaoUsuarioService.buscarSessaoAtivaPorId(
      decoded.Ss_Id,
    );

    if (!sessaoUsuario) {
      return res.status(401).json(
        respostaErro({
          mensagem: "Sessão inválida.",
          codigoRetorno: 401,
          requer_login: true,
        }),
      );
    }

    if (sessaoUsuario.revogado_em) {
      return res.status(401).json(
        respostaErro({
          mensagem: "Sessão expirada ou usuario logado em outro dispositivo.",
          codigoRetorno: 401,
          requer_login: true,
        }),
      );
    }

    // ==================== 4. VERIFICAR SE SESSÃO EXPIROU ====================
    if (sessaoUsuario.expiracao < new Date()) {
      const resultado = await tentarRefreshAutomatico(refreshToken, res);
      if (!resultado) return; // Resposta já enviada

      const { claims, novosTokens } = resultado;

      // Validar pessoa com novo token
      const pessoa = await validarPessoa(claims.Usu_Id, res);
      if (!pessoa) return; // Resposta já enviada

      // Configurar req.user com dados atualizados
      req.user = {
        Usu_Id: pessoa.id,
        Usu_Na: pessoa.nome,
        Email: pessoa.email,
        Dt_Ex: claims.Dt_Ex,
        Idp: claims.Idp,
        iss: claims.iss,
        aud: claims.aud,
        Ss_Id: claims.Ss_Id,
      };

      // Anexar novos tokens nos headers
      res.setHeader("X-New-Access-Token", novosTokens.access);
      res.setHeader("X-New-Refresh-Token", novosTokens.refresh);

      // Processar token de sala se existir
      if (tokenSala) {
        const salaDecoded = processarTokenSala(tokenSala);
        if (salaDecoded) req.sala = salaDecoded;
      }

      return next();
    }

    // ==================== 5. VALIDAÇÃO DA PESSOA ====================
    const pessoa = await validarPessoa(decoded.Usu_Id, res);
    if (!pessoa) return; // Resposta já enviada

    // ==================== 6. CONFIGURAR REQ.USER ====================
    req.user = {
      Usu_Id: pessoa.id,
      Usu_Na: pessoa.nome,
      Email: pessoa.email,
      Dt_Ex: decoded.Dt_Ex,
      Idp: decoded.Idp,
      iss: decoded.iss,
      aud: decoded.aud,
      Ss_Id: decoded.Ss_Id,
    };

    // ==================== 7. PROCESSAR TOKEN DE SALA (OPCIONAL) ====================
    if (tokenSala) {
      const salaDecoded = processarTokenSala(tokenSala);
      if (salaDecoded) req.sala = salaDecoded;
    }

    next();
  } catch (error) {
    // ==================== 8. TRATAMENTO DE TOKEN EXPIRADO ====================
    if (error instanceof jwt.TokenExpiredError) {
      const resultado = await tentarRefreshAutomatico(refreshToken, res);
      if (!resultado) return; // Resposta já enviada

      const { claims } = resultado;

      // Configurar req.user com claims do novo token
      req.user = {
        Usu_Id: claims.Usu_Id,
        Usu_Na: claims.Usu_Na,
        Email: claims.Email,
        Dt_Ex: claims.Dt_Ex,
        Idp: claims.Idp,
        iss: claims.iss,
        aud: claims.aud,
        Ss_Id: claims.Ss_Id,
      };

      // Anexar novos tokens nos headers
      res.setHeader("X-New-Access-Token", resultado.novosTokens.access);
      res.setHeader("X-New-Refresh-Token", resultado.novosTokens.refresh);

      // Processar token de sala se existir
      if (tokenSala) {
        const salaDecoded = processarTokenSala(tokenSala);
        if (salaDecoded) req.sala = salaDecoded;
      }

      return next();
    }

    // ==================== 9. OUTROS ERROS ====================
    console.error("Erro no authGuard:", error);
    return res
      .status(401)
      .json(respostaErro({ mensagem: "Token inválido.", codigoRetorno: 401 }));
  }
};
