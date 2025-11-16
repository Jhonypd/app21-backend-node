import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Claims } from "../lib/jwt";
import { sessaoUsuarioService } from "../services/auth/sessao-usuario.service";
import { pessoaService } from "../services/pessoas/pessoa.service";
import { respostaErro } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: Claims;
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

  // Authorization
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const [, t] = authHeader.split(" ");
    token = t;
  }

  // Cookie
  if (!token && req.cookies?.access_token) {
    token = req.cookies.access_token;
  }

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
    const sessao = await sessaoUsuarioService.buscarSessaoAtivaPorId(
      decoded.Ss_Id
    );

    if (!sessao) {
      return res
        .status(401)
        .json(
          respostaErro({ mensagem: "Sessão inválida.", codigoRetorno: 401 })
        );
    }

    if (sessao.revogado_em) {
      return res.status(401).json(
        respostaErro({
          mensagem: "Sessão expirada ou usuario logado em outro dispositivo.",
          codigoRetorno: 401,
        })
      );
    }

    if (sessao.expiracao < new Date()) {
      return res
        .status(401)
        .json(
          respostaErro({ mensagem: "Sua sessão expirou.", codigoRetorno: 401 })
        );
    }

    const pessoa = await pessoaService.obterDadosConta(decoded.Usu_Id);

    if (!pessoa)
      return res.status(401).json(
        respostaErro({
          mensagem: "Usuário não encontrado.",
          codigoRetorno: 401,
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

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json(respostaErro({ mensagem: "Token inválido.", codigoRetorno: 401 }));
  }
};
