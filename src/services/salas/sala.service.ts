import { prismaClient as prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

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

  return 1;
};

export const criar = async ({
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
    const saltRounds = 12;
    hashedSenha = await bcrypt.hash(senha, saltRounds);
  }

  const novaSala = await prisma.sala.create({
    data: {
      titulo,
      codigo,
      senha: hashedSenha,
      criado_por: proprietarioId,
    },
  });

  if (!novaSala) {
    throw new Error("Erro ao criar a sala.");
  }

  return novaSala;
};

export const listar = async () => {
  return await prisma.sala.findMany({ include: { votos: true } });
};
