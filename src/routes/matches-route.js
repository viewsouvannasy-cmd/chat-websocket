import { Router } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validation/matches-valid.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/matches-status.js";
import { desc } from "drizzle-orm";

const route = Router();

const MAX_LIMIT = 100;

route.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.issues,
    });
  }

  const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createAt))
      .limit(limit);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to get data", error: error });
  }
});

route.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid payload",
      details: parsed.error.issues,
    });
  }

  const {
    data: { startTime, endTime, homeScore, awayScore },
  } = parsed;

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    res.status(201).json({ data: event });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to create match.",
      detail: error,
    });
  }
});

export default route;
