import { Router } from "express";
import { salaController } from "../../controllers/salas/sala.controller";
import { sessaoSalaController } from "../../controllers/sessoes/sessao-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
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

// POST /salas/:id/sessoes
router.post(
  "/:id/sessoes",
  validateHandler,
  authGuard,
  sessaoSalaController.criarSessao
);

export default router;
