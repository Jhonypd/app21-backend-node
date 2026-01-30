import { addDays, addHours, addMinutes, differenceInMinutes } from "date-fns";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export interface Claims extends jwt.JwtPayload {
  Usu_Id: string;
  Usu_Na: string;
  Email: string;
  Idp: string;
  iss: string;
  aud: string;
  Ss_Id: string;
}

export interface ClaimsAuthSala extends jwt.JwtPayload {
  Role: 0 | 1 | 2 | 3; // 0 = Dono (Owner), 1 = Admin, 2 = Membro (Member), 3 = Visitante (Guest)
  Usu_Id: string;
  Usu_Na: string;
  Sala_Id: string;
  Sala_Co: string; // Código da sala (para redirecionamento no frontend)
  Sala_titulo: string;
  Ss_Sl_Id: string; // ID da SessaoSala (sessão ativa da sala)
}

export interface ClaimsRefreshToken extends jwt.JwtPayload {
  Usu_Id: string;
  Ss_Id: string;
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
  Ss_Id,
}: Claims) => {
  // 🔥 SIMPLIFICADO: Token válido por 7 dias
  // Sem refresh automático - se expirar, usuário faz login novamente
  return jwt.sign({ Usu_Id, Usu_Na, Email, Idp, Ss_Id }, jwtSecret, {
    expiresIn: "7d",
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
  Role,
  Ss_Sl_Id,
}: ClaimsAuthSala) => {
  const agora = new Date();
  const dataExpiracao = new Date(addHours(agora, 10));

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign(
    { Usu_Id, Usu_Na, Role, Sala_Id, Sala_Co, Sala_titulo, Ss_Sl_Id },
    jwtSecret,
    {
      expiresIn: `${expiresIn}m`,
      algorithm: "HS256",
    },
  );
};

export const geradorRefreshToken = ({ Usu_Id, Ss_Id }: ClaimsRefreshToken) => {
  const agora = new Date();
  const dataExpiracao = new Date(addDays(agora, 1));

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign({ Usu_Id, Ss_Id }, jwtSecret, {
    expiresIn: `${expiresIn}m`,
    algorithm: "HS256",
  });
};
