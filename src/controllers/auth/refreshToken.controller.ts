import { Request, Response } from "express";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { refreshTokenService } from "../../services/auth/refresh-token.service";
import { sessaoUsuarioService } from "../../services/auth/sessao-usuario.service";
import { getClientInfo } from "../../helpers/client-info.helper";

export const refreshTokenController = {
  async renovarAccessToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const { ip, userAgent } = getClientInfo(req);

      if (!refreshToken) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Refresh token é obrigatório" }));
      }

      const tokenValidado = await refreshTokenService.revalidarAccessToken(
        refreshToken,
        ip,
        userAgent
      );

      return res.status(200).json(
        respostaSucesso({
          mensagem: "Token renovado com sucesso",
          resultado: tokenValidado,
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

  async encerrarSessao(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const sessaoId = req.user?.Ss_Id;

      if (!refreshToken) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Refresh token é obrigatório" }));
      }

      if (!sessaoId) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Sessão é obrigatória" }));
      }

      await sessaoUsuarioService.invalidarSessaoRefreshToken(
        sessaoId,
        refreshToken
      );

      return res.status(200).json(
        respostaSucesso({
          mensagem: "Sessão encerrada com sucesso",
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
