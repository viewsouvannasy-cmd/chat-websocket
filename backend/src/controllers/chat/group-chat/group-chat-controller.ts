import { Request, Response, NextFunction } from "express";
import { sql } from "../../../config/database.js";

const createGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, group_name } = req.body;

    const [result] = (await sql`
    INSERT INTO groups ( group_name )
    VALUES (
    ${group_name}
    )
    RETURNING g_id, group_name
    `) as [{ g_id: number; group_name: string }];

    await sql`
    INSERT INTO group_members (g_id , user_id ,is_owner)
    VALUES (
    ${result.g_id},
    ${user_id},
    ${true}
    )
    `;

    res.status(201).json({ ok: true, msg: "create success", data: [] });
  } catch (error) {
    next(error);
  }
};

const getGroupList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id } = req.body;

    const result = (await sql`
    SELECT
        gm.g_id,
        g.group_name,
        u.user_id,
        u.user_name,
        gm.is_owner
    FROM group_members as gm
    INNER JOIN groups as g
    ON gm.g_id = g.g_id
    INNER JOIN users as u 
    on gm.user_id = u.user_id
    WHERE gm.g_id IN (
                    SELECT
                    g_id 
                    FROM group_members 
                    WHERE user_id = ${user_id}
                    )
    `) as {
      g_id: number;
      group_name: string;
      user_id: number;
      user_name: string;
      is_owner: boolean;
    }[];

    const finalResult: {
      g_id: number;
      group_name: string;
      is_owner: boolean;
      members: string[];
    }[] = [];

    const existItem: Record<string, { index: number }> = {};

    for (const item of result) {
      if (!existItem[item.g_id]) {
        existItem[item.g_id] = { index: finalResult.length };

        finalResult.push({
          g_id: item.g_id,
          group_name: item.group_name,
          is_owner: item.user_id === user_id && item.is_owner,
          members: [item.user_name],
        });
      } else {
        const index = existItem[item.g_id].index;
        if (!finalResult[index].is_owner) {
          finalResult[index].is_owner =
            item.user_id === user_id && item.is_owner;
        }
        finalResult[index].members.push(item.user_name);
      }
    }

    res.status(200).json({ ok: true, msg: "success", data: finalResult });
  } catch (error) {
    next(error);
  }
};

export { createGroupChat, getGroupList };
