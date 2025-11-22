import { sessionUsuarioRepository } from "../../repositories/sessao-usuario.repository";
import { refreshTokenService } from "./refresh-token.service";

export const sessaoUsuarioService = {
  async criarSessao(
    pessoaId: string,
    expiracao: Date,
    ip?: string,
    userAgent?: string
  ) {
    const sessao = await sessionUsuarioRepository.criar(
      pessoaId,
      expiracao,
      ip,
      userAgent
    );
    return sessao;
  },

  async invalidarSessaoPorPessoaId(pessoaId: string) {
    const sessao = await sessionUsuarioRepository.deleteSessoesPorPessoaId(
      pessoaId
    );
    return sessao;
  },

  async invalidarSessaoRefreshToken(sessaoId: string, refreshToken: string) {
    const sessao = await sessionUsuarioRepository.invalidarSessaoPorId(
      sessaoId
    );

    if (!sessao) {
      throw new Error("Sessão não encontrada ou já foi encerrada");
    }

    await refreshTokenService.revogarRefreshTokenPorSessaoId(sessaoId);
    return sessao;
  },

  async buscarSessaoAtivaPorId(id: string) {
    const sessao = await sessionUsuarioRepository.buscarSessaoAtivaPorId(id);
    return sessao;
  },

  async buscarSessoesAtivasPorPessoaId(pessoaId: string) {
    const sessoes =
      await sessionUsuarioRepository.buscarTodasSessoesAtivasPorPessoaId(
        pessoaId
      );
    return sessoes;
  },

  async atualizarUltimoAcesso(
    sessaoId: string,
    ip?: string,
    userAgent?: string
  ) {
    const sessao = await sessionUsuarioRepository.atualizarUltimoAcesso(
      sessaoId,
      ip,
      userAgent
    );
    return sessao;
  },
};
