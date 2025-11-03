import { body, header, param } from "express-validator";

const salaInserirValidations = () => {
  return [
    body("titulo")
      .isString()
      .withMessage("O campo titulo deve ser um valor válido")
      .isLength({ min: 3, max: 100 })
      .withMessage("O campo titulo deve ter entre 3 e 100 caracteres"),
    body("senha")
      .isString()
      .withMessage("O campo senha deve ser um valor válido")
      .isLength({ min: 6, max: 100 })
      .withMessage("O campo senha deve ter no mínimo 6 caracteres")
      .optional(),
    body("salaPrivada")
      .isBoolean()
      .withMessage("O campo salaPrivada deve ser um valor válido")
      .optional(),
    body("pessoaId")
      .isUUID()
      .withMessage("O campo pessoaId deve ser um id válido"),
  ];
};

const salaAlterarValidations = () => {
  return [
    param("id").isUUID().withMessage("O parâmetro id deve ser um id válido"),
    body("titulo")
      .isString()
      .withMessage("O campo titulo deve ser um valor válido")
      .isLength({ min: 3, max: 100 })
      .withMessage("O campo titulo deve ter entre 3 e 100 caracteres")
      .optional(),
    body("senha")
      .isString()
      .withMessage("O campo senha deve ser um valor válido")
      .isLength({ min: 6, max: 100 })
      .withMessage("O campo senha deve ter no mínimo 6 caracteres")
      .optional(),
  ];
};

const salaDeleteValidations = () => {
  return [
    header("IdSala").isUUID().withMessage("O IdSala deve ser um id válido"),
  ];
};

const salaLoginValidations = () => {
  return [
    body("codigo")
      .isString()
      .withMessage("O campo codigo deve ser um valor válido"),
    body("senha")
      .isString()
      .withMessage("O campo senha deve ser um valor válido")
      .isLength({ min: 6, max: 100 })
      .withMessage("O campo senha deve ter no mínimo 6 caracteres")
      .optional(),
  ];
};

export {
  salaInserirValidations,
  salaAlterarValidations,
  salaDeleteValidations,
  salaLoginValidations,
};
