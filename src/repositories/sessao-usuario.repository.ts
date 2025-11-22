import { prismaClient } from "../lib/prisma";

export const sessionUsuarioRepository = {
  criar: (pessoaId: string, expiracao: Date, ip?: string, userAgent?: string) =>
    prismaClient.sessaoPessoa.create({
      data: {
        pessoa_id: pessoaId,
        expiracao,
        ip,
        user_agent: userAgent,
      },
    }),

  deleteSessoesPorPessoaId: (pessoaId: string) =>
    prismaClient.sessaoPessoa.deleteMany({
      where: {
        pessoa_id: pessoaId,
      },
    }),

  buscarSessaoAtivaPorId: (id: string) =>
    prismaClient.sessaoPessoa.findUnique({
      where: { id, revogado_em: null },
    }),

  invalidarSessaoPorId: (sessaoId: string) =>
    prismaClient.sessaoPessoa.update({
      where: { id: sessaoId },
      data: { revogado_em: new Date() },
    }),

  buscarTodasSessoesAtivasPorPessoaId: (pessoaId: string) =>
    prismaClient.sessaoPessoa.findMany({
      where: { pessoa_id: pessoaId },
    }),

  atualizarUltimoAcesso: (sessaoId: string, ip?: string, userAgent?: string) =>
    prismaClient.sessaoPessoa.update({
      where: { id: sessaoId },
      data: {
        ultimo_acesso_em: new Date(),
        ip,
        user_agent: userAgent,
      },
    }),
};
