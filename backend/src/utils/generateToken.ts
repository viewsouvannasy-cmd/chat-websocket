import jwt from "jsonwebtoken";

import getEnv from "./getEnv.js";

export function generateAccessToken(user_id: number) {
  return jwt.sign({ user_id }, getEnv("ACCESS_TOKEN_SECRET"), {
    expiresIn: "1h",
  });
}

export function generateRefreshToken(user_id: number) {
  return jwt.sign({ user_id }, getEnv("REFRESH_TOKEN_SECRET"), {
    expiresIn: "90d",
  });
}
