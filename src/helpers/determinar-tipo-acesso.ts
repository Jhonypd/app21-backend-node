import { participanteSalaRepository } from "../repositories/participante-sala.repository";
import { participanteSessaoRepository } from "../repositories/participante-sessao.repository";

interface Sala {
  id: string;
  criado_por: string;
  sessoes?: Array<{ id: string; ativa?: boolean; criada_em?: Date }>;
}

/**
 * Determina o tipo de acesso de um usuário a uma sala
 * @param sala - Objeto da sala com sessões
 * @param pessoaId - ID da pessoa
 * @returns 0 (Dono) | 1 (Administrador) | 2 (Participante) | 3 (Visitante) | null (Sem acesso)
 */
export async function determinarTipoAcesso(
  sala: Sala,
  pessoaId: string
): Promise<0 | 1 | 2 | 3 | null> {
  // TIPO 0: Dono da sala (sempre tem prioridade)
  if (sala.criado_por === pessoaId) {
    return 0;
  }

  // Verificar se tem ParticipanteSala (participante permanente)
  const participanteSala = await participanteSalaRepository.obterPorSalaEPessoa(
    sala.id,
    pessoaId
  );

  if (participanteSala) {
    // TIPO 1: Administrador (tipo = 1 em ParticipanteSala)
    if (participanteSala.tipo === 1) {
      return 1;
    }
    // TIPO 2: Participante fixo (tipo = 2 em ParticipanteSala)
    if (participanteSala.tipo === 2) {
      return 2;
    }
  }

  // TIPO 3: Visitante (tem ParticipanteSessao mas NÃO tem ParticipanteSala)
  const sessaoAtiva =
    sala.sessoes?.find((s) => s.ativa !== false) || sala.sessoes?.[0];
  if (sessaoAtiva) {
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessaoAtiva.id,
        pessoaId
      );

    // Visitante = tem ParticipanteSessao MAS não tem ParticipanteSala
    if (participanteSessao) {
      return 3;
    }
  }

  // Sem acesso
  return null;
}
