import { NextFunction, Request, Response } from "express";
import { participanteSalaService } from "../../services/participantes/participante-sala.service";
import { respostaSucesso } from "../../utils/response";

export const participanteSalaController = {
  async ListarParticipantesSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.sala?.Sala_Id as string;
      const sessao_id = req.sala?.Sessao_Sala_Id as string | undefined;
      const apenasOnline = req.query.apenasOnline === "true";

      const resultado = await participanteSalaService.listarParticipantesDaSala(
        sala_id,
        sessao_id,
        apenasOnline,
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
