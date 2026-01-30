import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Claims, ClaimsAuthSala } from "../lib/jwt";
import { sessaoUsuarioService } from "../services/auth/sessao-usuario.service";
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
async function validarPessoa(
  usuarioId: string,
  res: Response,
): Promise<{
  id: string;
  nome: string;
  email: string;
  inativo: boolean;
  email_confirmado: boolean;
} | null> {
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

// ==================== MIDDLEWARE PRINCIPAL ====================
// 🔥 SIMPLIFICADO: Sem refresh automático
// Token válido por 7 dias - se expirar, usuário faz login novamente

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ==================== 1. EXTRAÇÃO DOS TOKENS ====================
  const authHeader = req.headers.authorization;
  const tokenSala = req.headers["x-token-sala"] as string | undefined;

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
          mensagem: "Sessão expirada ou usuário logado em outro dispositivo.",
          codigoRetorno: 401,
          requer_login: true,
        }),
      );
    }

    // ==================== 4. VALIDAÇÃO DA PESSOA ====================
    const pessoa = await validarPessoa(decoded.Usu_Id, res);
    if (!pessoa) return; // Resposta já enviada

    // ==================== 5. CONFIGURAR REQ.USER ====================
    req.user = {
      Usu_Id: pessoa.id,
      Usu_Na: pessoa.nome,
      Email: pessoa.email,
      Idp: decoded.Idp,
      iss: decoded.iss,
      aud: decoded.aud,
      Ss_Id: decoded.Ss_Id,
    };

    // ==================== 6. PROCESSAR TOKEN DE SALA (OPCIONAL) ====================
    if (tokenSala) {
      const salaDecoded = processarTokenSala(tokenSala);
      if (salaDecoded) req.sala = salaDecoded;
    }

    next();
  } catch (error) {
    // ==================== 7. TRATAMENTO DE ERROS ====================
    if (error instanceof jwt.TokenExpiredError) {
      // 🔥 Token expirado - pedir login novamente
      return res.status(401).json(
        respostaErro({
          mensagem: "Sessão expirada. Faça login novamente.",
          codigoRetorno: 401,
          requer_login: true,
        }),
      );
    }

    console.error("Erro no authGuard:", error);
    return res
      .status(401)
      .json(respostaErro({ mensagem: "Token inválido.", codigoRetorno: 401 }));
  }
};
