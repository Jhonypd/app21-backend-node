import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Claims, ClaimsAuthSala } from "../lib/jwt";
import { sessaoUsuarioService } from "../services/auth/sessao-usuario.service";
import { pessoaService } from "../services/pessoas/pessoa.service";
import { respostaErro } from "../utils/response";

// IMPORTANTE: Adicionar no app.ts (CORS):
// app.use(cors({ exposedHeaders: ['X-New-Access-Token', 'X-New-Refresh-Token'] }));

declare global {
  namespace Express {
    interface Request {
      user?: Claims;
      sala?: ClaimsAuthSala;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET as string;

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;
  let tokenSala: string | undefined;

  // Authorization
  const authHeader = req.headers.authorization;
  const authSala = req.headers["x-token-sala"] as string | undefined;

  if (authSala) {
    tokenSala = authSala;
  }
  if (authHeader) {
    const [, t] = authHeader.split(" ");
    token = t;
  }

  // ✅ Apenas headers - sem cookies
  if (!token) {
    return res
      .status(401)
      .json(
        respostaErro({ mensagem: "Token não informado.", codigoRetorno: 401 })
      );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as Claims;

    // SESSION VALIDATION
    const sessaoUsuario = await sessaoUsuarioService.buscarSessaoAtivaPorId(
      decoded.Ss_Id
    );

    if (!sessaoUsuario) {
      return res.status(401).json(
        respostaErro({
          mensagem: "Sessão inválida.",
          codigoRetorno: 401,
          requer_login: true,
        })
      );
    }

    if (sessaoUsuario.revogado_em) {
      return res.status(401).json(
        respostaErro({
          mensagem: "Sessão expirada ou usuario logado em outro dispositivo.",
          codigoRetorno: 401,
          requer_login: true,
        })
      );
    }

    // ✅ CORREÇÃO: Se sessão expirou, tentar refresh automático
    // Não forçar TokenExpiredError - fazer refresh diretamente
    if (sessaoUsuario.expiracao < new Date()) {
      // ✅ Apenas header X-Refresh-Token
      const refreshToken = req.headers["x-refresh-token"] as string;

      if (!refreshToken) {
        return res.status(401).json(
          respostaErro({
            mensagem: "Sessão expirada. Faça login novamente.",
            codigoRetorno: 401,
            requer_login: true,
          })
        );
      }

      try {
        // Importar serviço de refresh
        const {
          refreshTokenService,
        } = require("../services/auth/refresh-token.service");

        // Tentar fazer refresh
        const resultado = await refreshTokenService.refresh(refreshToken);

        // Retornar novos tokens nos headers
        res.setHeader("X-New-Access-Token", resultado.tokenAcesso.token);
        res.setHeader("X-New-Refresh-Token", resultado.refreshToken.token);

        // Decodificar novo token e continuar
        const decodedNovo = jwt.verify(
          resultado.tokenAcesso.token,
          jwtSecret
        ) as Claims;

        // Buscar dados da pessoa com novo token
        const pessoaNova = await pessoaService.obterDadosConta(
          decodedNovo.Usu_Id
        );

        if (!pessoaNova) {
          return res.status(401).json(
            respostaErro({
              mensagem: "Usuário não encontrado.",
              codigoRetorno: 401,
              requer_login: true,
            })
          );
        }

        req.user = {
          Usu_Id: pessoaNova.id,
          Usu_Na: pessoaNova.nome,
          Email: pessoaNova.email,
          Dt_Ex: decodedNovo.Dt_Ex,
          Idp: decodedNovo.Idp,
          iss: decodedNovo.iss,
          aud: decodedNovo.aud,
          Ss_Id: decodedNovo.Ss_Id,
        };

        // Processar token de sala se existir
        if (tokenSala) {
          try {
            const decodedTokenSala = jwt.verify(
              tokenSala,
              jwtSecret
            ) as ClaimsAuthSala;

            req.sala = {
              Sala_Id: decodedTokenSala.Sala_Id,
              Sala_Co: decodedTokenSala.Sala_Co,
              Sala_titulo: decodedTokenSala.Sala_titulo,
              Role: decodedTokenSala.Role,
              Ss_Sl_Id: decodedTokenSala.Ss_Sl_Id,
              Dt_Ex: decodedTokenSala.Dt_Ex,
              Usu_Id: decodedTokenSala.Usu_Id,
              Usu_Na: decodedTokenSala.Usu_Na,
            };
          } catch (error) {
            console.warn("Token de sala inválido, ignorando:", error);
          }
        }

        // console.log("✅ Refresh automático realizado (sessão expirou)");
        return next();
      } catch (refreshError) {
        console.error("Erro ao fazer refresh (sessão expirou):", refreshError);
        return res.status(401).json(
          respostaErro({
            mensagem: "Sessão expirada. Faça login novamente.",
            codigoRetorno: 401,
            requer_login: true,
          })
        );
      }
    }

    const pessoa = await pessoaService.obterDadosConta(decoded.Usu_Id);

    if (!pessoa)
      return res.status(401).json(
        respostaErro({
          mensagem: "Usuário não encontrado.",
          codigoRetorno: 401,
          requer_login: true,
        })
      );
    if (pessoa.inativo)
      return res
        .status(403)
        .json(
          respostaErro({ mensagem: "Usuário inativo.", codigoRetorno: 403 })
        );
    if (!pessoa.email_confirmado)
      return res.status(403).json(
        respostaErro({
          mensagem: "E-mail não confirmado.",
          codigoRetorno: 403,
        })
      );

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

    // Se token de sala está presente, apenas decodifica sem validar
    // A validação será feita por salaAuthGuard quando necessário
    if (tokenSala) {
      try {
        const decodedTokenSala = jwt.verify(
          tokenSala,
          jwtSecret
        ) as ClaimsAuthSala;

        req.sala = {
          Sala_Id: decodedTokenSala.Sala_Id,
          Sala_Co: decodedTokenSala.Sala_Co,
          Sala_titulo: decodedTokenSala.Sala_titulo,
          Role: decodedTokenSala.Role,
          Ss_Sl_Id: decodedTokenSala.Ss_Sl_Id,
          Dt_Ex: decodedTokenSala.Dt_Ex,
          Usu_Id: decodedTokenSala.Usu_Id,
          Usu_Na: decodedTokenSala.Usu_Na,
        };
      } catch (error) {
        // Token inválido, mas não bloqueia a requisição
        // Apenas não anexa req.sala
        console.warn("Token de sala inválido, ignorando:", error);
      }
    }

    next();
  } catch (error) {
    // Token expirado - tentar refresh automático
    if (error instanceof jwt.TokenExpiredError) {
      // ✅ Apenas header X-Refresh-Token
      const refreshToken = req.headers["x-refresh-token"] as string;

      if (!refreshToken) {
        return res.status(401).json(
          respostaErro({
            mensagem: "Token expirado. Faça login novamente.",
            codigoRetorno: 401,
            requer_login: true,
          })
        );
      }

      try {
        // Importar serviço de refresh
        const {
          refreshTokenService,
        } = require("../services/auth/refresh-token.service");

        // Tentar fazer refresh
        const resultado = await refreshTokenService.refresh(refreshToken);

        // Retornar novos tokens nos headers
        res.setHeader("X-New-Access-Token", resultado.tokenAcesso.token);
        res.setHeader("X-New-Refresh-Token", resultado.refreshToken.token);

        // Decodificar novo token e continuar
        const decoded = jwt.verify(
          resultado.tokenAcesso.token,
          jwtSecret
        ) as Claims;

        req.user = {
          Usu_Id: decoded.Usu_Id,
          Usu_Na: decoded.Usu_Na,
          Email: decoded.Email,
          Dt_Ex: decoded.Dt_Ex,
          Idp: decoded.Idp,
          iss: decoded.iss,
          aud: decoded.aud,
          Ss_Id: decoded.Ss_Id,
        };

        return next();
      } catch (refreshError) {
        console.error("Erro ao fazer refresh automático:", refreshError);
        return res.status(401).json(
          respostaErro({
            mensagem: "Sessão expirada. Faça login novamente.",
            codigoRetorno: 401,
            requer_login: true,
          })
        );
      }
    }

    console.error(error);
    return res
      .status(401)
      .json(respostaErro({ mensagem: "Token inválido.", codigoRetorno: 401 }));
  }
};
