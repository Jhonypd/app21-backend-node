import { Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const tokenCookies = {
  setAuthCookies(res: Response, refreshToken: string, accessToken: string) {
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 7 * 60 * 1000,
    });
  },

  setCsrfCookie(res: Response, csrfToken: string) {
    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });
  },

  clear(res: Response) {
    res.clearCookie("refresh_token", { path: "/" });
    res.clearCookie("access_token", { path: "/" });
    res.clearCookie("csrf_token", { path: "/" });
  },
};
