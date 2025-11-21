import { Router } from "express";
import { historiaSalaController } from "../../controllers/historias/historia-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { salaAuthGuard } from "../../middlewares/salaAuthGuard";
import { validateHandler } from "../../middlewares/handleValidate";
import { salaPermissaoGuard } from "../../middlewares/salaPermissaoGuard";

const router = Router();

// POST /salas/:salaId/historias - Criar história
router.post(
  "/:salaId/historias",
  validateHandler,
  authGuard,
  salaAuthGuard, // Valida token de sala
  salaPermissaoGuard([0, 1]), // Dono ou admin
  historiaSalaController.criar
);

// POST /salas/:salaId/historias/lote - Criar várias histórias de uma vez
router.post(
  "/:salaId/historias/lote",
  validateHandler,
  authGuard,
  salaAuthGuard, // Valida token de sala
  salaPermissaoGuard([0, 1]), // Dono ou admin
  historiaSalaController.criarVarias
);

// GET /salas/:salaId/historias - Listar histórias da sala
router.get(
  "/:salaId/historias",
  validateHandler,
  authGuard,
  salaAuthGuard, // Valida token de sala
  salaPermissaoGuard([0, 1, 2]), // Todos podem ver
  historiaSalaController.listar
);

// GET /historias/:id - Obter história por ID
router.get(
  "/historias/:id",
  validateHandler,
  authGuard,
  historiaSalaController.obterPorId
);

// PUT /historias/:id - Atualizar história
router.put(
  "/historias/:id",
  validateHandler,
  authGuard,
  historiaSalaController.atualizar
);

// DELETE /historias/:id - Deletar história
router.delete(
  "/historias/:id",
  validateHandler,
  authGuard,
  historiaSalaController.deletar
);

export default router;
