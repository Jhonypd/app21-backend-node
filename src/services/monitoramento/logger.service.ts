import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { AppError } from "../../lib/errorHandler";

/* ===================== TIPOS ===================== */

export type ErrorContext = {
  layer?:
    | "middleware"
    | "controller"
    | "service"
    | "repository"
    | "job"
    | "socket"
    | "application";
  route?: string;
  method?: string;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  tags?: string[];
  extra?: Record<string, any>;
};

type LoggedErrorPayload = {
  id: string;
  createdAt: string;
  context?: ErrorContext;
  error: {
    name?: string;
    message?: string;
    stack?: string;
    code?: any;
    meta?: any;
    clientVersion?: any;
    cause?: any;
  };
};

/* ===================== HELPERS ===================== */

function serializeError(error: unknown) {
  const e: any = error;
  return {
    name: e?.name,
    message: e?.message ?? String(error),
    stack: e?.stack,
    code: e?.code,
    meta: e?.meta,
    clientVersion: e?.clientVersion,
    cause: e?.cause,
  };
}

/**
 * Diretório base de logs
 */
export const LOGS_BASE_DIR = path.resolve(process.cwd(), "logs");

/**
 * Garante que um diretório exista (cria se não existir).
 * Safe para chamadas concorrentes.
 */
export async function verificaOuCriaPastaLog(dir: string = LOGS_BASE_DIR) {
  try {
    await fs.mkdir(dir, { recursive: true });
    // Verifica se o diretório existe e é acessível para escrita
    await fs.access(dir, fs.constants.W_OK);
    return true;
  } catch (error) {
    console.error(`Erro ao criar/verificar pasta de logs: ${dir}`, error);
    throw new AppError(`Não foi possível criar pasta de logs: ${dir}`, 500);
  }
}

/* ===================== LOGGER ===================== */

export class LoggerService {
  private baseDir: string;

  constructor() {
    this.baseDir = LOGS_BASE_DIR;
  }

  private getDayStr(date = new Date()) {
    return date.toISOString().slice(0, 10);
  }

  async capture(error: unknown, context?: ErrorContext) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const payload: LoggedErrorPayload = {
      id,
      createdAt,
      context,
      error: serializeError(error),
    };

    // pasta por dia
    const day = this.getDayStr();
    const dir = path.join(this.baseDir, day);

    // garante logs/ e logs/YYYY-MM-DD
    await verificaOuCriaPastaLog(dir);

    const filePath = path.join(dir, `logs_${day}.ndjson`);

    await fs.appendFile(filePath, JSON.stringify(payload) + "\n", "utf8");

    return { id, filePath, createdAt };
  }
}
