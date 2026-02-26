import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Claims, ClaimsAuthSala } from "../lib/jwt";
import { sessaoUsuarioService } from "../services/auth/sessao-usuario.service";
import { pessoaService } from "../services/pessoas/pessoa.service";
import { respostaErro } from "../utils/response";
import { getClientInfo } from "../helpers/client-info.helper";
import { refreshTokenService } from "../services/auth/refresh-token.service";
import { tokenCookies } from "../helpers/set-tokens-cookies.helper";

declare global {
  namespace Express {
    interface Request {
      user?: Claims;
      sala?: ClaimsAuthSala;
    }
  }
}

const jwtSecret = process.env.JWT_SECRET as string;

function processarTokenSala(tokenSala: string): ClaimsAuthSala | null {
  try {
    return jwt.verify(tokenSala, jwtSecret) as ClaimsAuthSala;
  } catch {
    return null;
  }
}

async function validarPessoa(usuarioId: string, res: Response) {
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

async function validarSessao(decoded: Claims, res: Response) {
  const sessaoUsuario = await sessaoUsuarioService.buscarSessaoAtivaPorId(
    decoded.Sessao_Usuario_Id,
  );

  if (!sessaoUsuario) {
    res.status(401).json(
      respostaErro({
        mensagem: "Sessão inválida.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
    return null;
  }

  if (sessaoUsuario.revogado_em) {
    res.status(401).json(
      respostaErro({
        mensagem: "Sessão expirada ou usuário logado em outro dispositivo.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
    return null;
  }

  if (sessaoUsuario.expiracao < new Date()) {
    res.status(401).json(
      respostaErro({
        mensagem: "Sessão expirada. Faça login novamente.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
    return null;
  }

  return sessaoUsuario;
}

export const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenSala = req.headers["x-token-sala"] as string | undefined;

  // cookie-first, fallback para Authorization header
  let accessToken = req.cookies?.access_token as string | undefined;

  const refreshToken = req.cookies?.refresh_token as string | undefined;

  if (!accessToken) {
    return res.status(401).json(
      respostaErro({
        mensagem: "Token não informado.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
  }

  try {
    // tenta validar access
    const decoded = jwt.verify(accessToken, jwtSecret) as Claims;

    // valida sessão e pessoa
    if (!(await validarSessao(decoded, res))) return;
    const pessoa = await validarPessoa(decoded.Usuario_Id, res);
    if (!pessoa) return;

    req.user = {
      Usuario_Id: pessoa.id,
      Nome: pessoa.nome,
      Email: pessoa.email,
      Idioma_Padrao: decoded.Idioma_Padrao,
      Sessao_Usuario_Id: decoded.Sessao_Usuario_Id,
      iss: decoded.iss,
      aud: decoded.aud,
    };

    if (tokenSala) {
      const salaDecoded = processarTokenSala(tokenSala);
      if (salaDecoded) req.sala = salaDecoded;
    }

    return next();
  } catch (err: any) {
    // access expirou -> tenta refresh
    if (err instanceof jwt.TokenExpiredError) {
      if (!refreshToken) {
        return res.status(401).json(
          respostaErro({
            mensagem: "Sessão expirada. Faça login novamente.",
            codigoRetorno: 401,
            requer_login: true,
          }),
        );
      }

      try {
        const { ip, userAgent } = getClientInfo(req);
        const novos = await refreshTokenService.revalidarAccessToken(
          refreshToken,
          ip,
          userAgent,
        );

        // seta cookies novos (rotação do refresh)
        tokenCookies.setAuthCookies(
          res,
          novos.refreshToken.token,
          novos.tokenAcesso.token,
        );

        // usa o NOVO access pra montar user
        accessToken = novos.tokenAcesso.token;
        const decodedNovo = jwt.verify(accessToken, jwtSecret) as Claims;

        if (!(await validarSessao(decodedNovo, res))) return;
        const pessoa = await validarPessoa(decodedNovo.Usuario_Id, res);
        if (!pessoa) return;

        req.user = {
          Usuario_Id: pessoa.id,
          Nome: pessoa.nome,
          Email: pessoa.email,
          Idioma_Padrao: decodedNovo.Idioma_Padrao,
          Sessao_Usuario_Id: decodedNovo.Sessao_Usuario_Id,
          iss: decodedNovo.iss,
          aud: decodedNovo.aud,
        };

        if (tokenSala) {
          const salaDecoded = processarTokenSala(tokenSala);
          if (salaDecoded) req.sala = salaDecoded;
        }

        return next();
      } catch {
        tokenCookies.clear(res);
        return res.status(401).json(
          respostaErro({
            mensagem: "Sessão expirada. Faça login novamente.",
            codigoRetorno: 401,
            requer_login: true,
          }),
        );
      }
    }

    // token inválido (não-expirado)
    return res.status(401).json(
      respostaErro({
        mensagem: "Token inválido.",
        codigoRetorno: 401,
        requer_login: true,
      }),
    );
  }
};
