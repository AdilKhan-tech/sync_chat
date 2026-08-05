import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://syncchatbackend-vtgo2jo4.b4a.run";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket Connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket Error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};