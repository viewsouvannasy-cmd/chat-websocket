import { connectDB } from "./config/database.js";
import app from "./app.js";

import http from "http";

import { attachWebSocketServer } from "./ws/ws-server.js";

import getEnv from "./utils/getEnv.js";

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    attachWebSocketServer(server);
    const port = getEnv("PORT") || 7000;
    server.listen(port, () => {
      console.log(`Server is live on port ${port}`);
      console.log(`WebSocket World Chat is live on ws://localhost:${port}/ws`);
    });
  } catch (error) {
    console.log("Server crush!!!");
    console.log(error);
  }
};

startServer();
