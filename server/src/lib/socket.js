import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import User from "../models/User.js";

let io;
const onlineUsers = new Set();

const parseJwtFromCookie = (cookieHeader) => {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("jwt="));
  return match ? match.split("=")[1] : null;
};

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ENV.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = parseJwtFromCookie(socket.handshake.headers.cookie);
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return next(new Error("Unauthorized"));

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(socket.userId);
    onlineUsers.add(socket.userId);
    io.emit("getOnlineUsers", Array.from(onlineUsers));

    socket.on("typing", ({ receiverId }) => {
      if (!receiverId) return;
      socket.to(receiverId).emit("userTyping", { senderId: socket.userId });
    });

    socket.on("stopTyping", ({ receiverId }) => {
      if (!receiverId) return;
      socket.to(receiverId).emit("userStopTyping", { senderId: socket.userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      io.emit("getOnlineUsers", Array.from(onlineUsers));
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
