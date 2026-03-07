import { Router } from "express";
import { salaController } from "../../controllers/salas/sala.controller";
import { sessaoSalaController } from "../../controllers/sessao-sala/sessao-sala.controller";
import { participanteSalaController } from "../../controllers/participantes/participante-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { salaAuthGuard } from "../../middlewares/salaAuthGuard";
import { salaPermissaoGuard } from "../../middlewares/salaPermissaoGuard";
import {
  salaAlterarValidations,
  salaDeleteValidations,
  salaInserirValidations,
  salaLoginValidations,
} from "../../middlewares/salaValidations";
import { validateHandler } from "../../middlewares/handleValidate";
import { csrfGuard } from "../../middlewares/csrfGuard";

const router = Router();

// POST /salas/inserir - Criar nova sala
router.post(
  "/inserir",
  salaInserirValidations(),
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.criarSalas,
);

// PUT /salas/alterar/:id - Alterar dados da sala
router.put(
  "/alterar/:id",
  salaAlterarValidations(),
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.alterarSala,
);

// DELETE /salas/:id - Excluir sala (soft delete - apenas dono)
// Validações: não pode ter sessões criadas, não pode ter votos
router.delete(
  "/:id",
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.excluirSala,
);

// Sair da sala (não encerra sessão, apenas marca como offline e não autorizado)
router.post(
  "/:id/sair",
  validateHandler,
  authGuard,
  salaAuthGuard,
  csrfGuard,
  salaController.sairDaSala,
);

// Aprovar reentrada de participante que saiu ou foi kickado
// precisa revisar
router.post(
  "/:id/aprovar-reentrada/:pessoaId",
  validateHandler,
  authGuard,
  salaAuthGuard,
  csrfGuard,
  salaController.aprovarReentrada,
);

router.get(
  "/obterPorCodigo/:codigo",
  validateHandler,
  authGuard,
  salaController.obterPorCodigo,
);

// router.get(
//   "/obterPorId/:id",
//   validateHandler,
//   authGuard,
//   salaController.obterPorId,
// );

// Rotas de gerenciamento de participantes (sem token de sala - para uso na edição)
// POST /salas/:id/participantes/adicionar - Adicionar participante (dono ou admin)
router.post(
  "/:id/participantes/adicionar",
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.adicionarParticipante,
);

// DELETE /salas/:id/participantes/:pessoaId/remover - Remover participante (dono ou admin)
router.delete(
  "/:id/participantes/:pessoaId/remover",
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.removerParticipante,
);

// PATCH /salas/:id/participantes/:pessoaId/role - Alterar role (apenas dono)
router.patch(
  "/:id/participantes/:pessoaId/role",
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.alterarRoleParticipante,
);

// POST /salas/:id/sessoes - Criar nova sessão (dono e admin)
router.post(
  "/:id/sessoes",
  validateHandler,
  csrfGuard,
  authGuard,
  sessaoSalaController.criarSessaoSala,
);

// POST /salas/:id/sessoes/encerrar - Encerrar sessão (dono e admin)
router.post(
  "/:id/sessoes/encerrar",
  validateHandler,
  authGuard,
  salaAuthGuard, // Valida token de sala
  csrfGuard,
  salaPermissaoGuard([0, 1]), // Dono e Admin
  sessaoSalaController.encerrarSessaoSalaAtiva,
);

// PATCH /salas/:id/sessoes/:sessaoId/participantes/:pessoaId/kick - Kickar participante (moderação)
// Admin não pode kickar dono
router.patch(
  "/:id/sessoes/:sessaoId/participantes/:pessoaId/kick",
  validateHandler,
  authGuard,
  salaAuthGuard, // Valida token de sala (necessário para validações)
  csrfGuard,
  salaPermissaoGuard([0, 1]), // Dono e Admin
  sessaoSalaController.kickarParticipanteSessaoSala,
);

// Lista de rotas que já estão no novo padrão de rotas

// PUT /salas/selecionarHistoriaAtual?id=00000000-0000-0000-0000-000000000000 - Selecionar história atual (dono e admin)
router.put(
  "/selecionarHistoriaAtual",
  validateHandler,
  authGuard,
  salaAuthGuard,
  csrfGuard,
  salaPermissaoGuard([0, 1]),
  salaController.selecionarHistoriaAtual,
);

// GET /salas/Entrar - Listar salas do usuário (todas as que participa, incluindo inativas)
router.post(
  "/entrarSala",
  salaLoginValidations(),
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.entrarSala,
);

// GET /salas/obterDadosSessaoAtiva?codigo=XXXXXX - Obter dados da sessão ativa
router.get(
  "/obterDadosSessaoAtiva",
  validateHandler,
  authGuard,
  salaController.obterDadosSessaoAtiva,
);

// GET /salas/listarSalas - Listar salas do usuário (todas as que participa, incluindo inativas)
router.get(
  "/listarSalas", // mudar para GET /salas/ListarSalas
  validateHandler,
  authGuard,
  salaController.listarSalas,
);

// GET /salas/obterDadosFormAlterar?id=00000000-0000-0000-0000-000000000000
router.get(
  "/obterDadosFormAlterar", // mudar para GET /salas/ObterDadosFormAlterar?id=00000000-0000-0000-0000-000000000000
  validateHandler,
  authGuard,
  salaController.obterDadosFormAlterar,
);

// GET /salas/ListarParticipantesSala - Listar participantes permanentes onlines ou não (todos podem ver)
router.get(
  "/ListarParticipantesSala", // já está correta dentro do novo padrão de rotas
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  participanteSalaController.ListarParticipantesSala,
);

export default router;
