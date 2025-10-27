import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import socketEventos from "./sockets/index";
import salas from "./routes/salas/sala.routes";
import auth from "./routes/auth/auth.routes";
import pessoas from "./routes/pessoas/pessoa.routes";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/pessoas", pessoas);
app.use("/salas", salas);

socketEventos(io);

const PORT = 5005;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
