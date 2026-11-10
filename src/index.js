import express from "express";
import http from "http";

// routes
import routeMatches from "./routes/matches-route.js";
import { attachWebSocketServer } from "./ws/server.js";

const app = express();
const server = http.createServer(app);

const port = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("EXPRESS SERVER");
});

app.use("/matches", routeMatches);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(port, () => {
  console.log(`Server is live on port ${port}`);
  console.log(`WebSocket broadcast is live on ws://localhots:${port}/ws`);
});
