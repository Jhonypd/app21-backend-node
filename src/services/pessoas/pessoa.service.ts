import { pessoaRepository } from "../../repositories/pessoa.repository";
import { criptografia } from "../../lib/criptografia";
import { hash } from "../../lib/hash";
import { formatarParaDataLocal } from "../../utils/formatar-data";
import emailService from "../mail/mail.service";
import { codigos } from "../../lib/codigos";
import { addMinutes } from "date-fns";

export interface AlterarPessoaData {
  nome?: string;
  email?: string;
  inativo?: boolean;

  codigo_confirmacao?: string;
  codigo_confirmacao_hash?: string;
  codigo_expiracao?: Date;
}

export const pessoaService = {
  async alterar(id: string, data: AlterarPessoaData) {
    // Verifica se o usuário existe
    const usuarioExistente = await pessoaRepository.obterPorId(id, false);

    if (!usuarioExistente) {
      throw new Error("Usuário não encontrado");
    }

    const dadosAtualizacao: any = {};

    // Se está alterando o email, verifica se já existe e gera hash
    if (data.email && data.email !== usuarioExistente.email) {
      const hashEmail = await hash.geradorCamposComuns(data.email);
      const emailExistente = await pessoaRepository.obterPorEmail(hashEmail);

      if (emailExistente && emailExistente.id !== id) {
        throw new Error("E-mail já cadastrado");
      }

      dadosAtualizacao.email = criptografia.criptografar(data.email);
      dadosAtualizacao.email_hash = hashEmail;
      dadosAtualizacao.email_confirmado = false;

      // Gera código de confirmação para novo email

      dadosAtualizacao.codigo_confirmacao_hash = await hash.geradorCamposComuns(
        (await codigos.confirmarConta()) as string
      );
      dadosAtualizacao.codigo_expiracao = addMinutes(new Date(), 30);
      dadosAtualizacao.codigo_confirmacao = criptografia.criptografar(
        (await codigos.confirmarConta()) as string
      );

      // Precisa revalidar o email
    }

    // Se está alterando o nome, criptografa
    if (data.nome) {
      dadosAtualizacao.nome = criptografia.criptografar(data.nome);
    }

    // Se está alterando o status inativo
    if (typeof data.inativo === "boolean") {
      dadosAtualizacao.inativo = data.inativo;
    }

    // Se não há dados para atualizar, retorna erro
    if (Object.keys(dadosAtualizacao).length === 0) {
      throw new Error("Nenhum dado válido para atualização");
    }

    const usuario = await pessoaRepository.alterar(id, dadosAtualizacao);

    let emailEnviado = false;
    let erroEmail: string | null = null;

    if (usuario) {
      try {
        await emailService.sendEmailConfirmaAlteracao(
          {
            nome: criptografia.descriptografar(usuario.nome), // Usa o nome original (não criptografado)
            email: criptografia.descriptografar(usuario.email!), // Usa o email original para envio
          },
          `${
            process.env.FRONTEND_URL
          }/confirmarConta?codigo=${encodeURIComponent(
            usuario.codigo_confirmacao!
          )}`
        );

        emailEnviado = true;
      } catch (emailError) {
        erroEmail = (emailError as Error).message;
        console.error("Erro ao enviar email de boas-vindas:", emailError);
      }
    }

    return { usuario, emailEnviado, erroEmail };
  },

  async obterDadosAlterar(id: string) {
    const dados = await pessoaRepository.obterPorId(id, false);

    if (!dados) {
      throw new Error("Usuário não encontrado");
    }

    return {
      id: dados.id,
      nome: criptografia.descriptografar(dados.nome),
      email: dados.email ? criptografia.descriptografar(dados.email) : null,
      inativo: dados.inativo,
    };
  },

  async obterDadosConta(id: string) {
    const usuario = await pessoaRepository.obterPorId(id, false);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Descriptografa os dados sensíveis para retorno
    return {
      id: usuario.id,
      nome: criptografia.descriptografar(usuario.nome),
      email: usuario.email ? criptografia.descriptografar(usuario.email) : null,
      inativo: usuario.inativo,
      data_criacao: formatarParaDataLocal(usuario.data_criacao),
      email_confirmado: usuario.email_confirmado,
    };
  },
};
