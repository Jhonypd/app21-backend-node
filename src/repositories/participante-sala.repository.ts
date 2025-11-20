import { prismaClient } from "../lib/prisma";

interface ParticipanteSalaInserirData {
  sala_id: string;
  pessoa_id: string;
  tipo?: number; // 0 = dono, 1 = admin, 2 = participante
}

export const participanteSalaRepository = {
  inserir: ({ sala_id, pessoa_id, tipo = 2 }: ParticipanteSalaInserirData) =>
    prismaClient.participanteSala.create({
      data: { sala_id, pessoa_id, tipo },
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

  obterTodosParticipantesPorSala: (sala_id: string) =>
    prismaClient.participanteSala.findMany({
      where: { sala_id },
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

  alterarParticipanteSalaOnline: (
    sala_id: string,
    pessoa_id: string,
    online: boolean
  ) =>
    prismaClient.participanteSala.update({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
      data: { online },
    }),
};
