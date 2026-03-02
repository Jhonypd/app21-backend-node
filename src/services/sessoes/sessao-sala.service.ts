import { sessaoSalaRepository } from "../../repositories/sessao-sala.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { salaRepository } from "../../repositories/sala.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { votosRepository } from "../../repositories/votos.repository";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
import { pessoaRepository } from "../../repositories/pessoa.repository";
import emailService from "../mail/mail.service";
import { criptografia } from "../../lib/criptografia";
import { obterVotosVencedoresHistoria } from "../../utils/voto-vencedor-historia";
import { AppError } from "../../lib/errorHandler";

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
      throw new AppError(
        "É necessário adicionar pelo menos uma história para iniciar a sessão.",
      );
    }

    // Verificar se a sala existe
    const sala = await salaRepository.obterPorId(sala_id, false);
    if (!sala) {
      throw new AppError("Sala não encontrada.");
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
      throw new AppError("Apenas o dono ou administrador podem criar sessão.");
    }

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
        throw new AppError("Já existe uma sessão ativa para esta sala.");
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
    // Todos começam com online: false, exceto quem inicia a sessão
    const participantesSala =
      await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);

    for (const participante of participantesSala) {
      await participanteSessaoRepository.inserir({
        sessao_id: novaSessao.id,
        pessoa_id: participante.pessoa.id,
        autorizado: true,
        // ✅ Quem inicia a sessão já entra online
        online: participante.pessoa.id === pessoa_id,
      });
    }

    // 2. Criar ParticipanteSessao para visitantes temporários (se fornecidos)
    if (visitantes && visitantes.length > 0) {
      const idsPermantentes = participantesSala.map((p) => p.pessoa.id);

      for (const visitanteId of visitantes) {
        // Não criar se já é participante permanente
        if (!idsPermantentes.includes(visitanteId)) {
          await participanteSessaoRepository.inserir({
            sessao_id: novaSessao.id,
            pessoa_id: visitanteId,
            // Visitantes são autorizados por padrão, caso contrario como entrarão na sala?
            autorizado: true,
            online: false,
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
      throw new AppError("Nenhuma sessão ativa encontrada para esta sala.");
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
      throw new AppError(
        isDono || isAdmin
          ? "Apenas quem iniciou a sessão pode encerrá-la."
          : "Apenas o dono ou administrador podem encerrar a sessão.",
      );
    }

    // Desativar sessão e registrar quem encerrou
    await sessaoSalaRepository.desativarSessoesPorSala(sala_id, pessoa_id);

    // ✅ Marcar todos os participantes da sessão como offline
    await participanteSessaoRepository.marcarTodosOfflinePorSessao(
      sessaoAtiva.id,
    );

    //  Desautorizar todos os ParticipanteSessao
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
      throw new AppError("Sessão não encontrada.");
    }

    // Verificar se o usuário tem acesso à sala
    const sala = await salaRepository.obterPorId(
      sessao.sala.id,
      false,
      pessoa_id,
    );

    if (!sala) {
      throw new AppError("Sem permissão para acessar esta sessão.");
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
      throw new AppError("Sessão não encontrada.");
    }

    if (!sessao.ativa) {
      throw new AppError("Sessão não está ativa.");
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
      throw new AppError("Sessão não encontrada.");
    }

    // Verificar se o usuário é o criador da sala
    if (sessao.sala.criado_por !== pessoa_id) {
      throw new AppError("Apenas o criador da sala pode revelar os votos.");
    }

    // Atualizar flag de votos revelados na sala
    await sessaoSalaRepository.atualizarVotosRevelados(sessao.sala.id, true);

    return sessao;
  },

  async resetarVotos(sessao_id: string, pessoa_id: string) {
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);

    if (!sessao) {
      throw new AppError(
        "Sessão não encontrada para os votos serem resetados.",
      );
    }

    // Verificar se o usuário é o criador da sala OU iniciador da sessão
    if (
      sessao.sala.criado_por !== pessoa_id &&
      sessao.iniciada_por !== pessoa_id
    ) {
      throw new AppError(
        "Apenas donos e iniciadores da sessão podem resetar os votos.",
      );
    }

    // Validar que existe uma história atual selecionada
    if (!sessao.sala.historia_atual_id) {
      throw new AppError(
        "Nenhuma história atual selecionada para resetar votos.",
      );
    }

    // Buscar a HistoriaSessao correspondente à história atual
    const historiaSessaoAtual = sessao.historias?.find(
      (hs) => hs.historia.id === sessao.sala.historia_atual_id,
    );

    if (!historiaSessaoAtual) {
      throw new AppError("A história atual não está vinculada a esta sessão.");
    }

    // Deletar apenas os votos da história atual da sessão
    await votosRepository.deletarVotosPorHistoriaSessao(
      historiaSessaoAtual.id,
      historiaSessaoAtual.historia.id,
    );

    // Atualizar flag de votos revelados
    await sessaoSalaRepository.atualizarVotosRevelados(sessao.sala.id, false);

    return {
      sessao: sessao.sala.titulo,
    };
  },

  async adicionarVisitantes(
    sala_id: string,
    pessoa_ids: string[],
    solicitante_id: string,
  ) {
    // Verificar se quem está chamando é dono ou admin
    const sala = await salaRepository.obterPorId(
      sala_id,
      false,
      solicitante_id,
    );
    if (!sala) {
      throw new AppError("Sala não encontrada.");
    }

    const isDono = sala.criado_por === solicitante_id;
    if (!isDono) {
      const participanteSolicitante =
        await participanteSalaRepository.obterPorSalaEPessoa(
          sala_id,
          solicitante_id,
        );
      const isAdmin = participanteSolicitante?.role === 1;
      if (!isAdmin) {
        throw new AppError(
          "Apenas o dono ou administradores podem adicionar visitantes.",
        );
      }
    }

    // Verificar se há sessão ativa
    const sessaoAtiva =
      await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
    if (!sessaoAtiva) {
      throw new AppError("Não há sessão ativa para adicionar visitantes.");
    }

    // Buscar participantes permanentes para evitar duplicação
    const permanentes =
      await participanteSalaRepository.obterTodosParticipantesPorSala(sala_id);
    const idsPermantentes = permanentes.map((p) => p.pessoa.id);

    // Buscar dados do anfitrião (solicitante)
    const anfitriao = await pessoaRepository.obterPorId(solicitante_id, false);
    if (!anfitriao) {
      throw new AppError("Anfitrião não encontrado.");
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
          autorizado: true, // Visitantes adicionados pelo dono/admin são autorizados
          online: false, // Visitantes começam offline
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

  async removerVisitante(
    sala_id: string,
    pessoa_id: string,
    solicitante_id: string,
  ) {
    // Verificar se quem está chamando é dono ou admin
    const sala = await salaRepository.obterPorId(
      sala_id,
      false,
      solicitante_id,
    );
    if (!sala) {
      throw new AppError("Sala não encontrada.");
    }

    const isDono = sala.criado_por === solicitante_id;
    if (!isDono) {
      const participanteSolicitante =
        await participanteSalaRepository.obterPorSalaEPessoa(
          sala_id,
          solicitante_id,
        );
      const isAdmin = participanteSolicitante?.role === 1;
      if (!isAdmin) {
        throw new AppError(
          "Apenas o dono ou administradores podem remover visitantes.",
        );
      }
    }

    // Verificar se há sessão ativa
    const sessaoAtiva =
      await sessaoSalaRepository.obterSessaoAtivaPorSala(sala_id);
    if (!sessaoAtiva) {
      throw new AppError("Não há sessão ativa.");
    }

    // Verificar se é realmente visitante (não pode remover permanente)
    const participanteSala =
      await participanteSalaRepository.obterPorSalaEPessoa(sala_id, pessoa_id);
    if (participanteSala) {
      throw new AppError(
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
      throw new AppError(
        "Apenas dono ou administrador podem kickar participantes.",
      );
    }

    // Obter sessão
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new AppError("Sessão não encontrada.");
    }

    // Obter sala
    const sala = await salaRepository.obterPorId(sessao.sala_id, false);
    if (!sala) {
      throw new AppError("Sala não encontrada.");
    }

    // PROTEÇÃO: Admin não pode kickar dono
    if (solicitante_role === 1 && sala.criado_por === pessoa_id) {
      throw new AppError("Administrador não pode remover o dono da sessão.");
    }

    // PROTEÇÃO: Ninguém pode kickar a si mesmo
    if (pessoa_id === solicitante_id) {
      throw new AppError(
        "Use a rota 'sair da sessão' para sair voluntariamente.",
      );
    }

    // Verificar se ParticipanteSessao existe
    const participante =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessao_id,
        pessoa_id,
      );

    if (!participante) {
      throw new AppError("Participante não encontrado nesta sessão.");
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
      throw new AppError("Participante não encontrado nesta sessão.");
    }

    // Atualizar flag participa_votacao
    const participanteAtualizado = await participanteSessaoRepository.atualizar(
      sessao_id,
      pessoa_id,
      { participa_votacao },
    );

    return participanteAtualizado.autorizado;
  },

  /**
   * Lista todas as histórias vinculadas a uma sessão
   * Retorna formatado com jaFoiVotada, historiaAtual e voto (vencedores)
   */
  async listarHistoriasPorSessao(sessao_id: string) {
    if (!sessao_id) {
      throw new AppError("Id da sessão é obrigatório");
    }

    // Buscar sessão para obter sala_id e historia_atual_id
    const sessao = await sessaoSalaRepository.obterPorId(sessao_id);
    if (!sessao) {
      throw new AppError("Sessão não encontrada");
    }

    const historiaAtualId = sessao.sala.historia_atual_id;

    // Buscar histórias da sessão com votos
    const historiasSessao =
      await historiaSessaoRepository.listarPorSessao(sessao_id);

    return historiasSessao.map((hs) => ({
      id: hs.historia.id,
      titulo: hs.historia.titulo,
      descricao: hs.historia.descricao,
      jaFoiVotada: hs.votos.length > 0,
      historiaAtual: hs.historia.id === historiaAtualId,
      voto: obterVotosVencedoresHistoria(
        hs.votos.reduce(
          (acc, voto) => {
            acc[voto.valor] = (acc[voto.valor] || 0) + 1;
            return acc;
          },
          {} as Record<number, number>,
        ),
      ),
    }));
  },

  /**
   * Adiciona história durante sessão ativa
   * Cria a história e vincula automaticamente à sessão ativa da sala
   */
  async adicionarHistoriaDuranteSessao(dados: {
    sala_id: string;
    titulo: string;
    descricao?: string | null;
    criado_por: string;
  }) {
    const { historiaSalaRepository } =
      await import("../../repositories/historia-sala.repository");

    // Verificar se sala existe e tem sessão ativa
    const sala = await salaRepository.obterPorId(dados.sala_id, false);
    if (!sala) {
      throw new AppError("Sala não encontrada");
    }

    if (sala.sessoes.length === 0) {
      throw new AppError("Sala não possui sessão ativa");
    }

    // Criar história
    const historia = await historiaSalaRepository.criar(dados);

    // Vincular à sessão ativa
    await historiaSessaoRepository.inserir({
      sessao_id: sala.sessoes[0].id,
      historia_id: historia.id,
    });

    return historia;
  },

  /**
   * Obter votos de uma história específica dentro de uma sessão
   */
  async obterVotosPorHistoriaSessao(sessao_id: string, historia_id: string) {
    // Buscar HistoriaSessao para obter os votos
    const historiaSessao =
      await historiaSessaoRepository.obterPorSessaoEHistoria(
        sessao_id,
        historia_id,
      );

    if (!historiaSessao) {
      // Se não existe HistoriaSessao, retornar array vazio (história ainda não tem votos)
      return { media: 0, voto_vencedor: 0, votos: [] };
    }

    // Buscar votos da HistoriaSessao
    const votos = await votosRepository.obterVotosPorHistoriaSessao(
      historiaSessao.id,
    );

    const contagemVotos = votos.reduce(
      (acc, voto) => {
        acc[voto.valor] = (acc[voto.valor] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    const calculaVotoVencedorHistoria =
      obterVotosVencedoresHistoria(contagemVotos);

    const votosValidos = votos
      .map((v) => Number(v.valor))
      .filter(Number.isFinite);
    const media = votosValidos.length
      ? Number(
          (
            votosValidos.reduce((a, b) => a + b, 0) / votosValidos.length
          ).toFixed(1),
        )
      : null;

    // Formatar votos com dados descriptografados
    return {
      media: media,
      voto_vencedor: calculaVotoVencedorHistoria[0],
      votos: votos.map((voto) => ({
        id: voto.id,
        pessoa_id: voto.pessoa_id,
        valor: voto.valor,
        pessoa: {
          nome: criptografia.descriptografar(voto.pessoa.nome),
          inativo: voto.pessoa.inativo,
        },
      })),
    };
  },
};
