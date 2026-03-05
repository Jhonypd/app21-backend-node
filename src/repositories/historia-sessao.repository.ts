import { prismaClient } from "../lib/prisma";

interface HistoriaSessaoInserirData {
  sessao_id: string;
  historia_id: string;
  ordem?: number;
}

type BuscarHistoriaSessaoParams =
  | { id: string }
  | { sessao_id: string; historia_id: string };

const historiaSessaoInclude = {
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
} as const;

export const historiaSessaoRepository = {
  inserir: (data: HistoriaSessaoInserirData) =>
    prismaClient.historiaSessao.create({
      data: {
        sessao_id: data.sessao_id,
        historia_id: data.historia_id,
        ordem: data.ordem,
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

  obter: (params: BuscarHistoriaSessaoParams) => {
    if ("id" in params) {
      return prismaClient.historiaSessao.findUnique({
        where: { id: params.id },
        include: historiaSessaoInclude,
      });
    }

    return prismaClient.historiaSessao.findUnique({
      where: {
        sessao_id_historia_id: {
          sessao_id: params.sessao_id,
          historia_id: params.historia_id,
        },
      },
      include: historiaSessaoInclude,
    });
  },

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

  deletar: (id: string[], sessao_id: string) =>
    prismaClient.historiaSessao.deleteMany({
      where: { id: { in: id }, sessao_id },
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
