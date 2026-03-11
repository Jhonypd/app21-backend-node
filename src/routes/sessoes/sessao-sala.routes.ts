import { Router } from "express";
import { sessaoSalaController } from "../../controllers/sessao-sala/sessao-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { validateHandler } from "../../middlewares/handleValidate";

const router = Router();

// POST /sessoes/:id/revelar
router.post(
  "/:id/revelar",
  validateHandler,
  authGuard,
  sessaoSalaController.revelarVotosSessaoSala,
);

// POST /sessoes/:id/resetar
router.post(
  "/:id/resetar",
  validateHandler,
  authGuard,
  sessaoSalaController.resetarVotosSessaoSala,
);

export default router;
