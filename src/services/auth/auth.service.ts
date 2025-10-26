import { pessoaRepository } from "../../repositories/pessoa.repository";
import { Claims, geradorToken } from "../../lib/jwt";
import { hash } from "../../lib/hash";
import { criptografia } from "../../lib/criptografia";
import emailService from "../mail/mail.service";
import { codigos } from "../../lib/codigos";
import { addHours, addMinutes, format } from "date-fns";
import { formatarParaDataLocal } from "../../utils/formatar-data";
import { ptBR } from "date-fns/locale";

export const authService = {
  async usuarioExiste(email: string) {
    const emailHash = await hash.geradorCamposComuns(email);

    const usuario = await pessoaRepository.obterPorEmail(emailHash);

    return usuario ? usuario : false;
  },

  async login(email: string, senha: string) {
    const usuario = await this.usuarioExiste(email);

    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await hash.compare(senha, usuario.senha as string);

    if (!senhaValida) throw new Error("Senha inválida");

    const tokenPayload = {
      Usu_Id: usuario.id,
      Usu_na: criptografia.descriptografar(usuario.nome),
      email: criptografia.descriptografar(usuario.email),
      Dt_Ex: format(addHours(new Date(), 5), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Idp: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    const token = geradorToken({ ...tokenPayload });
    return { token, dataExpiracao: tokenPayload.Dt_Ex };
  },

  async criarConta(nome: string, email: string, senha: string) {
    const usuarioExistente = await this.usuarioExiste(email);

    if (usuarioExistente) throw new Error("E-mail já cadastrado");

    const senhaHash = await hash.senha(senha);

    const codigo = await codigos.confirmarConta();

    const novoUsuario = await pessoaRepository.inserir(
      criptografia.criptografar(nome),
      criptografia.criptografar(email),
      await hash.geradorCamposComuns(email),
      senhaHash,
      criptografia.criptografar(codigo as string),
      await hash.geradorCamposComuns(codigo as string),
      addMinutes(new Date(), 30)
    );

    let emailEnviado = false;
    let erroEmail: string | null = null;

    if (novoUsuario) {
      try {
        await emailService.sendEmailConfirmaConta(
          {
            nome: criptografia.descriptografar(novoUsuario.nome), // Usa o nome original (não criptografado)
            email: criptografia.descriptografar(novoUsuario.email!), // Usa o email original para envio
          },
          `${
            process.env.FRONTEND_URL
          }/confirmarConta?codigo=${encodeURIComponent(
            novoUsuario.codigo_confirmacao!
          )}`
        );

        emailEnviado = true;
      } catch (emailError) {
        erroEmail = (emailError as Error).message;
        console.error("Erro ao enviar email de boas-vindas:", emailError);
      }
    }

    return { id: novoUsuario.id, emailEnviado, erroEmail };
  },

  async novoCodigo(email: string) {
    const usuarioExistente = await this.usuarioExiste(email);

    if (!usuarioExistente) {
      return;
    }

    const codigo = await codigos.confirmarConta();

    const usuario = await pessoaRepository.novoCodigo(
      await hash.geradorCamposComuns(email),
      criptografia.criptografar(codigo as string),
      await hash.geradorCamposComuns(codigo as string),
      addMinutes(new Date(), 30)
    );

    if (!usuario) {
      return;
    }

    try {
      await emailService.sendEmailConfirmaConta(
        {
          nome: criptografia.descriptografar(usuario.nome),
          email: criptografia.descriptografar(usuario.email),
        },
        `${process.env.FRONTEND_URL}/confirmarConta?codigo=${encodeURIComponent(
          usuario.codigo_confirmacao!
        )}`
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de boas-vindas:", emailError);
    }
  },

  async esqueciMinhaSenha(email: string) {
    const usuarioExistente = await this.usuarioExiste(email);

    if (!usuarioExistente) {
      return;
    }

    const codigo = await codigos.confirmarConta();

    const usuario = await pessoaRepository.novoCodigo(
      await hash.geradorCamposComuns(email),
      criptografia.criptografar(codigo as string),
      await hash.geradorCamposComuns(codigo as string),
      addMinutes(new Date(), 30)
    );

    if (!usuario) {
      return;
    }

    try {
      await emailService.sendEmailRecuperacaoSenha(
        {
          nome: criptografia.descriptografar(usuario.nome),
          email: criptografia.descriptografar(usuario.email),
        },
        `${
          process.env.FRONTEND_URL
        }/redefinicaoValidaCodigo?codigo=${encodeURIComponent(
          usuario.codigo_confirmacao!
        )}`
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de boas-vindas:", emailError);
    }
  },

  async validaCodigoConfirmacaoEmail(
    codigo: string,
    confirmarConta: boolean = false
  ) {
    const codigoDescriptografado = criptografia.descriptografar(codigo);

    const usuarioNovoExistente = await pessoaRepository.validaCodigoEmailExiste(
      await hash.geradorCamposComuns(codigoDescriptografado)
    );

    if (!usuarioNovoExistente) {
      throw new Error(
        "O link de recuperação de senha é inválido. Por favor, solicite um novo link."
      );
    }

    if (usuarioNovoExistente.codigo_expiracao! < new Date()) {
      throw new Error(
        "O link de recuperação de senha expirou. Por favor, solicite um novo link."
      );
    }

    if (confirmarConta && usuarioNovoExistente.id) {
      const confirmaContaNovoUsuario =
        await pessoaRepository.confirmarEmailContaNovoUsuario(
          usuarioNovoExistente.id
        );

      return { confirmaContaNovoUsuario, contaConfirmada: true };
    } else {
      return {
        id: usuarioNovoExistente.id,
        nome: criptografia.descriptografar(usuarioNovoExistente.nome),
        codigo_expiracao: formatarParaDataLocal(
          usuarioNovoExistente.codigo_expiracao!
        ),
      };
    }
  },

  async redefinirSenha(
    senha: string,
    confirmacaoSenha: string,
    codigo: string,
    id: string
  ) {
    if (senha !== confirmacaoSenha) {
      throw new Error("A confirmação de senha não corresponde à nova senha.");
    }

    const codigoDescriptografado = criptografia.descriptografar(codigo);

    const usuarioExistente = await pessoaRepository.validaCodigoEmailExiste(
      await hash.geradorCamposComuns(codigoDescriptografado)
    );

    if (!usuarioExistente) {
      throw new Error(
        "O link de recuperação de senha é inválido. Por favor, solicite um novo link."
      );
    }

    if (usuarioExistente.codigo_expiracao! < new Date()) {
      throw new Error(
        "O link de recuperação de senha expirou. Por favor, solicite um novo link."
      );
    }

    const novaSenha = await hash.senha(senha);

    const ultimaSenha = await pessoaRepository.obterSenhaAtual(
      usuarioExistente.id
    );

    const redefineSenhaUsuario = await pessoaRepository.redefinirSenha(
      usuarioExistente.codigo_confirmacao_hash!,
      novaSenha,
      id,
      ultimaSenha?.senha as string
    );

    return redefineSenhaUsuario.id;
  },
};
