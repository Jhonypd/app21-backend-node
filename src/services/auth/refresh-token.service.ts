import { addDays, addHours, format } from "date-fns";
import {
  ClaimsRefreshToken,
  decodeToken,
  geradorRefreshToken,
} from "../../lib/jwt";
import { ptBR } from "date-fns/locale";
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository";

export const refreshTokenService = {
  async gerar(userId: string, sessionId: string) {
    const dataTokenRefresh = {
      Usu_Id: userId,
      Dt_Ex: format(addDays(new Date(), 3), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Ss_Id: sessionId,
    } as ClaimsRefreshToken;

    const gerarRefreshToken = await geradorRefreshToken(dataTokenRefresh);

    const refreshToken = await RefreshTokenRepository.criar(
      userId,
      gerarRefreshToken,
      new Date(dataTokenRefresh.Dt_Ex)
    );
    console.table(refreshToken);
    return refreshToken;
  },

  async validar(token: string) {
    const buscaRefreshTokenBanco = await RefreshTokenRepository.buscarPorToken(
      token
    );

    if (!buscaRefreshTokenBanco) return null;
    if (buscaRefreshTokenBanco.revogado_em) return null;
    if (buscaRefreshTokenBanco.expiracao < new Date()) return null;
    const decode = decodeToken<ClaimsRefreshToken>(token);
    console.table(decode);
    return decode;
  },
  async revogar(token: string) {
    return RefreshTokenRepository.revogar(token);
  },
};
