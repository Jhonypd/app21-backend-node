import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { respostaErro } from "../utils/response";

export const validateHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.table(req.body);
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errosExtraidos: string[] = [];

  errors.array().map((err) => errosExtraidos.push(err.msg));

  return res.status(422).json(
    respostaErro({
      mensagem: "Ocorreram um ou mais erros de validação",
      detalhe: JSON.stringify(errosExtraidos.join(", ")),
    })
  );
};
