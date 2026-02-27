import express from "express";
import http from "http";
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
import dotenv from "dotenv";
import { errorHandler } from "./lib/errorHandler";
import { loggerLimpezaService } from "./services/monitoramento/logger-limpeza.service";
import { loggerService } from "./services/monitoramento/logger-index.service";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configurar trust proxy para obter o IP real do cliente através de proxies/load balancers
app.set("trust proxy", true);

// Lista real de origins permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://192.168.2.99:3000",
  "http://192.168.2.53:3000",
  "http://localhost:3000",
].filter(Boolean) as string[];

// CORS Geral do Express
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc)
      if (!origin) return callback(null, true);

      // Em desenvolvimento, permitir TODAS as origins
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // Em produção, verificar lista de origins permitidos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Rejeitar
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-token-sala",
      "X-CSRF-Token",
      "Accept",
      "sessao_id",
      "sala_id",
      "historia_id",
      "pessoa_id",
    ],
    exposedHeaders: [
      "set-cookie",
      "X-New-Access-Token",
      "X-New-Refresh-Token",
      "X-CSRF-Token",
    ],
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
app.use("/sessoes", votos);
app.use("/salas", historias);
app.use("/", historias);

// Middleware de tratamento de erros
app.use(errorHandler);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // Em desenvolvimento, permitir TODAS as origins
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`[Socket.IO CORS] Origin bloqueada: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-token-sala",
      "X-CSRF-Token",
    ],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

socketEventos(io, process.env.JWT_SECRET!);
loggerLimpezaService.start();
const DEV_PORT = 5007;

const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 5006 : DEV_PORT;

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
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
