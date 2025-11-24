import { differenceInMinutes } from "date-fns";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export interface Claims extends jwt.JwtPayload {
  Usu_Id: string;
  Usu_Na: string;
  Email: string;
  Idp: string;
  iss: string;
  aud: string;
  Dt_Ex: string;
  Ss_Id: string;
}

export interface ClaimsAuthSala extends jwt.JwtPayload {
  Role: 0 | 1 | 2 | 3; // 0 = Dono (Owner), 1 = Admin, 2 = Membro (Member), 3 = Visitante (Guest)
  Usu_Id: string;
  Usu_Na: string;
  Sala_Id: string;
  Sala_Co: string; // Código da sala (para redirecionamento no frontend)
  Sala_titulo: string;
  Dt_Ex: string;
  Ss_Sl_Id: string; // ID da SessaoSala (sessão ativa da sala)
}

export interface ClaimsRefreshToken extends jwt.JwtPayload {
  Usu_Id: string;
  Ss_Id: string;
  Dt_Ex: string;
}

type ClaimsType = Claims | ClaimsAuthSala | ClaimsRefreshToken;

export function decodeToken<T extends ClaimsType>(token: string): T {
  const decoded = jwt.verify(token, jwtSecret) as T;
  return decoded;
}

export const geradorToken = ({
  Usu_Id,
  Usu_Na,
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

  return jwt.sign({ Usu_Id, Usu_Na, Email, Dt_Ex, Idp, Ss_Id }, jwtSecret, {
    expiresIn: `${expiresIn}m`,
    audience: aud,
    issuer: iss,
    algorithm: "HS256",
  });
};

export const geradorTokenSala = ({
  Usu_Id,
  Usu_Na,
  Sala_Id,
  Sala_Co,
  Sala_titulo,
  Dt_Ex,
  Role,
  Ss_Sl_Id,
}: ClaimsAuthSala) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign(
    { Usu_Id, Usu_Na, Role, Sala_Id, Sala_Co, Sala_titulo, Dt_Ex, Ss_Sl_Id },
    jwtSecret,
    {
      expiresIn: `${expiresIn}m`,
      algorithm: "HS256",
    }
  );
};

export const geradorRefreshToken = ({
  Usu_Id,
  Dt_Ex,
  Ss_Id,
}: ClaimsRefreshToken) => {
  const agora = new Date();
  const dataExpiracao = new Date(Dt_Ex);

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign({ Usu_Id, Dt_Ex: Dt_Ex, Ss_Id }, jwtSecret, {
    expiresIn: `${expiresIn}m`,
    algorithm: "HS256",
  });
};
