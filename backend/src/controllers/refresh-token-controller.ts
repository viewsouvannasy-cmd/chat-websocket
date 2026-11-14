// library
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sql } from "../config/database.js";

// helper function
import getEnv from "../utils/getEnv.js";
import { generateAccessToken } from "../utils/generateToken.js";

// type
import type { JwtPayload } from "jsonwebtoken";

const refreshToken = async (
  req: Request<{}, { ok: boolean; accessToken?: string; msg?: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookie: string | null = req.cookies.jwt_chat;

    if (!cookie) {
      return res.status(401).json({ ok: false, msg: "invalid", data: [] });
    }

    const payload = jwt.verify(
      cookie,
      getEnv("REFRESH_TOKEN_SECRET"),
    ) as JwtPayload;
    if (!payload) {
      return res.status(401).json({ ok: false, msg: "invalid", data: [] });
    }

    const [user] = (await sql`
    SELECT 
    user_id
    FROM users
    WHERE user_id = ${payload.user_id}
    `) as [{ user_id: number }];
    if (!user) {
      return res.status(401).json({ ok: false, msg: "invalid", data: [] });
    }

    const accessToken = generateAccessToken(payload.user_id);

    res.status(201).json({ ok: true, msg: "Success", data: [{ accessToken }] });
  } catch (error) {
    next(error);
  }
};

export { refreshToken };
