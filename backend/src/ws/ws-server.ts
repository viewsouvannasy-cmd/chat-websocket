import { WebSocket, WebSocketServer } from "ws";

import { Server } from "http";

import type { Message } from "../types/chat.js";

let wss: WebSocketServer;

interface ClientSocket extends WebSocket {
  isAlive: boolean;
  userId: number;
  rooms: Set<string>;
}

const rooms = new Map<string, Set<ClientSocket>>();

export function sendMessgae(roomId: string, payload: Message) {
  if (!wss) return;
  payload;

  broadcastToRoom(roomId, payload);
}

function broadcastToRoom(roomId: string, payload: Message) {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const client of room) {
    if (
      client.readyState !== WebSocket.OPEN ||
      client.userId === payload.user_id
    ) {
      continue;
    }

    client.send(JSON.stringify(payload));
  }
}

// ========== handle room ========== //
function joinRoom(socket: ClientSocket, roomId: string) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  socket.send(JSON.stringify(`// ==== ${roomId} ==== //`));
  rooms.get(roomId)?.add(socket);
  socket.rooms.add(roomId);
}

function leaveRoom(socket: ClientSocket, roomId: string) {
  const room = rooms.get(roomId);
  if (!room) {
    return;
  }

  room.delete(socket);
  socket.rooms.delete(roomId);

  if (room.size === 0) {
    rooms.delete(roomId);
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
    socket.rooms = new Set();

    socket.on("message", (raw) => {
      let msg: any;

      try {
        msg = JSON.parse(raw.toString());
      } catch (error) {
        socket.send(JSON.stringify({ ok: false, msg: "Invalid Json" }));
        return;
      }

      if (msg.type === "join-room") {
        if (typeof msg.roomId !== "string") {
          return;
        }
        joinRoom(socket, msg.roomId);
        return;
      }

      if (msg.type === "leave-room") {
        if (typeof msg.roomId !== "string") {
          return;
        }
        leaveRoom(socket, msg.roomId);
        return;
      }
    });

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
