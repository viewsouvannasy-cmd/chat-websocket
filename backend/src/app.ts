import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middleware/errorHanlder.js";
import notFoundHanlder from "./middleware/notFoundHandler.js";

import authRoute from "./routes/auth-route.js";
import refreshTokenRoute from "./routes/refresh-token-route.js";
import worldChatRoute from "./routes/chat/world-chat-route.js";
import userRoute from "./routes/user-route.js";

import getEnv from "./utils/getEnv.js";
import verifyJwt from "./middleware/token/verifyJwt.js";

const app = express();

app.use(
  cors({
    origin: getEnv("CLIENT_HOST"),
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.use("/auth", authRoute);
app.use("/refresh-token", refreshTokenRoute);

app.use("/world-chat", verifyJwt, worldChatRoute);
app.use("/user", verifyJwt, userRoute);

app.use(errorHandler);
app.use(notFoundHanlder);

export default app;
