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
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

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
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
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

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

socketEventos(io, process.env.JWT_SECRET!);

const DEV_PORT = 5007;

const PORT =
  process.env.NODE_ENV === "production" ? process.env.PORT || 5006 : DEV_PORT;

console.log(
  `Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`
);
// Start
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
