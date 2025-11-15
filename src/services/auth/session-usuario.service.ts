import { sessionUsuarioRepository } from "../../repositories/session-usuario.repository";

export const sessionUsuarioService = {
  async criarSessao(usuarioId: string, expiracao: Date) {
    const sessao = await sessionUsuarioRepository.criar(usuarioId, expiracao);
    return sessao;
  },

  async invalidarSessao(usuarioId: string) {
    const sessao = await sessionUsuarioRepository.invalidarSessoesAtivas(
      usuarioId
    );
    return sessao;
  },

  async buscarSessaoAtiva(usuarioId: string) {
    const sessao = await sessionUsuarioRepository.buscarSessao(usuarioId);
    return sessao;
  },
};
