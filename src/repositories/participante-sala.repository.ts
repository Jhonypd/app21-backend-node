import { prismaClient } from "../lib/prisma";

interface ParticipanteSalaInserirData {
  sala_id: string;
  pessoa_id: string;
  tipo?: number; // 0 = dono, 1 = admin, 2 = participante, 3 = visitante
}

export const participanteSalaRepository = {
  inserir: ({ sala_id, pessoa_id, tipo = 2 }: ParticipanteSalaInserirData) =>
    prismaClient.participanteSala.create({
      data: { sala_id, pessoa_id, role: tipo },
    }),

  remover: (sala_id: string, pessoa_id: string) =>
    prismaClient.participanteSala.delete({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
    }),

  obterPorSalaEPessoa: (sala_id: string, pessoa_id: string) =>
    prismaClient.participanteSala.findUnique({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
      include: {
        pessoa: {
          select: {
            id: true,
            nome: true,
            inativo: true,
          },
        },
      },
    }),

  obterTodosParticipantesPorSala: (
    sala_id: string,
    sessao_id?: string | null,
    apenasOnline: boolean = false,
  ) =>
    prismaClient.participanteSala.findMany({
      where: {
        sala_id,
        // Se apenasOnline=true, filtra apenas quem está online na sessão
        ...(apenasOnline &&
          sessao_id && {
            pessoa: {
              participantes_sessao: {
                some: {
                  sessao_id,
                  online: true,
                },
              },
            },
          }),
      },
      select: {
        role: true,
        pessoa: {
          select: {
            id: true,
            nome: true,
            inativo: true,
            ...(apenasOnline &&
              sessao_id && {
                participantes_sessao: {
                  where: { sessao_id, online: true },
                  select: { online: true },
                },
              }),
          },
        },
      },
    }),

  alterarRole: (sala_id: string, pessoa_id: string, role: number) =>
    prismaClient.participanteSala.update({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
      data: { role },
    }),
};
