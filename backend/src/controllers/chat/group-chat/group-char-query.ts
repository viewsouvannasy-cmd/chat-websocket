import { sql } from "../../../config/database.js";

export const removeMember = async (group_id: number) => {
  await sql`
    DELETE FROM group_members 
    WHERE gm_id = (
                SELECT
                    gm_id
                FROM group_members 
                WHERE  g_id = ${group_id}
                )
    `;
};
