import { Router } from "express";
import { salaController } from "../../controllers/salas/sala.controller";
import { sessaoSalaController } from "../../controllers/sessoes/sessao-sala.controller";
import { participanteSalaController } from "../../controllers/participantes/participante-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { salaPermissaoGuard } from "../../middlewares/salaPermissaoGuard";
import {
  salaAlterarValidations,
  salaDeleteValidations,
  salaInserirValidations,
  salaLoginValidations,
} from "../../middlewares/salaValidations";
import { validateHandler } from "../../middlewares/handleValidate";

const router = Router();

router.post(
  "/inserir",
  salaInserirValidations(),
  validateHandler,
  authGuard,
  salaController.criarSalas
);

router.put(
  "/alterar/:id",
  salaAlterarValidations(),
  validateHandler,
  authGuard,
  salaController.alterarSala
);

router.delete(
  "/delete",
  salaDeleteValidations(),
  validateHandler,
  authGuard,
  salaController.deleteSala
);

router.post(
  "/entrar",
  salaLoginValidations(),
  validateHandler,
  authGuard,
  salaController.entrarSala
);

router.get(
  "/listarSalas",
  validateHandler,
  authGuard,
  salaController.listarSalas
);

router.get(
  "/obterPorCodigo/:codigo",
  validateHandler,
  authGuard,
  salaController.obterPorCodigo
);

router.get(
  "/obterPorId/:id",
  validateHandler,
  authGuard,
  salaController.obterPorId
);

// POST /salas/:id/sessoes - Criar sessão (apenas dono)
router.post(
  "/:id/sessoes",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  sessaoSalaController.criarSessao
);

// POST /salas/:id/sessoes/encerrar - Encerrar sessão (apenas dono)
router.post(
  "/:id/sessoes/encerrar",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  sessaoSalaController.encerrarSessao
);

// POST /salas/:id/sessoes/visitantes - Adicionar visitantes (apenas dono)
router.post(
  "/:id/sessoes/visitantes",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  sessaoSalaController.adicionarVisitantes
);

// DELETE /salas/:id/sessoes/visitantes/:pessoaId - Remover visitante (apenas dono)
router.delete(
  "/:id/sessoes/visitantes/:pessoaId",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0]), // Apenas dono
  sessaoSalaController.removerVisitante
);

// POST /salas/:id/participantes - Adicionar participante permanente (dono ou admin)
router.post(
  "/:id/participantes",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0, 1]), // Dono ou admin
  participanteSalaController.adicionarParticipante
);

// DELETE /salas/:id/participantes/:pessoaId - Remover participante permanente (dono ou admin)
router.delete(
  "/:id/participantes/:pessoaId",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0, 1]), // Dono ou admin
  participanteSalaController.removerParticipante
);

// GET /salas/:id/participantes - Listar participantes permanentes
router.get(
  "/:id/participantes",
  validateHandler,
  authGuard,
  salaPermissaoGuard([0, 1, 2, 3]), // Todos podem ver
  participanteSalaController.listarParticipantes
);

export default router;
