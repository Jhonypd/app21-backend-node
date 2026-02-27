import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { respostaErro } from "../utils/response";
import { mapPrismaRespostaErro } from "../lib/mapper-erros-db";

export const validateHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errosExtraidos: string[] = [];

  const validateErrosBanco = mapPrismaRespostaErro(errors);

  errors.array().map((err) => errosExtraidos.push(err.msg));

  return res.status(422).json(
    respostaErro({
      mensagem: "Ocorreram um ou mais erros de validação",
      detalhe: JSON.stringify(errosExtraidos.join(", ")),
    }),
  );
};
