import { Router } from "express";
import { criarSalas, listarSalas } from "../../controllers/salas/sala.controller";
import { authGuard } from "../../middlewares/authGuard";

const router = Router();

router.post("/inserir", authGuard, criarSalas);
router.get("/listarSalas", authGuard, listarSalas);

export default router;
