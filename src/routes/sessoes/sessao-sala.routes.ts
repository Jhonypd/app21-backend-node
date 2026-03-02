import { Router } from "express";
import { sessaoSalaController } from "../../controllers/sessoes/sessao-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { validateHandler } from "../../middlewares/handleValidate";

const router = Router();

// DEPRECATED: Use POST /salas/:id/participantes instead (unified endpoint)
// Old route: POST /sessoes/:id/participantes - Removed (consolidated)

// POST /sessoes/:id/revelar
router.post(
  "/:id/revelar",
  validateHandler,
  authGuard,
  sessaoSalaController.revelarVotos,
);

// POST /sessoes/:id/resetar
router.post(
  "/:id/resetar",
  validateHandler,
  authGuard,
  sessaoSalaController.resetarVotos,
);

// GET /sessoes/:id
router.get(
  "/:id",
  validateHandler,
  authGuard,
  sessaoSalaController.obterSessao,
);

// PATCH /sessoes/:id/participa-votacao
router.patch(
  "/:id/participa-votacao",
  validateHandler,
  authGuard,
  sessaoSalaController.atualizarParticipaVotacao,
);

// POST /sessoes/:sessaoId/historias/durante-sessao - Adicionar história durante sessão ativa
router.post(
  "/:sessaoId/historias/durante-sessao",
  validateHandler,
  authGuard,
  sessaoSalaController.adicionarHistoriaDuranteSessao,
);

// GET /sessoes/:sessaoId/historias - Listar todas as histórias da sessão
router.get(
  "/:sessaoId/historias",
  validateHandler,
  authGuard,
  sessaoSalaController.listarHistoriasPorSessao,
);

// GET /sessoes/:sessaoId/historias/:historiaId/votos - Obter votos de uma história específica
router.get(
  "/:sessaoId/historias/:historiaId/votos",
  validateHandler,
  authGuard,
  sessaoSalaController.obterVotosPorHistoria,
);

export default router;
