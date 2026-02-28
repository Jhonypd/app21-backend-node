import { NextFunction, Request, Response } from "express";
import { respostaErro } from "../utils/response";
import { mapPrismaRespostaErro } from "../lib/mapper-erros-db";
import { loggerService } from "../services/monitoramento/logger-index.service";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export class AppError extends Error {
  public codigoRetorno: number;
  public detalhe: string | null;
  public requer_login: boolean;

  constructor(
    mensagem: string,
    codigoRetorno = 400,
    detalhe: string | null = null,
    requer_login = false,
  ) {
    super(mensagem);
    this.name = "AppError";
    this.codigoRetorno = codigoRetorno;
    this.detalhe = detalhe;
    this.requer_login = requer_login;
  }
}

export async function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  let logId: string | undefined;

  try {
    const captured = await loggerService.capture(err, {
      layer: "middleware",
      route: req.path,
      method: req.method,
      userId: (req as any).user?.Usuario_Id,
      requestId: (req.headers["x-request-id"] as string) ?? undefined,
      ip: req.ip,
      userAgent: req.headers["user-agent"] as string,
      tags: [],
    });
    logId = captured.id;
  } catch (error) {
    console.error("[ERROR_MONITOR_FAILED]", error);
  }

  if (err instanceof AppError) {
    return res.status(err.codigoRetorno).json(
      respostaErro({
        mensagem: err.message,
        detalhe: err.detalhe,
        codigoRetorno: err.codigoRetorno,
        requer_login: err.requer_login,
      }),
    );
  }

  const mapped = mapPrismaRespostaErro(err);

  if (mapped) {
    console.error("[PRISMA_ERROR]", {
      method: req.method,
      path: req.path,
      code: err?.code,
      meta: err?.meta,
      message: err?.message,
    });

    return res.status(mapped.httpStatus || 500).json(mapped.body);
  }

  console.error("[UNHANDLED_ERROR]", {
    method: req.method,
    path: req.path,
    message: err?.message,
    stack: err?.stack,
  });

  return res.status(500).json(
    respostaErro({
      mensagem: "Erro interno do servidor.",
      detalhe: null,
      codigoRetorno: 500,
    }),
  );
}
