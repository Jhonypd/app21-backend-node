import { NextFunction, Request, Response } from "express";
import { sessaoSalaService } from "../../services/sessoes/sessao-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const sessaoSalaController = {
  async criarSessaoSala(req: Request, res: Response, next: NextFunction) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.user?.Usuario_Id as string;
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
      return next(error);
    }
  },

  async encerrarSessaoSalaAtiva(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.user?.Usuario_Id as string;

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

      // Limpar cookie token_sala ao encerrar sessão
      res.clearCookie("token_sala", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
      });

      res.json(
        respostaSucesso({
          resultado: { sessaoEncerradaId },
          mensagem: "Sessão encerrada com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  // async obterSessaoSalaAtiva(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const sessao_id = req.params.id;
  //     const pessoa_id = req.user?.Usuario_Id as string;

  //     const sessao = await sessaoSalaService.obterSessaoPorId(
  //       sessao_id,
  //       pessoa_id,
  //     );

  //     res.json(
  //       respostaSucesso({
  //         resultado: { sessao },
  //       }),
  //     );
  //   } catch (error: any) {
  //     return next(error);
  //   }
  // },

  async adicionarParticipanteSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.params.id;
      const { pessoa_id, autorizado } = req.body;

      const participante = await sessaoSalaService.adicionarParticipante(
        sessao_id,
        pessoa_id,
        autorizado ?? false,
      );

      res.status(201).json(
        respostaSucesso({
          resultado: { participante },
          mensagem: "Participante adicionado com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async revelarVotosSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usuario_Id as string;

      const sessao = await sessaoSalaService.revelarVotos(sessao_id, pessoa_id);

      res.json(
        respostaSucesso({
          resultado: { sessao },
          mensagem: "Votos revelados com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async resetarVotosSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usuario_Id as string;

      const sessao = await sessaoSalaService.resetarVotos(sessao_id, pessoa_id);

      res.json(
        respostaSucesso({
          resultado: { sessao },
          mensagem: "Votos resetados com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async adicionarVisitantesSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.params.id;
      const { pessoa_ids, pessoa_id } = req.body; // Array ou ID único
      const dono_id = req.user?.Usuario_Id as string;

      // Aceitar tanto array quanto ID único
      const ids: string[] = pessoa_ids
        ? pessoa_ids
        : pessoa_id
          ? [pessoa_id]
          : [];

      if (ids.length === 0) {
        return res.status(400).json(
          respostaErro({
            mensagem: "Informe pessoa_ids (array) ou pessoa_id (string).",
          }),
        );
      }

      const participantes = await sessaoSalaService.adicionarVisitantes(
        sala_id,
        ids,
        dono_id,
      );

      res.json(
        respostaSucesso({
          resultado: { participantes },
          mensagem: "Visitantes adicionados com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async removerVisitanteSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.params.pessoaId;
      const dono_id = req.user?.Usuario_Id as string;

      await sessaoSalaService.removerVisitante(sala_id, pessoa_id, dono_id);

      res.json(
        respostaSucesso({
          mensagem: "Visitante removido com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Kicka um participante da sessão (moderação)
   * Apenas dono e admin podem kickar
   * Admin não pode kickar dono
   */
  async kickarParticipanteSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
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
        usuarioLogado?.Usuario_Id as string,
        sala.Role as 0 | 1 | 2 | 3,
      );

      res.json(
        respostaSucesso({
          resultado: resultado,
          mensagem: resultado.mensagem,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Atualizar flag participa_votacao do participante na sessão
   * Permite Donos/Admin escolherem se vão votar ou não
   */
  async atualizarParticipaVotacaoSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.params.id;
      const pessoa_id = req.user?.Usuario_Id as string;
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
      return next(error);
    }
  },

  /**
   * Adicionar história(s) durante sessão ativa
   * POST /sessoes/:sessaoId/historias/durante-sessao
   * Body: { titulo, descricao } OU { adicionar: [...], remover: [...] }
   */
  async adicionarHistoriaDuranteSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { sessaoId } = req.params;
      const { adicionar, remover } = req.body;
      const usuarioId = req.user?.Usuario_Id as string;

      // Obter sessão para pegar o sala_id

      const resultado = await sessaoSalaService.adicionarHistoriaDuranteSessao({
        sessao_id: sessaoId,
        pessoa_id: usuarioId,
        adicionar,
        remover,
      });

      // Formato em lote
      res.status(200).json(
        respostaSucesso({
          resultado,
          mensagem: `${resultado.adicionadas} histórias adicionadas, ${resultado.removidas} removidas.`,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Listar todas as histórias de uma sessão
   * GET /sessoes/:sessaoId/historias
   */
  async listarHistoriasPorSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
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
      return next(error);
    }
  },

  // não remover o comentário, mas usar apenas caso quebre a chamada de votos da historia sessão no controller de votos, pois tem a mesma função de obter os votos por história sessão sala
  /**
   * Obter votos de uma história específica dentro de uma sessão
   * GET /sessoes/:sessaoId/historias/:historiaId/votos
   */
  // async obterVotosPorHistoriaSessaoSala(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   try {
  //     const sessao_id = req.params.sessaoId;
  //     const historia_id = req.params.historiaId;

  //     const votos =
  //       await sessaoSalaService.obterVotosPorHistoriaSessaoSessaoSala(
  //         sessao_id,
  //         historia_id,
  //       );

  //     res.json(
  //       respostaSucesso({
  //         resultado: votos,
  //       }),
  //     );
  //   } catch (error: any) {
  //     return next(error);
  //   }
  // },
};
