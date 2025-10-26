import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export interface Claims extends jwt.JwtPayload {
  Usu_Id: string;
  Usu_na: string;
  email: string;
  Idp: string;
  iss: string;
  aud: string;
  Dt_Ex: string;
}

export const geradorToken = ({
  Usu_Id,
  Usu_na,
  email,
  Idp,
  aud,
  iss,
  Dt_Ex,
}: Claims) => {
  return jwt.sign({ Usu_Id, Usu_na, email, Dt_Ex, Idp }, jwtSecret, {
    expiresIn: "5h",
    audience: aud,
    issuer: iss,
    algorithm: "HS256",
  });
};
