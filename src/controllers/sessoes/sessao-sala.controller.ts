import { Request, Response } from "express";
import { sessaoSalaService } from "../../services/sessoes/sessao-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const sessaoSalaController = {
  async criarSessao(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;

      const sessao = await sessaoSalaService.criarSessao(sala_id, pessoa_id);

      res.status(201).json(
        respostaSucesso({
          resultado: { sessao },
          mensagem: "Sessão criada com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
  async encerrarSessao(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const sessao_id = req.params.sessaoId;
      const pessoa_id = req.user?.Usu_Id as string;

      const sessaoEncerradaId = await sessaoSalaService.encerrarSessao(
        sala_id,
        sessao_id,
        pessoa_id
      );
      res.json(
        respostaSucesso({
          resultado: { sessaoEncerradaId },
          mensagem: "Sessão encerrada com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
  async obterSessao(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;

      const sessao = await sessaoSalaService.obterSessaoPorId(
        sessao_id,
        pessoa_id
      );

      res.json(
        respostaSucesso({
          resultado: { sessao },
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async adicionarParticipante(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const { pessoa_id, autorizado } = req.body;
      const usuario_id = req.user?.Usu_Id as string;

      // Se não foi passado pessoa_id, usa o usuário logado
      const pessoaIdParaAdicionar = pessoa_id || usuario_id;

      const participante = await sessaoSalaService.adicionarParticipante(
        sessao_id,
        pessoaIdParaAdicionar,
        autorizado ?? false
      );

      res.status(201).json(
        respostaSucesso({
          resultado: { participante },
          mensagem: "Participante adicionado com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async revelarVotos(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;

      const sessao = await sessaoSalaService.revelarVotos(sessao_id, pessoa_id);

      res.json(
        respostaSucesso({
          resultado: { sessao },
          mensagem: "Votos revelados com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async resetarVotos(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;

      const sessao = await sessaoSalaService.resetarVotos(sessao_id, pessoa_id);

      res.json(
        respostaSucesso({
          resultado: { sessao },
          mensagem: "Votos resetados com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
