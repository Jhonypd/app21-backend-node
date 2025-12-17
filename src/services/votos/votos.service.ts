import { votosRepository } from "../../repositories/votos.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";

interface VotoInserirData {
  historia_sessao_id: string;
  pessoa_id: string;
  valor: number;
}

export const votosService = {
  async votar(voto: VotoInserirData) {
    // Validação do valor do voto (exemplo: Planning Poker usa valores específicos)
    // Ajuste conforme as regras do seu Planning Poker
    if (voto.valor < -1 || voto.valor > 89) {
      throw new Error("Valor do voto inválido. Deve estar entre -1 e 89.");
    }

    // ✅ NOVA LÓGICA: Verificar se sessão tem histórias vinculadas
    const historiaSessao = await historiaSessaoRepository.obterPorId(
      voto.historia_sessao_id
    );

    if (!historiaSessao) {
      throw new Error("História de sessão não encontrada.");
    }

    // Buscar todas as histórias da sessão
    const historiasVinculadas = await historiaSessaoRepository.obterPorSessao(
      historiaSessao.sessao_id
    );

    // Se não há histórias vinculadas, retorna voto temporário (não salva)
    if (!historiasVinculadas || historiasVinculadas.length === 0) {
      return {
        temporario: true,
        voto: {
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
        voto.pessoa_id
      );

    if (votoExistente) {
      // Se já existe, atualiza o voto
      const votoAtualizado = await votosRepository.atualizar(
        voto.historia_sessao_id,
        voto.pessoa_id,
        {
          valor: voto.valor,
        }
      );
      return {
        temporario: false,
        voto: votoAtualizado,
        mensagem: "Voto atualizado com sucesso",
      };
    }

    // Se não existe, cria novo voto
    const novoVoto = await votosRepository.inserir(voto);
    return {
      temporario: false,
      voto: novoVoto,
      mensagem: "Voto registrado com sucesso",
    };
  },

  async obterVotosPorHistoriaSessao(historia_sessao_id: string) {
    return await votosRepository.obterVotosPorHistoriaSessao(
      historia_sessao_id
    );
  },

  async obterVotosPorSessao(sessao_id: string) {
    return await votosRepository.obterVotosPorSessao(sessao_id);
  },

  async obterVotoPorHistoriaSessaoEPessoa(
    historia_sessao_id: string,
    pessoa_id: string
  ) {
    return await votosRepository.obterVotoPorHistoriaSessaoEPessoa(
      historia_sessao_id,
      pessoa_id
    );
  },

  async resetarVotosPorHistoriaSessao(historia_sessao_id: string) {
    return await votosRepository.deletarVotosPorHistoriaSessao(
      historia_sessao_id
    );
  },

  async resetarVotosPorSessao(sessao_id: string) {
    return await votosRepository.deletarVotosPorSessao(sessao_id);
  },

  async contarVotosPorHistoriaSessao(historia_sessao_id: string) {
    return await votosRepository.contarVotosPorHistoriaSessao(
      historia_sessao_id
    );
  },

  async contarVotosPorSessao(sessao_id: string) {
    return await votosRepository.contarVotosPorSessao(sessao_id);
  },
};
