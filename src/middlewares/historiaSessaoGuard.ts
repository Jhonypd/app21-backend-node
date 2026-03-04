import { body, param } from "express-validator";

/**
 * Validações para POST /sessoes/:sessaoId/historias/durante-sessao
 *
 * Contrato esperado:
 * {
 *   adicionar?: Array<{ titulo: string; descricao?: string; ordem: number }>
 *   remover?:   string[]  // UUIDs de HistoriaSala
 * }
 *
 * Regras:
 * - Pelo menos um dos dois campos deve estar presente e não-vazio
 * - adicionar[].titulo  → obrigatório, string 3-200 chars
 * - adicionar[].descricao → opcional, string máx 500 chars
 * - adicionar[].ordem   → obrigatório, inteiro ≥ 1
 * - remover[]           → array de UUIDs válidos
 */
const adicionarHistoriaDuranteSessaoValidations = () => {
  return [
    // Param
    param("sessaoId")
      .isUUID()
      .withMessage("O parâmetro sessaoId deve ser um UUID válido"),

    // Pelo menos um dos campos deve estar presente
    body().custom((_, { req }) => {
      const { adicionar, remover } = req.body as {
        adicionar?: unknown[];
        remover?: unknown[];
      };
      const temAdicionar = Array.isArray(adicionar) && adicionar.length > 0;
      const temRemover = Array.isArray(remover) && remover.length > 0;
      if (!temAdicionar && !temRemover) {
        throw new Error("Informe ao menos um item em 'adicionar' ou 'remover'");
      }
      return true;
    }),

    // ── adicionar ──────────────────────────────────────────────────────────
    body("adicionar")
      .optional()
      .isArray({ min: 1 })
      .withMessage("'adicionar' deve ser um array com pelo menos 1 item"),

    body("adicionar.*.titulo")
      .isString()
      .withMessage("adicionar[].titulo deve ser uma string")
      .trim()
      .notEmpty()
      .withMessage("adicionar[].titulo não pode ser vazio")
      .isLength({ min: 3, max: 200 })
      .withMessage("adicionar[].titulo deve ter entre 3 e 200 caracteres"),

    body("adicionar.*.descricao")
      .optional({ nullable: true })
      .isString()
      .withMessage("adicionar[].descricao deve ser uma string")
      .isLength({ max: 500 })
      .withMessage("adicionar[].descricao deve ter no máximo 500 caracteres"),

    body("adicionar.*.ordem")
      .isInt({ min: 1 })
      .withMessage("adicionar[].ordem deve ser um inteiro maior ou igual a 1")
      .toInt(),

    // ── remover ────────────────────────────────────────────────────────────
    body("remover")
      .optional()
      .isArray({ min: 1 })
      .withMessage("'remover' deve ser um array com pelo menos 1 item"),

    body("remover.*")
      .isUUID()
      .withMessage("Cada item de 'remover' deve ser um UUID válido"),
  ];
};

export { adicionarHistoriaDuranteSessaoValidations };
