import { Server, Socket } from "socket.io";

interface VotoData {
	roomId: string;
	usuario: string;
	valor: string;
}

interface EntrarSalaData {
	roomId: string;
	usuario: string;
}

const socketEventos = (io: Server) => {
	io.on("connection", (socket: Socket) => {
		console.log("Usuário conectado:", socket.id);

		socket.on("entrar_sala", (data: EntrarSalaData) => {
			socket.join(data.roomId);
			io.to(data.roomId).emit("usuario_entrou", data.usuario);
		});

		socket.on("votar", (data: VotoData) => {
			io.to(data.roomId).emit("novo_voto", { usuario: data.usuario, valor: data.valor });
		});

		socket.on("revelar_votos", (roomId: string) => {
			io.to(roomId).emit("votos_revelados");
		});

		socket.on("disconnect", () => {
			console.log("Usuário desconectado:", socket.id);
		});
	});
};

export default socketEventos;
