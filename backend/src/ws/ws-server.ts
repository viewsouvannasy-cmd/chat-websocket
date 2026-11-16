import { WebSocket, WebSocketServer } from "ws";

import { Server } from "http";

import type { WroldChat } from "../types/chat.js";

let wss: WebSocketServer;

interface ClientSocket extends WebSocket {
  user_id: number;
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
    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });
}
