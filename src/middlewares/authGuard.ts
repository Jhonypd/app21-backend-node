import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../lib/prisma";

import jwt from "jsonwebtoken";
import { Claims } from "../lib/jwt";

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
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não informado." });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, jwtSecret) as Claims;

    const user = await prismaClient.pessoa.findUnique({
      where: { id: decoded.Usu_Id },
      select: {
        id: true,
        nome: true,
        email: true,
        inativo: true,
        email_confirmado: true,
        codigo_expiracao: true,
      },
    });

    if (user?.inativo) {
      return res.status(403).json({
        mensagem:
          "Usuário sem permissão de acesso. Você precisa entrar em contato com o administrador.",
      });
    }

    if (user?.codigo_expiracao && user.codigo_expiracao < new Date()) {
      return res.status(403).json({
        mensagem: "Você precisa confirmar seu e-mail para continuar.",
      });
    }

    if (!user) {
      return res
        .status(401)
        .json({ errors: ["Usuário não encontrado no banco."] });
    }

    req.user = {
      Usu_Id: user.id,
      Usu_na: user.nome,
      email: user.email,
      Dt_Ex: decoded.Dt_Ex,
      Idp: decoded.Idp,
      iss: decoded.iss,
      aud: decoded.aud,
    };
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(401).json({ errors: ["Erro interno de autenticação."] });
  }
};
