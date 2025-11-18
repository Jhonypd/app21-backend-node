import { Router } from "express";
import { votosController } from "../../controllers/votos/votos.controller";
import { authGuard } from "../../middlewares/authGuard";
import { validateHandler } from "../../middlewares/handleValidate";

const router = Router();

// POST /sessoes/:id/votos
router.post("/:id/votos", validateHandler, authGuard, votosController.votar);

// GET /sessoes/:id/votos
router.get(
  "/:id/votos",
  validateHandler,
  authGuard,
  votosController.obterVotos
);

export default router;
