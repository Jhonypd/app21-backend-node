import { Server, Socket } from "socket.io";

interface VotoData {
  pessoa_id: string;
  sala_id: string;
  valor: string;
}

interface EntrarSalaData {
  sala_id: string;
  pessoa_id: string;
}

const socketEventos = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("entrar_sala", (data: EntrarSalaData) => {
      socket.join(data.sala_id);
      io.to(data.sala_id).emit("usuario_entrou", data.pessoa_id);
    });

    socket.on("votar", (data: VotoData) => {
      io.to(data.sala_id).emit("novo_voto", {
        usuario: data.pessoa_id,
        valor: data.valor,
      });
    });

    socket.on("revelar_votos", (sala_id: string) => {
      io.to(sala_id).emit("votos_revelados");
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });
};

export default socketEventos;
