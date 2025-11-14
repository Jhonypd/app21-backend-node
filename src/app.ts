import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import socketEventos from "./sockets/index";
import salas from "./routes/salas/sala.routes";
import auth from "./routes/auth/auth.routes";
import pessoas from "./routes/pessoas/pessoa.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Lista real de origins permitidos
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://192.168.2.99",
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

// Start
const PORT = process.env.PORT || 5006;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
