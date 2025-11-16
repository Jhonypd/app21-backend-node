import { prismaClient } from "../lib/prisma";

export const sessionUsuarioRepository = {
  criar: (usuarioId: string, expiracao: Date) =>
    prismaClient.sessaoUsuario.create({
      data: {
        usuario_id: usuarioId,
        expiracao,
      },
    }),

  invalidarSessoesAtivas: (usuarioId: string) =>
    prismaClient.sessaoUsuario.updateMany({
      where: {
        usuario_id: usuarioId,
        revogado_em: null,
      },
      data: {
        revogado_em: new Date(),
      },
    }),

  buscarSessao: (id: string) =>
    prismaClient.sessaoUsuario.findUnique({
      where: { id },
    }),
};
