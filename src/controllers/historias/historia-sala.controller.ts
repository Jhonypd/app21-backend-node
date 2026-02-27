import { NextFunction, Request, Response } from "express";
import { historiaSalaService } from "../../services/historias/historia-sala.service";

class HistoriaSalaController {
  // POST /salas/:salaId/historias
  async criar(req: Request, res: Response, next: NextFunction) {
    try {
      const { salaId } = req.params;
      const { titulo, descricao } = req.body;
      const usuarioId = req.user!.Usuario_Id;

      const historia = await historiaSalaService.criar({
        sala_id: salaId,
        titulo,
        descricao,
        criado_por: usuarioId,
      });

      return res.status(201).json({
        Sucesso: true,
        Mensagem: "História criada com sucesso",
        Resultado: { historia },
      });
    } catch (error: any) {
      return next(error);
    }
  }

  // POST /salas/:salaId/historias/lote
  async criarVarias(req: Request, res: Response, next: NextFunction) {
    try {
      const { salaId } = req.params;
      const { historias } = req.body;
      const usuarioId = req.user!.Usuario_Id;

      const historiasComSala = historias.map((h: any) => ({
        sala_id: salaId,
        titulo: h.titulo,
        descricao: h.descricao,
        criado_por: usuarioId,
      }));

      await historiaSalaService.criarVarias(historiasComSala);

      return res.status(201).json({
        Sucesso: true,
        Mensagem: "Histórias criadas com sucesso",
        Resultado: { total: historias.length },
      });
    } catch (error: any) {
      return next(error);
    }
  }

  // GET /salas/:salaId/historias
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { salaId } = req.params;

      const historias = await historiaSalaService.listarPorSala(salaId);

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "Histórias listadas com sucesso",
        Resultado: { historias },
      });
    } catch (error: any) {
      return next(error);
    }
  }

  // GET /historias/:id
  async obterPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const historia = await historiaSalaService.obterPorId(id);

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "História obtida com sucesso",
        Resultado: { historia },
      });
    } catch (error: any) {
      return next(error);
    }
  }

  // PUT /historias/:id
  async atualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { titulo, descricao } = req.body;

      const historia = await historiaSalaService.atualizar(id, {
        titulo,
        descricao,
      });

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "História atualizada com sucesso",
        Resultado: { historia },
      });
    } catch (error: any) {
      return next(error);
    }
  }

  // DELETE /historias/:id
  async deletar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await historiaSalaService.deletar(id);

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "História deletada com sucesso",
      });
    } catch (error: any) {
      return next(error);
    }
  }
}

export const historiaSalaController = new HistoriaSalaController();
