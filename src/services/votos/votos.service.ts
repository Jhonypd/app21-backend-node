import { votosRepository } from "../../repositories/votos.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { AppError } from "../../lib/errorHandler";
import { obterVotosVencedoresHistoria } from "../../utils/voto-vencedor-historia";
import { criptografia } from "../../lib/criptografia";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";

interface VotoInserirData {
  historia_id: string;
  pessoa_id: string;
  valor: number;
  sessao_id?: string;
  participa_votacao?: boolean;
}

export const votosService = {
  /**
   * Registrar ou atualizar um voto para uma história-sessão
   * POST /sessoes/:sessaoId/historias/:historiaId/votar
   * Body: { valor, participa_votacao }
   * - Se participa_votacao === false, o voto não é salvo (temporário) e o participante não é incluído na votação
   * - Se participa_votacao === true ou não fornecido, o voto é salvo normalmente e o participante é incluído na votação
   */
  async votarOuAtualizar(voto: VotoInserirData) {
    const historiaSessao =
      await historiaSessaoRepository.obterPorIdOuSessaoEHistoria({
        sessao_id: voto.sessao_id as string,
        historia_id: voto.historia_id,
      });

    if (!historiaSessao) {
      throw new AppError(
        "História não encontrada na sessão. As histórias devem ser adicionadas ao criar a sessão.",
        404,
      );
    }

    // Ajuste conforme as regras do seu Planning Poker
    if (voto.valor < -1 || voto.valor > 89) {
      throw new AppError(
        "Valor do voto inválido. Deve estar entre -1 e 89.",
        400,
      );
    }

    // Se participa_votacao === false, não salvar voto
    if (voto.participa_votacao === false) {
      return {
        temporario: true,
        voto: {
          historia_id: voto.historia_id,
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
        console.warn(
          "Não foi possível incluir o usuário na votação atual:",
          error,
        );
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
          historia_id: voto.historia_id,
          pessoa_id: voto.pessoa_id,
          valor: voto.valor,
          data_voto: new Date(),
        },
        mensagem: "Voto registrado registrado",
      };
    }

    const historiaSessaoId = historiaSessao.id;

    // TEM histórias → salva normalmente
    // Verificar se já existe voto para esta história-sessão e pessoa
    const votoExistente =
      await votosRepository.obterVotoPorHistoriaSessaoEPessoa(
        historiaSessaoId,
        voto.pessoa_id,
      );

    if (votoExistente) {
      // Se já existe, atualiza o voto
      const votoAtualizado = await votosRepository.atualizarVoto(
        historiaSessaoId,
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
    const novoVoto = await votosRepository.inserirVoto({
      historia_sessao_id: historiaSessaoId,
      pessoa_id: voto.pessoa_id,
      valor: voto.valor,
    });
    return {
      temporario: false,
      voto: novoVoto,
    };
  },

  /**
   * Obter votos de uma história específica em uma sessão
   *
   * GET /votos/obterVotosPorHistoriaSessaoSessaoSala
   *
   * @param historia_sessao_id ID da história-sessão para obter os votos
   */
  async obterVotosPorHistoriaSessaoSessaoSala(
    sessao_id: string,
    historia_id: string,
  ) {
    // Buscar HistoriaSessao para obter os votos
    const historiaSessao =
      await historiaSessaoRepository.obterPorIdOuSessaoEHistoria({
        sessao_id,
        historia_id,
      });

    if (!historiaSessao) {
      // Se não existe HistoriaSessao, retornar array vazio (história ainda não tem votos)
      return { media: 0, voto_vencedor: 0, votos: [] };
    }

    // Buscar votos da HistoriaSessao
    const votos = await votosRepository.obterVotosPorHistoriaSessao(
      historiaSessao.id,
    );

    const contagemVotos = votos.reduce(
      (acc, voto) => {
        acc[voto.valor] = (acc[voto.valor] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const calculaVotoVencedorHistoria =
      obterVotosVencedoresHistoria(contagemVotos);

    const votosValidos = votos
      .map((v) => Number(v.valor))
      .filter(Number.isFinite);
    const media = votosValidos.length
      ? Number(
          (
            votosValidos.reduce((a, b) => a + b, 0) / votosValidos.length
          ).toFixed(1),
        )
      : null;

    // Formatar votos com dados descriptografados
    return {
      media: media,
      voto_vencedor: calculaVotoVencedorHistoria[0],
      votos: votos.map((voto) => ({
        id: voto.id,
        pessoa_id: voto.pessoa_id,
        valor: voto.valor,
        pessoa: {
          nome: criptografia.descriptografar(voto.pessoa.nome),
          inativo: voto.pessoa.inativo,
        },
      })),
    };
  },

  async obterVotoPorHistoriaSessaoEPessoa(
    historia_sessao_id: string,
    pessoa_id: string,
  ) {
    if (!historia_sessao_id || !pessoa_id) {
      throw new AppError(
        "Parâmetros historia_sessao_id e pessoa_id são obrigatórios para obter o voto.",
        400,
      );
    }

    return await votosRepository.obterVotoPorHistoriaSessaoEPessoa(
      historia_sessao_id,
      pessoa_id,
    );
  },

  async resetarVotosPorHistoriaSessao(
    sessao_sala_id: string,
    historia_id: string,
    pessoa_id: string,
    sala_id: string,
  ) {
    if (!sessao_sala_id || !historia_id) {
      throw new AppError(
        "Parâmetros historia e sessao são obrigatórios para resetar votos.",
        400,
      );
    }

    const permissaoPessoa =
      await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);

    const pessoaNaSala = permissaoPessoa.find((p) => p.pessoa.id === pessoa_id);

    if (!pessoaNaSala) {
      throw new AppError("Pessoa não encontrada na sala.", 404);
    }

    if (pessoaNaSala.role > 1) {
      throw new AppError(
        "Apenas o dono ou administradores da sala podem resetar os votos.",
        403,
      );
    }

    const historiaSessao =
      await historiaSessaoRepository.obterPorIdOuSessaoEHistoria({
        sessao_id: sessao_sala_id,
        historia_id,
      });

    if (!historiaSessao) {
      throw new AppError("História não encontrada na sessão.", 404);
    }

    return await votosRepository.deletarVotosPorHistoriaSessao(
      historiaSessao?.id,
      historia_id,
    );
  },

  // async resetarVotosPorSessao(sessao_id: string) {
  //   return await votosRepository.deletarVotosPorSessao(sessao_id);
  // },

  // async contarVotosPorHistoriaSessao(historia_sessao_id: string) {
  //   return await votosRepository.contarVotosPorHistoriaSessao(
  //     historia_sessao_id,
  //   );
  // },

  // async contarVotosPorSessao(sessao_id: string) {
  //   return await votosRepository.contarVotosPorSessao(sessao_id);
  // },

  async deletarVotoPessoa(
    voto_id: string,
    pessoa_id: string,
    id_admin_sala: string,
    sala_id: string,
    sessao_sala_id?: string,
  ) {
    const permissaoPessoa =
      await participanteSalaRepository.obterTodosParticipantesPorSala(
        sala_id,
        sessao_sala_id,
      );

    const pessoaNaSala = permissaoPessoa.find(
      (p) => p.pessoa.id === id_admin_sala,
    );

    if (!pessoaNaSala) {
      throw new AppError("Você não possui permissão para atua nessa sala", 404);
    }

    if (pessoaNaSala.role > 1) {
      throw new AppError(
        "Apenas o dono ou administradores da sala podem excluir os votos de outros participantes.",
        403,
      );
    }

    // Buscar o voto
    const voto = await votosRepository.obterVotoPorId(voto_id);

    if (!voto) {
      throw new AppError("Voto não encontrado.", 404);
    }

    // // Verificar se o voto pertence à pessoa autenticada
    // if (voto.pessoa_id !== pessoa_id) {
    //   throw new AppError("Você não pode cancelar o voto de outra pessoa.", 403);
    // }

    // Deletar o voto
    return await votosRepository.deletarVotoIndividual(voto_id);
  },
};
