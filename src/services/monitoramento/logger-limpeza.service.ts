import fs from "fs/promises";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const MAX_DAYS = 7;

class LoggerLimpezaService {
  private static instance: LoggerLimpezaService;
  private started = false;

  private constructor() {}

  static getInstance(): LoggerLimpezaService {
    if (!LoggerLimpezaService.instance) {
      LoggerLimpezaService.instance = new LoggerLimpezaService();
    }
    return LoggerLimpezaService.instance;
  }

  private isOlderThan(dateStr: string, days: number) {
    const date = new Date(dateStr);
    const limit = new Date();
    limit.setDate(limit.getDate() - days);
    return date < limit;
  }

  private async cleanupOnce() {
    try {
      const entries = await fs.readdir(LOG_DIR, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.name)) continue;

        if (this.isOlderThan(entry.name, MAX_DAYS)) {
          const dirPath = path.join(LOG_DIR, entry.name);
          await fs.rm(dirPath, { recursive: true, force: true });
          console.log(`[LIMPEZA_LOGS] Removido: ${entry.name}`);
        }
      }
    } catch (err) {
      console.error("[LIMPEZA_LOGS_ERROR]", err);
    }
  }

  start() {
    if (this.started) return;

    this.started = true;

    // executa na inicialização
    this.cleanupOnce();

    // executa a cada 24h
    setInterval(
      () => {
        this.cleanupOnce();
      },
      24 * 60 * 60 * 1000,
    );

    console.log("[LIMPEZA_LOGS] iniciado com intervalo de 24h");
  }
}

export const loggerLimpezaService = LoggerLimpezaService.getInstance();
