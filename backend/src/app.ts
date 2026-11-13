import express from "express";

import errorHandler from "./middleware/errorHanlder.js";
import notFoundHanlder from "./middleware/notFoundHandler.js";

import authRoute from "./routes/auth-route.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.use("/auth", authRoute);

app.use(errorHandler);
app.use(notFoundHanlder);

export default app;
