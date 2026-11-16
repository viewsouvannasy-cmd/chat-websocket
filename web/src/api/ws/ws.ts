export function connectWebSocketServer() {
  const socket = new WebSocket("ws://localhost:8000/ws");

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
