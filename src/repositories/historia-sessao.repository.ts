import { prismaClient } from "../lib/prisma";

interface HistoriaSessaoInserirData {
  sessao_id: string;
  historia_id: string;
}

export const historiaSessaoRepository = {
  inserir: (data: HistoriaSessaoInserirData) =>
    prismaClient.historiaSessao.create({
      data: {
        sessao_id: data.sessao_id,
        historia_id: data.historia_id,
      },
      include: {
        sessao: {
          select: {
            id: true,
            sala_id: true,
            ativa: true,
          },
        },
        historia: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            sala_id: true,
          },
        },
        votos: {
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
                inativo: true,
              },
            },
          },
        },
      },
    }),

  obterPorId: (id: string) =>
    prismaClient.historiaSessao.findUnique({
      where: { id },
      include: {
        sessao: {
          select: {
            id: true,
            sala_id: true,
            ativa: true,
          },
        },
        historia: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            sala_id: true,
          },
        },
        votos: {
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
                inativo: true,
              },
            },
          },
          orderBy: {
            data_voto: "asc",
          },
        },
      },
    }),

  obterPorSessaoEHistoria: (sessao_id: string, historia_id: string) =>
    prismaClient.historiaSessao.findUnique({
      where: {
        sessao_id_historia_id: {
          sessao_id,
          historia_id,
        },
      },
      include: {
        sessao: {
          select: {
            id: true,
            sala_id: true,
            ativa: true,
          },
        },
        historia: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            sala_id: true,
          },
        },
        votos: {
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
                inativo: true,
              },
            },
          },
          orderBy: {
            data_voto: "asc",
          },
        },
      },
    }),

  listarPorSessao: (sessao_id: string) =>
    prismaClient.historiaSessao.findMany({
      where: {
        sessao_id,
      },
      include: {
        historia: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
          },
        },
        votos: {
          select: {
            id: true,
            valor: true,
            data_voto: true,
          },
        },
      },
      orderBy: {
        ordem: "asc",
      },
    }),

  listarPorHistoria: (historia_id: string) =>
    prismaClient.historiaSessao.findMany({
      where: {
        historia_id,
      },
      include: {
        sessao: {
          select: {
            id: true,
            sala_id: true,
            ativa: true,
          },
        },
        historia: {
          select: {
            id: true,
            titulo: true,
            descricao: true,
            sala_id: true,
          },
        },
        votos: {
          include: {
            pessoa: {
              select: {
                id: true,
                nome: true,
                inativo: true,
              },
            },
          },
          orderBy: {
            data_voto: "asc",
          },
        },
      },
    }),

  deletar: (id: string) =>
    prismaClient.historiaSessao.delete({
      where: { id },
    }),

  deletarPorSessao: (sessao_id: string) =>
    prismaClient.historiaSessao.deleteMany({
      where: {
        sessao_id,
      },
    }),

  obterMaiorOrdem: async (sessao_id: string) => {
    const resultado = await prismaClient.historiaSessao.findFirst({
      where: { sessao_id },
      orderBy: { ordem: "desc" },
      select: { ordem: true },
    });
    return resultado?.ordem;
  },
};
