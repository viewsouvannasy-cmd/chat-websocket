import { getEnv } from "../../utils/getEnv";

export function connectWebSocketServer() {
  const socket = new WebSocket(getEnv("VITE_WS_URL"));

  socket.addEventListener("open", () => {
    console.log("connected");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Connection closed
  socket.addEventListener("close", (event) => {
    console.log("Disconnected", event.code, event.reason);
  });

  return socket;
}
