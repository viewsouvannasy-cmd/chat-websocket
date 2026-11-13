import { NextFunction, Request, Response } from "express";

import { sql } from "../config/database.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { generateCookieRefresh } from "../utils/generateCookie.js";

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_name, user_password } = req.body;

    const [findExistingUser] = (await sql`
    SELECT 
        user_id 
    FROM users 
    WHERE user_name = ${user_name}
        AND user_password = ${user_password} 
    `) as [{ user_id: number }] | [];
    if (findExistingUser?.user_id) {
      const accessToken = generateAccessToken(findExistingUser.user_id);
      const refreshToken = generateRefreshToken(findExistingUser.user_id);

      res.cookie("jwt_chat", refreshToken, generateCookieRefresh());

      return res
        .status(200)
        .json({ ok: true, msg: "Login Success", data: [{ accessToken }] });
    }

    const [newUser] = (await sql`
    INSERT INTO users (user_name, user_password)
    VAlUES (
    ${user_name},
    ${user_password}
    )
    RETURNING user_id
    `) as [{ user_id: number }];

    const accessToken = generateAccessToken(newUser.user_id);
    const refreshToken = generateRefreshToken(newUser.user_id);

    res.cookie("jwt_chat", refreshToken, generateCookieRefresh());

    res
      .status(201)
      .json({ ok: true, msg: "Sign In Sccuess", data: [{ accessToken }] });
  } catch (error) {
    next(error);
  }
};

export { signin };
