import type { Request, Response, NextFunction } from "express";
import { sql } from "../../../config/database.js";
import { Message } from "../../../types/chat.js";

const createPToP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, user2_id } = req.body;

    await sql`
    insert into p2p (user1_id , user2_id)
    values (
    ${user_id},
    ${user2_id}
    )
    `;

    res
      .status(201)
      .json({ ok: true, msg: "Create p2p chat success", data: [] });
  } catch (error) {
    next(error);
  }
};

const getP2PList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;

    const result = await sql`
        WITH cte_last_content AS (
        SELECT 
            pp.pp_id,
            pp.user1_id,
            pp.user2_id,
            ppc.content,
            ppc.create_at,
            ppc.user_created,
        ROW_NUMBER() OVER (PARTITION BY pp.pp_id ORDER BY ppc.create_at DESC) AS rn
        FROM p2p AS pp
        LEFT JOIN p2p_chat AS ppc 
            ON pp.pp_id = ppc.pp_id
        WHERE user1_id = ${user_id} or user2_id = ${user_id}
        )

        SELECT 
            cte.pp_id,
            u1.user_name AS u1,
            u2.user_name AS u2,
            CASE 
                WHEN cte.user1_id != ${user_id} THEN 'u1'
                WHEN cte.user2_id != ${user_id} THEN 'u2'
            END AS opposite_user,
            CASE 
                WHEN cte.user_created = ${user_id} THEN 'u1'
                WHEN cte.user_created != ${user_id} THEN 'u2'
            END AS user_create_content,
            cte.content AS last_content,
            cte.create_at
        FROM cte_last_content As cte
        INNER JOIN users AS u1
            ON u1.user_id = cte.user1_id
        INNER JOIN users AS u2 
            ON u2.user_id = cte.user2_id
        WHERE cte.rn = 1
        `;

    res.status(200).json({ ok: true, msg: "success", data: result });
  } catch (error) {
    next(error);
  }
};

const sendMessageP2P = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, content } = req.body;
    const { pp_id } = req.params;

    const [findUser] = (await sql`
    select 
    user_name
    from users 
    where user_id = ${user_id}
    `) as [{ user_name: string }];

    const isUserInPP = await sql`
    select 
    *
    from p2p 
    where pp_id = ${pp_id} AND (user1_id = ${user_id} or user2_id = ${user_id})
    `;
    if (isUserInPP.length === 0) {
      return res
        .status(401)
        .json({ ok: false, msg: "you are not in pp", data: [] });
    }

    const [result] = (await sql`
    insert into p2p_chat (pp_id , user_created, content)
    values (
    ${pp_id},
    ${user_id},
    ${content}
    )
    returning create_at
    `) as [{ create_at: Date }];

    const message: Message = {
      user_id: user_id,
      user_name: findUser.user_name,
      content: content,
      create_at: result.create_at,
    };

    res.status(201).json({ ok: true, msg: "Send success", data: [] });
  } catch (error) {
    next(error);
  }
};

const searchUserForP2P = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, search } = req.body;

    // this include current user id
    const ignoreUserId = (await sql`
    SELECT
      user1_id as user_id
    FROM p2p
    where user1_id = 22 or user2_id = ${user_id}
    GROUP by user1_id
      UNION ALL 
    SELECT 
      user2_id 
    FROM p2p
    where user1_id = 22 or user2_id = ${user_id}
    GROUP by user2_id
    `) as { user_id: number }[];

    const ignoreClean = ignoreUserId.map((row) => row.user_id);

    const results = (await sql`
    select
    user_id,
    user_name
    from users
    where not (user_id = any(${ignoreClean}::int[])) 
      and LOWER(user_name) LIKE '%' || LOWER(${search}) || '%' 
    `) as { user_id: number; user_name: string }[];

    res.status(200).json({ ok: true, msg: "Search success", data: results });
  } catch (error) {
    next(error);
  }
};

export { createPToP, getP2PList, sendMessageP2P, searchUserForP2P };
