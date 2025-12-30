import { historiaSalaRepository } from "../../repositories/historia-sala.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { salaRepository } from "../../repositories/sala.repository";
import type {
  CriarHistoriaSalaDTO,
  AtualizarHistoriaSalaDTO,
} from "../../repositories/historia-sala.repository";

class HistoriaSalaService {
  async criar(dados: CriarHistoriaSalaDTO) {
    return await historiaSalaRepository.criar(dados);
  }

  async obterPorId(id: string) {
    const historia = await historiaSalaRepository.obterPorId(id);
    if (!historia) {
      throw new Error("História não encontrada");
    }
    return historia;
  }

  async listarPorSala(sala_id: string) {
    return await historiaSalaRepository.listarPorSala(sala_id);
  }

  async atualizar(id: string, dados: AtualizarHistoriaSalaDTO) {
    await this.obterPorId(id); // Verifica se existe
    return await historiaSalaRepository.atualizar(id, dados);
  }

  async deletar(id: string) {
    await this.obterPorId(id); // Verifica se existe
    return await historiaSalaRepository.deletar(id);
  }

  async criarVarias(historias: CriarHistoriaSalaDTO[]) {
    return await historiaSalaRepository.criarVarias(historias);
  }

  /**
   * Adiciona história durante sessão ativa
   * Vincula automaticamente à sessão ativa da sala
   */
  async adicionarDuranteSessao(dados: {
    sala_id: string;
    titulo: string;
    descricao?: string | null;
    criado_por: string;
  }) {
    // Verificar se sala existe e tem sessão ativa
    const sala = await salaRepository.obterPorId(dados.sala_id, false);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    console.log(sala.sessoes[0]);
    if (sala.sessoes.length === 0) {
      throw new Error("Sala não possui sessão ativa");
    }

    // Criar história
    const historia = await historiaSalaRepository.criar(dados);

    // Vincular à sessão ativa
    await historiaSessaoRepository.inserir({
      sessao_id: sala.sessoes[0].id,
      historia_id: historia.id,
    });

    return historia;
  }
}

export const historiaSalaService = new HistoriaSalaService();
