import { prismaClient } from "../lib/prisma";

export const RefreshTokenRepository = {
  criar: (sessao_id: string, token: string, expiracao: Date) =>
    prismaClient.refreshToken.create({
      data: {
        sessao_id,
        token_hash: token,
        expiracao,
      },
    }),

  deletarPorId: (id: string) =>
    prismaClient.refreshToken.delete({ where: { id } }),

  buscarPorSessaoId: (sessao_id: string) =>
    prismaClient.refreshToken.findUnique({
      where: { sessao_id },
    }),

  deletarTodosPorSessaoId: (sessao_id: string) =>
    prismaClient.refreshToken.deleteMany({
      where: { sessao_id },
    }),
};
