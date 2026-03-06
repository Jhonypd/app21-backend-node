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
  votosController.votarOuAtualizar,
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

// DELETE /votos/:id - excluir voto apenas quando o adm/moderador quiser anular o voto de um participante (ex: voto indevido)
router.delete(
  "/:id",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]),
  votosController.deletarVotoPessoa,
);

// DELETE /votos/resetarVotosPorHistoriaSessao - endpoint para resetar votos de uma história-sessão (ex: para reiniciar votação de uma história)
router.delete(
  "/resetarVotosPorHistoriaSessao",
  validateHandler,
  authGuard,
  salaAuthGuard,
  salaPermissaoGuard([0, 1]),
  votosController.resetarVotosPorHistoriaSessao,
);

export default router;
