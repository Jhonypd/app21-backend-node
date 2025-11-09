import { differenceInHours, differenceInMinutes, getTime } from "date-fns";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export interface Claims extends jwt.JwtPayload {
  Usu_Id: string;
  Usu_na: string;
  Email: string;
  Idp: string;
  iss: string;
  aud: string;
  Dt_Ex: string;
}

export interface ClaimsAuthSala extends jwt.JwtPayload {
  Role: number; // 1 - participante, 2 - administrador
  Usu_Id: string;
  Usu_na: string;
  Sala_Id: string;
  Sala_titulo: string;
  Dt_Ex: string;
}

export const geradorToken = ({
  Usu_Id,
  Usu_na,
  Email,
  Idp,
  aud,
  iss,
  Dt_Ex,
}: Claims) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign({ Usu_Id, Usu_na, Email, Dt_Ex, Idp }, jwtSecret, {
    expiresIn: `${expiresIn}m`,
    audience: aud,
    issuer: iss,
    algorithm: "HS256",
  });
};

export const geradorTokenSala = ({
  Usu_Id,
  Usu_na,
  Sala_Id,
  Sala_titulo,
  Dt_Ex,
  Role,
}: ClaimsAuthSala) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign(
    { Usu_Id, Usu_na, Role, Sala_Id, Sala_titulo, Dt_Ex },
    jwtSecret,
    {
      expiresIn: `${expiresIn}m`,
      algorithm: "HS256",
    }
  );
};
