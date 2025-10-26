import { hash } from "./hash";
import { prismaClient } from "./prisma";

export const codigos = {
  async confirmarConta() {
    let contadorVerificacoes = 0;
    let codigo: string | null = null;

    while (contadorVerificacoes < 3) {
      const codigoGerado = crypto.randomUUID();

      const codigoHashGerado = await hash.geradorCamposComuns(codigoGerado);

      const condigoExiste = await prismaClient.pessoa.findFirst({
        where: { codigo_confirmacao_hash: codigoHashGerado },
      });

      if (condigoExiste) {
        contadorVerificacoes++;
      }

      codigo = codigoGerado;
      break;
    }

    return codigo;
  },
};
