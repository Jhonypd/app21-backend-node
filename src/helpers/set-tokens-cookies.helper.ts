import { Response } from "express";

const isProduction =
  process.env.NODE_ENV === "production" && process.env.DEPLOY_IIS !== "true";

const baseCookieOptions = {
  path: "/",
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
};

export const tokenCookies = {
  setAuthCookies(res: Response, refreshToken: string, accessToken: string) {
    res.cookie("refresh_token", refreshToken, {
      ...baseCookieOptions,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("access_token", accessToken, {
      ...baseCookieOptions,
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
  },

  setCsrfCookie(res: Response, csrfToken: string) {
    // Seta o cookie
    res.cookie("csrf_token", csrfToken, {
      ...baseCookieOptions,
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
    });

    // Também envia o token em um header customizado para o frontend capturar automaticamente
    res.setHeader("X-CSRF-Token", csrfToken);
  },

  setSalaCookie(res: Response, tokenSala: string) {
    res.cookie("token_sala", tokenSala, {
      ...baseCookieOptions,
      httpOnly: true,
      maxAge: 6 * 60 * 60 * 1000, // 6 horas
    });
  },

  clearTokensCookies(res: Response) {
    res.clearCookie("refresh_token", {
      ...baseCookieOptions,
      httpOnly: true,
    });

    res.clearCookie("access_token", {
      ...baseCookieOptions,
      httpOnly: true,
    });

    res.clearCookie("csrf_token", {
      ...baseCookieOptions,
      httpOnly: false,
    });

    res.clearCookie("token_sala", {
      ...baseCookieOptions,
      httpOnly: true,
    });
  },
};
