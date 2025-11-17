import { hash } from "../../lib/hash";
import { salaRepository } from "../../repositories/sala.repository";
import { criptografia } from "../../lib/criptografia";
import { addHours, format } from "date-fns";
import { ClaimsAuthSala, geradorTokenSala } from "../../lib/jwt";
import { ptBR, tr } from "date-fns/locale";

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

        return novaSala;
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

    const salaExistente = await salaRepository.obterPorId(id, pessoaId, true);

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
    const salaExistente = await salaRepository.obterPorId(id, pessoaId, true);
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
      return {
        ...restant,
        privada: sala.senha ? true : false,
        votos: [
          ...sala.votos.map((voto) => {
            return {
              ...voto,
              pessoa: {
                ...voto.pessoa,
                nome: criptografia.descriptografar(voto.pessoa.nome),
              },
            };
          }),
        ],
        proprietario: {
          ...sala.proprietario,
          nome: criptografia.descriptografar(sala.proprietario.nome),
        },
      };
    });
    return salaFormatada;
  },

  async obterPorCodigo(codigo: string, pessoaId: string) {
    const sala = await salaRepository.obterPorCodigo(codigo, pessoaId, true);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }
    return sala;
  },

  async obterPorId(id: string, pessoaId: string) {
    const sala = await salaRepository.obterPorId(id, pessoaId, true);

    if (!sala) {
      throw new Error("Sala não encontrada");
    }
    return sala;
  },

  async entrarSala(
    codigo: string,
    pessoaId: string,
    SessaoId: string,
    senha?: string
  ) {
    // Validações iniciais
    if (!pessoaId) throw new Error("Id da pessoa não fornecido.");
    if (!codigo) throw new Error("Código da sala não fornecido.");
    if (!SessaoId) throw new Error("Id da sessão do usuario não fornecido.");

    // Buscar sala
    const sala = await salaRepository.obterPorCodigo(codigo, pessoaId, false);
    if (!sala)
      throw new Error("Sala não encontrada e/ou usuário sem permissão.");

    const isCriador = pessoaId === sala.criado_por;
    const membro = await salaRepository.obterMembroSala(sala.id, pessoaId);

    // Verificação de acesso simplificada
    if (!isCriador && !membro) {
      throw new Error("Acesso negado à sala.");
    }

    // Lógica de senha mais clara
    if (sala.senha) {
      if (isCriador) {
        // Criador acessa sem senha
      } else if (!senha) {
        throw new Error("Informe a senha para acessar a sala.");
      } else {
        const senhaValida = await hash.compare(senha, sala.senha);
        if (!senhaValida) throw new Error("Senha informada inválida.");
      }
    }

    // Determinar role
    let role: number;
    let pessoaInfo: { id: string; nome: string };

    if (isCriador) {
      role = 1;
      pessoaInfo = {
        id: sala.proprietario.id,
        nome: sala.proprietario.nome,
      };
    } else {
      role = 2;
      pessoaInfo = {
        id: membro!.pessoa.id,
        nome: membro!.pessoa.nome,
      };
    }

    // Gerar token
    const dataExpiracao = addHours(new Date(), 6);
    const nomeDescriptografado = await criptografia.descriptografar(
      pessoaInfo.nome
    );

    const tokenPayload: ClaimsAuthSala = {
      Role: role,
      Usu_Id: pessoaInfo.id,
      Usu_Na: nomeDescriptografado,
      Sala_Id: sala.id,
      Sala_titulo: sala.titulo,
      Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
      Ss_Id: SessaoId,
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return { tokenSala, dataExpiracao: tokenPayload.Dt_Ex };
  },
};
