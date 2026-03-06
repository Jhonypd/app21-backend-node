import { Router } from "express";
import { sessaoSalaController } from "../../controllers/sessao-sala/sessao-sala.controller";
import { authGuard } from "../../middlewares/authGuard";
import { validateHandler } from "../../middlewares/handleValidate";

const router = Router();

// POST /sessoes/:id/revelar
router.post(
  "/:id/revelar",
  validateHandler,
  authGuard,
  sessaoSalaController.revelarVotosSessaoSala,
);

// POST /sessoes/:id/resetar
router.post(
  "/:id/resetar",
  validateHandler,
  authGuard,
  sessaoSalaController.resetarVotosSessaoSala,
);

// GET /sessoes/:id
// router.get(
//   "/:id",
//   validateHandler,
//   authGuard,
//   sessaoSalaController.obterSessaoSalaAtiva,
// );

// PATCH /sessoes/:id/participa-votacao
router.patch(
  "/:id/participa-votacao",
  validateHandler,
  authGuard,
  sessaoSalaController.atualizarParticipaVotacaoSessaoSala,
);

// POST /sessoes/:sessaoId/historias/durante-sessao - Adicionar história durante sessão ativa
// router.post(
//   "/:sessaoId/historias/durante-sessao",
//   adicionarHistoriaDuranteSessaoValidations(),
//   validateHandler,
//   authGuard,
//   sessaoSalaController.adicionarHistoriaDuranteSessaoSala,
// );

// GET /sessoes/:sessaoId/historias - Listar todas as histórias da sessão
// router.get(
//   "/:sessaoId/historias",
//   validateHandler,
//   authGuard,
//   sessaoSalaController.listarHistoriasPorSessaoSala,
// );

// GET /sessoes/:sessaoId/historias/:historiaId/votos - Obter votos de uma história específica
// router.get(
//   "/:sessaoId/historias/:historiaId/votos",
//   validateHandler,
//   authGuard,
//   sessaoSalaController.obterVotosPorHistoriaSessaoSala,
// );

export default router;
