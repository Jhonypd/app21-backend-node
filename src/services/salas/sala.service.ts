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

interface CriarSalaProps {
  pessoaId: string;
  titulo: string;
  senha?: string | null;
  salaPrivada: boolean;
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

  async inserir({ titulo, senha, salaPrivada, pessoaId }: CriarSalaProps) {
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

        // Dono é adicionado automaticamente como ParticipanteSala (tipo 0)
        if (novaSala) {
          await participanteSalaService.adicionarParticipanteASala(
            novaSala.id,
            pessoaId,
            0
          );
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

    const dadosParaAtualizar: AlterarSalaProps = {};

    if (data.titulo) {
      dadosParaAtualizar.titulo = data.titulo;
    }
    if (data.senha && data.senha.length > 0) {
      dadosParaAtualizar.senha = await hash.senha(data.senha);
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

  async listar(pessoaId: string, pagina: number, itensPagina: number) {
    if (!pessoaId) {
      throw new Error("Id da pessoa é obrigatório");
    }

    const salas = await salaRepository.listarTodos(
      pessoaId,
      pagina,
      itensPagina
    );
    const salaFormatada = salas.map((sala) => {
      const { senha, ...restant } = sala;
      // Coletar todos os votos das sessões ativas
      const votos =
        sala.sessoes?.flatMap(
          (sessao) =>
            sessao.historias?.flatMap(
              (historia) =>
                historia.votos?.map((voto) => ({
                  ...voto,
                  pessoa: {
                    ...voto.pessoa,
                    nome: criptografia.descriptografar(voto.pessoa.nome),
                  },
                })) || []
            ) || []
        ) || [];

      return {
        ...restant,
        privada: sala.senha ? true : false,
        votos,
        proprietario: {
          ...sala.proprietario,
          nome: criptografia.descriptografar(sala.proprietario.nome),
        },
        participantes: [
          ...sala.participantes.map((participante) => {
            return {
              ...participante.pessoa,
              nome: criptografia.descriptografar(participante.pessoa.nome),
              inativo: participante.pessoa.inativo,
            };
          }),
        ],
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

    // Determinar tipo de acesso (0=Dono, 1=Admin, 2=Participante, 3=Visitante, null=Sem acesso)
    const tipoAcesso = await determinarTipoAcesso(sala, pessoaId);

    if (tipoAcesso === null) {
      throw new Error("Você não tem permissão para acessar esta sala.");
    }

    // Validar senha (exceto para dono e administrador)
    if (sala.senha && tipoAcesso !== 0 && tipoAcesso !== 1) {
      if (!senha) {
        throw new Error("Informe a senha para acessar a sala.");
      }
      const senhaValida = await hash.compare(senha, sala.senha);
      if (!senhaValida) {
        throw new Error("Senha informada inválida.");
      }
    }

    // Obter sessão ativa
    let sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(
      sala.id,
      pessoaId
    );

    // TIPO 0 (Dono) ou TIPO 1 (Administrador): Pode criar sessão
    if (tipoAcesso === 0 || tipoAcesso === 1) {
      if (!sessaoAtiva && tipoAcesso === 0) {
        // Apenas dono pode criar sessão
        await sessaoSalaService.criarSessao(sala.id, pessoaId, visitantes);
        // Recarregar sessão ativa após criação
        sessaoAtiva = await sessaoSalaService.obterSessaoAtivaPorSala(
          sala.id,
          pessoaId
        );
      } else if (!sessaoAtiva && tipoAcesso === 1) {
        throw new Error(
          "Não há sessão ativa no momento. Apenas o dono pode criar sessão."
        );
      }
      // ParticipanteSessao já foi criado automaticamente em criarSessao

      // Marca como online em ParticipanteSala
      await participanteSalaRepository.alterarParticipanteSalaOnline(
        sala.id,
        pessoaId,
        true
      );
    }
    // TIPO 2 (Participante): Requer sessão ativa
    else if (tipoAcesso === 2) {
      if (!sessaoAtiva || !sessaoAtiva.ativa) {
        throw new Error(
          "Não há sessão ativa no momento. Aguarde o dono abrir a sessão."
        );
      }

      // ParticipanteSessao já foi criado automaticamente quando sessão foi aberta
      // Apenas marca como online
      await participanteSalaRepository.alterarParticipanteSalaOnline(
        sala.id,
        pessoaId,
        true
      );
    }
    // TIPO 3 (Visitante): Requer sessão ativa E ParticipanteSessao pré-existente
    else if (tipoAcesso === 3) {
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
      Ss_Id: sessaoPessoaId,
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return {
      tokenSala,
      dataExpiracao: tokenPayload.Dt_Ex,
      role: tipoAcesso,
    };
  },
};
