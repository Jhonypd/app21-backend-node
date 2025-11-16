import { pessoaRepository } from "../../repositories/pessoa.repository";
import { Claims, geradorToken } from "../../lib/jwt";
import { hash } from "../../lib/hash";
import { criptografia } from "../../lib/criptografia";
import emailService from "../mail/mail.service";
import { codigos } from "../../lib/codigos";
import { pessoaService } from "../pessoas/pessoa.service";
import { formatarParaDataLocal } from "../../utils/formatar-data";
import { addDays, addMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { refreshTokenService } from "./refresh-token.service";
import { sessaoUsuarioService } from "./sessao-usuario.service";

export const authService = {
  async login(email: string, senha: string) {
    const pessoa = await pessoaService.usuarioExistePorEmailOuId(email, null);

    if (!pessoa) throw new Error("Usuario e/ou senha inválido(s)");

    if (pessoa.inativo) {
      throw new Error(
        "Usuário sem permissão de acesso, entre em contato com o administrador."
      );
    }

    if (pessoa.email_confirmado === false) {
      throw new Error(
        "E-mail não confirmado. Por favor, confirme seu e-mail para continuar."
      );
    }

    const senhaValida = await hash.compare(senha, pessoa.senha as string);

    if (!senhaValida) throw new Error("Usuario e/ou senha inválido(s)");

    const tokenPayload = {
      Usu_Id: pessoa.id,
      Usu_Na: criptografia.descriptografar(pessoa.nome),
      Email: criptografia.descriptografar(pessoa.email),
      Dt_Ex: format(addMinutes(new Date(), 15), "yyyy-MM-dd' 'HH:mm:ss", {
        locale: ptBR,
      }),
      Idp: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    await refreshTokenService.revogarTodasRefreshTokensPorPessoaId(pessoa.id);
    await sessaoUsuarioService.invalidarSessaoPorPessoaId(pessoa.id);

    const novaSessao = await sessaoUsuarioService.criarSessao(
      pessoa.id,
      addDays(new Date(), 3)
    );

    const token = geradorToken({ ...tokenPayload, Ss_Id: novaSessao.id });
    const refreshToken = await refreshTokenService.gerarRefreshToken(
      pessoa.id,
      novaSessao.id
    );
    return {
      tokenAcesso: { token, dataExpiracao: tokenPayload.Dt_Ex },
      refreshToken,
    };
  },

  async criarConta(nome: string, email: string, senha: string) {
    const novoUsuario = await pessoaService.inserir({ email, nome, senha });

    let emailEnviado = false;
    let erroEmail: string | null = null;

    if (novoUsuario) {
      try {
        await emailService.sendEmailConfirmaConta(
          {
            nome: criptografia.descriptografar(novoUsuario.usuario.nome),
            email: criptografia.descriptografar(novoUsuario.usuario.email),
          },
          `${
            process.env.FRONTEND_URL
          }/validaCodigoEmail?codigo=${encodeURIComponent(
            novoUsuario.usuario.codigo_confirmacao!
          )}&confirmarConta=true`
        );

        emailEnviado = true;
      } catch (emailError) {
        erroEmail = (emailError as Error).message;
        console.error("Erro ao enviar email de confirmação:", emailError);
      }
    }

    return { id: novoUsuario.usuario.id, emailEnviado, erroEmail };
  },

  async novoCodigo(email: string) {
    const usuarioExistente = await pessoaService.usuarioExistePorEmailOuId(
      email,
      null
    );

    if (!usuarioExistente) {
      return;
    }

    // if (!usuarioExistente) {
    //   return;
    // }

    const codigo = await codigos.codigoConfirmarConta();

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
    const usuarioExistente = await pessoaService.usuarioExistePorEmailOuId(
      email
    );

    if (!usuarioExistente) {
      return;
    }

    const codigo = await codigos.codigoConfirmarConta();

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

      return { id: usuarioNovoExistente.id, contaConfirmada: true };
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
      id
    );

    return redefineSenhaUsuario.id;
  },
};
