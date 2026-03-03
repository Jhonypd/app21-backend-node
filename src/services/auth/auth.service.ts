import { pessoaRepository } from "../../repositories/pessoa.repository";
import { Claims, geradorToken } from "../../lib/jwt";
import { hash } from "../../lib/hash";
import { criptografia } from "../../lib/criptografia";
import emailService from "../mail/mail.service";
import { codigos } from "../../lib/codigos-conta";
import { pessoaService } from "../pessoas/pessoa.service";
import { formatarParaDataLocal } from "../../utils/formatar-data";
import { addDays, addMinutes } from "date-fns";
import { refreshTokenService } from "./refresh-token.service";
import { sessaoUsuarioService } from "./sessao-usuario.service";
import { AppError } from "../../lib/errorHandler";

const urlFrontend =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL_PROD || "http://localhost:3004"
    : process.env.FRONTEND_URL || "http://localhost:3000";

export const authService = {
  async login(email: string, senha: string, ip?: string, userAgent?: string) {
    const pessoa = await pessoaService.usuarioExistePorEmailOuId(email, null);

    if (!pessoa) throw new AppError("Usuario e/ou senha inválido(s)", 401);

    if (pessoa.inativo) {
      throw new AppError(
        "Usuário sem permissão de acesso, entre em contato com o administrador.",
        403,
      );
    }

    if (pessoa.email_confirmado === false) {
      throw new AppError(
        "E-mail não confirmado. Por favor, confirme seu e-mail para continuar.",
        401,
      );
    }

    const senhaValida = await hash.compare(senha, pessoa.senha as string);

    if (!senhaValida) throw new AppError("Usuario e/ou senha inválido(s)", 401);

    const tokenPayload = {
      Usuario_Id: pessoa.id,
      Nome: criptografia.descriptografar(pessoa.nome),
      Email: criptografia.descriptografar(pessoa.email),
      Idioma_Padrao: "pt-BR",
      aud: "App21",
      iss: "App21",
    } as Claims;

    await refreshTokenService.revogarTodasRefreshTokensPorPessoaId(pessoa.id);
    await sessaoUsuarioService.invalidarSessaoPorPessoaId(pessoa.id);

    const novaSessao = await sessaoUsuarioService.criarSessao(
      pessoa.id,
      addDays(new Date(), 7),
      ip,
      userAgent,
    );

    const token = geradorToken({
      ...tokenPayload,
      Sessao_Usuario_Id: novaSessao.id,
    });

    const refreshToken = await refreshTokenService.gerarRefreshToken(
      pessoa.id,
      novaSessao.id,
    );

    return {
      tokenAcesso: { token },
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
          `${urlFrontend}/confirmacao-email?codigo=${encodeURIComponent(
            novoUsuario.usuario.codigo_confirmacao!,
          )}&confirmarConta=true`,
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
      null,
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
      addMinutes(new Date(), 30),
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
        `${urlFrontend}/confirmacao-email?codigo=${encodeURIComponent(
          usuario.codigo_confirmacao!,
        )}&confirmarConta=true`,
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de boas-vindas:", emailError);
    }
  },

  async esqueciMinhaSenha(email: string) {
    const usuarioExistente =
      await pessoaService.usuarioExistePorEmailOuId(email);

    if (!usuarioExistente) {
      return;
    }

    const codigo = await codigos.codigoConfirmarConta();

    const usuario = await pessoaRepository.novoCodigo(
      await hash.geradorCamposComuns(email),
      criptografia.criptografar(codigo as string),
      await hash.geradorCamposComuns(codigo as string),
      addMinutes(new Date(), 30),
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
        `${urlFrontend}/redefinicaoValidaCodigo?codigo=${encodeURIComponent(
          usuario.codigo_confirmacao!,
        )}`,
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de boas-vindas:", emailError);
    }
  },

  async validaCodigoConfirmacaoEmail(
    codigo: string,
    confirmarConta: boolean = false,
  ) {
    // O código que vem da URL já está criptografado (é o codigo_confirmacao do banco)
    // Precisamos descriptografar para obter o UUID original e então gerar o hash
    const codigoDescriptografado = criptografia.descriptografar(codigo);

    const usuarioNovoExistente = await pessoaRepository.validaCodigoEmailExiste(
      await hash.geradorCamposComuns(codigoDescriptografado),
    );

    if (!usuarioNovoExistente) {
      throw new AppError(
        "O link de recuperação de senha é inválido. Por favor, solicite um novo link.",
        400,
      );
    }

    if (usuarioNovoExistente.codigo_expiracao! < new Date()) {
      throw new AppError(
        "O link de recuperação de senha expirou. Por favor, solicite um novo link.",
        400,
      );
    }

    if (confirmarConta && usuarioNovoExistente.id) {
      const confirmaContaNovoUsuario =
        await pessoaRepository.confirmarEmailContaNovoUsuario(
          usuarioNovoExistente.id,
        );

      return { id: usuarioNovoExistente.id, contaConfirmada: true };
    } else {
      return {
        id: usuarioNovoExistente.id,
        nome: criptografia.descriptografar(usuarioNovoExistente.nome),
        codigo_expiracao: formatarParaDataLocal(
          usuarioNovoExistente.codigo_expiracao!,
        ),
      };
    }
  },

  async redefinirSenha(
    senha: string,
    confirmacaoSenha: string,
    codigo: string,
    id: string,
  ) {
    if (senha !== confirmacaoSenha) {
      throw new AppError(
        "A confirmação de senha não corresponde à nova senha.",
        400,
      );
    }

    const codigoDescriptografado = criptografia.descriptografar(codigo);

    const usuarioExistente = await pessoaRepository.validaCodigoEmailExiste(
      await hash.geradorCamposComuns(codigoDescriptografado),
    );

    if (!usuarioExistente) {
      throw new AppError(
        "O link de recuperação de senha é inválido. Por favor, solicite um novo link.",
        400,
      );
    }

    if (usuarioExistente.codigo_expiracao! < new Date()) {
      throw new AppError(
        "O link de recuperação de senha expirou. Por favor, solicite um novo link.",
        400,
      );
    }

    const novaSenha = await hash.senha(senha);

    const ultimaSenha = await pessoaRepository.obterSenhaAtual(
      usuarioExistente.id,
    );

    const redefineSenhaUsuario = await pessoaRepository.redefinirSenha(
      usuarioExistente.codigo_confirmacao_hash!,
      novaSenha,
      id,
    );

    return redefineSenhaUsuario.id;
  },
};
