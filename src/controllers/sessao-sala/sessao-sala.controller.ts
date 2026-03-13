import { NextFunction, Request, Response } from "express";
import { sessaoSalaService } from "../../services/sessoes/sessao-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { role } from "../../lib/jwt";

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

  async adicionarParticipanteSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.params.id;
      const { pessoa_id, autorizado } = req.body;

      const participante = await sessaoSalaService.adicionarParticipanteSala(
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
      const sessaoId = req.get("sessao_id") as string;
      const pessoaId = req.get("pessoa_id") as string;
      const usuarioLogado = req.user?.Usuario_Id as string;
      const role = req.sala?.Role as role;

      const resultado = await sessaoSalaService.kickarParticipante(
        sessaoId,
        pessoaId,
        usuarioLogado,
        role,
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
};
