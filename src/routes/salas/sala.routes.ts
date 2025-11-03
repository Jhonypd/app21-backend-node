import { Router } from "express";
import { salaController } from "../../controllers/salas/sala.controller";
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
  "/loginSala",
  salaLoginValidations(),
  validateHandler,
  authGuard,
  salaController.loginSala
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

export default router;
