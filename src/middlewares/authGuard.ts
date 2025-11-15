import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Claims } from "../lib/jwt";
import { sessionUsuarioService } from "../services/auth/session-usuario.service";
import { pessoaService } from "../services/pessoas/pessoa.service";

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
    return res.status(401).json({ mensagem: "Token não informado." });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as Claims;

    // SESSION VALIDATION
    const sessao = await sessionUsuarioService.buscarSessaoAtiva(decoded.Ss_Id);

    if (!sessao) {
      return res.status(401).json({ mensagem: "Sessão inválida." });
    }

    if (sessao.revogado_em) {
      return res.status(401).json({
        mensagem: "Sessão expirada ou usuario logado em outro dispositivo.",
      });
    }

    if (sessao.expiracao < new Date()) {
      return res.status(401).json({ mensagem: "Sua sessão expirou." });
    }

    const pessoa = await pessoaService.obterDadosConta(decoded.Usu_Id);

    if (!pessoa)
      return res.status(401).json({ mensagem: "Usuário não encontrado." });
    if (pessoa.inativo)
      return res.status(403).json({ mensagem: "Usuário inativo." });
    if (!pessoa.email_confirmado)
      return res.status(403).json({ mensagem: "E-mail não confirmado." });

    req.user = {
      Usu_Id: pessoa.id,
      Usu_na: pessoa.nome,
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
    return res.status(401).json({ mensagem: "Token inválido." });
  }
};
