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

const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.body;

    const resultSearch = (await sql`
    SELECT
    user_id,
    user_name
    FROM users 
    WHERE LOWER(user_name) LIKE '%' || LOWER(${search}) || '%'
    `) as { user_id: number; user_name: string }[];

    res
      .status(200)
      .json({ ok: true, msg: "Search success", data: resultSearch });
  } catch (error) {
    next(error);
  }
};

export { getUserData, searchUser };
