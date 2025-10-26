import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../lib/prisma";

import jwt from "jsonwebtoken";

interface User {
  id: string;
  nome: string;
  email: string | null;
}

interface JwtPayload extends User{
  id: string;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
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

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await prismaClient.pessoa.findUnique({
      where: { id: decoded.id },
      select: { id: true, nome: true, email: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ errors: ["Usuário não encontrado no banco."] });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(401).json({ errors: ["Erro interno de autenticação."] });
  }
};
