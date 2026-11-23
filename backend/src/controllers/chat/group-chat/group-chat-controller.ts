import { Request, Response, NextFunction } from "express";
import { sql } from "../../../config/database.js";
import { removeMember } from "./group-char-query.js";

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

const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const { group_id } = req.params;

    const [isOwner] = (await sql`
    select 
    is_owner
    FROM group_members 
    WHERE g_id = ${group_id} AND user_id = ${user_id}`) as {
      is_owner: boolean;
    }[];
    if (!isOwner) {
      res.status(401).json({
        ok: false,
        msg: "you are not be able to delete this group",
        data: [],
      });
    }

    // remove member
    await removeMember(Number(group_id));

    await sql`
    DELETE FROM groups 
    WHERE g_id = ${group_id}
    `;

    res.status(202).json({ ok: true, msg: "Delect success", data: [] });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const { group_id, user_id_to_member } = req.params;

    const [isOwner] = (await sql`
    select 
    is_owner
    FROM group_members 
    WHERE g_id = ${group_id} AND user_id = ${user_id}`) as {
      is_owner: boolean;
    }[];
    if (!isOwner) {
      res.status(401).json({
        ok: false,
        msg: "you are not be able to delete this group",
        data: [],
      });
    }

    // to user from user_id_to_member that it actually have this user in the database
    const [findUser] = (await sql`
    select 
    user_id 
    from users 
    where user_id = ${Number(user_id_to_member)}
    `) as [{ user_id: number }];
    if (!findUser.user_id) {
      return res
        .status(400)
        .json({ ok: false, msg: "user is not exit", data: [] });
    }

    await sql`
    INSERT INTO group_members (g_id, user_id ,is_owner) 
    VALUES (
    ${group_id},
    ${user_id_to_member},
    ${false}
    )
    `;

    res.status(201).json({ ok: true, msg: "add member success", data: [] });
  } catch (error) {
    next(error);
  }
};

// ================= chat  ===================

const sendMessageGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { g_id, gm_id } = req.params;
    const { content } = req.body;

    const message = (await sql`
    INSERT INTO group_chats (g_id, gm_id, content)
    VALUES (
    ${g_id},
    ${gm_id},
    ${content}
    )
    RETURNING gc_id , g_id , gm_id , content
  `) as { gc_id: number; g_id: number; gm_id: number; content: string }[];

    res.status(202).json({ ok: true, msg: "seed message success", data: [] });
  } catch (error) {
    next(error);
  }
};

const getGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { g_id } = req.params;
    const { user_id } = req.body;

    const [userMemberId] = (await sql`
    select 
    gm_id 
    from group_members 
    where g_id = ${g_id} AND user_id = ${user_id}
    `) as { gm_id: number }[];

    const result = (await sql`
    SELECT 
    gc_id,
    g_id,
    gm_id,
    content
    FROM group_chats 
    WHERE g_id = ${g_id}
    `) as { gc_id: number; gm_id: number; content: string }[];

    res.status(200).json({
      ok: true,
      msg: "Success",
      data: [
        {
          user_member_id: userMemberId,
          chats: result,
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

export {
  createGroupChat,
  getGroupList,
  deleteGroup,
  addMember,
  sendMessageGroupChat,
  getGroupChat,
};
