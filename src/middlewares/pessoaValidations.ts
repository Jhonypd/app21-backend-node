import { body, param } from "express-validator";

const pessoaCreateValidation = () => {
  return [
    body("nome")
      .isString()
      .withMessage("Nome deve ser uma string")
      .isLength({ min: 3, max: 100 })
      .withMessage("Nome deve ter entre 3 e 100 caracteres"),
    body("email")
      .isEmail()
      .withMessage("Informe um email válido")
      .normalizeEmail(),
    body("senha")
      .isString()
      .withMessage("Senha deve ser uma string")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter pelo menos 6 caracteres"),
  ];
};

const pessoaUpdateValidation = () => {
  return [
    param("id").isUUID().withMessage("Id inválido"),
    body("nome")
      .isString()
      .withMessage("Nome deve ser uma string")
      .isLength({ min: 3, max: 100 })
      .withMessage("Nome deve ter entre 3 e 100 caracteres")
      .optional(),
    body("email")
      .isEmail()
      .withMessage("Informe um email válido")
      .normalizeEmail()
      .optional(),
    // body("senha")
    //   .isString()
    //   .withMessage("Senha deve ser uma string")
    //   .isLength({ min: 6 })
    //   .withMessage("Senha deve ter pelo menos 6 caracteres")
    //   .optional(),
    body("inativo")
      .isBoolean()
      .withMessage("Inativo deve ser um valor booleano")
      .optional(),
  ];
};

const pessoaLoginValidation = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Informe um email válido")
      .normalizeEmail(),
    body("senha")
      .isString()
      .withMessage("Senha deve ser uma string")
      .isLength({ min: 1 })
      .withMessage("Senha é obrigatória"),
  ];
};

// Validação específica para troca de senha
const pessoaChangePasswordValidation = () => {
  return [
    body("senhaAtual")
      .isString()
      .withMessage("Senha atual deve ser uma string")
      .isLength({ min: 1 })
      .withMessage("Senha atual é obrigatória"),
    body("novaSenha")
      .isString()
      .withMessage("Nova senha deve ser uma string")
      .isLength({ min: 6 })
      .withMessage("Nova senha deve ter pelo menos 6 caracteres")
      .custom((value, { req }) => {
        if (value === req.body.senhaAtual) {
          throw new Error("Nova senha deve ser diferente da senha atual");
        }
        return true;
      }),
  ];
};

const pessoaRedefinirSenhaValidation = () => {
  return (
    body("id")
      .isUUID()
      .withMessage("ID inválido")
      .isLength({ min: 1 })
      .withMessage("ID é obrigatório"),
    body("confirmacaoSenha")
      .isString()
      .withMessage("Confirmação de senha inválida")
      .isLength({ min: 6 })
      .withMessage("Confirmação de senha deve ter pelo menos 6 caracteres")
      .custom((value, { req }) => {
        if (value !== req.body.senha) {
          throw new Error("Confirmação de senha não confere com a nova senha");
        }
        return true;
      }),
    body("senha")
      .isString()
      .withMessage("Senha inválida")
      .isLength({ min: 6 })
      .withMessage("Senha deve ter pelo menos 6 caracteres"),
    body("codigo")
      .isString()
      .withMessage("Código inválido")
      .isLength({ min: 1 })
      .withMessage("Código é obrigatório")
  );
};

export {
  pessoaCreateValidation,
  pessoaUpdateValidation,
  pessoaLoginValidation,
  pessoaChangePasswordValidation,
  pessoaRedefinirSenhaValidation,
};
