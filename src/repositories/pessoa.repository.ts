import { prismaClient } from "../lib/prisma";

export const pessoaRepository = {
  obterSenhaAtual: (id: string) =>
    prismaClient.pessoa.findUnique({
      where: { id },
      select: {
        senha: true,
      },
    }),

  obterPorEmail: (emailHash: string) =>
    prismaClient.pessoa.findFirst({
      where: { email_hash: emailHash, inativo: false },
    }),

  validaCodigoEmailExiste: (codigo: string) =>
    prismaClient.pessoa.findFirst({
      where: { codigo_confirmacao_hash: codigo, inativo: false },
      select: {
        id: true,
        nome: true,
        email: true,
        codigo_confirmacao: true,
        codigo_expiracao: true,
        codigo_confirmacao_hash: true,
        email_hash: true,
        inativo: true,
        email_confirmado: true,
      },
    }),

  confirmarEmailContaNovoUsuario: (id: string) =>
    prismaClient.pessoa.update({
      where: { id, inativo: false },
      data: {
        email_confirmado: true,
        codigo_confirmacao: null,
        codigo_confirmacao_hash: null,
        codigo_expiracao: null,
      },
      omit: { senha: true },
    }),
  // precisa adicionar a logica de ultima_senha
  redefinirSenha: (codigo: string, senha: string, id: string) =>
    prismaClient.pessoa.update({
      where: { codigo_confirmacao_hash: codigo, id, inativo: false },
      data: {
        senha,
        codigo_confirmacao: null,
        codigo_confirmacao_hash: null,
        codigo_expiracao: null,
      },
      omit: { senha: true },
    }),

  inserir: (
    nome: string,
    email: string,
    email_hash: string,
    senha: string,
    codigo: string,
    codigoHash: string,
    codigoExp: Date
  ) =>
    prismaClient.pessoa.create({
      data: {
        nome,
        email,
        email_hash,
        senha,
        codigo_confirmacao: codigo,
        codigo_confirmacao_hash: codigoHash,
        codigo_expiracao: codigoExp,
      },
    }),

  obterPorId: (id: string, comSenha: boolean) =>
    prismaClient.pessoa.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        email_hash: true,
        data_criacao: true,
        inativo: true,
        email_confirmado: true,
        senha: comSenha ? true : false,
      },
    }),

  obterTodosPorNomeOuEmail: (valorPesquisa: string, salaId?: string) =>
    prismaClient.pessoa.findMany({
      where: {
        inativo: false,
        OR: [
          { nome: { contains: valorPesquisa, mode: "insensitive" } },
          { email_hash: { contains: valorPesquisa, mode: "insensitive" } },
        ],
        NOT: [
          {
            participacoes: {
              some: { sala_id: salaId },
            },
          },
          {},
        ],
      },
      select: {
        id: true,
        nome: true,
        inativo: true,
        email: true,
      },
      orderBy: { nome: "asc" },
    }),

  novoCodigo: (
    emailHash: string,
    codigo: string,
    codigoHash: string,
    codigoExp: Date
  ) =>
    prismaClient.pessoa.update({
      where: { email_hash: emailHash },
      data: {
        codigo_confirmacao: codigo,
        codigo_confirmacao_hash: codigoHash,
        codigo_expiracao: codigoExp,
      },
    }),

  alterar: (
    id: string,
    data: {
      nome: string;
      email: string;
      inativo: boolean;
      codigo_confirmacao?: string;
      codigo_confirmacao_hash?: string;
      codigo_expiracao?: Date;
    }
  ) =>
    prismaClient.pessoa.update({
      where: { id },
      data,
    }),
};
