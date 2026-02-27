import { NextFunction, Request, Response } from "express";
import { participanteSalaService } from "../../services/participantes/participante-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const participanteSalaController = {
  async listarParticipantes(req: Request, res: Response, next: NextFunction) {
    try {
      const sala_id = req.params.id;
      const sessao_id = req.headers["sessao_id"] as string | undefined;

      const resultado = await participanteSalaService.listarParticipantesDaSala(
        sala_id,
        sessao_id,
      );

      res.json(
        respostaSucesso({
          resultado,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },
};
