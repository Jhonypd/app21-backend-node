import { NextFunction, Request, Response } from "express";
import { salaService } from "../../services/salas/sala.service";
import { participanteSalaService } from "../../services/participantes/participante-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { tokenCookies } from "../../helpers/set-tokens-cookies.helper";
import { historiaSalaService } from "../../services/historias/historia-sala.service";

export const salaController = {
  async criarSalas(req: Request, res: Response, next: NextFunction) {
    try {
      const { titulo, senha, salaPrivada, participantesIds } = req.body;
      const pessoaId = req.user?.Usuario_Id as string;

      const sala = await salaService.inserir({
        titulo,
        senha,
        salaPrivada,
        pessoaId,
        participantesIds,
      });

      res.status(201).json(
        respostaSucesso({
          resultado: { id: sala },
          mensagem: "Sala criada com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async alterarSala(req: Request, res: Response, next: NextFunction) {
    try {
      // const id = req.params.id;
      const { id, titulo, senha } = req.body;
      const pessoaId = req.user?.Usuario_Id as string;

      const salaAtualizada = await salaService.alterarSala({
        id,
        pessoaId,
        titulo,
        senha,
      });

      res.json(
        respostaSucesso({
          resultado: { id: salaAtualizada.id },
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async listarSalas(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoaId = req.user?.Usuario_Id as string;

      const pagina = Number(req.query.pagina) || 1;
      const itensPagina = Number(req.query.itensPagina) || 5;
      const valorPesquisa = req.query.pesquisa as string | undefined;

      const salas = await salaService.listar(
        pessoaId,
        pagina,
        itensPagina,
        valorPesquisa,
      );

      res.json(respostaSucesso({ resultado: { salas: salas } }));
    } catch (error: any) {
      return next(error);
    }
  },

  async obterPorCodigo(req: Request, res: Response, next: NextFunction) {
    try {
      const codigo = req.params.codigo;
      const pessoaId = req.user?.Usuario_Id as string;
      const sala = await salaService.obterPorCodigo(codigo, pessoaId);
      res.json(respostaSucesso({ resultado: { sala: sala } }));
    } catch (error: any) {
      return next(error);
    }
  },

  async obterDadosSessaoAtiva(req: Request, res: Response, next: NextFunction) {
    try {
      const codigo = req.query.codigo as string;
      const pessoaId = req.user?.Usuario_Id as string;
      const dadosSala = await salaService.obterDadosSessaoAtiva(
        codigo,
        pessoaId,
      );
      res.json(respostaSucesso({ resultado: { sala: dadosSala } }));
    } catch (error: any) {
      return next(error);
    }
  },

  async obterPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const pessoaId = req.user?.Usuario_Id as string;
      const sala = await salaService.obterPorId(id, pessoaId);
      res.json(respostaSucesso({ resultado: { sala: sala } }));
    } catch (error: any) {
      return next(error);
    }
  },

  async obterDadosFormAlterar(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.query.id as string;
      const pessoaId = req.user?.Usuario_Id as string;
      const sala = await salaService.obterDadosFormAlterar(id, pessoaId);
      res.json(respostaSucesso({ resultado: { sala: sala } }));
    } catch (error: any) {
      return next(error);
    }
  },

  async entrarSala(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoa = req.user;
      const { codigo, senha } = req.body;

      const { tokenSala, role, sessaoId } = await salaService.entrarSala(
        codigo,
        pessoa?.Usuario_Id as string,
        pessoa?.Sessao_Usuario_Id as string,
        senha,
      );

      // Setar token_sala via cookie (httpOnly)
      tokenCookies.setSalaCookie(res, tokenSala);

      res.json(
        respostaSucesso({
          resultado: {
            role,
            sessaoId,
          },
          mensagem: "Login na sala realizado com sucesso.",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async sairDaSala(req: Request, res: Response, next: NextFunction) {
    try {
      const sala_id = req.query.id as string;
      const pessoa_id = req.user?.Usuario_Id as string;

      const resultado = await salaService.sairDaSala(sala_id, pessoa_id);

      // Limpar cookie token_sala ao sair da sala
      res.clearCookie("token_sala", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
      });

      res.json(
        respostaSucesso({
          resultado,
          mensagem: resultado.mensagem,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Exclui uma sala (soft delete)
   * Apenas o dono pode excluir
   * Validações: sem sessões criadas, sem votos registrados
   */
  async excluirSala(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const pessoaId = req.user?.Usuario_Id as string;

      const resultado = await salaService.excluirSala(id, pessoaId);

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
   * Adiciona um participante permanente à sala
   * Permissões: Dono pode adicionar admin (1) ou membro (2), Admin pode adicionar apenas membro (2)
   */
  async adicionarParticipante(req: Request, res: Response, next: NextFunction) {
    try {
      const pessoaIdSolicitante = req.user?.Usuario_Id as string;
      const { pessoa_id, role, sessao_id, sala_id } = req.body;

      if (!pessoa_id) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Id da pessoa é obrigatório" }));
      }

      if (role !== 1 && role !== 2) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Role deve ser 1 (Admin) ou 2 (Membro)" }),
          );
      }

      const participante = await participanteSalaService.adicionarParticipante(
        sala_id,
        pessoaIdSolicitante,
        pessoa_id,
        role,
        sessao_id,
      );

      res.status(201).json(
        respostaSucesso({
          resultado: participante,
          mensagem: "Participante adicionado com sucesso",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Remove um participante permanente da sala
   * Permissões: Dono e Admin podem remover membros, mas não podem remover dono ou outros admins
   */
  async removerParticipante(req: Request, res: Response, next: NextFunction) {
    try {
      const sala_id = req.params.id;
      const pessoa_id_remover = req.params.pessoaId;
      const pessoaIdSolicitante = req.user?.Usuario_Id as string;

      await participanteSalaService.removerParticipante(
        sala_id,
        pessoaIdSolicitante,
        pessoa_id_remover,
      );

      res.json(
        respostaSucesso({
          resultado: {},
          mensagem: "Participante removido com sucesso",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Altera o role de um participante (promover ou rebaixar)
   * Permissões: Apenas o dono pode alterar roles
   */
  async alterarRoleParticipante(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.params.id;
      const pessoa_id_alterar = req.params.pessoaId;
      const pessoaIdSolicitante = req.user?.Usuario_Id as string;
      const { role } = req.body;

      if (role !== 1 && role !== 2) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Role deve ser 1 (Admin) ou 2 (Membro)" }),
          );
      }

      const resultado = await participanteSalaService.alterarRoleParticipante(
        sala_id,
        pessoaIdSolicitante,
        pessoa_id_alterar,
        role,
      );

      res.json(
        respostaSucesso({
          resultado,
          mensagem: "Role alterado com sucesso",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async selecionarHistoriaAtual(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.sala?.Sala_Id as string;
      const pessoa_id = req.user?.Usuario_Id as string;
      const historia_id = req.query.id as string;

      if (!historia_id) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Id da história é obrigatório" }));
      }

      await salaService.selecionarHistoriaAtual(
        sala_id,
        historia_id,
        pessoa_id,
      );

      res.status(200).json(
        respostaSucesso({
          mensagem: "História atual atualizada com sucesso",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  /**
   * Listar todas as histórias de uma sessão
   * GET /historias/listarHistoriasPorSessaoSala
   * Retorna as histórias formatadas com jaFoiVotada, historiaAtual e voto (vencedores)
   */
  async listarHistoriasPorSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.sala?.Sessao_Sala_Id as string;

      const historias =
        await historiaSalaService.listarHistoriasPorSessaoSala(sessao_id);

      res.json(
        respostaSucesso({
          resultado: { historias },
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },
};
