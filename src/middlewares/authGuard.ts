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

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	const refreshToken = req.headers["refreshtoken"] as string; // Já vem limpo

	// Extrair access token (formato: "Bearer <token>")
	const accessToken = authHeader && authHeader.startsWith("Bearer ") 
		? authHeader.slice(7) 
		: null;

	console.log("Token de autorização:", accessToken ? "Presente" : "Ausente");
	console.log("Token de refresh:", refreshToken ? "Presente" : "Ausente");

	// Requer ambos os tokens
	if (!accessToken || !refreshToken) {
		return res.status(401).json({
			errors: ["Tokens de acesso inválidos!"],
		});
	}

	try {
		const supabase = supabaseServer();

		const { data, error } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken,
		});

		if (error) {
			console.error("Erro ao definir sessão:", error);
			return res.status(401).json({ 
				errors: ["Sessão inválida.", error.message] 
			});
		}

		// console.log("Usuário autenticado:", data.user);
		// console.log("Token de refresh:", data.session?.refresh_token);
		// console.log("Dados da sessão:", data.session?.expires_in);

		if (!data.user) {
			return res.status(401).json({ errors: ["Usuário não autenticado."] });
		}

		const user = await prismaClient.pessoa.findUnique({
			where: { id: data.user.id },
			select: { id: true, nome: true, email: true },
		});

		if (!user) {
			return res.status(401).json({ errors: ["Usuário não encontrado no banco."] });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Erro na autenticação:", error);
		res.status(401).json({ errors: ["Erro interno de autenticação."] });
	}
};