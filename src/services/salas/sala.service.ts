import { hash } from "../../lib/hash";
import { salaRepository } from "../../repositories/sala.repository";
import { criptografia } from "../../lib/criptografia";
import { addHours } from "date-fns";
import { ClaimsAuthSala, geradorTokenSala } from "../../lib/jwt";
import { participanteSalaService } from "../participantes/participante-sala.service";
import { sessaoSalaService } from "../sessoes/sessao-sala.service";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
import { participanteSessaoRepository } from "../../repositories/participante-sessao.repository";
import { pessoaRepository } from "../../repositories/pessoa.repository";
import { determinarTipoAcesso } from "../../helpers/determinar-tipo-acesso.helper";
import { sessaoSalaRepository } from "../../repositories/sessao-sala.repository";
import { votosRepository } from "../../repositories/votos.repository";
import { historiaSalaRepository } from "../../repositories/historia-sala.repository";
import { historiaSessaoRepository } from "../../repositories/historia-sessao.repository";
import { AppError } from "../../lib/errorHandler";

interface CriarSalaProps {
  pessoaId: string;
  titulo: string;
  senha?: string | null;
  salaPrivada: boolean;
  participantesIds?: string[];
}

export interface AlterarSalaProps {
  id: string;
  pessoaId: string;
  titulo?: string;
  senha?: string | null;
  participantesAdicionarIds: string[];
  participantesRemoverIds: string[];
}

export const salaService = {
  async geradorCodigoUnico(tamanho: number = 6): Promise<string> {
    if (tamanho < 2) {
      throw new AppError(
        "O tamanho mínimo deve ser 2 para conter letras e números.",
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
  async criarSala({
    titulo,
    senha,
    salaPrivada,
    pessoaId,
    participantesIds,
  }: CriarSalaProps) {
    const MAX_TENTATIVAS = 3;

    if (salaPrivada && !senha) {
      throw new AppError("Senha é obrigatória para salas privadas.");
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
            0,
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
                    2, // role 2 = Membro
                  );
                } catch (error) {
                  // Ignora erro se participante já existe ou não foi encontrado
                  console.error(
                    `Erro ao adicionar participante ${participanteId}:`,
                    error,
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
    throw new AppError("Chave única não pôde ser gerada. Tente novamente.");
  },

  async alterarSala(data: AlterarSalaProps) {
    if (
      !data.senha &&
      !data.titulo &&
      (!data.participantesAdicionarIds ||
        data.participantesAdicionarIds.length === 0) &&
      (!data.participantesRemoverIds ||
        data.participantesRemoverIds.length === 0)
    ) {
      throw new AppError("Dados para alteração não fornecidos.");
    }

    const salaExistente = await salaRepository.obterPorId(
      data.id,
      true,
      data.pessoaId,
    );

    if (!salaExistente) {
      throw new AppError("Sala não encontrada.");
    }

    // Validar permissões: apenas dono (criado_por) pode alterar
    if (salaExistente.criado_por !== data.pessoaId) {
      // Verificar se é Admin (role=1) - pode alterar apenas título
      const participante = await participanteSalaRepository.obterPorSalaEPessoa(
        data.id,
        data.pessoaId,
      );

      if (!participante || participante.role !== 1) {
        throw new AppError("Você não tem permissão para alterar esta sala.");
      }

      // Admin só pode alterar título
      if (data.senha) {
        throw new AppError("Apenas o dono pode alterar a senha da sala.");
      }
    }

    const dadosParaAtualizar: AlterarSalaProps = {
      id: data.id,
      pessoaId: data.pessoaId,
      participantesAdicionarIds: data.participantesAdicionarIds,
      participantesRemoverIds: data.participantesRemoverIds,
    };

    if (data.titulo) {
      dadosParaAtualizar.titulo = data.titulo;
    }

    // Validar senha: se sala tinha senha, nova senha é obrigatória (não pode remover)
    if (data.senha !== undefined) {
      if (salaExistente.senha && !data.senha) {
        throw new AppError(
          "Não é possível remover a senha de uma sala privada. Defina uma nova senha.",
        );
      }

      if (data.senha && data.senha.length > 0) {
        if (data.senha.length < 6) {
          throw new AppError("A senha deve ter no mínimo 6 caracteres.");
        }
        dadosParaAtualizar.senha = await hash.senha(data.senha);
      }
    }

    const salaAtualizada = await salaRepository.alterar({
      id: data.id,
      criado_por: data.pessoaId,
      titulo: dadosParaAtualizar.titulo,
      senha: dadosParaAtualizar.senha,
    });

    if (
      salaAtualizada &&
      dadosParaAtualizar.participantesAdicionarIds.length > 0
    ) {
      for (const participanteId of dadosParaAtualizar.participantesAdicionarIds) {
        await participanteSalaService.adicionarParticipanteASala(
          salaAtualizada.id,
          participanteId,
          2, // role 2 = Membro
        );
      }
    }

    if (
      salaAtualizada &&
      dadosParaAtualizar.participantesRemoverIds.length > 0
    ) {
      for (const participanteId of dadosParaAtualizar.participantesRemoverIds) {
        await participanteSalaService.removerParticipante(
          salaAtualizada.id,
          data.pessoaId,
          participanteId,
        );
      }
    }

    return salaAtualizada;
  },

  async listar(
    pessoaId: string,
    pagina: number,
    itensPagina: number,
    valorPesquisa?: string,
  ) {
    if (!pessoaId) {
      throw new AppError("Id da pessoa é obrigatório");
    }

    const salas = await salaRepository.listarTodos(
      pessoaId,
      pagina,
      itensPagina,
      valorPesquisa,
    );
    const salaFormatada = salas.map((sala: any) => {
      // Determinar o role do usuário atual na sala
      const meuRole =
        sala.criado_por === pessoaId
          ? 0 // Dono
          : (sala.participantes_sala[0]?.role ?? null); // Admin(1), Membro(2) ou null (já filtrado por pessoaId no repository)

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
        membros: sala._count.participantes_sala,
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
      throw new AppError("Sala não encontrada");
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
        ...sala.participantes_sala.map((participante) => {
          return {
            ...participante.pessoa,
            nome: criptografia.descriptografar(participante.pessoa.nome),
            role: participante.role, // Inclui role (0=Dono, 1=Admin, 2=Membro)
          };
        }),
      ],
      // historias: sala.historias || [],
      votos: [],
    };
  },

  async obterPorId(id: string, pessoaId: string) {
    const sala = await salaRepository.obterPorId(id, true, pessoaId);

    if (!sala) {
      throw new AppError("Sala não encontrada");
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
              })) || [],
          ) || [],
      ) || [];

    return {
      ...sala,
      proprietario: {
        ...sala.proprietario,
        nome: criptografia.descriptografar(sala.proprietario.nome),
      },
      participantes: [
        ...sala.participantes_sala.map((participante) => ({
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

    const sala = await salaRepository.obterPorCodigo(codigo, true, undefined);

    if (!sala) {
      throw new AppError("Sala não encontrada");
    }

    // Buscar sessão ativa
    const sessaoAtiva = sala.sessoes?.find((s) => s.ativa);

    if (!sessaoAtiva) {
      throw new AppError("Nenhuma sessão ativa encontrada para esta sala");
    }

    // ✅ Calcular resumo de participantes baseado em ParticipanteSessao
    // Criar mapa de ParticipanteSessao (online e participa_votacao)
    const participanteSessaoMap = new Map<
      string,
      { online: boolean; participa_votacao: boolean }
    >();
    sessaoAtiva.participantes_sessao?.forEach((ps) => {
      participanteSessaoMap.set(ps.pessoa.id, {
        online: ps.online ?? false,
        participa_votacao: ps.participa_votacao ?? true,
      });
    });

    // Contar participantes permanentes
    let totalParticipantes = sala.participantes_sala.length;
    let totalOnline = 0;
    let totalDevemVotar = 0;

    // Participantes permanentes - verificar online e participa_votacao em ParticipanteSessao
    sala.participantes_sala.forEach((participante) => {
      const sessaoData = participanteSessaoMap.get(participante.pessoa.id);

      // Contar online apenas se estiver online em ParticipanteSessao
      if (sessaoData?.online) {
        totalOnline++;
      }

      // Contar quem deve votar: participa_votacao=true E online=true
      if (sessaoData?.online && sessaoData?.participa_votacao) {
        totalDevemVotar++;
      }
    });

    // Contar visitantes (ParticipanteSessao que não são permanentes)
    const idsParticipantesPermanentes = new Set(
      sala.participantes_sala.map((p) => p.pessoa.id),
    );

    sessaoAtiva.participantes_sessao?.forEach((participanteSessao) => {
      if (!idsParticipantesPermanentes.has(participanteSessao.pessoa.id)) {
        totalParticipantes++;

        // Contar online
        if (participanteSessao.online) {
          totalOnline++;
        }

        // Contar quem deve votar: participa_votacao=true E online=true
        if (participanteSessao.online && participanteSessao.participa_votacao) {
          totalDevemVotar++;
        }
      }
    });

    // Determinar role do usuário que fez a requisição
    let meuRole: number | null = null;
    if (sala.criado_por === pessoaId) {
      meuRole = 0; // Dono
    } else {
      const participantePermanente = sala.participantes_sala.find(
        (p) => p.pessoa.id === pessoaId,
      );
      if (participantePermanente) {
        meuRole = participantePermanente.role; // Admin(1) ou Membro(2)
      } else {
        // Verificar se é visitante da sessão
        const visitanteSessao = sessaoAtiva.participantes_sessao?.find(
          (ps) => ps.pessoa.id === pessoaId,
        );
        if (visitanteSessao) {
          meuRole = 3; // Visitante
        }
      }
    }

    return {
      id: sala.id,
      codigo: sala.codigo,
      titulo: sala.titulo,
      criado_por: sala.criado_por,
      inativo: sala.inativo,
      historia_atual_id: sala.historia_atual_id,
      votos_revelados: sala.votos_revelados,
      meuRole,
      proprietario: {
        ...sala.proprietario,
        nome: criptografia.descriptografar(sala.proprietario.nome),
      },
      resumoParticipantes: {
        totalParticipantes,
        totalOnline,
        totalDevemVotar,
      },
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
    senha?: string,
  ) {
    // Validações iniciais
    if (!pessoaId) throw new AppError("Id da pessoa não fornecido.");
    if (!codigo) throw new AppError("Código da sala não fornecido.");
    if (!sessaoPessoaId)
      throw new AppError("Id da sessão do usuário não fornecido.");

    // Buscar sala com sessões ativas (sem filtro de criador para permitir visitantes)
    const sala = await salaRepository.obterPorCodigo(codigo, true, undefined);

    if (!sala) {
      throw new AppError("Sala não encontrada.");
    }

    // Determinar tipo de acesso (0=Dono, 1=Admin, 2=Membro, 3=Visitante, null=Sem acesso)
    const tipoAcesso = await determinarTipoAcesso(sala, pessoaId);

    if (tipoAcesso === null) {
      throw new AppError("Você não tem permissão para acessar esta sala.");
    }

    // Validar senha (exceto para dono)
    if (sala.senha && tipoAcesso > 1) {
      if (!senha) {
        throw new AppError("Informe a senha para acessar a sala.");
      }
      const senhaValida = await hash.compare(senha, sala.senha);
      if (!senhaValida) {
        throw new AppError("Senha informada inválida.");
      }
    }

    // Obter sessão ativa (sem filtro de pessoa - busca apenas por sala_id)
    let sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(sala.id);

    // TIPO 0 (Dono) ou TIPO 1 (Admin): Requer sessão ativa
    if (tipoAcesso === 0 || tipoAcesso === 1) {
      // ✅ Sessão deve ser criada via rota separada (POST /salas/:id/sessoes)
      // Não criamos automaticamente aqui para evitar race conditions
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new AppError("Não há sessão ativa. Inicie uma sessão primeiro.");
      }

      // Verificar ParticipanteSessao
      const participanteSessao =
        await participanteSessaoRepository.obterPorSessaoEPessoa(
          sessaoAtiva.id,
          pessoaId,
        );

      // Se não tem ParticipanteSessao, criar (caso excepcional)
      if (!participanteSessao) {
        await participanteSessaoRepository.inserir({
          sessao_id: sessaoAtiva.id,
          pessoa_id: pessoaId,
          autorizado: true,
        });
      } else if (!participanteSessao.autorizado) {
        // Se foi kickado/banido, não pode reentrar sem aprovação
        throw new AppError(
          "Você foi removido desta sessão. Aguarde aprovação do administrador para reentrar.",
        );
      }

      // ✅ Atualizar ParticipanteSessao: online=true (donos/admins mantêm controle de participa_votacao)
      if (participanteSessao) {
        await participanteSessaoRepository.atualizar(sessaoAtiva.id, pessoaId, {
          online: true,
        });
      }
    }
    // TIPO 2 (Membro): Requer sessão ativa
    else if (tipoAcesso === 2) {
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new AppError(
          "Não há sessão ativa no momento. Aguarde o dono ou admin iniciar uma sessão.",
        );
      }

      // Verificar ParticipanteSessao
      const participanteSessao =
        await participanteSessaoRepository.obterPorSessaoEPessoa(
          sessaoAtiva.id,
          pessoaId,
        );

      if (!participanteSessao) {
        throw new AppError(
          "Você não tem permissão para acessar esta sessão. Aguarde o dono ou admin iniciar uma sessão e adicionar você como participante.",
        );
      }

      // Se já tem, apenas verifica se foi kickado
      else if (!participanteSessao.autorizado) {
        // Se foi kickado/banido, não pode reentrar sem aprovação
        throw new AppError(
          "REQUER_APROVACAO:Você foi removido desta sessão. Aguarde aprovação do administrador para reentrar.",
        );
      }
      // Se já tem e está autorizado, pode entrar (saiu temporariamente)

      // ✅ Atualizar ParticipanteSessao: online=true, participa_votacao=true (membros votam ao entrar)
      if (participanteSessao) {
        await participanteSessaoRepository.atualizar(sessaoAtiva.id, pessoaId, {
          online: true,
          participa_votacao: true,
        });
      }
    }
    // TIPO 3 (Visitante): Requer sessão ativa E ParticipanteSessao pré-existente
    else if (tipoAcesso === 3) {
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new AppError("Não há sessão ativa no momento.");
      }

      // Verificar se visitante tem ParticipanteSessao
      const participanteSessao =
        await participanteSessaoRepository.obterPorSessaoEPessoa(
          sessaoAtiva.id,
          pessoaId,
        );

      if (!participanteSessao) {
        throw new AppError(
          "Você não foi convidado para esta sessão. Solicite ao anfitrião para adicionar você.",
        );
      }

      if (!participanteSessao.autorizado) {
        throw new AppError(
          "Você foi removido desta sessão. Aguarde aprovação do administrador para reentrar.",
        );
      }

      // ✅ Atualizar ParticipanteSessao: online=true, participa_votacao=true (visitantes votam ao entrar)
      await participanteSessaoRepository.atualizar(sessaoAtiva.id, pessoaId, {
        online: true,
        participa_votacao: true,
      });
    }

    // Buscar informações da pessoa
    const pessoa = await pessoaRepository.obterPorId(pessoaId, false);
    if (!pessoa) throw new AppError("Pessoa não encontrada.");

    // Gerar token
    const dataExpiracao = addHours(new Date(), 6);
    const nomeDescriptografado = await criptografia.descriptografar(
      pessoa.nome,
    );

    const tokenPayload: ClaimsAuthSala = {
      Role: tipoAcesso,
      Usuario_Id: pessoaId,
      Nome: nomeDescriptografado,
      Sala_Id: sala.id,
      Sala_Codigo: sala.codigo,
      Sala_Titulo: sala.titulo,
      Sessao_Sala_Id: sessaoAtiva?.id as string,
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return {
      tokenSala,
      role: tipoAcesso,
      sessaoId: tokenPayload.Sessao_Sala_Id,
    };
  },

  async sairDaSala(sala_id: string, pessoa_id: string) {
    // Verificar se tem sessão ativa
    const sessaoAtiva =
      await sessaoSalaService.obterSessaoAtivaPorSala(sala_id);

    if (!sessaoAtiva) {
      throw new AppError("Nenhuma sessão ativa encontrada.");
    }

    // Verificar se a pessoa está na sessão
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        sessaoAtiva.id,
        pessoa_id,
      );

    if (!participanteSessao) {
      throw new AppError("Você não está participando desta sessão.");
    }

    // ✅ NÃO desautorizar! Apenas marcar como offline e não participando
    // O participante pode entrar e sair livremente
    // Desautorização só acontece em kick/ban (futuro) ou encerrar sessão (todos)

    // ✅ Atualizar ParticipanteSessao: online=false e participa_votacao=false para TODOS
    // Quando voltar, define novamente se participa ou não
    await participanteSessaoRepository.atualizar(sessaoAtiva.id, pessoa_id, {
      online: false,
      participa_votacao: false,
    });

    return {
      mensagem: "Você saiu da sala com sucesso.",
      limpar_token: true, // Frontend deve limpar token_sala
    };
  },

  // async aprovarReentrada(
  //   sala_id: string,
  //   pessoa_id_aprovador: string,
  //   pessoa_id_reentrada: string,
  // ) {
  //   // Verificar se quem está aprovando é Dono ou Admin
  //   const sala = await salaRepository.obterPorId(sala_id, false);
  //   if (!sala) {
  //     throw new AppError("Sala não encontrada.");
  //   }

  //   const isDono = sala.criado_por === pessoa_id_aprovador;
  //   let isAdmin = false;

  //   if (!isDono) {
  //     const participanteSala =
  //       await participanteSalaRepository.obterPorSalaEPessoa(
  //         sala_id,
  //         pessoa_id_aprovador,
  //       );
  //     isAdmin = participanteSala?.role === 1;
  //   }

  //   if (!isDono && !isAdmin) {
  //     throw new AppError(
  //       "Apenas o dono ou administrador podem aprovar reentradas.",
  //     );
  //   }

  //   // Verificar sessão ativa
  //   const sessaoAtiva =
  //     await sessaoSalaService.obterSessaoAtivaPorSala(sala_id);
  //   if (!sessaoAtiva) {
  //     throw new AppError("Nenhuma sessão ativa encontrada.");
  //   }

  //   // Verificar se a pessoa tem ParticipanteSessao não autorizado
  //   const participanteSessao =
  //     await participanteSessaoRepository.obterPorSessaoEPessoa(
  //       sessaoAtiva.id,
  //       pessoa_id_reentrada,
  //     );

  //   if (!participanteSessao) {
  //     throw new AppError("Pessoa não está na sessão.");
  //   }

  //   if (participanteSessao.autorizado) {
  //     throw new AppError("Pessoa já está autorizada na sessão.");
  //   }

  //   // Autorizar reentrada
  //   await participanteSessaoRepository.atualizarAutorizacao(
  //     sessaoAtiva.id,
  //     pessoa_id_reentrada,
  //     true,
  //   );

  //   // ✅ Marcar como online em ParticipanteSessao
  //   await participanteSessaoRepository.atualizar(
  //     sessaoAtiva.id,
  //     pessoa_id_reentrada,
  //     { online: true },
  //   );

  //   // Buscar pessoa para gerar novo token
  //   const pessoa = await pessoaRepository.obterPorId(
  //     pessoa_id_reentrada,
  //     false,
  //   );
  //   if (!pessoa) {
  //     throw new AppError("Pessoa não encontrada.");
  //   }

  //   // Gerar novo token
  //   const nomeDescriptografado = await criptografia.descriptografar(
  //     pessoa.nome,
  //   );

  //   const tipoAcesso = await determinarTipoAcesso(sala, pessoa_id_reentrada);

  //   const tokenPayload: ClaimsAuthSala = {
  //     Role: tipoAcesso as 0 | 1 | 2 | 3,
  //     Usuario_Id: pessoa_id_reentrada,
  //     Nome: nomeDescriptografado,
  //     Sala_Id: sala.id,
  //     Sala_Codigo: sala.codigo,
  //     Sala_Titulo: sala.titulo,
  //     // Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
  //     Sessao_Sala_Id: sessaoAtiva.id,
  //   };

  //   const tokenSala = geradorTokenSala(tokenPayload);

  //   return {
  //     mensagem: "Reentrada aprovada com sucesso.",
  //     tokenSala,
  //     dataExpiracao: tokenPayload.Dt_Ex,
  //     pessoa_id: pessoa_id_reentrada,
  //   };
  // },

  /**
   * Busca dados da sala para edição
   * Retorna: título, salaPrivada (boolean), participantes com roles
   * NUNCA retorna a senha (segurança)
   * Permissões: Dono (0) pode acessar tudo, Admin (1) pode ver para alterar título
   */
  async obterDadosFormAlterar(sala_id: string, pessoa_id: string) {
    const sala = await salaRepository.obterParaEdicao(sala_id, pessoa_id);

    if (!sala) {
      // Verificar se é Admin (role=1)
      const participante = await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id,
      );

      if (
        !participante ||
        (participante.role !== 0 && participante.role !== 1)
      ) {
        throw new AppError("Você não tem permissão para acessar esta sala.");
      }

      // Buscar sala completa com participantes (Admin pode gerenciar participantes)
      const salaCompleta = await salaRepository.obterPorId(
        sala_id,
        true,
        undefined,
      );
      if (!salaCompleta) {
        throw new AppError("Sala não encontrada.");
      }

      // Admin (role=1) tem permissão para gerenciar participantes fixos
      return {
        id: salaCompleta.id,
        titulo: salaCompleta.titulo,
        salaPrivada: !!salaCompleta.senha,
        participantes: salaCompleta.participantes_sala.map((p) => ({
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
      participantes: sala.participantes_sala.map((p) => ({
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
      throw new AppError("Sala não encontrada ou você não tem permissão.");
    }

    if (sala.criado_por !== pessoa_id) {
      throw new AppError("Apenas o dono pode excluir a sala.");
    }

    // VALIDAÇÃO #1: Verificar se há sessões criadas
    const totalSessoes = await sessaoSalaRepository.contarSessaoSala(sala_id);
    if (totalSessoes > 0) {
      throw new AppError(
        "Não é possível excluir sala com sessões criadas. Histórico deve ser preservado.",
      );
    }

    // VALIDAÇÃO #2: Verificar se há votos registrados
    const totalVotos = await votosRepository.contarVotosHistoriaSessao(sala_id);
    if (totalVotos > 0) {
      throw new AppError(
        "Não é possível excluir sala com votos registrados. Histórico deve ser preservado.",
      );
    }

    // Exclusão LÓGICA (soft delete)
    await salaRepository.atualizarStatus(sala_id, true); // inativo = true

    return { sucesso: true, mensagem: "Sala excluída com sucesso." };
  },

  async selecionarHistoriaAtual(
    sala_id: string,
    historia_id: string,
    pessoa_id: string,
  ) {
    // Validar sala
    const sala = await salaRepository.obterPorId(sala_id, false);
    if (!sala) {
      throw new AppError("Sala não encontrada");
    }

    // Validar permissão (Dono ou Admin)
    const isDono = sala.criado_por === pessoa_id;
    let isAdmin = false;

    if (!isDono) {
      const participante = await participanteSalaRepository.obterPorSalaEPessoa(
        sala_id,
        pessoa_id,
      );
      isAdmin = participante?.role === 1;
    }

    if (!isDono && !isAdmin) {
      throw new AppError(
        "Apenas dono ou administrador podem alterar a história atual",
      );
    }

    // Validar que história pertence à sala
    const historia = await historiaSalaRepository.obterPorId(historia_id);
    if (!historia || historia.sala_id !== sala_id) {
      throw new AppError("História não pertence a esta sala");
    }

    // Verificar se está vinculada à sessão ativa
    const sessaoAtiva =
      sala.sessoes && sala.sessoes.length > 0 ? sala.sessoes[0] : null;
    if (sessaoAtiva) {
      const vinculada =
        await historiaSessaoRepository.obterPorIdOuSessaoEHistoria({
          sessao_id: sessaoAtiva.id,
          historia_id,
        });
      if (!vinculada) {
        throw new AppError("História não está vinculada à sessão ativa");
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
