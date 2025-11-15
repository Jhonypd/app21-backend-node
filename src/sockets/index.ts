import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { ClaimsAuthSala } from "../lib/jwt";

interface EntrarSalaData {
  token: string;
}

// const jwtSecret = process.env.JWT_SECRET as string;

const socketEventos = (io: Server, jwtSecret: string) => {
  io.use((socket, next) => {
    let token = socket.handshake.auth;

    // 👇 Aqui fazemos a normalização pro Insomnia
    if (typeof token === "object" && token?.token) {
      token = token.token;
    }

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

  io.on("connection", (socket: Socket) => {
    console.log("Usuário conectado:", socket.data.usuario.Usu_Na);

    socket.on("entrar_sala", (data: EntrarSalaData) => {
      const usuario = socket.data.usuario;

      socket.join(usuario.Sala_Id);

      io.to(usuario.Sala_Id).emit("usuario_entrou", {
        pessoa_id: usuario.Usu_Id,
        nome: usuario.Usu_Na,
        role: usuario.Role,
      });
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.data.usuario.Usu_Na);
    });
  });
};

export default socketEventos;
