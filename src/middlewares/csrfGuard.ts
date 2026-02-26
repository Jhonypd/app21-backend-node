import { NextFunction, Request, Response } from "express";
import { respostaErro } from "../utils/response";

export const csrfGuard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const method = req.method.toUpperCase();

  if (["GET", "HEAD", "OPTIONS"].includes(method)) return next();

  const csrfCookie = req.cookies?.csrf_token;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res
      .status(403)
      .json(respostaErro({ mensagem: "CSRF inválido.", codigoRetorno: 403 }));
  }

  return next();
};
