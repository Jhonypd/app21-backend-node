import { votosRepository } from "../../repositories/votos.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { AppError } from "../../lib/errorHandler";

interface VotoInserirData {
  historia_sessao_id: string;
  pessoa_id: string;
  valor: number;
  sessao_id?: string;
  participa_votacao?: boolean;
}

export const votosService = {
  async votar(voto: VotoInserirData) {
    // Ajuste conforme as regras do seu Planning Poker
    if (voto.valor < -1 || voto.valor > 89) {
      throw new AppError(
        "Valor do voto inválido. Deve estar entre -1 e 89.",
        400,
      );
    }

    // Verificar se sessão tem histórias vinculadas
    const historiaSessao = await historiaSessaoRepository.obterPorId(
      voto.historia_sessao_id,
    );

    if (!historiaSessao) {
      throw new AppError("História de sessão não encontrada.", 404);
    }

    // Se participa_votacao === false, não salvar voto
    if (voto.participa_votacao === false) {
      return {
        temporario: true,
        voto: {
          historia_sessao_id: voto.historia_sessao_id,
          pessoa_id: voto.pessoa_id,
          valor: voto.valor,
          data_voto: new Date(),
        },
        mensagem:
          "Voto não registrado - Dono/Admin não está participando da votação",
      };
    }

    // Atualizar flag participa_votacao no ParticipanteSessao se sessao_id foi fornecido
    if (voto.sessao_id) {
      try {
        await participanteSessaoRepository.atualizar(
          voto.sessao_id,
          voto.pessoa_id,
          { participa_votacao: true },
        );
      } catch (error) {
        // Se não conseguir atualizar, continua (participante pode não existir ainda)
        console.warn("Não foi possível atualizar participa_votacao:", error);
      }
    }

    // Buscar todas as histórias da sessão
    const historiasVinculadas = await historiaSessaoRepository.listarPorSessao(
      historiaSessao.sessao_id,
    );

    // Se não há histórias vinculadas, retorna voto temporário (não salva)
    if (!historiasVinculadas || historiasVinculadas.length === 0) {
      return {
        temporario: true,
        voto: {
          id: crypto.randomUUID(),
          historia_sessao_id: voto.historia_sessao_id,
          pessoa_id: voto.pessoa_id,
          valor: voto.valor,
          data_voto: new Date(),
        },
        mensagem: "Voto registrado (modo prática - não será salvo)",
      };
    }

    // ✅ TEM histórias → salva normalmente
    // Verificar se já existe voto para esta história-sessão e pessoa
    const votoExistente =
      await votosRepository.obterVotoPorHistoriaSessaoEPessoa(
        voto.historia_sessao_id,
        voto.pessoa_id,
      );

    if (votoExistente) {
      // Se já existe, atualiza o voto
      const votoAtualizado = await votosRepository.atualizar(
        voto.historia_sessao_id,
        voto.pessoa_id,
        {
          valor: voto.valor,
        },
      );
      return {
        temporario: false,
        voto: votoAtualizado,
      };
    }

    // Se não existe, cria novo voto
    const novoVoto = await votosRepository.inserir(voto);
    return {
      temporario: false,
      voto: novoVoto,
    };
  },

  async obterVotosPorHistoriaSessao(historia_sessao_id: string) {
    return await votosRepository.obterVotosPorHistoriaSessao(
      historia_sessao_id,
    );
  },

  async obterVotosPorSessao(sessao_id: string) {
    return await votosRepository.obterVotosPorSessao(sessao_id);
  },

  async obterVotoPorHistoriaSessaoEPessoa(
    historia_sessao_id: string,
    pessoa_id: string,
  ) {
    return await votosRepository.obterVotoPorHistoriaSessaoEPessoa(
      historia_sessao_id,
      pessoa_id,
    );
  },

  async resetarVotosPorHistoriaSessao(
    historia_sessao_id: string,
    historia_id: string,
  ) {
    return await votosRepository.deletarVotosPorHistoriaSessao(
      historia_sessao_id,
      historia_id,
    );
  },

  async resetarVotosPorSessao(sessao_id: string) {
    return await votosRepository.deletarVotosPorSessao(sessao_id);
  },

  async contarVotosPorHistoriaSessao(historia_sessao_id: string) {
    return await votosRepository.contarVotosPorHistoriaSessao(
      historia_sessao_id,
    );
  },

  async contarVotosPorSessao(sessao_id: string) {
    return await votosRepository.contarVotosPorSessao(sessao_id);
  },

  async obterHistoriaSessao(sessao_id: string, historia_id: string) {
    return await historiaSessaoRepository.obterPorSessaoEHistoria(
      sessao_id,
      historia_id,
    );
  },

  async anularVoto(voto_id: string, pessoa_id: string) {
    // Buscar o voto
    const voto = await votosRepository.obterPorId(voto_id);

    if (!voto) {
      throw new AppError("Voto não encontrado.", 404);
    }

    // Verificar se o voto pertence à pessoa autenticada
    if (voto.pessoa_id !== pessoa_id) {
      throw new AppError("Você não pode cancelar o voto de outra pessoa.", 403);
    }

    // Deletar o voto
    return await votosRepository.deletarVoto(voto_id);
  },
};
