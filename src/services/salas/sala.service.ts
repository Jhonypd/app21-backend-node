import { hash } from "../../lib/hash";
import { salaRepository } from "../../repositories/sala.repository";
import { criptografia } from "../../lib/criptografia";
import { addHours, format } from "date-fns";
import { ClaimsAuthSala, geradorTokenSala } from "../../lib/jwt";
import { ptBR } from "date-fns/locale";
import { participanteSalaService } from "../participantes/participante-sala.service";
import { sessaoSalaService } from "../sessoes/sessao-sala.service";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { pessoaRepository } from "../../repositories/pessoa.repository";
import { determinarTipoAcesso } from "../../helpers/determinar-tipo-acesso";
import { sessaoSalaRepository } from "../../repositories/sessao-sala.repository";
import { votosRepository } from "../../repositories/votos.repository";

interface CriarSalaProps {
  pessoaId: string;
  titulo: string;
  senha?: string | null;
  salaPrivada: boolean;
  participantesIds?: string[];
}

export interface AlterarSalaProps {
  titulo?: string;
  senha?: string | null;
}

export const salaService = {
  async geradorCodigoUnico(tamanho: number = 6): Promise<string> {
    if (tamanho < 2) {
      throw new Error(
        "O tamanho mínimo deve ser 2 para conter letras e números."
      );
    }

    const LETRAS = "ABCDEFGHJKMNPQRSTUVWXYZ";
    const NUMEROS = "23456789";
    const TODOS = LETRAS + NUMEROS;

    const resultado: string[] = [];

    // Garante pelo menos uma letra
    resultado.push(LETRAS[Math.floor(Math.random() * LETRAS.length)]);

    // Garante pelo menos um número
    resultado.push(NUMEROS[Math.floor(Math.random() * NUMEROS.length)]);

    // Preenche o restante
    for (let i = 2; i < tamanho; i++) {
      resultado.push(TODOS[Math.floor(Math.random() * TODOS.length)]);
    }

    // Embaralha para evitar padrão previsível
    for (let i = resultado.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }

    return resultado.join("");
  },
  async inserir({
    titulo,
    senha,
    salaPrivada,
    pessoaId,
    participantesIds,
  }: CriarSalaProps) {
    const MAX_TENTATIVAS = 3;

    if (salaPrivada && !senha) {
      throw new Error("Senha é obrigatória para salas privadas.");
    }

    let hashedSenha: string | null = null;

    if (senha) {
      hashedSenha = await hash.senha(senha);
    }
    for (let i = 0; i < MAX_TENTATIVAS; i++) {
      const codigo = await this.geradorCodigoUnico();

      try {
        const novaSala = await salaRepository.inserir({
          codigo,
          titulo,
          senha: hashedSenha,
          criado_por: pessoaId,
        });

        // Dono é adicionado automaticamente como ParticipanteSala (role 0)
        if (novaSala) {
          await participanteSalaService.adicionarParticipanteASala(
            novaSala.id,
            pessoaId,
            0
          );

          // Adicionar participantes permanentes (role 2 = Membro)
          if (participantesIds && participantesIds.length > 0) {
            for (const participanteId of participantesIds) {
              if (participanteId !== pessoaId) {
                // Não adicionar o dono novamente
                try {
                  await participanteSalaService.adicionarParticipanteASala(
                    novaSala.id,
                    participanteId,
                    2 // role 2 = Membro
                  );
                } catch (error) {
                  // Ignora erro se participante já existe ou não foi encontrado
                  console.error(
                    `Erro ao adicionar participante ${participanteId}:`,
                    error
                  );
                }
              }
            }
          }
        }

        return novaSala.id;
      } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target?.includes("codigo")) {
          continue;
        }

        throw error;
      }
    }
    throw new Error("Chave única não pôde ser gerada. Tente novamente.");
  },

  async alterar(id: string, pessoaId: string, data: AlterarSalaProps) {
    if (!data.senha && !data.titulo) {
      throw new Error("Dados para alteração não fornecidos.");
    }

    const salaExistente = await salaRepository.obterPorId(id, true, pessoaId);

    if (!salaExistente) {
      throw new Error("Sala não encontrada.");
    }

    // Validar permissões: apenas dono (criado_por) pode alterar
    if (salaExistente.criado_por !== pessoaId) {
      // Verificar se é Admin (role=1) - pode alterar apenas título
      const participante = await participanteSalaRepository.obterPorSalaEPessoa(
        id,
        pessoaId
      );

      if (!participante || participante.role !== 1) {
        throw new Error("Você não tem permissão para alterar esta sala.");
      }

      // Admin só pode alterar título
      if (data.senha) {
        throw new Error("Apenas o dono pode alterar a senha da sala.");
      }
    }

    const dadosParaAtualizar: AlterarSalaProps = {};

    if (data.titulo) {
      dadosParaAtualizar.titulo = data.titulo;
    }

    // Validar senha: se sala tinha senha, nova senha é obrigatória (não pode remover)
    if (data.senha !== undefined) {
      if (salaExistente.senha && !data.senha) {
        throw new Error(
          "Não é possível remover a senha de uma sala privada. Defina uma nova senha."
        );
      }

      if (data.senha && data.senha.length > 0) {
        if (data.senha.length < 6) {
          throw new Error("A senha deve ter no mínimo 6 caracteres.");
        }
        dadosParaAtualizar.senha = await hash.senha(data.senha);
      }
    }

    const salaAtualizada = await salaRepository.alterar(
      id,
      pessoaId,
      dadosParaAtualizar
    );

    return salaAtualizada;
  },

  async listar(
    pessoaId: string,
    pagina: number,
    itensPagina: number,
    valorPesquisa?: string
  ) {
    if (!pessoaId) {
      throw new Error("Id da pessoa é obrigatório");
    }

    const salas = await salaRepository.listarTodos(
      pessoaId,
      pagina,
      itensPagina,
      valorPesquisa
    );
    const salaFormatada = salas.map((sala: any) => {
      // Determinar o role do usuário atual na sala
      const meuRole =
        sala.criado_por === pessoaId
          ? 0 // Dono
          : sala.participantes[0]?.role ?? null; // Admin(1), Membro(2) ou null (já filtrado por pessoaId no repository)

      // Verificar se tem sessão ativa
      const temSessaoAtiva =
        sala.sessoes && sala.sessoes.length > 0 && sala.sessoes[0].ativa;
      const ultimaSessaoAtiva =
        sala.sessoes.length > 0 ? sala.sessoes[0] : null;

      return {
        id: sala.id,
        titulo: sala.titulo,
        codigo: sala.codigo,
        inativo: sala.inativo,
        salaPrivada: !!sala.senha,
        data_criacao: sala.data_criacao,
        proprietario: {
          id: sala.proprietario.id,
          nome: criptografia.descriptografar(sala.proprietario.nome),
          inativo: sala.proprietario.inativo,
        },
        membros: sala._count.participantes,
        meuRole,
        temSessaoAtiva,
        status: temSessaoAtiva ? "online" : "offline",
        data_ultima_sessao: temSessaoAtiva
          ? ultimaSessaoAtiva.criada_em
          : ultimaSessaoAtiva.data_encerramento,
      };
    });
    return salaFormatada;
  },

  async obterPorCodigo(codigo: string, pessoaId: string) {
    // Busca apenas dados básicos da sala sem sessões (usado para listar salas)
    const sala = await salaRepository.obterPorCodigo(codigo, false, pessoaId);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Remove senha da resposta
    const { senha, ...restante } = sala;

    return {
      ...restante,
      proprietario: {
        ...sala.proprietario,
        nome: criptografia.descriptografar(sala.proprietario.nome),
      },
      participantes: [
        ...sala.participantes.map((participante) => {
          return {
            ...participante.pessoa,
            nome: criptografia.descriptografar(participante.pessoa.nome),
            role: participante.role, // Inclui role (0=Dono, 1=Admin, 2=Membro)
          };
        }),
      ],
      historias: sala.historias || [],
      votos: [],
    };
  },

  async obterPorId(id: string, pessoaId: string) {
    const sala = await salaRepository.obterPorId(id, true, pessoaId);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Coletar todos os votos das sessões ativas
    const votos =
      sala.sessoes?.flatMap(
        (sessao) =>
          sessao.historias?.flatMap(
            (historia) =>
              historia.votos?.map((voto) => ({
                ...voto,
                pessoa: {
                  nome: criptografia.descriptografar(voto.pessoa.nome),
                  inativo: voto.pessoa.inativo,
                },
              })) || []
          ) || []
      ) || [];

    return {
      ...sala,
      proprietario: {
        ...sala.proprietario,
        nome: criptografia.descriptografar(sala.proprietario.nome),
      },
      participantes: [
        ...sala.participantes.map((participante) => ({
          ...participante.pessoa,
          nome: criptografia.descriptografar(participante.pessoa.nome),
        })),
        {
          ...sala.proprietario,
          nome: criptografia.descriptografar(sala.proprietario.nome),
        },
      ],
      votos,
      sessaoAtiva: sala.sessoes?.[0] || null,
    };
  },

  async obterDadosSessaoAtiva(codigo: string, pessoaId: string) {
    // Busca sala com sessão ativa e todos os dados relacionados
    // undefined = não filtra por criador (permite participantes acessarem)
    const sala = await salaRepository.obterPorCodigo(codigo, true, undefined);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Buscar sessão ativa
    const sessaoAtiva = sala.sessoes?.find((s) => s.ativa);

    if (!sessaoAtiva) {
      throw new Error("Nenhuma sessão ativa encontrada para esta sala");
    }

    // Filtrar histórias pela sessão ativa
    const historiasAtivas =
      sessaoAtiva.historias?.map((historiaSessao) => ({
        id: historiaSessao.historia.id,
        titulo: historiaSessao.historia.titulo,
        descricao: historiaSessao.historia.descricao,
      })) || [];

    // Buscar votos apenas da história ATUAL (historia_atual_id)
    const historiaAtualSessao = sessaoAtiva.historias?.find(
      (hs) => hs.historia.id === sala.historia_atual_id
    );

    const votosHistoriaAtual =
      historiaAtualSessao?.votos?.map((voto) => ({
        id: voto.id,
        pessoa_id: voto.pessoa_id,
        valor: voto.valor,
        pessoa: {
          nome: criptografia.descriptografar(voto.pessoa.nome),
          inativo: voto.pessoa.inativo,
        },
      })) || [];

    // ✅ Juntar participantes permanentes + visitantes
    const participantes: Array<{
      id: string;
      nome: string;
      inativo: boolean;
      role: number;
      online: boolean;
      participa_votacao?: boolean;
    }> = [];

    // Criar mapa de participa_votacao dos ParticipanteSessao
    const participaVotacaoMap = new Map<string, boolean>();
    sessaoAtiva.participantes?.forEach((ps) => {
      participaVotacaoMap.set(ps.pessoa.id, ps.participa_votacao ?? true);
    });

    // 1. Adicionar participantes PERMANENTES (têm ParticipanteSala)
    sala.participantes.forEach((participante) => {
      participantes.push({
        id: participante.pessoa.id,
        nome: criptografia.descriptografar(participante.pessoa.nome),
        inativo: participante.pessoa.inativo,
        role: participante.role, // 0=Dono, 1=Admin, 2=Membro
        online: participante.online, // Status real do ParticipanteSala
        participa_votacao: participaVotacaoMap.get(participante.pessoa.id),
      });
    });

    // 2. Adicionar VISITANTES (apenas ParticipanteSessao)
    // Buscar IDs dos permanentes para filtrar
    const idsParticipantesPermanentes = sala.participantes.map(
      (p) => p.pessoa.id
    );

    // Buscar visitantes da sessão ativa (excluir permanentes)
    sessaoAtiva.participantes?.forEach((participanteSessao) => {
      // Se NÃO é permanente, é visitante
      if (!idsParticipantesPermanentes.includes(participanteSessao.pessoa.id)) {
        participantes.push({
          id: participanteSessao.pessoa.id,
          nome: criptografia.descriptografar(participanteSessao.pessoa.nome),
          inativo: participanteSessao.pessoa.inativo,
          role: 3, // Visitante sempre role 3
          online: true, // Visitante sempre online (se está na sessão ativa)
          participa_votacao: participanteSessao.participa_votacao ?? true,
        });
      }
    });

    return {
      id: sala.id,
      codigo: sala.codigo,
      titulo: sala.titulo,
      criado_por: sala.criado_por,
      inativo: sala.inativo,
      historia_atual_id: sala.historia_atual_id,
      votos_revelados: sala.votos_revelados,
      proprietario: {
        ...sala.proprietario,
        nome: criptografia.descriptografar(sala.proprietario.nome),
      },
      participantes, // Lista unificada (permanentes + visitantes)
      historias: historiasAtivas, // Lista de histórias da sessão (sem votos dentro)
      votos: votosHistoriaAtual, // Apenas votos da história atual
      sessaoAtiva: {
        id: sessaoAtiva.id,
        criada_em: sessaoAtiva.criada_em,
        ativa: sessaoAtiva.ativa,
        iniciada_por: sessaoAtiva.iniciada_por,
      },
    };
  },

  async entrarSala(
    codigo: string,
    pessoaId: string,
    sessaoPessoaId: string,
    senha?: string
  ) {
    // Validações iniciais
    if (!pessoaId) throw new Error("Id da pessoa não fornecido.");
    if (!codigo) throw new Error("Código da sala não fornecido.");
    if (!sessaoPessoaId)
      throw new Error("Id da sessão do usuário não fornecido.");

    // Buscar sala com sessões ativas (sem filtro de criador para permitir visitantes)
    const sala = await salaRepository.obterPorCodigo(codigo, true, undefined);

    if (!sala) {
      throw new Error("Sala não encontrada.");
    }

    // Determinar tipo de acesso (0=Dono, 1=Admin, 2=Membro, 3=Visitante, null=Sem acesso)
    const tipoAcesso = await determinarTipoAcesso(sala, pessoaId);

    if (tipoAcesso === null) {
      throw new Error("Você não tem permissão para acessar esta sala.");
    }

    // Validar senha (exceto para dono)
    if (sala.senha && tipoAcesso > 1) {
      if (!senha) {
        throw new Error("Informe a senha para acessar a sala.");
      }
      const senhaValida = await hash.compare(senha, sala.senha);
      if (!senhaValida) {
        throw new Error("Senha informada inválida.");
      }
    }

    // Obter sessão ativa (sem filtro de pessoa - busca apenas por sala_id)
    let sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(sala.id);

    // TIPO 0 (Dono) ou TIPO 1 (Admin): Requer sessão ativa
    if (tipoAcesso === 0 || tipoAcesso === 1) {
      // ✅ Sessão deve ser criada via rota separada (POST /salas/:id/sessoes)
      // Não criamos automaticamente aqui para evitar race conditions
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new Error("Não há sessão ativa. Inicie uma sessão primeiro.");
      }

      // Verificar ParticipanteSessao
      const participanteSessao =
        await participanteSessaoRepository.obterPorSessaoEPessoa(
          sessaoAtiva.id,
          pessoaId
        );

      // Se não tem ParticipanteSessao, criar (caso excepcional)
      if (!participanteSessao) {
        await participanteSessaoRepository.inserir({
          sessao_id: sessaoAtiva.id,
          pessoa_id: pessoaId,
          autorizado: true,
        });
      }
      // ✅ NOVA LÓGICA: Ao sair, mantemos autorizado=true
      // Então dono/admin podem entrar e sair livremente
      // Apenas verificar se foi kickado/banido (autorizado=false)
      else if (!participanteSessao.autorizado) {
        // Se foi kickado/banido, não pode reentrar sem aprovação
        throw new Error(
          "REQUER_APROVACAO:Você foi removido desta sessão. Aguarde aprovação do administrador para reentrar."
        );
      }

      // ✅ Marca como online em ParticipanteSala
      const participanteSala =
        await participanteSalaRepository.obterPorSalaEPessoa(sala.id, pessoaId);
      if (participanteSala) {
        await participanteSalaRepository.alterarParticipanteSalaOnline(
          sala.id,
          pessoaId,
          true
        );
      }
    }
    // TIPO 2 (Membro): Requer sessão ativa
    else if (tipoAcesso === 2) {
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new Error(
          "Não há sessão ativa no momento. Aguarde o dono ou admin iniciar uma sessão."
        );
      }

      // Verificar ParticipanteSessao
      const participanteSessao =
        await participanteSessaoRepository.obterPorSessaoEPessoa(
          sessaoAtiva.id,
          pessoaId
        );

      // Se não tem ParticipanteSessao ainda, cria (primeira entrada na sessão)
      if (!participanteSessao) {
        await participanteSessaoRepository.inserir({
          sessao_id: sessaoAtiva.id,
          pessoa_id: pessoaId,
          autorizado: true,
        });
      }
      // ✅ NOVA LÓGICA: Se já tem, apenas verifica se foi kickado
      else if (!participanteSessao.autorizado) {
        // Se foi kickado/banido, não pode reentrar sem aprovação
        throw new Error(
          "REQUER_APROVACAO:Você foi removido desta sessão. Aguarde aprovação do administrador para reentrar."
        );
      }
      // Se já tem e está autorizado, pode entrar (saiu temporariamente)

      // Marca como online em ParticipanteSala
      const participanteSala =
        await participanteSalaRepository.obterPorSalaEPessoa(sala.id, pessoaId);
      if (participanteSala) {
        await participanteSalaRepository.alterarParticipanteSalaOnline(
          sala.id,
          pessoaId,
          true
        );
      }
    }
    // TIPO 3 (Visitante): Requer sessão ativa E ParticipanteSessao pré-existente
    else if (tipoAcesso === 3) {
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new Error("Não há sessão ativa no momento.");
      }

      // Visitante já tem ParticipanteSessao (criado pelo dono/admin)
      // Validado em determinarTipoAcesso - se chegou aqui, tem permissão
      // Não marca online em ParticipanteSala pois visitante não tem
    }

    // Buscar informações da pessoa
    const pessoa = await pessoaRepository.obterPorId(pessoaId, false);
    if (!pessoa) throw new Error("Pessoa não encontrada.");

    // Gerar token
    const dataExpiracao = addHours(new Date(), 6);
    const nomeDescriptografado = await criptografia.descriptografar(
      pessoa.nome
    );

    const tokenPayload: ClaimsAuthSala = {
      Role: tipoAcesso,
      Usu_Id: pessoaId,
      Usu_Na: nomeDescriptografado,
      Sala_Id: sala.id,
      Sala_Co: sala.codigo,
      Sala_titulo: sala.titulo,
      Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
      Ss_Sl_Id: sessaoAtiva?.id as string,
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return {
      tokenSala,
      dataExpiracao: tokenPayload.Dt_Ex,
      role: tipoAcesso,
      sessaoId: tokenPayload.Ss_Sl_Id,
    };
  },

  async sairDaSala(sala_id: string, pessoa_id: string) {
    // Verificar se tem sessão ativa
    const sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(
      sala_id
    );

    if (!sessaoAtiva) {
      throw new Error("Nenhuma sessão ativa encontrada.");
    }

    // Verificar se a pessoa está na sessão
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessaoAtiva.id,
        pessoa_id
      );

    if (!participanteSessao) {
      throw new Error("Você não está participando desta sessão.");
    }

    // ✅ NÃO desautorizar! Apenas marcar como offline
    // O participante pode entrar e sair livremente
    // Desautorização só acontece em kick/ban (futuro) ou encerrar sessão (todos)

    // Marcar como offline em ParticipanteSala (se for permanente)
    const participanteSala =
      await participanteSalaRepository.obterPorSalaEPessoa(sala_id, pessoa_id);

    if (participanteSala) {
      await participanteSalaRepository.alterarParticipanteSalaOnline(
        sala_id,
        pessoa_id,
        false
      );
    }

    return {
      mensagem: "Você saiu da sala com sucesso.",
      limpar_token: true, // Frontend deve limpar token_sala
    };
  },

  async aprovarReentrada(
    sala_id: string,
    pessoa_id_aprovador: string,
    pessoa_id_reentrada: string
  ) {
    // Verificar se quem está aprovando é Dono ou Admin
    const sala = await salaRepository.obterPorId(sala_id, false);
    if (!sala) {
      throw new Error("Sala não encontrada.");
    }

    const isDono = sala.criado_por === pessoa_id_aprovador;
    let isAdmin = false;

    if (!isDono) {
      const participanteSala =
        await participanteSalaRepository.obterPorSalaEPessoa(
          sala_id,
          pessoa_id_aprovador
        );
      isAdmin = participanteSala?.role === 1;
    }

    if (!isDono && !isAdmin) {
      throw new Error(
        "Apenas o dono ou administrador podem aprovar reentradas."
      );
    }

    // Verificar sessão ativa
    const sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(
      sala_id
    );
    if (!sessaoAtiva) {
      throw new Error("Nenhuma sessão ativa encontrada.");
    }

    // Verificar se a pessoa tem ParticipanteSessao não autorizado
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessaoAtiva.id,
        pessoa_id_reentrada
      );

    if (!participanteSessao) {
      throw new Error("Pessoa não está na sessão.");
    }

    if (participanteSessao.autorizado) {
      throw new Error("Pessoa já está autorizada na sessão.");
    }

    // Autorizar reentrada
    await participanteSessaoRepository.atualizarAutorizacao(
      sessaoAtiva.id,
      pessoa_id_reentrada,
      true
    );

    // Marcar como online
    const participanteSala =
      await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id_reentrada
      );

    if (participanteSala) {
      await participanteSalaRepository.alterarParticipanteSalaOnline(
        sala_id,
        pessoa_id_reentrada,
        true
      );
    }

    // Buscar pessoa para gerar novo token
    const pessoa = await pessoaRepository.obterPorId(
      pessoa_id_reentrada,
      false
    );
    if (!pessoa) {
      throw new Error("Pessoa não encontrada.");
    }

    // Gerar novo token
    const dataExpiracao = addHours(new Date(), 6);
    const nomeDescriptografado = await criptografia.descriptografar(
      pessoa.nome
    );

    const tipoAcesso = await determinarTipoAcesso(sala, pessoa_id_reentrada);

    const tokenPayload: ClaimsAuthSala = {
      Role: tipoAcesso as 0 | 1 | 2 | 3,
      Usu_Id: pessoa_id_reentrada,
      Usu_Na: nomeDescriptografado,
      Sala_Id: sala.id,
      Sala_Co: sala.codigo,
      Sala_titulo: sala.titulo,
      Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
      Ss_Sl_Id: sessaoAtiva.id,
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return {
      mensagem: "Reentrada aprovada com sucesso.",
      tokenSala,
      dataExpiracao: tokenPayload.Dt_Ex,
      pessoa_id: pessoa_id_reentrada,
    };
  },

  /**
   * Busca dados da sala para edição
   * Retorna: título, salaPrivada (boolean), participantes com roles
   * NUNCA retorna a senha (segurança)
   * Permissões: Dono (0) pode acessar tudo, Admin (1) pode ver para alterar título
   */
  async obterParaEdicao(sala_id: string, pessoa_id: string) {
    const sala = await salaRepository.obterParaEdicao(sala_id, pessoa_id);

    if (!sala) {
      // Verificar se é Admin (role=1)
      const participante = await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id
      );

      if (
        !participante ||
        (participante.role !== 0 && participante.role !== 1)
      ) {
        throw new Error("Você não tem permissão para acessar esta sala.");
      }

      // Buscar sala completa com participantes (Admin pode gerenciar participantes)
      const salaCompleta = await salaRepository.obterPorId(
        sala_id,
        true,
        undefined
      );
      if (!salaCompleta) {
        throw new Error("Sala não encontrada.");
      }

      // Admin (role=1) tem permissão para gerenciar participantes fixos
      return {
        id: salaCompleta.id,
        titulo: salaCompleta.titulo,
        salaPrivada: !!salaCompleta.senha,
        participantes: salaCompleta.participantes.map((p) => ({
          id: p.pessoa.id,
          nome: criptografia.descriptografar(p.pessoa.nome),
          inativo: p.pessoa.inativo,
          role: p.role,
        })),
      };
    }

    return {
      id: sala.id,
      titulo: sala.titulo,
      salaPrivada: !!sala.senha,
      participantes: sala.participantes.map((p) => ({
        id: p.pessoa.id,
        nome: criptografia.descriptografar(p.pessoa.nome),
        inativo: p.pessoa.inativo,
        role: p.role,
      })),
    };
  },

  /**
   * Exclui uma sala (soft delete)
   * VALIDAÇÕES:
   * - Só o dono pode excluir
   * - Não pode ter sessões criadas
   * - Não pode ter votos registrados
   */
  async excluirSala(sala_id: string, pessoa_id: string) {
    // Verificar se é o dono
    const sala = await salaRepository.obterPorId(sala_id, false, pessoa_id);

    if (!sala) {
      throw new Error("Sala não encontrada ou você não tem permissão.");
    }

    if (sala.criado_por !== pessoa_id) {
      throw new Error("Apenas o dono pode excluir a sala.");
    }

    // VALIDAÇÃO #1: Verificar se há sessões criadas
    const totalSessoes = await sessaoSalaRepository.contarPorSala(sala_id);
    if (totalSessoes > 0) {
      throw new Error(
        "Não é possível excluir sala com sessões criadas. Histórico deve ser preservado."
      );
    }

    // VALIDAÇÃO #2: Verificar se há votos registrados
    const totalVotos = await votosRepository.contarPorSala(sala_id);
    if (totalVotos > 0) {
      throw new Error(
        "Não é possível excluir sala com votos registrados. Histórico deve ser preservado."
      );
    }

    // Exclusão LÓGICA (soft delete)
    await salaRepository.atualizarStatus(sala_id, true); // inativo = true

    return { sucesso: true, mensagem: "Sala excluída com sucesso." };
  },

  async selecionarHistoriaAtual(
    sala_id: string,
    historia_id: string,
    pessoa_id: string
  ) {
    const { historiaSalaRepository } = await import(
      "../../repositories/historia-sala.repository"
    );
    const { historiaSessaoRepository } = await import(
      "../../repositories/historia-sessao.repository"
    );

    // Validar sala
    const sala = await salaRepository.obterPorId(sala_id, false);
    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    // Validar permissão (Dono ou Admin)
    const isDono = sala.criado_por === pessoa_id;
    let isAdmin = false;

    if (!isDono) {
      const participante = await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id
      );
      isAdmin = participante?.role === 1;
    }

    if (!isDono && !isAdmin) {
      throw new Error(
        "Apenas dono ou administrador podem alterar a história atual"
      );
    }

    // Validar que história pertence à sala
    const historia = await historiaSalaRepository.obterPorId(historia_id);
    if (!historia || historia.sala_id !== sala_id) {
      throw new Error("História não pertence a esta sala");
    }

    // Verificar se está vinculada à sessão ativa
    const sessaoAtiva =
      sala.sessoes && sala.sessoes.length > 0 ? sala.sessoes[0] : null;
    if (sessaoAtiva) {
      const vinculada = await historiaSessaoRepository.obterPorSessaoEHistoria(
        sessaoAtiva.id,
        historia_id
      );
      if (!vinculada) {
        throw new Error("História não está vinculada à sessão ativa");
      }
    }

    // Atualizar sala
    await salaRepository.atualizar(sala_id, {
      historia_atual_id: historia_id,
      votos_revelados: false, // Resetar ao trocar
    });

    // Emit socket para notificar todos os participantes
    // TODO: Implementar socket service quando disponível
    // const { socketService } = await import("../../sockets/socket.service");
    // socketService.emitToRoom(`sala:${sala_id}`, "historia:alterada", {
    //   historiaId: historia_id,
    //   titulo: historia.titulo,
    // });

    return true;
  },
};
