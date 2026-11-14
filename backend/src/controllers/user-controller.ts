import { Request, Response, NextFunction } from "express";

import { sql } from "../config/database.js";

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;

    const user = await sql`
        SELECT 
        *
        FROM users 
        WHERE user_id = ${user_id}
        `;

    res.status(200).json({ ok: true, msg: "Success", data: user });
  } catch (error) {
    next(error);
  }
};

export { getUserData };
