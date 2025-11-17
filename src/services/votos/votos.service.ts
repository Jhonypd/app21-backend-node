interface VotoInserirData {
  idHistoria: string;
  idPessoa: string;
  valorVoto: number;
  idSala: string;
}

export const VotosService = {
  async votar(voto: VotoInserirData) {
    if (voto.valorVoto < -1 || voto.valorVoto > 89) {
      throw new Error("Valor do voto inválido.");
    }
  },
};
