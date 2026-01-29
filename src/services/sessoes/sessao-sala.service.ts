import { sessaoSalaRepository } from "../../repositories/sessao-sala.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { salaRepository } from "../../repositories/sala.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { votosRepository } from "../../repositories/votos.repository";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
import { pessoaRepository } from "../../repositories/pessoa.repository";
import emailService from "../mail/mail.service";
import { criptografia } from "../../lib/criptografia";

interface CriarHistoriaDTO {
  titulo: string;
  descricao?: string;
}

export const sessaoSalaService = {
  async criarSessao(
    sala_id: string,
    pessoa_id: string,
    visitantes?: string[],
    historias?: CriarHistoriaDTO[],
  ) {
    // Validar que histórias foram fornecidas
    if (!historias || historias.length === 0) {
      throw new Error(
        "É necessário adicionar pelo menos uma história para iniciar a sessão.",
      );
    }

    // Verificar se a sala existe
    const sala = await salaRepository.obterPorId(sala_id, false);
    if (!sala) {
      throw new Error("Sala não encontrada.");
    }

    // Verificar se o usuário é dono (role 0) ou admin (role 1)
    const isDono = sala.criado_por === pessoa_id;

    let isAdmin = false;
    if (!isDono) {
      const participanteSala =
        await participanteSalaRepository.obterPorSalaEPessoa(
          sala_id,
          pessoa_id,
        );
      isAdmin = participanteSala?.role === 1;
    }

    if (!isDono && !isAdmin) {
      throw new Error("Apenas o dono ou administrador podem criar sessão.");
    }

    // 🔴 CRÍTICO: Usar transação Prisma para evitar race condition
    // Se 2 admins tentarem criar sessão simultaneamente, apenas 1 conseguirá
    const { prismaClient } = await import("../../lib/prisma");

    const novaSessao = await prismaClient.$transaction(async (prisma) => {
      // 1. Verificar se já existe sessão ativa (dentro da transação)
      const sessaoExistente = await prisma.sessaoSala.findFirst({
        where: {
          sala_id,
          ativa: true,
        },
      });

      if (sessaoExistente) {
        throw new Error("Já existe uma sessão ativa para esta sala.");
      }

      // 2. Criar nova sessão
      const sessao = await prisma.sessaoSala.create({
        data: {
          sala_id,
          iniciada_por: pessoa_id,
          ativa: true,
        },
        include: {
          sala: {
            select: {
              id: true,
              codigo: true,
              titulo: true,
              criado_por: true,
            },
          },
        },
      });

      // 3. Criar histórias e vincular à sessão
      if (historias && historias.length > 0) {
        for (const historia of historias) {
          // Criar HistoriaSala
          const historiaCriada = await prisma.historiaSala.create({
            data: {
              sala_id,
              titulo: historia.titulo,
              descricao: historia.descricao || null,
              criado_por: pessoa_id,
            },
          });

          // Criar HistoriaSessao (vinculação)
          await prisma.historiaSessao.create({
            data: {
              sessao_id: sessao.id,
              historia_id: historiaCriada.id,
            },
          });
        }
      }

      return sessao;
    });

    // 1. Criar ParticipanteSessao para TODOS os ParticipanteSala (permanentes)
    const participantesSala =
      await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);

    for (const participante of participantesSala) {
      await participanteSessaoRepository.inserir({
        sessao_id: novaSessao.id,
        pessoa_id: participante.pessoa_id,
        autorizado: true, // Todos permanentes autorizados automaticamente
      });

      // ✅ Marcar como online APENAS quem iniciou a sessão
      if (participante.pessoa_id === pessoa_id) {
        await participanteSalaRepository.alterarParticipanteSalaOnline(
          sala_id,
          pessoa_id,
          true,
        );
      }
    }

    // 2. Criar ParticipanteSessao para visitantes temporários (se fornecidos)
    if (visitantes && visitantes.length > 0) {
      const idsPermantentes = participantesSala.map((p) => p.pessoa_id);

      for (const visitanteId of visitantes) {
        // Não criar se já é participante permanente
        if (!idsPermantentes.includes(visitanteId)) {
          await participanteSessaoRepository.inserir({
            sessao_id: novaSessao.id,
            pessoa_id: visitanteId,
            // Visitantes são autorizados por padrão, caso contrario como entrarão na sala?
            autorizado: true,
          });
        }
      }
    }

    return novaSessao;
  },

  async encerrarSessao(sala_id: string, sessao_id: string, pessoa_id: string) {
    const sessaoAtiva =
      await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);

    if (!sessaoAtiva) {
      throw new Error("Nenhuma sessão ativa encontrada para esta sala.");
    }

    // Verificar se é dono ou admin que INICIOU a sessão
    const isDono = sessaoAtiva.sala.criado_por === pessoa_id;
    const foiIniciadorDaSessao = sessaoAtiva.iniciada_por === pessoa_id;

    let isAdmin = false;
    if (!isDono) {
      const participanteSala =
        await participanteSalaRepository.obterPorSalaEPessoa(
          sala_id,
          pessoa_id,
        );
      isAdmin = participanteSala?.role === 1;
    }

    // Dono pode encerrar qualquer sessão, Admin só pode encerrar se ele iniciou
    if (!isDono && (!isAdmin || !foiIniciadorDaSessao)) {
      throw new Error(
        isDono || isAdmin
          ? "Apenas quem iniciou a sessão pode encerrá-la."
          : "Apenas o dono ou administrador podem encerrar a sessão.",
      );
    }

    // ✅ Desativar sessão e registrar quem encerrou
    await sessaoSalaRepository.desativarSessoesPorSala(sala_id, pessoa_id);

    // ✅ Marcar todos os participantes como offline
    await participanteSalaRepository.marcarTodosOfflinePorSala(sala_id);

    // ✅ Desautorizar todos os ParticipanteSessao
    await participanteSessaoRepository.desautorizarTodosPorSessao(
      sessaoAtiva.id,
    );

    // TODO: Quando implementar Socket.IO, emitir evento:
    // socketService.emitToRoom(sessao_id, 'sessao_encerrada', { encerrado_por: pessoa_id })

    return sessao_id;
  },

  async obterSessaoPorId(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Verificar se o usuário tem acesso à sala
    const sala = await salaRepository.obterPorId(
      sessao.sala.id,
      false,
      pessoa_id,
    );

    if (!sala) {
      throw new Error("Sem permissão para acessar esta sessão.");
    }

    return sessao;
  },

  async obterSessaoAtivaPorSala(sala_id: string) {
    // Buscar sessão ativa sem validação de permissão
    // A permissão é validada no contexto de uso (entrarSala, etc)
    const sessao = await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
    return sessao;
  },

  async adicionarParticipante(
    sessao_id: string,
    pessoa_id: string,
    autorizado: boolean = false,
  ) {
    // Verificar se a sessão existe
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    if (!sessao.ativa) {
      throw new Error("Sessão não está ativa.");
    }

    // Verificar se a pessoa já é participante
    const participanteExistente =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessao_id,
        pessoa_id,
      );

    if (participanteExistente) {
      // Se já existe, apenas atualiza a autorização se necessário
      if (participanteExistente.autorizado !== autorizado) {
        return await participanteSessaoRepository.atualizarAutorizacao(
          sessao_id,
          pessoa_id,
          autorizado,
        );
      }
      return participanteExistente;
    }

    // Adicionar novo participante
    return await participanteSessaoRepository.inserir({
      sessao_id,
      pessoa_id,
      autorizado,
    });
  },

  async revelarVotos(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Verificar se o usuário é o criador da sala
    if (sessao.sala.criado_por !== pessoa_id) {
      throw new Error("Apenas o criador da sala pode revelar os votos.");
    }

    // Atualizar flag de votos revelados na sala
    await sessaoSalaRepository.atualizarVotosRevelados(sessao.sala.id, true);

    return sessao;
  },

  async resetarVotos(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Verificar se o usuário é o criador da sala
    if (sessao.sala.criado_por !== pessoa_id) {
      throw new Error("Apenas o criador da sala pode resetar os votos.");
    }

    // Deletar todos os votos das histórias da sessão
    for (const historiaSessao of sessao.historias) {
      await votosRepository.deletarVotosPorHistoriaSessao(historiaSessao.id);
    }

    // Atualizar flag de votos revelados
    await sessaoSalaRepository.atualizarVotosRevelados(sessao.sala.id, false);

    // Buscar sessão atualizada
    return await sessaoSalaRepository.obterPorId(sessao_id);
  },

  async adicionarVisitantes(
    sala_id: string,
    pessoa_ids: string[],
    dono_id: string,
  ) {
    // Verificar se quem está chamando é o dono
    const sala = await salaRepository.obterPorId(sala_id, false, dono_id);
    if (!sala || sala.criado_por !== dono_id) {
      throw new Error("Apenas o dono da sala pode adicionar visitantes.");
    }

    // Verificar se há sessão ativa
    const sessaoAtiva =
      await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
    if (!sessaoAtiva) {
      throw new Error("Não há sessão ativa para adicionar visitantes.");
    }

    // Buscar participantes permanentes para evitar duplicação
    const permanentes =
      await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);
    const idsPermantentes = permanentes.map((p) => p.pessoa_id);

    // Buscar dados do anfitrião (dono)
    const anfitriao = await pessoaRepository.obterPorId(dono_id, false);
    if (!anfitriao) {
      throw new Error("Anfitrião não encontrado.");
    }

    const participantesCriados = [];

    for (const pessoaId of pessoa_ids) {
      // Não criar se já é participante permanente
      if (idsPermantentes.includes(pessoaId)) {
        continue;
      }

      // Verificar se já existe ParticipanteSessao
      const jaExiste = await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessaoAtiva.id,
        pessoaId,
      );

      if (!jaExiste) {
        const participante = await participanteSessaoRepository.inserir({
          sessao_id: sessaoAtiva.id,
          pessoa_id: pessoaId,
          autorizado: false, // Visitantes não autorizados por padrão
        });
        participantesCriados.push(participante);

        // Buscar dados do visitante para enviar email
        const visitante = await pessoaRepository.obterPorId(pessoaId, false);
        if (visitante && visitante.email) {
          try {
            // Descriptografar dados para o email
            const nomeVisitante = criptografia.descriptografar(visitante.nome);
            const emailVisitante = criptografia.descriptografar(
              visitante.email,
            );
            const nomeAnfitriao = criptografia.descriptografar(anfitriao.nome);

            // Enviar email de convite
            await emailService.sendEmailConviteSessao(
              { nome: nomeVisitante, email: emailVisitante },
              { titulo: sala.titulo, codigo: sala.codigo },
              { nome: nomeAnfitriao },
            );
          } catch (error) {
            console.error(
              `Erro ao enviar email para visitante ${pessoaId}:`,
              error,
            );
            // Não bloqueia a adição do visitante se o email falhar
          }
        }
      }
    }

    return participantesCriados;
  },

  async removerVisitante(sala_id: string, pessoa_id: string, dono_id: string) {
    // Verificar se quem está chamando é o dono
    const sala = await salaRepository.obterPorId(sala_id, false, dono_id);
    if (!sala || sala.criado_por !== dono_id) {
      throw new Error("Apenas o dono da sala pode remover visitantes.");
    }

    // Verificar se há sessão ativa
    const sessaoAtiva =
      await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
    if (!sessaoAtiva) {
      throw new Error("Não há sessão ativa.");
    }

    // Verificar se é realmente visitante (não pode remover permanente)
    const participanteSala =
      await participanteSalaRepository.obterPorSalaEPessoa(sala_id, pessoa_id);
    if (participanteSala) {
      throw new Error(
        "Não é possível remover participante permanente. Use a rota de remoção de participantes.",
      );
    }

    // Remover ParticipanteSessao
    return await participanteSessaoRepository.deletar(
      sessaoAtiva.id,
      pessoa_id,
    );
  },

  /**
   * Kicka um participante da sessão (UPDATE autorizado=false)
   * Admin NÃO pode kickar dono
   *
   * @param sessao_id - ID da sessão
   * @param pessoa_id - ID da pessoa a ser kickada
   * @param solicitante_id - ID de quem está kickando (para validação)
   * @param solicitante_role - Role de quem está kickando (0=Dono, 1=Admin)
   */
  async kickarParticipante(
    sessao_id: string,
    pessoa_id: string,
    solicitante_id: string,
    solicitante_role: 0 | 1 | 2 | 3,
  ) {
    // Validar que quem está kickando é dono ou admin
    if (solicitante_role !== 0 && solicitante_role !== 1) {
      throw new Error(
        "Apenas dono ou administrador podem kickar participantes.",
      );
    }

    // Obter sessão
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new Error("Sessão não encontrada.");
    }

    // Obter sala
    const sala = await salaRepository.obterPorId(sessao.sala_id, false);
    if (!sala) {
      throw new Error("Sala não encontrada.");
    }

    // PROTEÇÃO: Admin não pode kickar dono
    if (solicitante_role === 1 && sala.criado_por === pessoa_id) {
      throw new Error("Administrador não pode remover o dono da sessão.");
    }

    // PROTEÇÃO: Ninguém pode kickar a si mesmo
    if (pessoa_id === solicitante_id) {
      throw new Error("Use a rota 'sair da sessão' para sair voluntariamente.");
    }

    // Verificar se ParticipanteSessao existe
    const participante =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessao_id,
        pessoa_id,
      );

    if (!participante) {
      throw new Error("Participante não encontrado nesta sessão.");
    }

    // UPDATE autorizado = false (kick)
    await participanteSessaoRepository.atualizar(sessao_id, pessoa_id, {
      autorizado: false,
    });

    // TODO: Quando implementar Socket.IO, emitir evento:
    // socketService.emitToUser(pessoa_id, 'participante_kickado', { sessao_id })

    return {
      sucesso: true,
      mensagem: "Participante removido da sessão com sucesso.",
    };
  },

  /**
   * Atualizar flag participa_votacao do participante na sessão
   * Usado quando Donos/Admin alternam o toggle de participação
   */
  async atualizarParticipaVotacao(
    sessao_id: string,
    pessoa_id: string,
    participa_votacao: boolean,
  ) {
    // Verificar se ParticipanteSessao existe
    const participante =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessao_id,
        pessoa_id,
      );

    if (!participante) {
      throw new Error("Participante não encontrado nesta sessão.");
    }

    // Atualizar flag participa_votacao
    const participanteAtualizado = await participanteSessaoRepository.atualizar(
      sessao_id,
      pessoa_id,
      { participa_votacao },
    );

    return participanteAtualizado;
  },

  /**
   * Obter votos de uma história específica dentro de uma sessão
   * Usado para carregar votos ao alternar entre histórias
   */
  async obterVotosPorHistoria(sessao_id: string, historia_id: string) {
    // Buscar HistoriaSessao para obter os votos
    const historiaSessao =
      await historiaSessaoRepository.obterPorSessaoEHistoria(
        sessao_id,
        historia_id,
      );

    if (!historiaSessao) {
      // Se não existe HistoriaSessao, retornar array vazio (história ainda não tem votos)
      return [];
    }

    // Buscar votos da HistoriaSessao
    const votos = await votosRepository.obterVotosPorHistoriaSessao(
      historiaSessao.id,
    );

    // Formatar votos com dados descriptografados
    return votos.map((voto) => ({
      id: voto.id,
      pessoa_id: voto.pessoa_id,
      valor: voto.valor,
      pessoa: {
        nome: criptografia.descriptografar(voto.pessoa.nome),
        inativo: voto.pessoa.inativo,
      },
    }));
  },
};
