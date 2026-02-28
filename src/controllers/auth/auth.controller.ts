import { NextFunction, Request, Response } from "express";
import { authService } from "../../services/auth/auth.service";
import { respostaErro, respostaSucesso } from "../../utils/response";
import { getClientInfo } from "../../helpers/client-info.helper";
import { tokenCookies } from "../../helpers/set-tokens-cookies.helper";
import { hash } from "../../lib/hash";

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const { ip, userAgent } = getClientInfo(req);

      if (!email || !senha) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Email e senha são obrigatórios" }));
      }

      const resultado = await authService.login(email, senha, ip, userAgent);

      tokenCookies.setAuthCookies(
        res,
        resultado.refreshToken.token,
        resultado.tokenAcesso.token,
      );

      // Gera novo CSRF token no login (cookie + header)
      const csrfToken = await hash.geradorCsrfToken();
      tokenCookies.setCsrfCookie(res, csrfToken);

      return res.status(200).json(
        respostaSucesso({
          resultado,
          mensagem: "Login realizado com sucesso",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async criarConta(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json(
            respostaErro({ mensagem: "Nome, email e senha são obrigatórios" }),
          );
      }

      const resultado = await authService.criarConta(nome, email, senha);

      return res.status(201).json(
        respostaSucesso({
          resultado: { id: resultado.id },
          mensagem: resultado.emailEnviado
            ? "Usuário criado com sucesso"
            : "Usuário criado, mas email de confirmação não pôde ser enviado",
          tipoRetorno: resultado.emailEnviado ? 1 : 0,
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async novoCodigo(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Email é obrigatório" }));
      }
      await authService.novoCodigo(email);
      return res.status(200).json(
        respostaSucesso({
          mensagem:
            "Você receberá um email de confirmação se houver uma conta associada a este endereço",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async esqueciMinhaSenha(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Email é obrigatório" }));
      }

      await authService.esqueciMinhaSenha(email);

      return res.status(200).json(
        respostaSucesso({
          mensagem:
            "Você receberá um email com as instruções para redefinir sua senha se houver conta associada a este endereço",
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async validaCodigoEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { codigo, confirmarConta } = req.query;
      if (!codigo) {
        return res
          .status(400)
          .json(respostaErro({ mensagem: "Código é obrigatório" }));
      }

      // Decodifica o código caso venha encoded da URL
      const codigoDecodificado = decodeURIComponent(codigo as string);

      const resultado = await authService.validaCodigoConfirmacaoEmail(
        codigoDecodificado,
        confirmarConta === "true" ? true : false,
      );

      return res.status(200).json(
        respostaSucesso({
          mensagem: `${
            resultado.contaConfirmada
              ? "Conta confirmada com sucesso"
              : "Código válido"
          }`,
          resultado: { pessoa: { ...resultado } },
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },

  async redefinirSenha(req: Request, res: Response, next: NextFunction) {
    try {
      const { senha, confirmacaoSenha, codigo, id } = req.body;

      const resultado = await authService.redefinirSenha(
        senha,
        confirmacaoSenha,
        codigo,
        id,
      );

      return res.status(200).json(
        respostaSucesso({
          mensagem: "Senha alterada com sucesso",
          resultado: { id: resultado },
        }),
      );
    } catch (error: any) {
      return next(error);
    }
  },
};
