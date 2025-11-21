import { participanteSalaRepository } from "../repositories/participante-sala.repository";
import { participanteSessaoRepository } from "../repositories/participante-sessao.repository";

interface Sala {
  id: string;
  criado_por: string;
  sessoes?: Array<{ id: string; ativa?: boolean; criada_em?: Date }>;
}

/**
 * Determina o tipo de acesso de um usuário a uma sala (4 NÍVEIS)
 * @param sala - Objeto da sala com sessões
 * @param pessoaId - ID da pessoa
 * @returns 0 (Dono) | 1 (Admin) | 2 (Membro) | 3 (Visitante) | null (Sem acesso)
 *
 * - Tipo 0: Criador da sala (sala.criado_por === pessoaId)
 * - Tipo 1: Administrador (ParticipanteSala.role === 1)
 * - Tipo 2: Membro (ParticipanteSala.role === 2)
 * - Tipo 3: Visitante (tem ParticipanteSessao mas NÃO tem ParticipanteSala)
 * - null: Não se enquadra em nenhum tipo acima
 */
export async function determinarTipoAcesso(
  sala: Sala,
  pessoaId: string
): Promise<0 | 1 | 2 | 3 | null> {
  // TIPO 0: Dono da sala (sempre tem prioridade máxima)
  if (sala.criado_por === pessoaId) {
    return 0;
  }

  // Verificar se tem ParticipanteSala (participante permanente)
  const participanteSala = await participanteSalaRepository.obterPorSalaEPessoa(
    sala.id,
    pessoaId
  );

  if (participanteSala) {
    // TIPO 1: Administrador (role = 1)
    if (participanteSala.role === 1) {
      return 1;
    }

    // TIPO 2: Membro/Participante Fixo (role = 2)
    if (participanteSala.role === 2) {
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
    if (participanteSessao && !participanteSala) {
      return 3;
    }
  }

  // Sem acesso
  return null;
}
