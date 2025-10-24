import { Request, Response } from "express";
import { login, signup } from "../../services/auth/auth.service";

export const loginController = async (req: Request, res: Response) => {
	const { email, senha } = req.body;

	if (!email || !senha) {
		return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
	}

	try {
		const data = await login({ email, senha });

		if (!data.Sucesso || !data.Resultado.user) {
			return res.status(401).json(data);
		}

		// Retorna dados do usuário e sessão
		return res.json(data);
	} catch (err: any) {
		return res.status(500).json({ mensagem: err.message });
	}
};

export const signupController = async (req: Request, res: Response) => {
	const { nome, email, senha } = req.body;

	if (!email || !senha) {
		return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
	}

	try {
		const resultado = await signup({ nome, email, senha });

		return res.status(201).json(resultado);
	} catch (err: any) {
		return res.status(500).json({ mensagem: err.message });
	}
};
