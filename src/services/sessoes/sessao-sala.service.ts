import { sessaoSalaRepository } from "../../repositories/sessao-sala.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { salaRepository } from "../../repositories/sala.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { votosRepository } from "../../repositories/votos.repository";

export const sessaoSalaService = {
  async criarSessao(sala_id: string, pessoa_id: string) {
    // Verificar se a sala existe e se o usuário tem permissão
    const sala = await salaRepository.obterPorId(sala_id, false, pessoa_id);
    if (!sala) {
      throw new Error("Sala não encontrada ou sem permissão.");
    }

    // Desativar sessões ativas anteriores da sala
    await sessaoSalaRepository.desativarSessoesPorSala(sala_id);

    // Criar nova sessão
    const novaSessao = await sessaoSalaRepository.inserir({ sala_id });

    // Adicionar o criador da sala como participante autorizado
    await participanteSessaoRepository.inserir({
      sessao_id: novaSessao.id,
      pessoa_id: sala.criado_por,
      autorizado: true,
    });

    return novaSessao;
  },

  async encerrarSessao(sala_id: string, sessao_id: string, pessoa_id: string) {
    const sessaoAtiva = await sessaoSalaRepository.obterSessaoAtivaPorSala(
      sala_id
    );

    if (!sessaoAtiva) {
      throw new Error("Nenhuma sessão ativa encontrada para esta sala.");
    }

    if (sessaoAtiva.sala.criado_por !== pessoa_id) {
      throw new Error("Apenas o criador da sala pode encerrar a sessão.");
    }

    const sessaoEncerrada = await sessaoSalaRepository.desativarSessoesPorSala(
      sessao_id
    );

    return sessaoEncerrada.id;
  },

  async obterSessaoPorId(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Verificar se o usuário tem acesso à sala
    const sala = await salaRepository.obterPorId(
      sessao.sala.id,
      false,
      pessoa_id
    );

    if (!sala) {
      throw new Error("Sem permissão para acessar esta sessão.");
    }

    return sessao;
  },

  async obterSessaoAtivaPorSala(sala_id: string, pessoa_id?: string) {
    // Verificar se a sala existe e se o usuário tem permissão
    const sala = await salaRepository.obterPorId(sala_id, false, pessoa_id);

    if (!sala) {
      throw new Error("Sala não encontrada ou sem permissão.");
    }

    const sessao = await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
    return sessao;
  },

  async adicionarParticipante(
    sessao_id: string,
    pessoa_id: string,
    autorizado: boolean = false
  ) {
    // Verificar se a sessão existe
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    if (!sessao.ativa) {
      throw new Error("Sessão não está ativa.");
    }

    // Verificar se a pessoa já é participante
    const participanteExistente =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessao_id,
        pessoa_id
      );

    if (participanteExistente) {
      // Se já existe, apenas atualiza a autorização se necessário
      if (participanteExistente.autorizado !== autorizado) {
        return await participanteSessaoRepository.atualizarAutorizacao(
          sessao_id,
          pessoa_id,
          autorizado
        );
      }
      return participanteExistente;
    }

    // Adicionar novo participante
    return await participanteSessaoRepository.inserir({
      sessao_id,
      pessoa_id,
      autorizado,
    });
  },

  async revelarVotos(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Verificar se o usuário é o criador da sala
    if (sessao.sala.criado_por !== pessoa_id) {
      throw new Error("Apenas o criador da sala pode revelar os votos.");
    }

    // Atualizar flag de votos revelados na sala
    await sessaoSalaRepository.atualizarVotosRevelados(sessao.sala.id, true);

    return sessao;
  },

  async resetarVotos(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Verificar se o usuário é o criador da sala
    if (sessao.sala.criado_por !== pessoa_id) {
      throw new Error("Apenas o criador da sala pode resetar os votos.");
    }

    // Deletar todos os votos das histórias da sessão
    for (const historiaSessao of sessao.historias) {
      await votosRepository.deletarVotosPorHistoriaSessao(historiaSessao.id);
    }

    // Atualizar flag de votos revelados
    await sessaoSalaRepository.atualizarVotosRevelados(sessao.sala.id, false);

    // Buscar sessão atualizada
    return await sessaoSalaRepository.obterPorId(sessao_id);
  },
};
