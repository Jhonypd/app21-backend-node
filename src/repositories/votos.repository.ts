import { prismaClient } from "../lib/prisma";
interface VotoInserirData {
  idHistoria: string;
  idPessoa: string;
  valorVoto: number;
  idSala: string;
}
export const votosRepository = {
  inserir: (voto: VotoInserirData) =>
    prismaClient.voto.create({
      data: {
        sala_id: voto.idSala,
        historia_id: voto.idHistoria,
        pessoa_id: voto.idPessoa,
        valor: voto.valorVoto,
      },
    }),

  obterVotoPorHistoriaEPessoa: (idHistoria: string, idPessoa: string) =>
    prismaClient.voto.findFirst({
      where: {
        historia_id: idHistoria,
        pessoa_id: idPessoa,
      },
    }),
};
