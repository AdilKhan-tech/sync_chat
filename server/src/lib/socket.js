import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { isDBConnected } from "./db.js";

let io;
const onlineUsers = new Map();

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
    cors: { origin: ENV.CLIENT_URL, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      if (!isDBConnected()) return next(new Error("Database unavailable"));
      const token = parseJwtFromCookie(socket.handshake.headers.cookie);
      if (!token) return next(new Error("Unauthorized"));
      const decoded = jwt.verify(token, ENV.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return next(new Error("Unauthorized"));
      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
    socket.join(socket.userId);
    onlineUsers.set(socket.userId, {
      userId: socket.userId,
      presenceStatus: socket.user.presenceStatus || "online",
    });

    await User.findByIdAndUpdate(socket.userId, {
      lastSeenAt: new Date(),
      presenceStatus: "online",
    });

    broadcastOnlineUsers();

    socket.on("messageDelivered", async ({ messageId }) => {
      const message = await Message.findById(messageId);
      if (!message) return;
      const exists = message.deliveredTo?.some(
        (d) => d.userId.toString() === socket.userId,
      );
      if (!exists) {
        message.deliveredTo = message.deliveredTo || [];
        message.deliveredTo.push({ userId: socket.userId, readAt: new Date() });
        await message.save();
        io.to(message.senderId.toString()).emit("messageDelivered", {
          messageId,
          userId: socket.userId,
        });
      }
    });

    socket.on("markRead", async ({ partnerId }) => {
      const result = await Message.updateMany(
        {
          senderId: partnerId,
          receiverId: socket.userId,
          "readBy.userId": { $ne: socket.userId },
        },
        { $push: { readBy: { userId: socket.userId, readAt: new Date() } } },
      );
      if (result.modifiedCount > 0) {
        io.to(partnerId).emit("messagesRead", { readerId: socket.userId, partnerId });
      }
    });

    socket.on("typing", ({ receiverId }) => {
      if (!receiverId) return;
      socket.to(receiverId).emit("userTyping", { senderId: socket.userId });
      io.emit("typingInList", { senderId: socket.userId, receiverId });
    });

    socket.on("stopTyping", ({ receiverId }) => {
      if (!receiverId) return;
      socket.to(receiverId).emit("userStopTyping", { senderId: socket.userId });
    });

    socket.on("updatePresence", async ({ presenceStatus, customStatus }) => {
      await User.findByIdAndUpdate(socket.userId, { presenceStatus, customStatus });
      onlineUsers.set(socket.userId, { userId: socket.userId, presenceStatus });
      broadcastOnlineUsers();
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(socket.userId);
      await User.findByIdAndUpdate(socket.userId, {
        lastSeenAt: new Date(),
        presenceStatus: "offline",
      });
      broadcastOnlineUsers();
    });
  });

  return io;
};

const broadcastOnlineUsers = () => {
  io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  io.emit("onlineUsersMeta", Array.from(onlineUsers.values()));
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
