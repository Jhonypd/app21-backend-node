import { Request, Response, NextFunction } from "express";
import { respostaErro } from "../utils/response";

/**
 * Middleware que valida se o usuário tem permissão para acessar a rota baseado no role da sala
 * @param tiposPermitidos - Array com os tipos permitidos: 0 (Dono), 1 (Administrador), 2 (Participante), 3 (Visitante)
 * @example
 * router.post('/:id/sessoes', salaPermissaoGuard([0]), controller.criarSessao) // Apenas dono
 * router.post('/:id/historias', salaPermissaoGuard([0, 1]), controller.criar) // Dono e administrador
 * router.post('/:id/votos', salaPermissaoGuard([0, 1, 2]), controller.votar) // Dono, admin e participantes
 */
export const salaPermissaoGuard = (tiposPermitidos: (0 | 1 | 2 | 3)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.Role;

    if (userRole === undefined || !tiposPermitidos.includes(userRole)) {
      return res.status(403).json(
        respostaErro({
          mensagem: "Você não tem permissão para executar esta ação.",
        })
      );
    }

    next();
  };
};
