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
    const { group_id, search } = req.body;

    const resultSearch = (await sql`
    SELECT
    user_id,
    user_name
    FROM users 
    WHERE LOWER(user_name) LIKE '%' || LOWER(${search}) || '%' 
      AND user_id NOT IN (
                SELECT 
                user_id 
                FROM group_members 
                WHERE g_id = ${group_id}
                )
    `) as { user_id: number; user_name: string }[];

    res
      .status(200)
      .json({ ok: true, msg: "Search success", data: resultSearch });
  } catch (error) {
    next(error);
  }
};

export { getUserData, searchUser };
