import { hash } from "../../lib/hash";
import { prismaClient as prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { salaRepository } from "../../repositories/sala.repository";

interface CriarSalaProps {
  proprietarioId: string;
  titulo: string;
  senha?: string | null;
  salaPrivada: boolean;
}

const geradorCodigoUnico = async () => {
  const ultimoCodigo = await prisma.sala.findFirst({
    select: { codigo: true },
    orderBy: { codigo: "desc" },
  });

  if (ultimoCodigo) {
    return ultimoCodigo.codigo + 1;
  }
  debugger;
  return 1;
};

export const inserir = async ({
  titulo,
  senha,
  salaPrivada,
  proprietarioId,
}: CriarSalaProps) => {
  if (salaPrivada && !senha) {
    throw new Error("Senha é obrigatória para salas privadas.");
  }
  const codigo = await geradorCodigoUnico();

  let hashedSenha: string | null = null;

  if (senha) {
    hashedSenha = await hash.senha(senha);
  }

  const novaSala = await salaRepository.inserir({
    codigo,
    titulo,
    senha: hashedSenha,
    criado_por: proprietarioId,
  });

  if (!novaSala) {
    throw new Error("Erro ao criar a sala.");
  }

  return novaSala;
};

export const listar = async (proprietarioId: string) => {
  return await salaRepository.listarTodos(proprietarioId);
};
