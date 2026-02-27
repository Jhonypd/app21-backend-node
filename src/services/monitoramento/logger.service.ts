import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export type ErrorContext = {
  layer?:
    | "middleware"
    | "controller"
    | "service"
    | "repository"
    | "job"
    | "socket";
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

export class LoggerService {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), "logs");
  }

  private getDayStr(date = new Date()) {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  private async ensureDirExists(dir: string) {
    await fs.mkdir(dir, { recursive: true });
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

    // pasta por dia + 1 arquivo por dia
    const day = this.getDayStr();
    const dir = path.join(this.baseDir, day);
    await this.ensureDirExists(dir);

    const filePath = path.join(dir, `errors_${day}.ndjson`);

    // append de 1 linha JSON (NDJSON)
    await fs.appendFile(filePath, JSON.stringify(payload) + "\n", "utf8");

    return { id, filePath, createdAt };
  }
}
