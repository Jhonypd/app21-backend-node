import { Request, Response } from "express";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { refreshTokenService } from "../../services/auth/refresh-token.service";

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

      if (!dados) {
        return res
          .status(401)
          .json(respostaErro({ mensagem: "Refresh token inválido" }));
      }

      // Gera um novo access-token
      const novoAccessToken = {
        Usu_Id: dados.Usu_Id,
        Usu_na: dados.Usu_na ?? "",
        Email: dados.Email ?? "",
        Dt_Ex: dados.Dt_Ex,
        Idp: "pt-BR",
        aud: "App21",
        iss: "App21",
      };

      const { geradorToken } = require("../../lib/jwt");
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
