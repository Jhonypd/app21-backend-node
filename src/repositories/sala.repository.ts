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

  obterPorId: (id: string, criadoPor: string, comSenha: boolean) =>
    prismaClient.sala.findUnique({
      where: { id, criado_por: criadoPor },
      omit: { senha: !comSenha },
    }),

  obterPorCodigo: (codigo: string, criadoPor: string, comSenha: boolean) =>
    prismaClient.sala.findUnique({
      where: { codigo, criado_por: criadoPor },
      omit: { senha: !comSenha },
      include: {
        proprietario: { select: { id: true, nome: true, inativo: true } },
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
        votos: {
          select: {
            id: true,
            valor: true,
            pessoa: { select: { id: true, nome: true, inativo: true } },
          },
        },
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
