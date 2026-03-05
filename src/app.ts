import dotenv from "dotenv";

dotenv.config();

console.log("Variáveis de ambiente:", {
  DATABASE_URL: !!process.env.DATABASE_URL,
  DIRECT_URL: !!process.env.DIRECT_URL,
  FRONTEND_URL: !!process.env.FRONTEND_URL,
  JWT_SECRET: !!process.env.JWT_SECRET,
  PORT: !!process.env.PORT,
  SMTP_PASS: !!process.env.SMTP_PASS,
  SMTP_USER: !!process.env.SMTP_USER,
  SMTP_HOST: !!process.env.SMTP_HOST,
  SMTP_PORT: !!process.env.SMTP_PORT,
  SMTP_FROM: !!process.env.SMTP_FROM,
  JWT_REFRESH_SECRET: !!process.env.JWT_REFRESH_SECRET,
});

import express from "express";
import http from "http";
import os from "os";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import socketEventos from "./sockets/index";
import salas from "./routes/salas/sala.routes";
import auth from "./routes/auth/auth.routes";
import pessoas from "./routes/pessoas/pessoa.routes";
import sessoes from "./routes/sessoes/sessao-sala.routes";
import votos from "./routes/votos/votos.routes";
import historias from "./routes/historias/historia-sala.routes";
import { errorHandler } from "./lib/errorHandler";
import { loggerLimpezaService } from "./services/monitoramento/logger-limpeza.service";
import { loggerService } from "./services/monitoramento/logger-index.service";
import { verificaOuCriaPastaLog } from "./services/monitoramento/logger.service";
import { main } from "./utils/seed";

const app = express();
const server = http.createServer(app);
const isDevelopment = process.env.NODE_ENV !== "production";

// Configurar trust proxy para obter o IP real do cliente através de proxies/load balancers
app.set("trust proxy", true);

// IPs locais da máquina onde o backend está rodando
const localIPs = Object.values(os.networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4" && !iface.internal)
  .map((iface) => iface!.address);

const frontendPorts = [3000, 3004];
const localOrigins = localIPs.flatMap((ip) =>
  frontendPorts.map((port) => `http://${ip}:${port}`),
);

// Lista real de origins permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_PROD,
  "http://192.168.2.99:3000",
  "http://192.168.2.53:3000",
  "http://192.168.2.53:3004",
  "http://192.168.2.100:3004",
  "http://localhost:3000",
  "http://localhost:3004",
  "http://192.168.0.108:3004",
  ...localOrigins,
].filter(Boolean) as string[];

const validateOrigin = (
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void,
) => {
  if (!origin) return callback(null, true);

  if (isDevelopment) {
    return callback(null, true);
  }

  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }

  callback(new Error("Not allowed by CORS"));
};

// CORS Geral do Express
app.use(
  cors({
    origin: validateOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "Accept",
      "sessao_sala_id",
      "sala_id",
      "historia_id",
      "pessoa_id",
    ],
    exposedHeaders: ["X-CSRF-Token"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Body JSON
app.use(express.json());

// Cookies
app.use(cookieParser());

// Rotas
app.use("/auth", auth);
app.use("/pessoas", pessoas);
app.use("/salas", salas);
app.use("/sessoes", sessoes);
app.use("/votos", votos);
app.use("/salas", historias);
app.use("/", historias);

// Middleware de tratamento de erros
app.use(errorHandler);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      validateOrigin(origin, (error, allow) => {
        if (error && origin) {
          console.warn(`[Socket.IO CORS] Origin bloqueada: ${origin}`);
        }
        callback(error, allow);
      });
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-CSRF-Token",
      "historia_id",
      "sessao_sala_id",
    ],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

socketEventos(io, process.env.JWT_SECRET!);

// Função de inicialização do sistema de logs
async function inicializarLogs() {
  try {
    //  ativar apenas se houver coisas a serem atualizadas
    // await main().catch((err) => {
    //   console.error("Erro ao executar seed:", err);
    // });

    // Garante que a pasta de logs existe
    await verificaOuCriaPastaLog();

    // Inicia serviço de limpeza de logs antigos
    loggerLimpezaService.start();

    // Registra log de inicialização
    await loggerService.capture("Servidor iniciado com sucesso", {
      layer: "application",
      tags: ["App", "Startup"],
      extra: {
        nodeEnv: process.env.NODE_ENV,
        port: PORT,
      },
    });

    console.log("✓ Sistema de logs inicializado com sucesso");
  } catch (error) {
    console.error("✗ Erro ao inicializar sistema de logs:", error);
  }
}

const DEV_PORT = 5007;

const PORT =
  process.env.NODE_ENV === "production"
    ? Number(process.env.PORT) || 5006
    : DEV_PORT;

console.log(
  `Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`,
);
// Erros não tratados em nível de processo
process.on("uncaughtException", (err) => {
  loggerService
    .capture(err, { layer: "job", tags: ["uncaughtException"] })
    .catch(() => {})
    .finally(() => {
      console.error("[uncaughtException]", err);
      process.exit(1);
    });
});

process.on("unhandledRejection", (reason) => {
  loggerService
    .capture(reason, { layer: "job", tags: ["unhandledRejection"] })
    .catch(() => console.error("[unhandledRejection]", reason));
});

// Start
server.listen(PORT, "0.0.0.0", async () => {
  console.log(`Servidor rodando na porta ${PORT} (todas as interfaces)`);
  console.log(`- Acesso local: http://localhost:${PORT}`);
  console.log(
    localOrigins.length > 0
      ? `- Acesso pela rede: ${localOrigins.map((ip) => `${ip}`).join(", ")}`
      : "- Nenhum IP local detectado para acesso pela rede",
  );
  if (process.env.API_URL) {
    console.log(`- API URL configurada: ${process.env.API_URL}`);
  }
  await inicializarLogs();
});
