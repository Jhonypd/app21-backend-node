import { Request, Response, NextFunction } from "express";
import { respostaErro } from "../utils/response";

/**
 * Middleware que valida se o usuário tem permissão para acessar a rota baseado no role da sala.
 * O Role vem do token JWT da sala (x-token-sala) decodificado pelo salaAuthGuard.
 *
 * @param tiposPermitidos - Array com os tipos permitidos (4 NÍVEIS):
 *   - 0: Dono da sala (Owner)
 *   - 1: Administrador (Admin)
 *   - 2: Membro/Participante Fixo (Member)
 *   - 3: Visitante (Guest)
 *
 * @example
 * router.delete('/:id', salaPermissaoGuard([0]), controller.excluir) // Apenas dono
 * router.post('/:id/sessoes', salaPermissaoGuard([0, 1]), controller.criar) // Dono e admin
 * router.post('/:id/historias', salaPermissaoGuard([0, 1]), controller.criar) // Dono e admin
 * router.post('/:id/votos', salaPermissaoGuard([0, 1, 2, 3]), controller.votar) // Todos
 */
export const salaPermissaoGuard = (tiposPermitidos: (0 | 1 | 2 | 3)[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // O Role vem do token da sala (x-token-sala), decodificado em req.sala pelo authGuard
    const userRole = req.sala?.Role;

    if (userRole === undefined || userRole === null) {
      return res.status(401).json(
        respostaErro({
          mensagem: "Token da sala não fornecido ou inválido.",
        })
      );
    }

    if (!tiposPermitidos.includes(userRole as 0 | 1 | 2 | 3)) {
      return res.status(403).json(
        respostaErro({
          mensagem: "Você não tem permissão para executar esta ação.",
        })
      );
    }

    next();
  };
};
