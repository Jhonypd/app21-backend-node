import { Request, Response } from "express";
import { historiaSalaService } from "../../services/historias/historia-sala.service";

class HistoriaSalaController {
  // POST /salas/:salaId/historias
  async criar(req: Request, res: Response) {
    try {
      const { salaId } = req.params;
      const { titulo, descricao } = req.body;
      const usuarioId = req.user!.Usu_Id;

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
      return res.status(400).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao criar história",
      });
    }
  }

  // POST /salas/:salaId/historias/lote
  async criarVarias(req: Request, res: Response) {
    try {
      const { salaId } = req.params;
      const { historias } = req.body;
      const usuarioId = req.user!.Usu_Id;

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
      return res.status(400).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao criar histórias",
      });
    }
  }

  // GET /salas/:salaId/historias
  async listar(req: Request, res: Response) {
    try {
      const { salaId } = req.params;

      const historias = await historiaSalaService.listarPorSala(salaId);

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "Histórias listadas com sucesso",
        Resultado: { historias },
      });
    } catch (error: any) {
      return res.status(400).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao listar histórias",
      });
    }
  }

  // GET /historias/:id
  async obterPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const historia = await historiaSalaService.obterPorId(id);

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "História obtida com sucesso",
        Resultado: { historia },
      });
    } catch (error: any) {
      return res.status(404).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao obter história",
      });
    }
  }

  // PUT /historias/:id
  async atualizar(req: Request, res: Response) {
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
      return res.status(400).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao atualizar história",
      });
    }
  }

  // DELETE /historias/:id
  async deletar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await historiaSalaService.deletar(id);

      return res.status(200).json({
        Sucesso: true,
        Mensagem: "História deletada com sucesso",
      });
    } catch (error: any) {
      return res.status(400).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao deletar história",
      });
    }
  }

  // POST /salas/:salaId/historias/durante-sessao
  async adicionarDuranteSessao(req: Request, res: Response) {
    try {
      const { salaId } = req.params;
      const { titulo, descricao } = req.body;
      const usuarioId = req.user!.Usu_Id;

      const historia = await historiaSalaService.adicionarDuranteSessao({
        sala_id: salaId,
        titulo,
        descricao,
        criado_por: usuarioId,
      });

      return res.status(201).json({
        Sucesso: true,
        Mensagem: "História adicionada e vinculada à sessão",
        Resultado: { historia },
      });
    } catch (error: any) {
      return res.status(400).json({
        Sucesso: false,
        Mensagem: error.message || "Erro ao adicionar história durante sessão",
      });
    }
  }
}

export const historiaSalaController = new HistoriaSalaController();
