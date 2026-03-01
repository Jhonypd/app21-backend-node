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
            role: true,
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
            role: true,
            online: true,
            pessoa: {
              select: {
                id: true,
                nome: true,
                inativo: true,
              },
            },
          },
        },
        sessoes: {
          where: {
            ativa: true,
          },
          select: {
            id: true,
            criada_em: true,
            ativa: true,
            iniciada_por: true,
            participantes: {
              select: {
                autorizado: true,
                participa_votacao: true,
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
        },
      },
    }),

  listarTodos: (
    pessoaId: string,
    pagina: number,
    itensPagina: number,
    valorPesquisa?: string,
  ) =>
    prismaClient.sala.findMany({
      where: {
        inativo: false,
        OR: [
          { criado_por: pessoaId },
          { participantes: { some: { pessoa_id: pessoaId } } },
          { titulo: { contains: valorPesquisa, mode: "insensitive" } },
          { codigo: { contains: valorPesquisa, mode: "insensitive" } },
          {
            sessoes: {
              some: {
                participantes: {
                  some: {
                    pessoa_id: pessoaId,
                    autorizado: true,
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        codigo: true,
        titulo: true,
        senha: true,
        criado_por: true,
        data_criacao: true,
        inativo: true,
        proprietario: { select: { id: true, nome: true, inativo: true } },
        _count: {
          select: {
            participantes: true,
          },
        },
        participantes: {
          where: {
            pessoa_id: pessoaId,
          },
          select: {
            role: true,
          },
        },
        sessoes: {
          // where: {
          //   ativa: true,
          // },
          select: {
            id: true,
            criada_em: true,
            ativa: true,
            iniciada_por: true,
            encerrada_por: true,
            data_encerramento: true,
            _count: {
              select: {
                participantes: true,
              },
            },
          },
          orderBy: {
            criada_em: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        data_criacao: "desc",
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

  /**
   * Busca dados completos da sala para edição (apenas para dono)
   */
  obterParaEdicao: (id: string, criadoPor: string) =>
    prismaClient.sala.findUnique({
      where: { id, criado_por: criadoPor },
      select: {
        id: true,
        titulo: true,
        senha: true,
        participantes: {
          select: {
            role: true,
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

  /**
   * Atualiza status de atividade da sala (soft delete)
   */
  atualizarStatus: (sala_id: string, inativo: boolean) =>
    prismaClient.sala.update({
      where: { id: sala_id },
      data: { inativo },
    }),

  /**
   * Atualiza campos da sala (genérico)
   */
  atualizar: (
    sala_id: string,
    data: Partial<{
      historia_atual_id: string | null;
      votos_revelados: boolean;
    }>,
  ) =>
    prismaClient.sala.update({
      where: { id: sala_id },
      data,
    }),
};
