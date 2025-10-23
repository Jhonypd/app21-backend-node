import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../lib/prisma";
import { supabaseServer } from "../lib/supabase";

interface User {
	id: string;
	nome: string;
	email: string | null;
}

interface JwtPayload {
	id: string;
	iat?: number;
	exp?: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

const jwtSecret = process.env.JWT_SECRET as string;

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const authHeaderRefreshToken = req.headers["refresh_token"];

	const token = authHeader && authHeader.split(" ")[1];
	const refreshToken = authHeaderRefreshToken && authHeaderRefreshToken.split(" ")[1];

	console.log("Token de autorização:", token);
	console.log("Token de refresh:", refreshToken);
	if (!token || !refreshToken) {
		return res.status(401).json({
			errors: ["Sem autorização!"],
		});
	}

	try {
		const supabase = await supabaseServer();

		const { error, data } = await supabase.auth.setSession({
			access_token: token,
			refresh_token: refreshToken,
		});
		console.log("Dados da sessão do Supabase:", data);

		const user = await prismaClient.pessoa.findUnique({
			where: { id: data.user?.id },
			select: {
				id: true,
				nome: true,
				email: true,
			},
		});

		if (!user) {
			return res.status(401).json({ errors: ["Usuário não encontrado."] });
		}

		// Adicionar usuário à request
		req.user = user;

		next();
	} catch (error) {
		console.error("Erro na autenticação:", error);
		res.status(401).json({ errors: ["Token inválido."] });
	}
};
