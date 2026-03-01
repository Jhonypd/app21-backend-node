import { criptografia } from "../lib/criptografia";
import { prismaClient } from "../lib/prisma";
import { normalizarTexto } from "./normalize-texto";

export async function main() {
  console.log("Iniciando seed...");

  const pessoas = await prismaClient.pessoa.findMany({
    select: { id: true, nome: true, email: true },
  });

  if (pessoas.length === 0) {
    console.log("Nenhuma pessoa encontrada para atualizar.");
    return;
  }

  let pessoasAtualizadas = 0;

  for (const pessoa of pessoas) {
    try {
      const nomePlain = criptografia.descriptografar(pessoa.nome);
      const emailPlain = criptografia.descriptografar(pessoa.email);

      await prismaClient.pessoa.update({
        where: { id: pessoa.id },
        data: {
          nome_busca: normalizarTexto.normalizarNomeBusca(nomePlain),
          email_busca: normalizarTexto.normalizarEmailBusca(emailPlain),
        },
      });

      pessoasAtualizadas++;
    } catch (err) {
      console.error(`Erro ao atualizar pessoa ${pessoa.id}:`, err);
    }
  }

  console.log("Seed finalizada! Pessoas atualizadas:", pessoasAtualizadas);
}
