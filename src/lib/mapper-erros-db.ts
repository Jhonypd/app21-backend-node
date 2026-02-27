import { ResponsePadrao, respostaErro } from "../utils/response";
import { Prisma } from "./generated/prisma/client";

export type MappedHttpError = {
  httpStatus: number;
  body: ResponsePadrao;
};

export function mapPrismaRespostaErro(err: unknown): MappedHttpError | null {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    const meta = err.meta as any;

    switch (code) {
      case "P2002": {
        const target = meta?.target?.join?.(", ") ?? meta?.target ?? null;
        const body = respostaErro({
          mensagem: "Registro já existe. Conflito de dados.",
          detalhe: target ? `Campo(s): ${target}` : null,
          codigoRetorno: 409,
        });
        return { httpStatus: 409, body };
      }

      case "P2003": {
        const field = meta?.field_name ?? null;
        const body = respostaErro({
          codigoRetorno: 409,
          mensagem:
            "Não foi possível concluir: existe vínculo com outro registro.",
          detalhe: field ? `Campo: ${field}` : null,
        });
        return { httpStatus: 409, body };
      }

      case "P2025":
      case "P2001": {
        const body = respostaErro({
          codigoRetorno: 404,
          mensagem: "Registro não encontrado.",
          detalhe: null,
        });
        return { httpStatus: 404, body };
      }

      case "P2011":
      case "P2012":
      case "P2013":
      case "P2005":
      case "P2006":
      case "P2007":
      case "P2000": {
        const body = respostaErro({
          codigoRetorno: 400,
          mensagem: "Dados inválidos. Verifique os campos e tente novamente.",
          detalhe: null,
        });
        return { httpStatus: 400, body };
      }

      case "P1001":
      case "P1017": {
        const body = respostaErro({
          codigoRetorno: 503,
          mensagem:
            "Não consegui conectar no banco agora. Tenta novamente em instantes.",
          detalhe: null,
        });
        return { httpStatus: 503, body };
      }

      case "P1002":
      case "P1008": {
        const body = respostaErro({
          codigoRetorno: 504,
          mensagem: "O banco demorou demais pra responder. Tenta novamente.",
          detalhe: null,
        });
        return { httpStatus: 504, body };
      }

      case "P1000": {
        const body = respostaErro({
          codigoRetorno: 500,
          mensagem: "Falha de autenticação com o banco.",
          detalhe: null,
        });
        return { httpStatus: 500, body };
      }

      case "P1010": {
        const body = respostaErro({
          codigoRetorno: 403,
          mensagem: "Você não tem permissão para realizar essa ação.",
          detalhe: null,
        });
        return { httpStatus: 403, body };
      }

      default: {
        const body = respostaErro({
          codigoRetorno: 500,
          mensagem: "Erro ao processar no banco.",
          detalhe: null,
        });
        return { httpStatus: 500, body };
      }
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    console.error("[PRISMA_VALIDATION_ERROR]", {
      message: err.message,
      clientVersion: err.clientVersion,
    });

    const body = respostaErro({
      codigoRetorno: 422,
      mensagem: "Dados inválidos. Verifique os campos e tente novamente.",
      detalhe:
        process.env.NODE_ENV !== "production"
          ? err.message // serializa cru só em DEV
          : null,
    });

    return { httpStatus: 422, body };
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    const body = respostaErro({
      codigoRetorno: 500,
      mensagem: "Erro interno do servidor.",
      detalhe: null,
    });
    return { httpStatus: 500, body };
  }

  return null;
}
