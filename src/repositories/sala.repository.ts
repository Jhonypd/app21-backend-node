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
    prismaClient.sala.findMany({ where: { criado_por: pessoaId } }),
};
