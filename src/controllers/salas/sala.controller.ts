import { Request, Response } from "express";
import { salaService } from "../../services/salas/sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const salaController = {
  async criarSalas(req: Request, res: Response) {
    try {
      const { titulo, senha, salaPrivada } = req.body;
      const pessoaId = req.user?.Usu_Id as string;

      const sala = await salaService.inserir({
        titulo,
        senha,
        salaPrivada,
        pessoaId,
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

  async alterarSala(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { titulo, senha } = req.body;
      const pessoaId = req.user?.Usu_Id as string;

      const salaAtualizada = await salaService.alterar(id, pessoaId, {
        titulo,
        senha,
      });

      res.json(
        respostaSucesso({
          resultado: { id: salaAtualizada.id },
          mensagem: "Sala atualizada com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async deleteSala(req: Request, res: Response) {
    try {
      const idSala = req.header("IdSala");

      const pessoaId = req.user?.Usu_Id as string;

      await salaService.delete(idSala as string, pessoaId);

      res.json(
        respostaSucesso({
          resultado: {},
          mensagem: "Sala deletada com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async listarSalas(req: Request, res: Response) {
    try {
      const pessoaId = req.user?.Usu_Id as string;

      const pagina = Number(req.query.pagina) || 0;
      const itensPagina = Number(req.query.itensPagina) || 5;

      const salas = await salaService.listar(pessoaId, pagina, itensPagina);

      res.json(respostaSucesso({ resultado: { salas: salas } }));
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async obterPorCodigo(req: Request, res: Response) {
    try {
      const codigo = req.params.codigo;
      const pessoaId = req.user?.Usu_Id as string;
      const sala = await salaService.obterPorCodigo(codigo, pessoaId);
      res.json(respostaSucesso({ resultado: { sala: sala } }));
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async obterPorId(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pessoaId = req.user?.Usu_Id as string;
      const sala = await salaService.obterPorId(id, pessoaId);
      res.json(respostaSucesso({ resultado: { sala: sala } }));
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async loginSala(req: Request, res: Response) {
    try {
      const pessoa = req.user;
      const { codigo } = req.body;
      const { tokenSala, dataExpiracao } = await salaService.loginSala(
        codigo,
        pessoa?.Usu_Id as string
      );
      res.json(
        respostaSucesso({
          resultado: { tokenSala: tokenSala, dataExpiracao: dataExpiracao },
          mensagem: "Login na sala realizado com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
