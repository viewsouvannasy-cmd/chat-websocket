import getEnv from "./getEnv.js";

interface SetCookie {
  httpOnly: true;
  sameSite: "none" | "lax";
  secure: boolean;
  maxAge: number;
}

export function generateCookieRefresh(): SetCookie {
  return {
    httpOnly: true,
    sameSite: getEnv("NODE_ENV") === "production" ? "none" : "lax",
    secure: getEnv("NODE_ENV") === "production",
    maxAge: 90 * 24 * 60 * 60 * 1000,
  };
}
