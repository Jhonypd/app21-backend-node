import { Request, Response } from "express";
import { criar, listar } from "../../services/salas/sala.service";

export const criarSalas = async (req: Request, res: Response) => {
	try {
		const sala = await criar(req.body.nome);
		res.status(201).json(sala);
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
};

export const listarSalas = async (req: Request, res: Response) => {
	try {
		const salas = await listar();
		res.json(salas);
	} catch (error: any) {
		res.status(500).json({ erro: error.message });
	}
};
