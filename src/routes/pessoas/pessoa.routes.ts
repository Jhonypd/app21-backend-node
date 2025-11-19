import { Router } from "express";
import { validateHandler } from "../../middlewares/handleValidate";
import { authGuard } from "../../middlewares/authGuard";
import { pessoaController } from "../../controllers/pessoas/pessoa.controller";
import { pessoaUpdateValidation } from "../../middlewares/pessoaValidations";

const router = Router();

router.put(
  "/alterar/:id",
  authGuard,
  pessoaUpdateValidation(),
  validateHandler,
  pessoaController.alterar
);

router.get("/obterDadosConta", authGuard, pessoaController.obterDadosConta);

router.get("/obterDadosAlterar", authGuard, pessoaController.obterDadosAlterar);

router.get(
  "/listarPorNomeOuEmail",
  authGuard,
  pessoaController.listarPorNomeOuEmail
);

export default router;
