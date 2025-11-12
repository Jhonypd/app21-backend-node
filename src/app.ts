import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import socketEventos from "./sockets/index";
import salas from "./routes/salas/sala.routes";
import auth from "./routes/auth/auth.routes";
import pessoas from "./routes/pessoas/pessoa.routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.FRONTEND_URL ||
      "http://192.168.0.156" ||
      "http://localhost:5005", // URL específica
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Se usar cookies/auth
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://192.168.0.156" ||
      "http://localhost:5005",
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());

app.use("/auth", auth);
app.use("/pessoas", pessoas);
app.use("/salas", salas);
socketEventos(io, process.env.JWT_SECRET!);

const PORT = 5005;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
