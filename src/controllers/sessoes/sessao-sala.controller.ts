import { Request, Response } from "express";
import { sessaoSalaService } from "../../services/sessoes/sessao-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const sessaoSalaController = {
  async criarSessao(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;
      const { visitantes, historias } = req.body; // visitantes: Array de IDs | historias: Array de {titulo, descricao}

      const sessao = await sessaoSalaService.criarSessao(
        sala_id,
        pessoa_id,
        visitantes,
        historias,
      );

      res.status(201).json(
        respostaSucesso({
          resultado: { sessao },
          mensagem: "Sessão criada com sucesso.",
        }),
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
      const sessaoAtiva =
        await sessaoSalaService.obterSessaoAtivaPorSala(sala_id);

      if (!sessaoAtiva) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Nenhuma sessão ativa para encerrar." }),
          );
      }

      const sessaoEncerradaId = await sessaoSalaService.encerrarSessao(
        sala_id,
        sessaoAtiva.id,
        pessoa_id,
      );
      res.json(
        respostaSucesso({
          resultado: { sessaoEncerradaId },
          mensagem: "Sessão encerrada com sucesso.",
        }),
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
        pessoa_id,
      );

      res.json(
        respostaSucesso({
          resultado: { sessao },
        }),
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
        autorizado ?? false,
      );

      res.status(201).json(
        respostaSucesso({
          resultado: { participante },
          mensagem: "Participante adicionado com sucesso.",
        }),
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
        }),
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
        }),
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
        dono_id,
      );

      res.json(
        respostaSucesso({
          resultado: { participantes },
          mensagem: "Visitantes adicionados com sucesso.",
        }),
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
        }),
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
        sala.Role as 0 | 1 | 2 | 3,
      );

      res.json(
        respostaSucesso({
          resultado: resultado,
          mensagem: resultado.mensagem,
        }),
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Atualizar flag participa_votacao do participante na sessão
   * Permite Donos/Admin escolherem se vão votar ou não
   */
  async atualizarParticipaVotacao(req: Request, res: Response) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;
      const { participa_votacao } = req.body;

      if (typeof participa_votacao !== "boolean") {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "participa_votacao deve ser um boolean" }),
          );
      }

      const participante = await sessaoSalaService.atualizarParticipaVotacao(
        sessao_id,
        pessoa_id,
        participa_votacao,
      );

      res.json(
        respostaSucesso({
          resultado: { participante },
          mensagem: `Participação ${
            participa_votacao ? "ativada" : "desativada"
          } com sucesso.`,
        }),
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Adicionar história durante sessão ativa
   * POST /sessoes/:sessaoId/historias/durante-sessao
   */
  async adicionarHistoriaDuranteSessao(req: Request, res: Response) {
    try {
      const { sessaoId } = req.params;
      const { titulo, descricao } = req.body;
      const usuarioId = req.user?.Usu_Id as string;

      // Obter sessão para pegar o sala_id
      const sessao = await sessaoSalaService.obterSessaoPorId(
        sessaoId,
        usuarioId,
      );

      const historia = await sessaoSalaService.adicionarHistoriaDuranteSessao({
        sala_id: sessao.sala_id,
        titulo,
        descricao,
        criado_por: usuarioId,
      });

      res.status(201).json(
        respostaSucesso({
          resultado: { historia },
          mensagem: "História adicionada e vinculada à sessão.",
        }),
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Listar todas as histórias de uma sessão
   * GET /sessoes/:sessaoId/historias
   */
  async listarHistoriasPorSessao(req: Request, res: Response) {
    try {
      const sessao_id = req.params.sessaoId;

      const historias =
        await sessaoSalaService.listarHistoriasPorSessao(sessao_id);

      res.json(
        respostaSucesso({
          resultado: { historias },
        }),
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Obter votos de uma história específica dentro de uma sessão
   * GET /sessoes/:sessaoId/historias/:historiaId/votos
   */
  async obterVotosPorHistoria(req: Request, res: Response) {
    try {
      const sessao_id = req.params.sessaoId;
      const historia_id = req.params.historiaId;

      const votos = await sessaoSalaService.obterVotosPorHistoria(
        sessao_id,
        historia_id,
      );

      res.json(
        respostaSucesso({
          resultado: { votos },
        }),
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
