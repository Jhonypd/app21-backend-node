import { Router } from "express";
import { validateHandler } from "../../middlewares/handleValidate";
import { authGuard } from "../../middlewares/authGuard";
import { pessoaController } from "../../controllers/pessoas/pessoa.controller";
import { pessoaUpdateValidation } from "../../middlewares/pessoaValidations";
import { csrfGuard } from "../../middlewares/csrfGuard";

const router = Router();

router.put(
  "/alterar/:id",
  validateHandler,
  authGuard,
  csrfGuard,
  pessoaUpdateValidation(),
  pessoaController.alterar,
);

router.get(
  "/obterDadosConta",
  authGuard,
  csrfGuard,
  pessoaController.obterDadosConta,
);

router.get(
  "/obterDadosAlterar",
  authGuard,
  csrfGuard,
  pessoaController.obterDadosAlterar,
);

router.get(
  "/listarPorNomeOuEmail",
  authGuard,
  csrfGuard,
  pessoaController.listarPorNomeOuEmail,
);

export default router;
