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
      const pessoa_id = req.user?.Usu_Id as string;

      // Buscar sessão ativa da sala
      const sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(
        sala_id
      );

      if (!sessaoAtiva) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Nenhuma sessão ativa para encerrar." })
          );
      }

      const sessaoEncerradaId = await sessaoSalaService.encerrarSessao(
        sala_id,
        sessaoAtiva.id,
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

  async adicionarVisitantes(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const { pessoa_ids } = req.body; // Array de IDs
      const dono_id = req.user?.Usu_Id as string;

      const participantes = await sessaoSalaService.adicionarVisitantes(
        sala_id,
        pessoa_ids,
        dono_id
      );

      res.json(
        respostaSucesso({
          resultado: { participantes },
          mensagem: "Visitantes adicionados com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async removerVisitante(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.params.pessoaId;
      const dono_id = req.user?.Usu_Id as string;

      await sessaoSalaService.removerVisitante(sala_id, pessoa_id, dono_id);

      res.json(
        respostaSucesso({
          mensagem: "Visitante removido com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Kicka um participante da sessão (moderação)
   * Apenas dono e admin podem kickar
   * Admin não pode kickar dono
   */
  async kickarParticipante(req: Request, res: Response) {
    try {
      const sessaoId = req.params.sessaoId;
      const pessoaId = req.params.pessoaId;
      const usuarioLogado = req.user;
      const sala = req.sala; // Vem do salaAuthGuard

      if (!sala) {
        return res
          .status(401)
          .json(respostaErro({ mensagem: "Token da sala não encontrado" }));
      }

      const resultado = await sessaoSalaService.kickarParticipante(
        sessaoId,
        pessoaId,
        usuarioLogado?.Usu_Id as string,
        sala.Role as 0 | 1 | 2 | 3
      );

      res.json(
        respostaSucesso({
          resultado: resultado,
          mensagem: resultado.mensagem,
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
