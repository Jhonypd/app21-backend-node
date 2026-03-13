import { historiaSalaRepository } from "../../repositories/historia-sala.repository";
import { AppError } from "../../lib/errorHandler";
import type {
  CriarHistoriaSalaDTO,
  AtualizarHistoriaSalaDTO,
} from "../../repositories/historia-sala.repository";
import { sessaoSalaService } from "../sessoes/sessao-sala.service";
import { prismaClient } from "../../lib/prisma";
import { sessaoSalaRepository } from "../../repositories/sessao-sala.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { obterVotosVencedoresHistoria } from "../../utils/voto-vencedor-historia";

class HistoriaSalaService {
  private formatarHistoriaSessao(
    hs: Awaited<
      ReturnType<typeof historiaSessaoRepository.listarPorSessao>
    >[number],
    historiaAtualId: string | null,
  ) {
    return {
      id: hs.historia.id,
      titulo: hs.historia.titulo,
      descricao: hs.historia.descricao,
      jaFoiVotada: hs.votos.length > 0,
      historiaAtual: hs.historia.id === historiaAtualId,
      ordem: hs.ordem,
      voto: obterVotosVencedoresHistoria(
        hs.votos.reduce(
          (acc, voto) => {
            acc[voto.valor] = (acc[voto.valor] || 0) + 1;
            return acc;
          },
          {} as Record<number, number>,
        ),
      ),
    };
  }

  /**
   * Lista todas as histórias vinculadas a uma sessão
   * Retorna formatado com jaFoiVotada, historiaAtual e voto (vencedores)
   */
  async listarHistoriasPorSessaoSala(
    sessao_id: string,
    role?: 0 | 1 | 2 | 3,
  ) {
    if (!sessao_id) {
      throw new AppError("Id da sessão é obrigatório");
    }

    // Buscar sessão para obter sala_id e historia_atual_id
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);

    if (!sessao) {
      throw new AppError("Sessão não encontrada");
    }

    const historiaAtualId = sessao.sala.historia_atual_id;

    // Buscar histórias da sessão com votos
    const historiasSessao =
      await historiaSessaoRepository.listarPorSessao(sessao_id);

    const historiasFormatadas = historiasSessao.map((hs) =>
      this.formatarHistoriaSessao(hs, historiaAtualId),
    );

    if (role !== undefined && role !== 0 && role !== 1) {
      return historiasFormatadas.filter((historia) => historia.historiaAtual);
    }

    return historiasFormatadas;
  }

  /**
   * Adiciona história(s) durante sessão ativa
   *
   * POST /historias/durante-sessao
   *
   * Permite adicionar novas histórias ou remover histórias existentes da sessão ativa
   */
  async adicionarHistoriaSessaoSala(dados: {
    sessao_id: string;
    pessoa_id: string;
    adicionar?: Array<{
      titulo: string;
      descricao?: string | null;
      ordem?: number;
    }>;
    remover?: string[];
  }) {
    // Verificar se sala existe
    const sessao = await sessaoSalaService.obterSessaoPorId(
      dados.sessao_id,
      dados.pessoa_id,
    );

    if (!sessao) {
      throw new AppError("Sessão não encontrada");
    }

    if (!sessao || !sessao.ativa) {
      throw new AppError("Sessão não encontrada ou inativa");
    }

    // Formato em lote
    const resultado = {
      adicionadas: 0,
      removidas: 0,
      historias: [] as Array<{
        titulo: string;
        descricao?: string | null;
        ordem?: number;
      }>,
    };

    await prismaClient.$transaction(async (tx) => {
      // 1. Remover histórias
      if (dados.remover && dados.remover.length > 0) {
        const removidas = await tx.historiaSessao.deleteMany({
          where: {
            sessao_id: sessao.id,
            historia_id: { in: dados.remover },
          },
        });
        await tx.historiaSala.deleteMany({
          where: {
            id: { in: dados.remover },
            sala_id: sessao.sala_id,
          },
        });

        resultado.removidas = removidas.count;
      }

      // 2. Adicionar novas histórias
      if (dados.adicionar && dados.adicionar.length > 0) {
        let maxOrdem;
        let proximaOrdem = 1;
        for (const historiaInput of dados.adicionar) {
          if (historiaInput.ordem !== undefined && historiaInput.ordem > 0) {
            proximaOrdem = historiaInput.ordem;
          } else {
            maxOrdem = await tx.historiaSessao.findFirst({
              where: { sessao_id: sessao.id },
              orderBy: { ordem: "desc" },
              select: { ordem: true },
            });
            proximaOrdem = (maxOrdem?.ordem ?? 0) + 1;
          }

          const historia = await tx.historiaSala.create({
            data: {
              sala_id: sessao.sala_id,
              titulo: historiaInput.titulo,
              descricao: historiaInput.descricao ?? null,
              criado_por: dados.pessoa_id,
            },
          });

          await tx.historiaSessao.create({
            data: {
              sessao_id: sessao.id,
              historia_id: historia.id,
              ordem: proximaOrdem,
            },
          });

          resultado.historias.push(historia);
          proximaOrdem += 1;
        }

        resultado.adicionadas = dados.adicionar.length;
      }
    });

    return resultado;
  }
}

export const historiaSalaService = new HistoriaSalaService();
