import { Request, Response } from "express";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { refreshTokenService } from "../../services/auth/refresh-token.service";
import { geradorToken } from "../../lib/jwt";
import { pessoaService } from "../../services/pessoas/pessoa.service";
import { sessionUsuarioService } from "../../services/auth/session-usuario.service";
import { addMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { criptografia } from "../../lib/criptografia";

export const refreshTokenController = {
  async renovar(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Refresh token é obrigatório" }));
      }

      const dados = await refreshTokenService.validar(refreshToken);
      console.table(dados);

      if (!dados) {
        return res
          .status(401)
          .json(respostaErro({ mensagem: "Refresh token inválido" }));
      }

      const dadosUsuarioNovoToken =
        await pessoaService.usuarioExistePorEmailOuId(undefined, dados.Usu_Id);

      if (!dadosUsuarioNovoToken) {
        return res.status(404).json(
          respostaErro({
            mensagem: "Usuário não encontrado para renovar token",
          })
        );
      }

      const sessionAtiva = await sessionUsuarioService.buscarSessaoAtiva(
        dados.Ss_Id
      );
      // Gera um novo access-token
      const novoAccessToken = {
        Usu_Id: dadosUsuarioNovoToken.id,
        Usu_na: criptografia.descriptografar(dadosUsuarioNovoToken.nome),
        Email: criptografia.descriptografar(dadosUsuarioNovoToken.email),
        Dt_Ex: format(addMinutes(new Date(), 15), "yyyy-MM-dd' 'HH:mm:ss", {
          locale: ptBR,
        }),
        Ss_Id: sessionAtiva?.id as string,
        Idp: "pt-BR",
        aud: "App21",
        iss: "App21",
      };

      const accessToken = geradorToken(novoAccessToken);

      return res.status(200).json(
        respostaSucesso({
          mensagem: "Token renovado com sucesso",
          resultado: { token: accessToken },
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        respostaErro({
          mensagem: error.message || "Erro ao renovar token",
        })
      );
    }
  },

  async revogar(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Refresh token é obrigatório" }));
      }

      await refreshTokenService.revogar(refreshToken);

      return res.status(200).json(
        respostaSucesso({
          mensagem: "Refresh token revogado com sucesso",
        })
      );
    } catch (error: any) {
      return res.status(500).json(
        respostaErro({
          mensagem: error.message || "Erro ao revogar refresh token",
        })
      );
    }
  },
};
