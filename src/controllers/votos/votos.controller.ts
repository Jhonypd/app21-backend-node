import { NextFunction, Request, Response } from "express";
import { votosService } from "../../services/votos/votos.service";
import { respostaSucesso } from "../../utils/response";

export const votosController = {
  /**
   * Registrar um voto para uma história em uma sessão,
   * ou atualiza o voto com o novo valor se já existir.
   *
   * Endpoint:
   *   POST /votos/votar
   *
   * Body:
   *   {
   *     historia_sessao_id: string
   *     valor: number
   *     participa_votacao: boolean
   *   }
   */
  async votarOuAtualizar(req: Request, res: Response, next: NextFunction) {
    try {
      // const sessao_id = req.params.id;
      const { historia_id, valor, participa_votacao } = req.body;
      const pessoa_id = req.user?.Usuario_Id as string;
      const sessao_id = req.sala?.Sessao_Sala_Id as string;

      // Registrar o voto
      const voto = await votosService.votarOuAtualizar({
        historia_id,
        pessoa_id,
        valor,
        sessao_id,
        participa_votacao,
      });

      return res.status(201).json(
        respostaSucesso({
          resultado: {
            voto: voto.voto.id,
            temporario: voto.temporario,
          },
          mensagem: "Voto registrado com sucesso.",
        }),
      );
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Obter votos de uma história específica em uma sessão
   *
   *  Endpoint:
   * GET /votos/obterVotosPorHistoriaSessaoSessaoSala
   */
  async obterVotosPorHistoriaSessaoSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.get("sessao_sala_id") as string;
      const historia_id = req.get("historia_id") as string;

      const votos = await votosService.obterVotosPorHistoriaSessaoSessaoSala(
        sessao_id,
        historia_id,
      );

      res.json(
        respostaSucesso({
          resultado: votos,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Resetar votos de uma história-sessão (ex: para reiniciar votação de uma história)
   *
   * Endpoint:
   *
   */
  async resetarVotosPorHistoriaSessao(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_sala_id = req.sala?.Sessao_Sala_Id as string;
      const sala_id = req.sala?.Sala_Id as string;
      const pessoa_id = req.user?.Usuario_Id as string;
      const historia_id = req.get("historia_id") as string;

      const votosResetados = await votosService.resetarVotosPorHistoriaSessao(
        sessao_sala_id,
        historia_id,
        pessoa_id,
        sala_id,
      );

      res.json(
        respostaSucesso({
          mensagem: "Votos resetados com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Excluir um voto (anular voto)
   * Somente permitido para administradores e moderadores
   *
   * Endpoint:
   * DELETE /votos/deletarVotoPessoa?id={id}
   *
   */
  async deletarVotoPessoa(req: Request, res: Response, next: NextFunction) {
    try {
      const voto_id = req.query.id as string;
      const pessoa_id = req.get("pessoa_id") as string;
      const sala_id = req.sala?.Sala_Id as string;
      const id_admin_sala = req.user?.Usuario_Id as string;
      const sessao_sala_id = req.sala?.Sessao_Sala_Id as string;

      const voto = await votosService.deletarVotoPessoa(
        voto_id,
        pessoa_id,
        id_admin_sala,
        sala_id,
        sessao_sala_id,
      );

      return res.json(
        respostaSucesso({
          resultado: { id: voto.id },
          mensagem: "Voto cancelado com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },
};
