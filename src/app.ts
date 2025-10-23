import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import routesSalas from "./routes/salas/sala.routes";
import auth from "./routes/auth/auth.routes";
import socketEventos from "./sockets/index";

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

app.use("/auth", auth);
app.use("/salas", routesSalas);

socketEventos(io);

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
