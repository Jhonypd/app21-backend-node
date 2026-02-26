import { addDays } from "date-fns";
import {
  Claims,
  ClaimsRefreshToken,
  decodeToken,
  geradorRefreshToken,
  geradorToken,
} from "../../lib/jwt";
import { RefreshTokenRepository } from "../../repositories/refresh-token.repository";
import { pessoaService } from "../pessoas/pessoa.service";
import { sessaoUsuarioService } from "./sessao-usuario.service";
import { criptografia } from "../../lib/criptografia";
import { hash } from "../../lib/hash";

export const refreshTokenService = {
  async gerarRefreshToken(userId: string, sessionId: string) {
    const dataTokenRefresh = {
      Usuario_Id: userId,
      Sessao_Usuario_Id: sessionId,
    } as ClaimsRefreshToken;

    const gerarRefreshToken = geradorRefreshToken(dataTokenRefresh);

    const refreshTokenHash = await hash.senha(gerarRefreshToken);

    const expiracao = addDays(new Date(), 7);

    const refreshToken = await RefreshTokenRepository.criar(
      sessionId,
      refreshTokenHash,
      expiracao,
    );

    return { token: gerarRefreshToken };
  },

  async revalidarAccessToken(
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ) {
    const refreshTokenDecoded = decodeToken<ClaimsRefreshToken>(refreshToken);

    const buscaRefreshTokenBanco =
      await RefreshTokenRepository.buscarPorSessaoId(
        refreshTokenDecoded.Sessao_Usuario_Id,
      );

    if (!buscaRefreshTokenBanco) {
      console.error(
        "[refreshTokenService] Refresh token não encontrado no banco!",
      );
      throw new Error("Refresh token inválido");
    }

    const validaTokenDoBb = await hash.compare(
      refreshToken,
      buscaRefreshTokenBanco?.token_hash,
    );

    if (!validaTokenDoBb) {
      console.error("[refreshTokenService] Hash do token não confere!");
      throw new Error("Refresh token inválido");
    }

    if (buscaRefreshTokenBanco.revogado_em) {
      console.error("[refreshTokenService] Token foi revogado!");
      throw new Error("Refresh token inválido");
    }

    if (buscaRefreshTokenBanco.expiracao < new Date())
      throw new Error("Refresh token expirado");

    const dadosUsuarioNovoToken = await pessoaService.usuarioExistePorEmailOuId(
      null,
      refreshTokenDecoded.Usuario_Id,
    );

    if (!dadosUsuarioNovoToken)
      throw new Error("Usuário não encontrado para renovar token de acesso");

    const sessaoAtiva = await sessaoUsuarioService.buscarSessaoAtivaPorId(
      refreshTokenDecoded.Sessao_Usuario_Id,
    );

    if (!sessaoAtiva)
      throw new Error("Sessão inválida para renovar token de acesso");
    if (sessaoAtiva.revogado_em)
      throw new Error("Sessão revogada para renovar token de acesso");
    if (sessaoAtiva.expiracao < new Date())
      throw new Error("Sessão expirada para renovar token de acesso");

    // Atualiza o último acesso com IP e User-Agent
    await sessaoUsuarioService.atualizarUltimoAcesso(
      sessaoAtiva.id,
      ip,
      userAgent,
    );

    const novoAccessTokenPayload = {
      Usuario_Id: dadosUsuarioNovoToken.id,
      Nome: criptografia.descriptografar(dadosUsuarioNovoToken.nome),
      Email: criptografia.descriptografar(dadosUsuarioNovoToken.email),
      Sessao_Usuario_Id: sessaoAtiva.id,
      Idioma_Padrao: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    const novoRefreshTokenPayload = {
      Usuario_Id: dadosUsuarioNovoToken.id,
      Sessao_Usuario_Id: sessaoAtiva.id,
    } as ClaimsRefreshToken;

    const accessToken = geradorToken(novoAccessTokenPayload);
    const novoRefreshToken = geradorRefreshToken(novoRefreshTokenPayload);

    // Rotacionar o hash do refresh token no banco (refresh token rotation)
    const novoRefreshTokenHash = await hash.senha(novoRefreshToken);
    await RefreshTokenRepository.atualizarTokenHash(
      sessaoAtiva.id,
      novoRefreshTokenHash,
    );

    return {
      tokenAcesso: {
        token: accessToken,
      },
      refreshToken: {
        token: novoRefreshToken,
      },
    };
  },

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

  /**
   * Método simplificado para refresh - alias para revalidarAccessToken
   */
  async refresh(refreshToken: string, ip?: string, userAgent?: string) {
    return this.revalidarAccessToken(refreshToken, ip, userAgent);
  },
};
