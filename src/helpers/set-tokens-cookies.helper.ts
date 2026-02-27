import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

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
      maxAge: 15 * 60 * 1000,
    });
  },

  setCsrfCookie(res: Response, csrfToken: string) {
    res.cookie("csrf_token", csrfToken, {
      ...baseCookieOptions,
      httpOnly: false,
      maxAge: 60 * 60 * 1000,
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
  },
};
