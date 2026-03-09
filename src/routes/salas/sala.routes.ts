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

// POST /salas/criarSala - Criar nova sala
router.post(
  "/criarSala",
  salaInserirValidations(),
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.criarSala,
);

// DELETE /salas/excluirSala - Excluir sala (soft delete - apenas dono)
// Validações: não pode ter sessões criadas, não pode ter votos
router.delete(
  "/excluirSala",
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.excluirSala,
);

// GET /salas/obterPorCodigo/:codigo - Obter dados da sala por código
// vou validar o uso dessa rota
router.get(
  "/obterPorCodigo/:codigo",
  validateHandler,
  authGuard,
  salaController.obterPorCodigo,
);

// Sair da sala (não encerra sessão, apenas marca como offline e não autorizado)
router.post(
  "/sairDaSala",
  validateHandler,
  authGuard,
  salaAuthGuard,
  csrfGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  salaController.sairDaSala,
);

// PUT /salas/alterarSala - Alterar dados da sala
router.put(
  "/alterarSala",
  salaAlterarValidations(),
  validateHandler,
  authGuard,
  csrfGuard,
  salaController.alterarSala,
);

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

// GET /historias/listarHistoriasPorSessaoSala - Listar histórias da sessão ativa da sala (todos os participantes)
router.get(
  "/listarHistoriasPorSessaoSala",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]),
  salaController.listarHistoriasPorSessaoSala,
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

// POST /salas/encerrarSessaoSalaAtiva?id={salaId} - Encerrar sessão (dono e admin)
router.post(
  "/encerrarSessaoSalaAtiva",
  validateHandler,
  authGuard,
  salaAuthGuard, // Valida token de sala
  csrfGuard,
  salaPermissaoGuard([0, 1]), // Dono e Admin
  sessaoSalaController.encerrarSessaoSalaAtiva,
);

// GET /salas/obterDadosSessaoAtiva?codigo={codigo} - Obter dados da sessão ativa
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

// GET /salas/obterDadosFormAlterar?id={id}
router.get(
  "/obterDadosFormAlterar",
  validateHandler,
  authGuard,
  salaController.obterDadosFormAlterar,
);

// GET /salas/ListarParticipantesSala - Listar participantes permanentes onlines ou não (todos podem ver)
router.get(
  "/ListarParticipantesSala",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  participanteSalaController.ListarParticipantesSala,
);

export default router;
