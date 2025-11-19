import { prismaClient } from "../lib/prisma";

interface SalaInserirData {
  codigo: string;
  titulo: string;
  senha?: string | null;
  criado_por: string;
}

interface SalaAlterarData {
  titulo?: string;
  senha?: string | null;
}

export const salaRepository = {
  inserir: (data: SalaInserirData) =>
    prismaClient.sala.create({
      data: data,
    }),

  alterar: (id: string, criadoPor: string, data: SalaAlterarData) =>
    prismaClient.sala.update({
      where: { id, criado_por: criadoPor },
      data: data,
    }),

  delete: (id: string, criadoPor: string) =>
    prismaClient.sala.delete({ where: { id, criado_por: criadoPor } }),

  obterPorId: (id: string, comSenha: boolean, criadoPor?: string) =>
    prismaClient.sala.findUnique({
      where: { id, criado_por: criadoPor },
      omit: { senha: !comSenha },
      include: {
        proprietario: { select: { id: true, nome: true, inativo: true } },
        participantes: {
          select: {
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
          select: {
            id: true,
            titulo: true,
            descricao: true,
          },
        },
        sessoes: {
          where: {
            ativa: true,
          },
          select: {
            id: true,
            criada_em: true,
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
        },
      },
    }),

  obterPorCodigo: (codigo: string, comSenha: boolean, criadoPor?: string) =>
    prismaClient.sala.findUnique({
      where: { codigo, criado_por: criadoPor },
      omit: { senha: !comSenha },
      include: {
        proprietario: { select: { id: true, nome: true, inativo: true } },
        participantes: {
          select: {
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
          select: {
            id: true,
            titulo: true,
            descricao: true,
          },
        },
        sessoes: {
          where: {
            ativa: true,
          },
          select: {
            id: true,
            criada_em: true,
            historias: {
              select: {
                id: true,
                historia: {
                  select: {
                    id: true,
                    titulo: true,
                  },
                },
                votos: {
                  select: {
                    id: true,
                    pessoa_id: true,
                    valor: true,
                    pessoa: {
                      select: {
                        nome: true,
                        inativo: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),

  listarTodos: (pessoaId: string, pagina: number, itensPagina: number) =>
    prismaClient.sala.findMany({
      where: {
        // criado_por: pessoaId,
        inativo: false,
        OR: [
          { criado_por: pessoaId },
          { participantes: { some: { pessoa_id: pessoaId } } },
        ],
      },
      select: {
        id: true,
        codigo: true,
        titulo: true,
        criado_por: true,
        data_criacao: true,
        data_alteracao: true,
        inativo: true,
        senha: true,
        sessoes: {
          where: {
            ativa: true,
          },
          select: {
            id: true,
            historias: {
              select: {
                id: true,
                votos: {
                  select: {
                    id: true,
                    valor: true,
                    pessoa: { select: { id: true, nome: true, inativo: true } },
                  },
                },
              },
            },
          },
        },
        proprietario: { select: { id: true, nome: true, inativo: true } },
        participantes: {
          select: {
            pessoa_id: true,
            pessoa: {
              select: {
                nome: true,
                inativo: true,
              },
            },
          },
        },
      },
      take: itensPagina,
      skip: (pagina - 1) * itensPagina,
    }),

  obterMembroSala: (salaId: string, pessoaId: string) =>
    prismaClient.participanteSala.findUnique({
      where: { sala_id_pessoa_id: { sala_id: salaId, pessoa_id: pessoaId } },
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
};
