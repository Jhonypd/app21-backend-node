import { NextFunction, Request, Response } from "express";

import { respostaSucesso } from "../../utils/response";
import { historiaSalaService } from "../../services/historias/historia-sala.service";

class HistoriaSalaController {
  /**
   * Adicionar história(s) durante sessão ativa
   * POST /sessoes/:sessaoId/historias/durante-sessao
   * Body: { titulo, descricao } OU { adicionar: [...], remover: [...] }
   */
  async adicionarOuRemoverHistoriaSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessaoId = req.sala?.Sessao_Sala_Id as string;
      const { adicionar, remover } = req.body;
      const usuarioId = req.user?.Usuario_Id as string;

      const resultado = await historiaSalaService.adicionarHistoriaSessaoSala({
        sessao_id: sessaoId,
        pessoa_id: usuarioId,
        adicionar,
        remover,
      });

      res.status(200).json(
        respostaSucesso({
          resultado,
          mensagem: `${resultado.adicionadas} histórias adicionadas, ${resultado.removidas} removidas.`,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  }

  /**
   * Listar todas as histórias de uma sessão
   * GET /historias/listarHistoriasPorSessaoSala?sessaoId=00000000-0000-0000-0000-000000000000
   * Retorna as histórias formatadas com jaFoiVotada, historiaAtual e voto (vencedores)
   */
  async listarHistoriasPorSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.query.sessaoId as string;

      const historias =
        await historiaSalaService.listarHistoriasPorSessaoSala(sessao_id);

      res.json(
        respostaSucesso({
          resultado: { historias },
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  }
}

export const historiaSalaController = new HistoriaSalaController();
