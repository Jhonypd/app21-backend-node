import { addHours, format } from "date-fns";
import {
  ClaimsRefreshToken,
  decodeToken,
  geradorRefreshToken,
} from "../../lib/jwt";
import { ptBR } from "date-fns/locale";
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository";

export const refreshTokenService = {
  async gerar(userId: string) {
    const dataTokenRefresh = {
      Usu_Id: userId,
      Dt_Ex: format(addHours(new Date(), 10), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
    } as ClaimsRefreshToken;

    const gerarRefreshToken = await geradorRefreshToken(dataTokenRefresh);

    const refreshToken = await RefreshTokenRepository.criar(
      userId,
      gerarRefreshToken,
      new Date(dataTokenRefresh.Dt_Ex)
    );

    return refreshToken;
  },

  async validar(token: string) {
    const buscaRefreshTokenBanco = await RefreshTokenRepository.buscarPorToken(
      token
    );

    if (!buscaRefreshTokenBanco) return null;
    if (buscaRefreshTokenBanco.revogado_em) return null;
    if (buscaRefreshTokenBanco.expiracao < new Date()) return null;
    const decode = decodeToken(token, {} as ClaimsRefreshToken);

    return decode;
  },
  async revogar(token: string) {
    return RefreshTokenRepository.revogar(token);
  },
};
