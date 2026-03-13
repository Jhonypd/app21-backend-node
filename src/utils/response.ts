export interface ResponsePadrao {
  Sucesso: boolean;
  Mensagem: string | null;
  Detalhe: string | null;
  CodigoRetorno: number;
  TipoRetorno: number;
  Resultado: any;
  requer_login_sala?: boolean; // Flag para indicar que usuário precisa fazer login na sala
  requer_login?: boolean; // Flag para indicar que usuário precisa fazer login
}

interface ErroParams {
  mensagem: string;
  detalhe?: string | null;
  codigoRetorno?: number;
  tipoRetorno?: number;
  requer_login?: boolean;
  requer_login_sala?: boolean;
}

interface SucessoParams {
  resultado?: any;
  mensagem?: string | null;
  codigoRetorno?: number;
  tipoRetorno?: number;
}

/**
 * Gera uma resposta de sucesso padrão
 * @param mensagem Mensagem de sucesso principal
 * @param resultado Dados opcionais a serem retornados
 * @param codigoRetorno Código HTTP ou interno
 * @param tipoRetorno Tipo de retorno (0 = erro, 1 = sucesso)
 */
export const respostaSucesso = ({
  resultado = null,
  mensagem = "Operação realizada com sucesso",
  codigoRetorno = 200,
  tipoRetorno = 1,
}: SucessoParams): ResponsePadrao => ({
  Sucesso: true,
  Mensagem: mensagem,
  Detalhe: null,
  CodigoRetorno: codigoRetorno,
  TipoRetorno: tipoRetorno,
  Resultado: resultado,
});

/**
 * Gera uma resposta de erro padrão
 * @param mensagem Mensagem de erro principal
 * @param detalhe Detalhe opcional do erro
 * @param codigoRetorno Código HTTP ou interno
 * @param tipoRetorno Tipo de retorno (0 = erro, 1 = sucesso)
 */
export const respostaErro = ({
  mensagem,
  detalhe = null,
  codigoRetorno = 400,
  tipoRetorno = 0,
  requer_login = false,
  requer_login_sala = false,
}: ErroParams): ResponsePadrao => ({
  Sucesso: false,
  Mensagem: mensagem,
  Detalhe: detalhe,
  CodigoRetorno: codigoRetorno,
  TipoRetorno: tipoRetorno,
  Resultado: null,
  ...(requer_login && { requer_login }), // Só inclui se for true
  ...(requer_login_sala && { requer_login_sala }), // Só inclui se for true
});
