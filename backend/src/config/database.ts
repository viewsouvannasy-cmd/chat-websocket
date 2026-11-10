import "dotenv/config";
import { neon } from "@neondatabase/serverless";

import getEnv from "../utils/getEnv.js";

const sql = neon(getEnv("DATABASE_URL"));

const connectDB = async () => {
  try {
    console.time();
    const [connect] = await sql`SELECT NOW()`;
    console.timeEnd();

    console.log("Database conneted", connect.now);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export { connectDB, sql };
