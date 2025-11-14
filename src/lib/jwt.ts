import { differenceInMinutes } from "date-fns";
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
  Ss_Id: string;
}

export interface ClaimsAuthSala extends jwt.JwtPayload {
  Role: number; // 1 - participante, 2 - administrador
  Usu_Id: string;
  Usu_na: string;
  Sala_Id: string;
  Sala_titulo: string;
  Dt_Ex: string;
  Ss_Id: string;
}

export interface ClaimsRefreshToken extends jwt.JwtPayload {
  Usu_Id: string;
  Dt_Ex: string;
}

export const decodeToken = (
  token: string,
  claims: Claims | ClaimsAuthSala | ClaimsRefreshToken
) => {
  const decoded = jwt.verify(token, jwtSecret) as typeof claims;
  return decoded;
};

export const geradorToken = ({
  Usu_Id,
  Usu_na,
  Email,
  Idp,
  aud,
  iss,
  Dt_Ex,
  Ss_Id,
}: Claims) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign({ Usu_Id, Usu_na, Email, Dt_Ex, Idp, Ss_Id }, jwtSecret, {
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
  Ss_Id,
}: ClaimsAuthSala) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign(
    { Usu_Id, Usu_na, Role, Sala_Id, Sala_titulo, Dt_Ex, Ss_Id },
    jwtSecret,
    {
      expiresIn: `${expiresIn}m`,
      algorithm: "HS256",
    }
  );
};

export const geradorRefreshToken = ({ Usu_Id, Dt_Ex }: ClaimsRefreshToken) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign({ Usu_Id, Dt_Ex: Dt_Ex }, jwtSecret, {
    expiresIn: `${expiresIn}m`,
    algorithm: "HS256",
  });
};
