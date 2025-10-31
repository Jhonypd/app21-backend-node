import { prismaClient } from "../lib/prisma";

interface SalaInserirData {
  codigo: number;
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

  obterPorId: (id: string) => prismaClient.sala.findUnique({ where: { id } }),

  obterPorCodigo: (codigo: number) =>
    prismaClient.sala.findUnique({ where: { codigo } }),

  alterar: (id: string, data: SalaAlterarData) =>
    prismaClient.sala.update({ where: { id }, data: data }),

  listarTodos: (pessoaId: string) =>
    prismaClient.sala.findMany({
      where: {
        criado_por: pessoaId,
        inativo: false,
        // OR: [{ participantes: { some: { pessoa_id: pessoaId } } }],
      },
      select: {
        id: true,
        codigo: true,
        titulo: true,
        criado_por: true,
        data_criacao: true,
        data_alteracao: true,
        inativo: true,
        votos: { select: { id: true, valor: true } },
        proprietario: { select: { id: true, nome: true, inativo: true } },
        participantes: {
          select: {
            pessoa_id: true,
            pessoa: {
              select: {
                nome: true,
                id: true,
                inativo: true,
              },
            },
          },
        },
      },
    }),
};
