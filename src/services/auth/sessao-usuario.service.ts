import { sessionUsuarioRepository } from "../../repositories/sessao-usuario.repository";

export const sessaoUsuarioService = {
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
