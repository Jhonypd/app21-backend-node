import { addDays, addMinutes, format } from "date-fns";
import {
  Claims,
  ClaimsRefreshToken,
  decodeToken,
  geradorRefreshToken,
  geradorToken,
} from "../../lib/jwt";
import { ptBR } from "date-fns/locale";
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository";
import { pessoaService } from "../pessoas/pessoa.service";
import { sessionUsuarioService } from "./session-usuario.service";
import { criptografia } from "../../lib/criptografia";

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

    if (!buscaRefreshTokenBanco) throw new Error("Refresh token inválido");
    if (buscaRefreshTokenBanco.revogado_em)
      throw new Error("Refresh token inválido");
    if (buscaRefreshTokenBanco.expiracao < new Date())
      throw new Error("Refresh token expirado");
    const decode = decodeToken<ClaimsRefreshToken>(token);

    console.table(decode);

    const dadosUsuarioNovoToken = await pessoaService.usuarioExistePorEmailOuId(
      undefined,
      decode.Usu_Id
    );

    if (!dadosUsuarioNovoToken)
      throw new Error("Usuário não encontrado para renovar token");

    const sessionAtiva = await sessionUsuarioService.buscarSessaoAtiva(
      decode.Ss_Id
    );

    const novoAccessToken = {
      Usu_Id: dadosUsuarioNovoToken.id,
      Usu_Na: criptografia.descriptografar(dadosUsuarioNovoToken.nome),
      Email: criptografia.descriptografar(dadosUsuarioNovoToken.email),
      Dt_Ex: format(addMinutes(new Date(), 15), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Ss_Id: sessionAtiva?.id as string,
      Idp: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    const accessToken = geradorToken(novoAccessToken);

    return {
      tokenAcesso: { token: accessToken, dataExpiracao: novoAccessToken.Dt_Ex },
    };
  },
  async revogar(token: string) {
    return RefreshTokenRepository.revogar(token);
  },
};
