import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ClaimsAuthSala } from "../lib/jwt";
import { respostaErro } from "../utils/response";
import { sessaoSalaRepository } from "../repositories/sessao-sala.repository";
import { participanteSessaoRepository } from "../repositories/participante-sessao.repository";

const jwtSecret = process.env.JWT_SECRET as string;

/**
 * Middleware CRÍTICO para validar acesso à sala
 *
 * TRÊS VALIDAÇÕES OBRIGATÓRIAS:
 * 1. Sessão da sala ainda está ativa?
 * 2. Pessoa tem ParticipanteSessao nessa sessão?
 * 3. ParticipanteSessao.autorizado === true? (não foi kickado)
 *
 * Se qualquer validação falhar, retorna 403 com limpar_token: true
 * Frontend DEVE limpar o tokenSala do Redux ao receber limpar_token
 */
export const salaAuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenSala = req.headers["x-token-sala"] as string | undefined;

  if (!tokenSala) {
    return res.status(401).json(
      respostaErro({
        mensagem: "Token da sala não informado.",
        codigoRetorno: 401,
      })
    );
  }

  try {
    const decodedTokenSala = jwt.verify(tokenSala, jwtSecret) as ClaimsAuthSala;

    // VALIDAÇÃO CRÍTICA #0: Verificar se o token é válido para esta sala
    const codigoSalaRota = req.params.codigo || req.params.id;
    if (codigoSalaRota && decodedTokenSala.Sala_Co !== codigoSalaRota && decodedTokenSala.Sala_Id !== codigoSalaRota) {
      return res.status(403).json({
        Sucesso: false,
        Mensagem: "Token não é válido para esta sala.",
        CodigoRetorno: 403,
        Resultado: { limpar_token: true },
      });
    }

    // VALIDAÇÃO CRÍTICA #1: Verificar se sessão ainda está ativa
    const sessao = await sessaoSalaRepository.obterPorId(
      decodedTokenSala.Ss_Sl_Id
    );

    if (!sessao || !sessao.ativa) {
      return res.status(403).json({
        Sucesso: false,
        Mensagem: "Sessão encerrada ou inválida.",
        CodigoRetorno: 403,
        Resultado: { limpar_token: true },
      });
    }

    // VALIDAÇÃO CRÍTICA #2: Verificar se pessoa tem ParticipanteSessao
    const participanteSessao =
      await participanteSessaoRepository.obterPorSessaoEPessoa(
        decodedTokenSala.Ss_Sl_Id,
        decodedTokenSala.Usu_Id
      );

    if (!participanteSessao) {
      return res.status(403).json({
        Sucesso: false,
        Mensagem: "Você não está mais nesta sessão.",
        CodigoRetorno: 403,
        Resultado: { limpar_token: true },
      });
    }

    // VALIDAÇÃO CRÍTICA #3: Verificar se está autorizado (não foi kickado)
    if (!participanteSessao.autorizado) {
      return res.status(403).json({
        Sucesso: false,
        Mensagem: "Você foi removido desta sessão (kick).",
        CodigoRetorno: 403,
        Resultado: { limpar_token: true },
      });
    }

    // Anexar informações da sala no request
    req.sala = {
      Sala_Id: decodedTokenSala.Sala_Id,
      Sala_Co: decodedTokenSala.Sala_Co,
      Sala_titulo: decodedTokenSala.Sala_titulo,
      Role: decodedTokenSala.Role,
      Ss_Sl_Id: decodedTokenSala.Ss_Sl_Id,
      Dt_Ex: decodedTokenSala.Dt_Ex,
      Usu_Id: decodedTokenSala.Usu_Id,
      Usu_Na: decodedTokenSala.Usu_Na,
    };

    next();
  } catch (error) {
    console.error("Erro ao validar token da sala:", error);
    return res.status(401).json({
      Sucesso: false,
      Mensagem: "Token da sala inválido ou expirado.",
      CodigoRetorno: 401,
      Resultado: { limpar_token: true },
    });
  }
};
