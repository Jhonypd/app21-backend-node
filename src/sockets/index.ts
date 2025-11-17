import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ClaimsAuthSala } from "../lib/jwt";

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
      console.error("Erro ao verificar token:", error);
      next(new Error("Token inválido"));
    }
  });

  // Conexão
  io.on("connection", (socket: Socket) => {
    const user = socket.data.usuario;

    console.log("Usuário conectado:", user.Usu_Na);

    // Entrar na sala
    socket.on("entrar_sala", () => {
      socket.join(user.Sala_Id);

      io.to(user.Sala_Id).emit("usuario_entrou", {
        pessoa_id: user.Usu_Id,
        nome: user.Usu_Na,
        role: user.Role,
      });
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", user.Usu_Na);
    });
  });
};

export default socketEventos;
