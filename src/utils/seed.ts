import { criptografia } from "../lib/criptografia";
import { hash } from "../lib/hash";
import { prismaClient } from "../lib/prisma";
import { normalizarTexto } from "./normalize-texto";

export async function main() {
  console.log("Iniciando seed...");

  const pessoasAdicionar = [
    { nome: "Adriana Montes", email: "adriana.montes@example.com" },
    { nome: "Bruno Cassiano", email: "bruno.cassiano@example.com" },
    { nome: "Carlos Eduardo", email: "carlos.eduardo@example.com" },
    { nome: "Daniela Faria", email: "daniela.faria@example.com" },
    { nome: "Elaine Rocha", email: "elaine.rocha@example.com" },
    { nome: "Felipe Guedes", email: "felipe.guedes@example.com" },
    { nome: "Gustavo Henrique", email: "gustavo.henrique@example.com" },
    { nome: "Heloísa Paiva", email: "heloisa.paiva@example.com" },
    { nome: "Ítalo Mendes", email: "italo.mendes@example.com" },
    { nome: "Jéssica Torres", email: "jessica.torres@example.com" },
    { nome: "Kátia Rebouças", email: "katia.rebouças@example.com" },
    { nome: "Lucas Nogueira", email: "lucas.nogueira@example.com" },
    { nome: "Mariana Lins", email: "mariana.lins@example.com" },
    { nome: "Otávio Salgado", email: "otavio.salgado@example.com" },
    { nome: "Patrícia Viana", email: "patricia.viana@example.com" },
  ];

  if (pessoasAdicionar.length === 0) {
    console.log("Nenhuma pessoa encontrada para adicionar.");
    return;
  }

  let pessoasAdicionadas = 0;

  for (const pessoa of pessoasAdicionar) {
    try {
      const nomeCriptografado = criptografia.criptografar(pessoa.nome);
      const emailCriptografado = criptografia.criptografar(pessoa.email);

      await prismaClient.pessoa.create({
        data: {
          nome: nomeCriptografado,
          email: emailCriptografado,
          nome_busca: normalizarTexto.normalizarNomeBusca(pessoa.nome),
          email_busca: normalizarTexto.normalizarEmailBusca(pessoa.email),
          email_hash: await hash.geradorCamposComuns(pessoa.email),
          senha: await hash.senha("123456"),
          email_confirmado: true,
        },
      });

      pessoasAdicionadas++;
    } catch (err) {
      console.error(`Erro ao adicionar pessoa ${pessoa.nome}:`, err);
    }
  }

  console.log(`Seed finalizada! Pessoas adicionadas: ${pessoasAdicionadas}`);
}
