import type { Request, Response, NextFunction } from "express";
import { sql } from "../../../config/database.js";
import { Message } from "../../../types/chat.js";
import { sendMessgae } from "../../../ws/ws-server.js";

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
            cte.user_created,
            CASE 
                WHEN cte.user1_id != ${user_id} THEN 'u1'
                WHEN cte.user2_id != ${user_id} THEN 'u2'
            END AS opposite_user,
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
    sendMessgae(`p2p:${pp_id}`, message);

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

const getP2PChatData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { pp_id } = req.params;
    const { user_id } = req.body;

    const [getOppositeUser] = (await sql`
    SELECT 
      u1.user_name AS u1,
      u2.user_name AS u2,
      CASE 
          WHEN pp.user1_id != ${user_id} THEN 'u1'
          WHEN pp.user2_id != ${user_id} THEN 'u2'
      END AS opposite_user,
      CASE 
        WHEN pp.user1_id = 22 THEN 'u1'
        WHEN pp.user2_id = 22 THEN 'u2'
      END AS current_user
    FROM p2p as pp
    INNER JOIN users AS u1
        ON u1.user_id = pp.user1_id
    INNER JOIN users AS u2 
        ON u2.user_id = pp.user2_id
    WHERE pp.pp_id = ${pp_id}
    `) as [
      {
        u1: string;
        u2: string;
        opposite_user: "u1" | "u2";
        current_user: "u1" | "u2";
      },
    ];

    const result = (await sql`
      SELECT 
        u.user_id ,
        u.user_name,
        ppc.content,
        ppc.create_at
      FROM p2p_chat as ppc
      INNER JOIN users as u
        ON ppc.user_created  = u.user_id 
      where ppc.pp_id = ${pp_id}
      `) as Message[];

    res.status(200).json({
      ok: true,
      msg: "scucess",
      data: [
        {
          user_id,
          user_name: getOppositeUser[getOppositeUser.current_user],
          opposite_user_name: getOppositeUser[getOppositeUser.opposite_user],
          chats: result,
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPToP,
  getP2PList,
  sendMessageP2P,
  searchUserForP2P,
  getP2PChatData,
};
