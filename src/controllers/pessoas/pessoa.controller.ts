import { Request, Response } from "express";
import { pessoaService } from "../../services/pessoas/pessoa.service";
import { respostaErro, respostaSucesso } from "../../utils/response";

export const pessoaController = {
  async alterar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, inativo } = req.body;

      const usuarioAtualizado = await pessoaService.alterar(id, {
        nome,
        email,
        inativo,
      });

      return res.status(200).json(
        respostaSucesso({
          resultado: { id: usuarioAtualizado.usuario.id },
          mensagem: `${
            usuarioAtualizado.emailEnviado
              ? "Usuário atualizado com sucesso"
              : "Usuário atualizado, mas email de confirmação não pôde ser enviado"
          }`,
        })
      );
    } catch (error: any) {
      return res.status(400).json(respostaErro({ mensagem: error.message }));
    }
  },

  async obterDadosAlterar(req: Request, res: Response) {
    try {
      const { id } = req.query;

      if (!id) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Id é obrigatório" }));
      }

      const dados = await pessoaService.obterDadosAlterar(id as string);

      return res.status(200).json(
        respostaSucesso({
          resultado: {
            pessoa: dados,
          },
        })
      );
    } catch (error: any) {
      return res.status(400).json(respostaErro({ mensagem: error.message }));
    }
  },

  async obterDadosConta(req: Request, res: Response) {
    try {
      const pessoaId = req.user?.Usu_Id as string;

      const dados = await pessoaService.obterDadosConta(pessoaId);

      return res
        .status(200)
        .json(respostaSucesso({ resultado: { pessoa: dados } }));
    } catch (error: any) {
      return res.status(400).json(respostaErro({ mensagem: error.message }));
    }
  },
};
