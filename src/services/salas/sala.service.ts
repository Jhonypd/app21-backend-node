import { hash } from "../../lib/hash";
import { salaRepository } from "../../repositories/sala.repository";
import { criptografia } from "../../lib/criptografia";
import { addHours, format } from "date-fns";
import { ClaimsAuthSala, geradorTokenSala } from "../../lib/jwt";
import { ptBR } from "date-fns/locale";
import { participanteSalaService } from "../participantes/participante-sala.service";
import { sessaoSalaService } from "../sessoes/sessao-sala.service";
import { participanteSalaRepository } from "../../repositories/participante-sala.repository";
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
    const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let codigo = "";

    for (let i = 0; i < tamanho; i++) {
      const index = Math.floor(Math.random() * ALFABETO.length);
      codigo += ALFABETO[index];
    }

    return codigo;
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

  async delete(id: string, pessoaId: string) {
    const salaExistente = await salaRepository.obterPorId(id, true, pessoaId);
    if (!salaExistente) {
      throw new Error("Sala não encontrada.");
    }

    const salaDeletada = await salaRepository.delete(id, pessoaId);
    if (!salaDeletada) {
      throw new Error("Erro ao deletar a sala.");
    }
    return salaDeletada.id;
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
      const temSessaoAtiva = sala.sessoes && sala.sessoes.length > 0;
      const sessaoAtiva = temSessaoAtiva ? sala.sessoes[0] : null;

      // Se tem sessão ativa, verificar se tem participantes
      const temParticipantes = sessaoAtiva
        ? sessaoAtiva._count.participantes > 0
        : false;

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
        status: temParticipantes ? "online" : null,
        data_ultima_sessao:
          sessaoAtiva?.criada_em &&
          format(new Date(sessaoAtiva.criada_em), "dd/MM/yyyy HH:mm:ss", {
            locale: ptBR,
          }),
      };
    });
    return salaFormatada;
  },

  async obterPorCodigo(codigo: string, pessoaId: string) {
    const sala = await salaRepository.obterPorCodigo(codigo, true, pessoaId);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }

    const { senha, ...restante } = sala;

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
          };
        }),
      ],
      votos,
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

  async entrarSala(
    codigo: string,
    pessoaId: string,
    sessaoPessoaId: string,
    senha?: string,
    visitantes?: string[]
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

    // Determinar tipo de acesso (0=Dono, 1=Fixo, 2=Visitante, null=Sem acesso)
    const tipoAcesso = await determinarTipoAcesso(sala, pessoaId);

    if (tipoAcesso === null) {
      throw new Error("Você não tem permissão para acessar esta sala.");
    }

    // Validar senha (exceto para dono)
    if (sala.senha && tipoAcesso !== 0) {
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

    // TIPO 0 (Dono) ou TIPO 1 (Admin): Podem criar sessão se não existir
    if (tipoAcesso === 0 || tipoAcesso === 1) {
      if (!sessaoAtiva) {
        // Criar sessão e ParticipanteSessao para todos (permanentes + visitantes opcionais)
        await sessaoSalaService.criarSessao(sala.id, pessoaId, visitantes);
        // Recarregar sessão ativa após criação
        sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(sala.id);
      }
      // ParticipanteSessao já foi criado automaticamente em criarSessao

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
    // TIPO 2 (Visitante): Requer sessão ativa E ParticipanteSessao pré-existente
    else if (tipoAcesso === 2) {
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new Error("Não há sessão ativa no momento.");
      }

      // Visitante já tem ParticipanteSessao (criado pelo dono)
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
      Sala_titulo: sala.titulo,
      Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
      Ss_Sl_Id: sessaoAtiva?.id as string,
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return {
      tokenSala,
      dataExpiracao: tokenPayload.Dt_Ex,
      role: tipoAcesso,
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

      // Buscar sala sem filtro de criado_por
      const salaCompleta = await salaRepository.obterPorId(
        sala_id,
        true,
        undefined
      );
      if (!salaCompleta) {
        throw new Error("Sala não encontrada.");
      }

      return {
        id: salaCompleta.id,
        titulo: salaCompleta.titulo,
        salaPrivada: !!salaCompleta.senha,
        participantes: [], // Admin não precisa ver participantes para alterar título
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
};
