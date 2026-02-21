import { prismaClient } from "../lib/prisma";

interface ParticipanteSessaoInserirData {
  sessao_id: string;
  pessoa_id: string;
  autorizado?: boolean;
  participa_votacao?: boolean;
}

export const participanteSessaoRepository = {
  inserir: (data: ParticipanteSessaoInserirData) =>
    prismaClient.participanteSessao.create({
      data: {
        sessao_id: data.sessao_id,
        pessoa_id: data.pessoa_id,
        autorizado: data.autorizado ?? false,
        participa_votacao: data.participa_votacao ?? true,
      },
      include: {
        pessoa: {
          select: {
            id: true,
            nome: true,
            inativo: true,
          },
        },
        sessao: {
          select: {
            id: true,
            sala_id: true,
            ativa: true,
          },
        },
      },
    }),

  obterPorSessaoEPessoa: (sessao_id: string, pessoa_id: string) =>
    prismaClient.participanteSessao.findUnique({
      where: {
        sessao_id_pessoa_id: {
          sessao_id,
          pessoa_id,
        },
      },
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

  obterParticipantesPorSessao: (sessao_id: string) =>
    prismaClient.participanteSessao.findMany({
      where: {
        sessao_id,
      },
      select: {
        id: true,
        participa_votacao: true,
        pessoa: {
          select: {
            id: true,
            nome: true,
            inativo: true,
          },
        },
      },
    }),

  atualizarAutorizacao: (
    sessao_id: string,
    pessoa_id: string,
    autorizado: boolean,
  ) =>
    prismaClient.participanteSessao.update({
      where: {
        sessao_id_pessoa_id: {
          sessao_id,
          pessoa_id,
        },
      },
      data: {
        autorizado,
      },
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

  /**
   * Método genérico para atualizar campos de ParticipanteSessao
   * Útil para operações como kick (autorizado=false)
   */
  atualizar: (
    sessao_id: string,
    pessoa_id: string,
    dados: {
      autorizado?: boolean;
      online?: boolean;
      participa_votacao?: boolean;
    },
  ) =>
    prismaClient.participanteSessao.update({
      where: {
        sessao_id_pessoa_id: {
          sessao_id,
          pessoa_id,
        },
      },
      data: dados,
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

  deletar: (sessao_id: string, pessoa_id: string) =>
    prismaClient.participanteSessao.delete({
      where: {
        sessao_id_pessoa_id: {
          sessao_id,
          pessoa_id,
        },
      },
    }),

  // ✅ Desautorizar todos os participantes de uma sessão (ao encerrar)
  desautorizarTodosPorSessao: (sessao_id: string) =>
    prismaClient.participanteSessao.updateMany({
      where: { sessao_id },
      data: { autorizado: false },
    }),
};
