import { prismaClient } from "../lib/prisma";

export const RefreshTokenRepository = {
  criar: (userId: string, token: string, expiracao: Date) =>
    prismaClient.refreshToken.create({
      data: {
        userId,
        token,
        expiracao,
      },
    }),

  buscarPorToken: (token: string) =>
    prismaClient.refreshToken.findUnique({
      where: { token },
    }),
  revogar: (token: string) =>
    prismaClient.refreshToken.update({
      where: { token },
      data: { revogado_em: new Date() },
    }),
  revogarPorUsuarioId: (userId: string) =>
    prismaClient.refreshToken.updateMany({
      where: { userId, revogado_em: null },
      data: { revogado_em: new Date() },
    }),
};
