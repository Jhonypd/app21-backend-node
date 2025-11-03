import { hash } from "../../lib/hash";
import { prismaClient as prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { salaRepository } from "../../repositories/sala.repository";
import { criptografia } from "../../lib/criptografia";

interface CriarSalaProps {
  pessoaId: string;
  titulo: string;
  senha?: string | null;
  salaPrivada: boolean;
}

export interface AlterarSalaProps {
  titulo?: string;
  senha?: string | null;
}

export const salaService = {
  async geradorCodigoUnico() {
    const ultimoCodigo = await prisma.sala.findFirst({
      select: { codigo: true },
      orderBy: { codigo: "desc" },
    });

    if (ultimoCodigo) {
      return ultimoCodigo.codigo + 1;
    }
    return 1;
  },

  async inserir({ titulo, senha, salaPrivada, pessoaId }: CriarSalaProps) {
    if (salaPrivada && !senha) {
      throw new Error("Senha é obrigatória para salas privadas.");
    }
    const codigo = await this.geradorCodigoUnico();

    let hashedSenha: string | null = null;

    if (senha) {
      hashedSenha = await hash.senha(senha);
    }

    const novaSala = await salaRepository.inserir({
      codigo,
      titulo,
      senha: hashedSenha,
      criado_por: pessoaId,
    });

    if (!novaSala) {
      throw new Error("Erro ao criar a sala.");
    }

    return novaSala;
  },

  async alterar(id: string, pessoaId: string, data: AlterarSalaProps) {
    if (!data.senha && !data.titulo) {
      throw new Error("Dados para alteração não fornecidos.");
    }

    const salaExistente = await salaRepository.obterPorId(id, pessoaId, true);

    if (!salaExistente) {
      throw new Error("Sala não encontrada.");
    }

    const dadosParaAtualizar: AlterarSalaProps = {};

    if (data.titulo) {
      dadosParaAtualizar.titulo = data.titulo;
    }
    if (data.senha && data.senha.length > 0) {
      dadosParaAtualizar.senha = await hash.senha(data.senha);
    }

    const salaAtualizada = await salaRepository.alterar(
      id,
      pessoaId,
      dadosParaAtualizar
    );

    return salaAtualizada;
  },

  async delete(id: string, pessoaId: string) {
    const salaExistente = await salaRepository.obterPorId(id, pessoaId, true);
    if (!salaExistente) {
      throw new Error("Sala não encontrada.");
    }

    const salaDeletada = await salaRepository.delete(id, pessoaId);
    if (!salaDeletada) {
      throw new Error("Erro ao deletar a sala.");
    }
    return salaDeletada.id;
  },

  async listar(pessoaId: string) {
    if (!pessoaId) {
      throw new Error("Id da pessoa é obrigatório");
    }

    const salas = await salaRepository.listarTodos(pessoaId);
    const salaFormatada = salas.map((sala) => {
      return {
        ...sala,
        votos: [
          ...sala.votos.map((voto) => {
            return {
              ...voto,
              pessoa: {
                ...voto.pessoa,
                nome: criptografia.descriptografar(voto.pessoa.nome),
              },
            };
          }),
        ],
        proprietario: {
          ...sala.proprietario,
          nome: criptografia.descriptografar(sala.proprietario.nome),
        },
      };
    });
    return salaFormatada;
  },

  async obterPorCodigo(codigo: string, pessoaId: string) {
    const sala = await salaRepository.obterPorCodigo(
      Number(codigo),
      pessoaId,
      true
    );

    if (!sala) {
      throw new Error("Sala não encontrada");
    }
    return sala;
  },

  async obterPorId(id: string, pessoaId: string) {
    const sala = await salaRepository.obterPorId(id, pessoaId, true);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }
    return sala;
  },
};
