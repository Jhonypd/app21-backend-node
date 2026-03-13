import { NextFunction, Request, Response } from "express";
import { salaService } from "../../services/salas/sala.service";
import { participanteSalaService } from "../../services/participantes/participante-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { tokenCookies } from "../../helpers/set-tokens-cookies.helper";
import { historiaSalaService } from "../../services/historias/historia-sala.service";
import { sessaoSalaService } from "../../services/sessoes/sessao-sala.service";
import { role } from "../../lib/jwt";

export const salaController = {
  async criarSala(req: Request, res: Response, next: NextFunction) {
    try {
      const { titulo, senha, salaPrivada, participantesIds } = req.body;
      const pessoaId = req.user?.Usuario_Id as string;

      const sala = await salaService.criarSala({
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
      const {
        id,
        titulo,
        senha,
        participantesAdicionarIds,
        participantesRemoverIds,
      } = req.body;
      const pessoaId = req.user?.Usuario_Id as string;

      const salaAtualizada = await salaService.alterarSala({
        id,
        pessoaId,
        titulo,
        senha,
        participantesAdicionarIds,
        participantesRemoverIds,
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
      const id = req.get("ids") as string;
      const pessoaId = req.user?.Usuario_Id as string;

      const resultado = await salaService.excluirSala([id], pessoaId);

      res.json(
        respostaSucesso({
          resultado: resultado,
          mensagem: "Sala excluída com sucesso.",
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
      const role = req.sala?.Role as role;

      const historias = await historiaSalaService.listarHistoriasPorSessaoSala(
        sessao_id,
        role,
      );

      res.json(
        respostaSucesso({
          resultado: { historias },
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
      const sala_id = req.query.id as string;
      const pessoa_id = req.user?.Usuario_Id as string;

      const sessaoEncerrada = await sessaoSalaService.encerrarSessao(
        sala_id,
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
          resultado: { sessaoEncerrada },
          mensagem: "Sessão encerrada com sucesso.",
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
      const sessao_id = req.query.id as string;
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

  async ListarParticipantesSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.sala?.Sala_Id as string;
      const sessao_id = req.sala?.Sessao_Sala_Id as string | undefined;
      const apenasOnline = req.query.apenasOnline === "true";

      const resultado = await participanteSalaService.listarParticipantesDaSala(
        sala_id,
        sessao_id,
        apenasOnline,
      );

      res.json(
        respostaSucesso({
          resultado,
        }),
      );
    } catch (error) {
      return next(error);
    }
  },

  async adicionarParticipanteOuVisitanteSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sala_id = req.sala?.Sala_Id as string;
      const sessao_sala_id = req.sala?.Sessao_Sala_Id as string;
      const pessoa_id = req.user?.Usuario_Id as string;
      const { role, pessoaId } = req.body;

      const participante =
        await participanteSalaService.adicionarParticipanteOuVisitante(
          sala_id,
          pessoaId,
          role,
          pessoa_id,
          sessao_sala_id,
        );
      res.json(
        respostaSucesso({
          resultado: { participante },
          mensagem: "Participante adicionado com sucesso.",
        }),
      );
    } catch (error) {
      return next(error);
    }
  },

  async revelarVotosSessaoSala(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const sessao_id = req.sala?.Sessao_Sala_Id as string;
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
};
