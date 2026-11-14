import { sql } from "../../../config/database.js";

import { Request, Response, NextFunction } from "express";

const getWorldChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const results = await sql`
        SELECT 
        *
        FROM world_chat 
        `;

    res.status(200).json({ ok: true, msg: "Success", data: results });
  } catch (error) {
    next(error);
  }
};

const sendWorldChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, content } = req.body;

    if (!user_id || !content) {
      return res
        .status(400)
        .json({ ok: false, msg: "Please Provide All Require", data: [] });
    }

    const result = await sql`
        INSERT INTO world_chat (user_id, content) 
        VALUES (
        ${user_id},
        ${content}
        )
        RETURNING *
        `;

    res
      .status(201)
      .json({ ok: true, msg: "Send World Chat Success", data: result });
  } catch (error) {
    next(error);
  }
};

export { sendWorldChat, getWorldChat };
