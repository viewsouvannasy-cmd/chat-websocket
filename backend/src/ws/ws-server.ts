import { WebSocket, WebSocketServer } from "ws";

import { Server } from "http";

import type { WroldChat } from "../types/chat.js";

let wss: WebSocketServer;

interface ClientSocket extends WebSocket {
  isAlive: boolean;
}

export function sendMessgae(payload: WroldChat) {
  broadcast(wss, payload);
}

function broadcast(wss: WebSocketServer, payload: WroldChat) {
  for (const client of wss.clients) {
    const c = client as ClientSocket;
    if (c.readyState !== WebSocket.OPEN) {
      continue;
    }

    client.send(JSON.stringify({ ...payload, type: "world-chat" }));
  }
}

export function attachWebSocketServer(server: Server) {
  wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024,
  });

  wss.on("connection", (socket: ClientSocket) => {
    socket.isAlive = true;

    socket.on("pong", () => {
      socket.isAlive = true;
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      const ws = client as ClientSocket;
      if (ws.isAlive === false) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 5000);

  wss.on("close", () => clearInterval(interval));
}
