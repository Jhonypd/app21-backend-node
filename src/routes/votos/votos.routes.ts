import { Router } from "express";
import { votosController } from "../../controllers/votos/votos.controller";
import { authGuard } from "../../middlewares/authGuard";
import { validateHandler } from "../../middlewares/handleValidate";
import { salaAuthGuard } from "../../middlewares/salaAuthGuard";
import { salaPermissaoGuard } from "../../middlewares/salaPermissaoGuard";

const router = Router();

// POST /votos/votar
router.post(
  "/votar",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  votosController.votar,
);

/* GET /votos/obterVotosPorHistoriaSessaoSessaoSala */
router.get(
  "/obterVotosPorHistoriaSessaoSessaoSala",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  votosController.obterVotosPorHistoriaSessaoSessaoSala,
);

// DELETE /votos/:id - excluir voto apenas quando o adm/moderador quiser anular o voto
router.delete(
  "/:id",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]),
  votosController.excluirVoto,
);

export default router;
