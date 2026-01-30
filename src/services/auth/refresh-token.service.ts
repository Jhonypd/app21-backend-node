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
      Ss_Id: sessionId,
    } as ClaimsRefreshToken;

    const gerarRefreshToken = geradorRefreshToken(dataTokenRefresh);

    const refreshTokenHash = await hash.senha(gerarRefreshToken);

    // 🔥 CORREÇÃO: Expiração deve ser 7 dias no futuro, não a data atual
    const expiracao = addDays(new Date(), 7);

    console.log("📝 [refreshTokenService] Salvando refresh token no banco:", {
      sessionId,
      userId,
      expiracao: expiracao.toISOString(),
    });

    const refreshToken = await RefreshTokenRepository.criar(
      sessionId,
      refreshTokenHash,
      expiracao,
    );

    console.log("✅ [refreshTokenService] Refresh token salvo:", {
      id: refreshToken?.id,
      sessaoId: sessionId,
    });

    return { token: gerarRefreshToken };
  },

  async revalidarAccessToken(
    refreshToken: string,
    ip?: string,
    userAgent?: string,
  ) {
    const refreshTokenDecoded = decodeToken<ClaimsRefreshToken>(refreshToken);

    console.log("🔍 [refreshTokenService] Buscando refresh token:", {
      sessaoIdDoToken: refreshTokenDecoded.Ss_Id,
      usuarioIdDoToken: refreshTokenDecoded.Usu_Id,
    });

    const buscaRefreshTokenBanco =
      await RefreshTokenRepository.buscarPorSessaoId(refreshTokenDecoded.Ss_Id);

    console.log("🔍 [refreshTokenService] Resultado da busca:", {
      encontrado: !!buscaRefreshTokenBanco,
      sessaoIdBuscado: refreshTokenDecoded.Ss_Id,
    });

    if (!buscaRefreshTokenBanco) {
      console.error(
        "❌ [refreshTokenService] Refresh token não encontrado no banco!",
      );
      throw new Error("Refresh token inválido");
    }

    const validaTokenDoBb = await hash.compare(
      refreshToken,
      buscaRefreshTokenBanco?.token_hash,
    );

    if (!validaTokenDoBb) {
      console.error("❌ [refreshTokenService] Hash do token não confere!");
      throw new Error("Refresh token inválido");
    }

    if (buscaRefreshTokenBanco.revogado_em) {
      console.error("❌ [refreshTokenService] Token foi revogado!");
      throw new Error("Refresh token inválido");
    }

    if (buscaRefreshTokenBanco.expiracao < new Date())
      throw new Error("Refresh token expirado");

    const dadosUsuarioNovoToken = await pessoaService.usuarioExistePorEmailOuId(
      null,
      refreshTokenDecoded.Usu_Id,
    );

    if (!dadosUsuarioNovoToken)
      throw new Error("Usuário não encontrado para renovar token de acesso");

    const sessaoAtiva = await sessaoUsuarioService.buscarSessaoAtivaPorId(
      refreshTokenDecoded.Ss_Id,
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
      Usu_Id: dadosUsuarioNovoToken.id,
      Usu_Na: criptografia.descriptografar(dadosUsuarioNovoToken.nome),
      Email: criptografia.descriptografar(dadosUsuarioNovoToken.email),
      Ss_Id: sessaoAtiva.id,
      Idp: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    const novoRefreshTokenPayload = {
      Usu_Id: dadosUsuarioNovoToken.id,
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
