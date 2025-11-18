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

  obterPorSessao: (sessao_id: string) =>
    prismaClient.historiaSessao.findMany({
      where: {
        sessao_id,
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
      orderBy: {
        historia: {
          data_criacao: "asc",
        },
      },
    }),

  obterPorHistoria: (historia_id: string) =>
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
};
