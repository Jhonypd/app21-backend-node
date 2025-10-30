import { Request, Response } from "express";
import { inserir, listar } from "../../services/salas/sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const salaController = {
  async criarSalas(req: Request, res: Response) {
    try {
      const { titulo, senha, salaPrivada } = req.body;
      const proprietarioId = req.user?.Usu_Id;

      const sala = await inserir({
        titulo,
        senha,
        salaPrivada,
        proprietarioId: proprietarioId as string,
      });

      res.status(201).json(
        respostaSucesso({
          resultado: { id: sala.id },
          mensagem: "Sala criada com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
  async listarSalas(req: Request, res: Response) {
    try {
      const proprietarioId = req.user?.Usu_Id;
      const salas = await listar(proprietarioId as string);
      console.log(salas);
      res.json(respostaSucesso({ resultado: { salas: salas } }));
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
