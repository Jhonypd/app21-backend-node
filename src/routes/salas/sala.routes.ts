import { Router } from "express";
import { salaController } from "../../controllers/salas/sala.controller";
import { authGuard } from "../../middlewares/authGuard";

const router = Router();

router.post("/inserir", authGuard, salaController.criarSalas);
router.get("/listarSalas", authGuard, salaController.listarSalas);

export default router;
