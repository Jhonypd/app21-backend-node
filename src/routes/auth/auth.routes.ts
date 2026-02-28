import { Router } from "express";
import { authController } from "../../controllers/auth/auth.controller";
import { validateHandler } from "../../middlewares/handleValidate";
import {
  pessoaCreateValidation,
  pessoaLoginValidation,
  pessoaRedefinirSenhaValidation,
} from "../../middlewares/pessoaValidations";
import { refreshTokenController } from "../../controllers/auth/refreshToken.controller";
import { authGuard } from "../../middlewares/authGuard";

const router = Router();

router.post(
  "/login",
  pessoaLoginValidation(),
  validateHandler,
  authController.login,
);

router.post(
  "/refresh/revogar",
  authGuard,
  validateHandler,
  refreshTokenController.encerrarSessao,
);

router.post(
  "/criarConta",
  pessoaCreateValidation(),
  validateHandler,
  authController.criarConta,
);

router.post("/novoCodigo", validateHandler, authController.novoCodigo);

router.post(
  "/esqueciMinhaSenha",
  validateHandler,
  authController.esqueciMinhaSenha,
);

router.get(
  "/validaCodigoEmail",
  validateHandler,
  authController.validaCodigoEmail,
);

router.put(
  "/redefinirSenha",
  pessoaRedefinirSenhaValidation(),
  validateHandler,
  authController.redefinirSenha,
);

export default router;
