import { NextFunction, Request, Response } from "express";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { refreshTokenService } from "../../services/auth/refresh-token.service";
import { sessaoUsuarioService } from "../../services/auth/sessao-usuario.service";
import { getClientInfo } from "../../helpers/client-info.helper";
import { tokenCookies } from "../../helpers/set-tokens-cookies.helper";

export const refreshTokenController = {
  async encerrarSessao(req: Request, res: Response, next: NextFunction) {
    try {
      // Lê do cookie (cookie-based auth) com fallback para o body
      const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
      const sessaoId = req.user?.Sessao_Usuario_Id;

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
        refreshToken,
      );

      // Limpar todos os cookies de autenticação
      tokenCookies.clearTokensCookies(res);

      return res.status(200).json(
        respostaSucesso({
          mensagem: "Sessão encerrada com sucesso",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },
};
