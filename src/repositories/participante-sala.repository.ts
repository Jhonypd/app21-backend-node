import { prismaClient } from "../lib/prisma";

interface ParticipanteSalaInserirData {
  sala_id: string;
  pessoa_id: string;
  membro_permanente: boolean;
}

export const participanteSalaRepository = {
  inserir: ({
    sala_id,
    pessoa_id,
    membro_permanente = false,
  }: ParticipanteSalaInserirData) =>
    prismaClient.participanteSala.create({
      data: { sala_id, pessoa_id, membro_permanente },
    }),

  remover: (sala_id: string, pessoa_id: string) =>
    prismaClient.participanteSala.delete({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
    }),

  obterPorSalaEPessoa: (sala_id: string, pessoa_id: string) =>
    prismaClient.participanteSala.findUnique({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
    }),

  obterTodosParticipantesPorSala: (sala_id: string) =>
    prismaClient.participanteSala.findMany({
      where: { sala_id },
    }),

  alterarParticipanteSalaMembroPermanente: (
    sala_id: string,
    pessoa_id: string,
    membro_permanente: boolean
  ) =>
    prismaClient.participanteSala.update({
      where: { sala_id_pessoa_id: { sala_id, pessoa_id } },
      data: { membro_permanente },
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
