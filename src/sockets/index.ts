import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ClaimsAuthSala } from "../lib/jwt";
import { loggerService } from "../services/monitoramento/logger-index.service";

const socketEventos = (io: Server, jwtSecret: string) => {
  // Autenticação WebSocket
  io.use((socket, next) => {
    const { token } = socket.handshake.auth ?? {};

    if (!token || typeof token !== "string") {
      return next(new Error("Token não fornecido"));
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as ClaimsAuthSala;
      socket.data.usuario = decoded;
      next();
    } catch (error) {
      loggerService
        .capture(error, {
          layer: "socket",
          tags: ["ws-auth"],
          extra: { socketId: socket.id },
        })
        .catch(() => {});
      next(new Error("Token inválido"));
    }
  });

  // Conexão
  io.on("connection", (socket: Socket) => {
    const user = socket.data.usuario;

    console.log("Usuário conectado:", user.Nome);

    // Entrar na sala
    socket.on("entrar_sala", () => {
      socket.join(user.Sala_Id);

      io.to(user.Sala_Id).emit("usuario_entrou", {
        pessoa_id: user.Usuario_Id,
        nome: user.Nome,
        role: user.Role,
      });
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", user.Nome);
    });
  });
};

export default socketEventos;
