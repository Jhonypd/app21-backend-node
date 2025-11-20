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
import { sessaoUsuarioService } from "./sessao-usuario.service";
import { criptografia } from "../../lib/criptografia";
import { hash } from "../../lib/hash";

export const refreshTokenService = {
  async gerarRefreshToken(userId: string, sessionId: string) {
    const dataTokenRefresh = {
      Usu_Id: userId,
      Dt_Ex: format(addDays(new Date(), 3), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Ss_Id: sessionId,
    } as ClaimsRefreshToken;

    const gerarRefreshToken = geradorRefreshToken(dataTokenRefresh);

    const refreshTokenHash = await hash.senha(gerarRefreshToken);

    const refreshToken = await RefreshTokenRepository.criar(
      sessionId,
      refreshTokenHash,
      new Date(dataTokenRefresh.Dt_Ex)
    );

    return { token: gerarRefreshToken, dataExpiracao: dataTokenRefresh.Dt_Ex };
  },

  async revalidarAccessToken(refreshToken: string) {
    const refreshTokenDecoded = decodeToken<ClaimsRefreshToken>(refreshToken);

    const buscaRefreshTokenBanco =
      await RefreshTokenRepository.buscarPorSessaoId(refreshTokenDecoded.Ss_Id);

    if (!buscaRefreshTokenBanco) throw new Error("Refresh token inválido");

    const validaTokenDoBb = await hash.compare(
      refreshToken,
      buscaRefreshTokenBanco?.token_hash
    );

    if (!validaTokenDoBb) throw new Error("Refresh token inválido");

    if (buscaRefreshTokenBanco.revogado_em)
      throw new Error("Refresh token inválido");

    if (buscaRefreshTokenBanco.expiracao < new Date())
      throw new Error("Refresh token expirado");

    const dadosUsuarioNovoToken = await pessoaService.usuarioExistePorEmailOuId(
      null,
      refreshTokenDecoded.Usu_Id
    );

    if (!dadosUsuarioNovoToken)
      throw new Error("Usuário não encontrado para renovar token de acesso");

    const sessaoAtiva = await sessaoUsuarioService.buscarSessaoAtivaPorId(
      refreshTokenDecoded.Ss_Id
    );

    if (!sessaoAtiva)
      throw new Error("Sessão inválida para renovar token de acesso");
    if (sessaoAtiva.revogado_em)
      throw new Error("Sessão revogada para renovar token de acesso");
    if (sessaoAtiva.expiracao < new Date())
      throw new Error("Sessão expirada para renovar token de acesso");

    const novoAccessTokenPayload = {
      Usu_Id: dadosUsuarioNovoToken.id,
      Usu_Na: criptografia.descriptografar(dadosUsuarioNovoToken.nome),
      Email: criptografia.descriptografar(dadosUsuarioNovoToken.email),
      Dt_Ex: format(addMinutes(new Date(), 15), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Ss_Id: sessaoAtiva.id,
      Idp: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    const novoRefreshTokenPayload = {
      Usu_Id: dadosUsuarioNovoToken.id,
      Dt_Ex: format(addDays(new Date(), 3), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Ss_Id: sessaoAtiva.id,
    } as ClaimsRefreshToken;

    const accessToken = geradorToken(novoAccessTokenPayload);
    const novoRefreshToken = geradorRefreshToken(novoRefreshTokenPayload);

    return {
      tokenAcesso: {
        token: accessToken,
        dataExpiracao: novoAccessTokenPayload.Dt_Ex,
      },
      refreshToken: {
        token: novoRefreshToken,
        dataExpiracao: novoRefreshTokenPayload.Dt_Ex,
      },
    };
  },

  // async revogarRefreshTokenPorRefreshToken(refreshToken: string) {
  //   //decodificar e pegar o Ss_Id para revogar todos os refresh tokens daquela sessão
  //   const refreshTokenDecoded = decodeToken<ClaimsRefreshToken>(refreshToken);

  //   if (!refreshTokenDecoded.Ss_Id)
  //     throw new Error("Refresh token inválido para revogação");

  //   return RefreshTokenRepository.deletarTodosPorSessaoId(refreshTokenDecoded.Ss_Id);
  // },

  async revogarTodasRefreshTokensPorPessoaId(pessoaId: string) {
    const sessoesPessoa =
      await sessaoUsuarioService.buscarSessoesAtivasPorPessoaId(pessoaId);

    if (!sessoesPessoa || sessoesPessoa.length === 0) return;

    for (const sessao of sessoesPessoa) {
      await RefreshTokenRepository.deletarTodosPorSessaoId(sessao.id);
    }
  },

  async revogarRefreshTokenPorSessaoId(sessaoId: string) {
    return RefreshTokenRepository.deletarTodosPorSessaoId(sessaoId);
  },
};
