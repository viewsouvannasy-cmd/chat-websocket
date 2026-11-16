import { sql } from "../../../config/database.js";
import { sendMessgae } from "../../../ws/ws-server.js";
import { Request, Response, NextFunction } from "express";

import type { WroldChat } from "../../../types/chat.js";

const getWorldChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const results = await sql`
        SELECT
        wc.*,
        u.user_name
        FROM world_chat as wc
        JOIN users as u
        ON wc.user_id = u.user_id 
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

    const [user] = await sql`
    SELECT
      user_name
    FROM users 
    WHERE user_id = ${user_id}
    `;

    result[0].user_name = user.user_name;
    const data = result[0] as WroldChat;
    sendMessgae(data);

    res
      .status(201)
      .json({ ok: true, msg: "Send World Chat Success", data: result });
  } catch (error) {
    next(error);
  }
};

export { sendWorldChat, getWorldChat };
