import { historiaSalaRepository } from "../../repositories/historia-sala.repository";
import { AppError } from "../../lib/errorHandler";
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
      throw new AppError("História não encontrada", 404);
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
}

export const historiaSalaService = new HistoriaSalaService();
