import express from "express";

// routes
import routeMatches from "./routes/matches-route.js";

const app = express();

const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("EXPRESS SERVER");
});

app.use("/matches", routeMatches);

app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});
