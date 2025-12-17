import { Request, Response } from "express";
import { salaService } from "../../services/salas/sala.service";
import { participanteSalaService } from "../../services/participantes/participante-sala.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const salaController = {
  async criarSalas(req: Request, res: Response) {
    try {
      const { titulo, senha, salaPrivada, participantesIds } = req.body;
      const pessoaId = req.user?.Usu_Id as string;

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

      const pagina = Number(req.query.pagina) || 1;
      const itensPagina = Number(req.query.itensPagina) || 5;
      const valorPesquisa = req.query.pesquisa as string | undefined;

      const salas = await salaService.listar(
        pessoaId,
        pagina,
        itensPagina,
        valorPesquisa
      );

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

  async obterDadosSessaoAtiva(req: Request, res: Response) {
    try {
      const codigo = req.params.codigo;
      const pessoaId = req.user?.Usu_Id as string;
      const dadosSala = await salaService.obterDadosSessaoAtiva(
        codigo,
        pessoaId
      );
      res.json(respostaSucesso({ resultado: { sala: dadosSala } }));
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

  async obterParaEdicao(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pessoaId = req.user?.Usu_Id as string;
      const sala = await salaService.obterParaEdicao(id, pessoaId);
      res.json(respostaSucesso({ resultado: { sala: sala } }));
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async entrarSala(req: Request, res: Response) {
    try {
      const pessoa = req.user;
      const { codigo, senha } = req.body;

      const { tokenSala, dataExpiracao, role, sessaoId } =
        await salaService.entrarSala(
          codigo,
          pessoa?.Usu_Id as string,
          pessoa?.Ss_Id as string,
          senha
        );

      res.json(
        respostaSucesso({
          resultado: {
            tokenSala,
            dataExpiracao,
            role,
            sessaoId,
          },
          mensagem: "Login na sala realizado com sucesso.",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async sairDaSala(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id = req.user?.Usu_Id as string;

      const resultado = await salaService.sairDaSala(sala_id, pessoa_id);

      res.json(
        respostaSucesso({
          resultado,
          mensagem: resultado.mensagem,
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  async aprovarReentrada(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id_reentrada = req.params.pessoaId;
      const pessoa_id_aprovador = req.user?.Usu_Id as string;

      const resultado = await salaService.aprovarReentrada(
        sala_id,
        pessoa_id_aprovador,
        pessoa_id_reentrada
      );

      res.json(
        respostaSucesso({
          resultado,
          mensagem: resultado.mensagem,
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Exclui uma sala (soft delete)
   * Apenas o dono pode excluir
   * Validações: sem sessões criadas, sem votos registrados
   */
  async excluirSala(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const pessoaId = req.user?.Usu_Id as string;

      const resultado = await salaService.excluirSala(id, pessoaId);

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

  /**
   * Adiciona um participante permanente à sala
   * Permissões: Dono pode adicionar admin (1) ou membro (2), Admin pode adicionar apenas membro (2)
   */
  async adicionarParticipante(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoaIdSolicitante = req.user?.Usu_Id as string;
      const { pessoa_id, role } = req.body;

      if (!pessoa_id) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "ID da pessoa é obrigatório" }));
      }

      if (role !== 1 && role !== 2) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Role deve ser 1 (Admin) ou 2 (Membro)" })
          );
      }

      const participante = await participanteSalaService.adicionarParticipante(
        sala_id,
        pessoaIdSolicitante,
        pessoa_id,
        role
      );

      res.status(201).json(
        respostaSucesso({
          resultado: participante,
          mensagem: "Participante adicionado com sucesso",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Remove um participante permanente da sala
   * Permissões: Dono e Admin podem remover membros, mas não podem remover dono ou outros admins
   */
  async removerParticipante(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id_remover = req.params.pessoaId;
      const pessoaIdSolicitante = req.user?.Usu_Id as string;

      await participanteSalaService.removerParticipante(
        sala_id,
        pessoaIdSolicitante,
        pessoa_id_remover
      );

      res.json(
        respostaSucesso({
          resultado: {},
          mensagem: "Participante removido com sucesso",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },

  /**
   * Altera o role de um participante (promover ou rebaixar)
   * Permissões: Apenas o dono pode alterar roles
   */
  async alterarRoleParticipante(req: Request, res: Response) {
    try {
      const sala_id = req.params.id;
      const pessoa_id_alterar = req.params.pessoaId;
      const pessoaIdSolicitante = req.user?.Usu_Id as string;
      const { role } = req.body;

      if (role !== 1 && role !== 2) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Role deve ser 1 (Admin) ou 2 (Membro)" })
          );
      }

      const resultado = await participanteSalaService.alterarRoleParticipante(
        sala_id,
        pessoaIdSolicitante,
        pessoa_id_alterar,
        role
      );

      res.json(
        respostaSucesso({
          resultado,
          mensagem: "Role alterado com sucesso",
        })
      );
    } catch (error: any) {
      res.status(500).json(respostaErro({ mensagem: error.message }));
    }
  },
};
