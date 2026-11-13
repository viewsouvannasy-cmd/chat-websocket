import { Request, Response, NextFunction } from "express";

import getEnv from "../utils/getEnv.js";

const errorHandler = async (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error);

  res.status(500).json({
    ok: false,
    msg: getEnv("NODE_ENV") === "development" ? error : "Internal Server Error",
    data: [],
  });
};

export default errorHandler;
