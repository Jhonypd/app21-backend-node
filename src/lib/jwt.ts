import { addDays, addHours, addMinutes, differenceInMinutes } from "date-fns";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export interface Claims extends jwt.JwtPayload {
  Usuario_Id: string;
  Nome: string;
  Email: string;
  Idioma_Padrao: string;
  Sessao_Usuario_Id: string;
  iss: string;
  aud: string;
}

export interface ClaimsAuthSala extends jwt.JwtPayload {
  Role: 0 | 1 | 2 | 3; // 0 = Dono (Owner), 1 = Admin, 2 = Membro (Member), 3 = Visitante (Guest)
  Usuario_Id: string;
  Nome: string;
  Sala_Id: string;
  Sala_Codigo: string; // Código da sala (para redirecionamento no frontend)
  Sala_Titulo: string;
  Sessao_Sala_Id: string; // ID da SessaoSala (sessão ativa da sala)
}

export interface ClaimsRefreshToken extends jwt.JwtPayload {
  Usuario_Id: string;
  Sessao_Usuario_Id: string;
}

type ClaimsType = Claims | ClaimsAuthSala | ClaimsRefreshToken;

export function decodeToken<T extends ClaimsType>(token: string): T {
  const decoded = jwt.verify(token, jwtSecret) as T;
  return decoded;
}

export const geradorToken = ({
  Usuario_Id,
  Nome,
  Email,
  Idioma_Padrao,
  aud,
  iss,
  Sessao_Usuario_Id,
}: Claims) => {
  return jwt.sign(
    { Usuario_Id, Nome, Email, Idioma_Padrao, Sessao_Usuario_Id },
    jwtSecret,
    {
      expiresIn: "15m",
      audience: aud,
      issuer: iss,
      algorithm: "HS256",
    },
  );
};

export const geradorTokenSala = ({
  Usuario_Id,
  Nome,
  Sala_Id,
  Sala_Codigo,
  Sala_Titulo,
  Role,
  Sessao_Sala_Id,
}: ClaimsAuthSala) => {
  const agora = new Date();
  const dataExpiracao = new Date(addHours(agora, 10));

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign(
    {
      Usuario_Id,
      Nome,
      Role,
      Sala_Id,
      Sala_Codigo,
      Sala_Titulo,
      Sessao_Sala_Id,
    },
    jwtSecret,
    {
      expiresIn: `${expiresIn}m`,
      algorithm: "HS256",
    },
  );
};

export const geradorRefreshToken = ({
  Usuario_Id,
  Sessao_Usuario_Id,
}: ClaimsRefreshToken) => {
  const agora = new Date();
  const dataExpiracao = new Date(addDays(agora, 7));

  const duracaoEmMinutos = differenceInMinutes(dataExpiracao, agora);

  const expiresIn = duracaoEmMinutos ? duracaoEmMinutos + 1 : 1;

  return jwt.sign({ Usuario_Id, Sessao_Usuario_Id }, jwtSecret, {
    expiresIn: `${expiresIn}m`,
    algorithm: "HS256",
  });
};
