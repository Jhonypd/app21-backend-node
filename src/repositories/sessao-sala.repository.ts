import { prismaClient } from "../lib/prisma";

interface SessaoSalaInserirData {
  sala_id: string;
  iniciada_por: string;
}

export const sessaoSalaRepository = {
  inserir: (data: SessaoSalaInserirData) =>
    prismaClient.sessaoSala.create({
      data: {
        sala_id: data.sala_id,
        ativa: true,
        iniciada_por: data.iniciada_por,
      },
      include: {
        sala: {
          select: {
            id: true,
            codigo: true,
            titulo: true,
            criado_por: true,
          },
        },
        participantes: {
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
        historias: {
          include: {
            historia: {
              select: {
                id: true,
                titulo: true,
                descricao: true,
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
        },
      },
    }),

  obterPorId: (id: string) =>
    prismaClient.sessaoSala.findUnique({
      where: { id },
      include: {
        iniciador: true,
        sala: {
          select: {
            id: true,
            codigo: true,
            titulo: true,
            criado_por: true,
            votos_revelados: true,
            historia_atual_id: true,
          },
        },
        participantes: {
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
        historias: {
          include: {
            historia: {
              select: {
                id: true,
                titulo: true,
                descricao: true,
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
        },
      },
    }),

  obterSessaoAtivaPorSala: (sala_id: string) =>
    prismaClient.sessaoSala.findFirst({
      where: {
        sala_id,
        ativa: true,
      },
      include: {
        sala: {
          select: {
            id: true,
            codigo: true,
            titulo: true,
            criado_por: true,
            votos_revelados: true,
            historia_atual_id: true,
          },
        },
        participantes: {
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
        historias: {
          include: {
            historia: {
              select: {
                id: true,
                titulo: true,
                descricao: true,
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
        },
      },
    }),

  desativarSessoesPorSala: (sala_id: string, encerrada_por?: string) =>
    prismaClient.sessaoSala.updateMany({
      where: {
        sala_id,
        ativa: true,
      },
      data: {
        ativa: false,
        // ✅ AUDITORIA: Registrar quem encerrou e quando
        // Nota: Requer migração do schema para adicionar campos:
        // encerrada_por String?
        // data_encerramento DateTime?
        ...(encerrada_por && {
          encerrada_por,
          data_encerramento: new Date(),
        }),
      },
    }),

  atualizarVotosRevelados: (sala_id: string, revelados: boolean) =>
    prismaClient.sala.update({
      where: { id: sala_id },
      data: { votos_revelados: revelados },
    }),

  atualizarHistoriaAtual: (sala_id: string, historia_id: string | null) =>
    prismaClient.sala.update({
      where: { id: sala_id },
      data: { historia_atual_id: historia_id },
    }),

  /**
   * Conta total de sessões criadas em uma sala (para validação de exclusão)
   */
  contarPorSala: (sala_id: string) =>
    prismaClient.sessaoSala.count({
      where: { sala_id },
    }),
};
