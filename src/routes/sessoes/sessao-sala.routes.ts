import { Router } from "express";
import { sessaoSalaController } from "../../controllers/sessoes/sessao-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { validateHandler } from "../../middlewares/handleValidate";

const router = Router();

// POST /sessoes/:id/participantes
router.post(
  "/:id/participantes",
  validateHandler,
  authGuard,
  sessaoSalaController.adicionarParticipante
);

// POST /sessoes/:id/revelar
router.post(
  "/:id/revelar",
  validateHandler,
  authGuard,
  sessaoSalaController.revelarVotos
);

// POST /sessoes/:id/resetar
router.post(
  "/:id/resetar",
  validateHandler,
  authGuard,
  sessaoSalaController.resetarVotos
);

// GET /sessoes/:id
router.get(
  "/:id",
  validateHandler,
  authGuard,
  sessaoSalaController.obterSessao
);

// PATCH /sessoes/:id/participa-votacao
router.patch(
  "/:id/participa-votacao",
  validateHandler,
  authGuard,
  sessaoSalaController.atualizarParticipaVotacao
);

export default router;
