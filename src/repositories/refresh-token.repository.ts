import { prismaClient } from "../lib/prisma";

export const RefreshTokenRepository = {
  criar: async (sessao_id: string, token: string, expiracao: Date) => {
    console.log("💾 [RefreshTokenRepository] Criando registro:", {
      sessao_id,
      tokenHashLength: token?.length,
      expiracao: expiracao?.toISOString(),
    });

    const result = await prismaClient.refreshToken.create({
      data: {
        sessao_id,
        token_hash: token,
        expiracao,
      },
    });

    console.log("💾 [RefreshTokenRepository] Registro criado:", {
      rf_id: result.id,
      sessao_id: result.sessao_id,
    });

    return result;
  },

  deletarPorId: (id: string) =>
    prismaClient.refreshToken.delete({ where: { id } }),

  buscarPorSessaoId: async (sessao_id: string) => {
    console.log(
      "🔎 [RefreshTokenRepository] Buscando por sessao_id:",
      sessao_id,
    );

    const result = await prismaClient.refreshToken.findUnique({
      where: { sessao_id },
    });

    console.log("🔎 [RefreshTokenRepository] Resultado da busca:", {
      encontrado: !!result,
      rf_id: result?.id,
      sessao_id: result?.sessao_id,
      expiracao: result?.expiracao?.toISOString(),
    });

    return result;
  },

  atualizarTokenHash: (sessao_id: string, novoTokenHash: string) =>
    prismaClient.refreshToken.update({
      where: { sessao_id },
      data: { token_hash: novoTokenHash },
    }),

  deletarTodosPorSessaoId: (sessao_id: string) =>
    prismaClient.refreshToken.deleteMany({
      where: { sessao_id },
    }),
};
