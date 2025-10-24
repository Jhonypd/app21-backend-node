import { prismaClient } from "../../lib/prisma";

interface LoginProps {
	email: string;
	senha: string;
}

interface SignupProps {
	nome: string | null;
	email: string;
	senha: string;
}

interface Response {
	Sucesso: boolean;
	Mensagem: string | null;
	Detalhe: string | null;
	CodigoRetorno: number;
	TipoRetorno: number;
	Resultado: any;
}

const JWT_SECRET = process.env.JWT_SECRET as string

export const login = async ({ email, senha }: LoginProps): Promise<Response> => {
	const usuario = await prismaClient.pessoa.findUnique({ where: { email } });

	// tenta autenticar
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password: senha,
	});

	if (error) {
		console.error("Erro ao fazer login:", error.message);
		return {
			CodigoRetorno: 401,
			Detalhe: error.message,
			Mensagem: "Erro ao fazer login",
			Resultado: null,
			Sucesso: false,
			TipoRetorno: 0,
		};
	}

	return {
		Sucesso: true,
		Mensagem: "Login realizado com sucesso",
		Detalhe: null,
		Resultado: {
			user: data.user.user_metadata,
			session: data.session,
		},
		CodigoRetorno: 200,
		TipoRetorno: 1,
	};
};

export const signup = async ({ nome, email, senha }: SignupProps): Promise<Response> => {
	const supabase = await supabaseServer();

	const { data, error } = await supabase.auth.signUp({
		email,
		password: senha,
		options: {
			data: {
				nome: nome || "",
			},
		},
	});

	if (error) {
		throw new Error(error.message);
	}

	if (!data.user) {
		throw new Error("Erro ao criar usuário");
	}

	// Cria registro no banco local via Prisma
	const pessoa = await prismaClient.pessoa.create({
		data: {
			id: data.user.id,
			nome: data.user.user_metadata.nome,
			email: data.user.email,
			auth_id: data.user.id,
		},
	});

	return {
		Sucesso: true,
		CodigoRetorno: 201,
		TipoRetorno: 1,
		Mensagem: "Usuário criado com sucesso",
		Detalhe: null,
		Resultado: {
			id: pessoa.id,
		},
	};
};
