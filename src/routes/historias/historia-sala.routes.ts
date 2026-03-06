import { Router } from "express";
import { historiaSalaController } from "../../controllers/historias/historia-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { salaAuthGuard } from "../../middlewares/salaAuthGuard";
import { validateHandler } from "../../middlewares/handleValidate";
import { salaPermissaoGuard } from "../../middlewares/salaPermissaoGuard";
import { adicionarHistoriaDuranteSessaoValidations } from "../../middlewares/historiaSessaoGuard";

const router = Router();

// POST /historias/adicionarOuRemoverHistoriaSessaoSala
router.post(
  "/historias/adicionarOuRemoverHistoriaSessaoSala",
  adicionarHistoriaDuranteSessaoValidations(),
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]),
  historiaSalaController.adicionarOuRemoverHistoriaSessaoSala,
);

// GET /historias/listarHistoriasPorSessaoSala/:sessaoId
router.get(
  "/historias/listarHistoriasPorSessaoSala/:sessaoId",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1, 2, 3]),
  historiaSalaController.listarHistoriasPorSessaoSala,
);

export default router;
