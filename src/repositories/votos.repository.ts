import { prismaClient } from "../lib/prisma";

interface VotoInserirData {
  historia_sessao_id: string;
  pessoa_id: string;
  valor: number;
}

interface VotoAtualizarData {
  valor: number;
}

export const votosRepository = {
  inserir: (voto: VotoInserirData) =>
    prismaClient.voto.create({
      data: {
        historia_sessao_id: voto.historia_sessao_id,
        pessoa_id: voto.pessoa_id,
        valor: voto.valor,
      },
    }),

  atualizar: (
    historia_sessao_id: string,
    pessoa_id: string,
    data: VotoAtualizarData,
  ) =>
    prismaClient.voto.update({
      where: {
        historia_sessao_id_pessoa_id: {
          historia_sessao_id,
          pessoa_id,
        },
      },
      data: {
        valor: data.valor,
        data_voto: new Date(),
      },
    }),

  obterVotoPorHistoriaSessaoEPessoa: (
    historia_sessao_id: string,
    pessoa_id: string,
  ) =>
    prismaClient.voto.findUnique({
      where: {
        historia_sessao_id_pessoa_id: {
          historia_sessao_id,
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
        historiaSessao: {
          include: {
            sessao: {
              select: {
                id: true,
                sala_id: true,
              },
            },
            historia: {
              select: {
                id: true,
                titulo: true,
                descricao: true,
              },
            },
          },
        },
      },
    }),

  obterVotosPorHistoriaSessao: (historia_sessao_id: string) =>
    prismaClient.voto.findMany({
      where: {
        historia_sessao_id,
      },
      include: {
        pessoa: {
          select: {
            id: true,
            nome: true,
            inativo: true,
          },
        },
        historiaSessao: {
          include: {
            sessao: {
              select: {
                id: true,
                sala_id: true,
              },
            },
            historia: {
              select: {
                id: true,
                titulo: true,
                descricao: true,
              },
            },
          },
        },
      },
      orderBy: {
        data_voto: "asc",
      },
    }),

  obterVotosPorSessao: (sessao_id: string) =>
    prismaClient.voto.findMany({
      where: {
        historiaSessao: {
          sessao_id,
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
        historiaSessao: {
          include: {
            sessao: {
              select: {
                id: true,
                sala_id: true,
              },
            },
            historia: {
              select: {
                id: true,
                titulo: true,
                descricao: true,
              },
            },
          },
        },
      },
      orderBy: {
        data_voto: "asc",
      },
    }),

  deletarVotosPorHistoriaSessao: (
    historia_sessao_id: string,
    historia_id: string,
  ) =>
    prismaClient.voto.deleteMany({
      where: {
        historia_sessao_id,
        AND: {
          historiaSessao: {
            historia_id,
          },
        },
      },
    }),

  deletarVotosPorSessao: (sessao_id: string) =>
    prismaClient.voto.deleteMany({
      where: {
        historiaSessao: {
          sessao_id,
        },
      },
    }),

  contarVotosPorHistoriaSessao: (historia_sessao_id: string) =>
    prismaClient.voto.count({
      where: {
        historia_sessao_id,
      },
    }),

  contarVotosPorSessao: (sessao_id: string) =>
    prismaClient.voto.count({
      where: {
        historiaSessao: {
          sessao_id,
        },
      },
    }),

  /**
   * Conta total de votos em uma sala (para validação de exclusão)
   * Conta votos através de HistoriaSessao → SessaoSala → Sala
   */
  contarPorSala: (sala_id: string) =>
    prismaClient.voto.count({
      where: {
        historiaSessao: {
          sessao: {
            sala_id,
          },
        },
      },
    }),
};
