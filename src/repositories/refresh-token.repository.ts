import { prismaClient } from "../lib/prisma";

export const RefreshTokenRepository = {
  criar: async (sessao_id: string, token: string, expiracao: Date) => {
    const result = await prismaClient.refreshToken.create({
      data: {
        sessao_id,
        token_hash: token,
        expiracao,
      },
    });

    return result;
  },

  deletarPorId: (id: string) =>
    prismaClient.refreshToken.delete({ where: { id } }),

  buscarPorSessaoId: async (sessao_id: string) => {
    const result = await prismaClient.refreshToken.findUnique({
      where: { sessao_id },
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
