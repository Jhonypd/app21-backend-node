import { pessoaRepository } from "../../repositories/pessoa.repository";
import {
  Claims,
  ClaimsAuthSala,
  geradorToken,
  geradorTokenSala,
} from "../../lib/jwt";
import { hash } from "../../lib/hash";
import { criptografia } from "../../lib/criptografia";
import emailService from "../mail/mail.service";
import { codigos } from "../../lib/codigos";
import { pessoaService } from "../pessoas/pessoa.service";
import { formatarParaDataLocal } from "../../utils/formatar-data";
import { addHours, addMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { salaRepository } from "../../repositories/sala.repository";

interface PessoaToken {
  role: number;
  id: string;
  nome: string;
}

export const authService = {
  async login(email: string, senha: string) {
    const usuario = await pessoaService.usuarioExiste(email);

    if (!usuario) throw new Error("Usuário não encontrado");

    if (usuario.inativo) {
      throw new Error(
        "Usuário sem permissão de acesso, entre em contato com o administrador."
      );
    }

    if (usuario.email_confirmado === false) {
      throw new Error(
        "E-mail não confirmado. Por favor, confirme seu e-mail para continuar."
      );
    }

    const senhaValida = await hash.compare(senha, usuario.senha as string);

    if (!senhaValida) throw new Error("Senha inválida");

    const tokenPayload = {
      Usu_Id: usuario.id,
      Usu_na: criptografia.descriptografar(usuario.nome),
      email: criptografia.descriptografar(usuario.email),
      Dt_Ex: format(addHours(new Date(), 10), "yyyy-MM-dd' 'HH:mm:ss", {
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
          `${process.env.API_URL}/validaCodigoEmail?codigo=${encodeURIComponent(
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
    const usuarioExistente = await pessoaService.usuarioExiste(email);

    if (!usuarioExistente) {
      return;
    }

    if (!usuarioExistente.codigo_confirmacao) {
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
    const usuarioExistente = await pessoaService.usuarioExiste(email);

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

  async loginSala(codigo: string, pessoaId: string, senha?: string) {
    // Validações iniciais
    if (!pessoaId) throw new Error("Id da pessoa não fornecido.");
    if (!codigo) throw new Error("Código da sala não fornecido.");

    // Buscar sala
    const sala = await salaRepository.obterPorCodigo(
      Number(codigo),
      pessoaId,
      false
    );
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
        throw new Error("Senha da sala é necessária.");
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
    const dataExpiracao = addHours(new Date(), 1);
    const nomeDescriptografado = await criptografia.descriptografar(
      pessoaInfo.nome
    );

    const tokenPayload: ClaimsAuthSala = {
      Role: role,
      Usu_Id: pessoaInfo.id,
      Usu_na: nomeDescriptografado,
      Sala_Id: sala.id,
      Sala_titulo: sala.titulo,
      Dt_Ex: format(dataExpiracao, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR }),
    };

    const tokenSala = geradorTokenSala(tokenPayload);

    return { tokenSala, dataExpiracao: tokenPayload.Dt_Ex };
  },
};
