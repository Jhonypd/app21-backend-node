import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../lib/prisma";

import jwt from "jsonwebtoken";

interface User {
  id: string;
  nome: string;
  email: string | null;
}

interface JwtPayload {
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
  const authHeader = req.headers["authorization"];
  const refreshToken = req.headers["refreshtoken"] as string;

  const accessToken =
    authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  // Requer ambos os tokens
  if (!accessToken || !refreshToken) {
    return res.status(401).json({
      errors: ["Tokens de acesso inválidos!"],
    });
  }

  try {
    const verified = jwt.verify(accessToken, jwtSecret);

    const user = await prismaClient.pessoa.findUnique({
      where: { id: verified.id },
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
