import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { isDBConnected } from "./db.js";
import { plainUser, toId } from "./sequelizeHelpers.js";
import { appendReadReceipt } from "./messageHelpers.js";

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
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
      });
      if (!user) return next(new Error("Unauthorized"));
      socket.userId = String(user.id);
      socket.user = plainUser(user);
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

    await User.update(
      { lastSeenAt: new Date(), presenceStatus: "online" },
      { where: { id: socket.userId } },
    );

    broadcastOnlineUsers();

    socket.on("messageDelivered", async ({ messageId }) => {
      const message = await Message.findByPk(messageId);
      if (!message) return;
      const exists = (message.deliveredTo || []).some(
        (d) => String(d.userId) === socket.userId,
      );
      if (!exists) {
        message.deliveredTo = [
          ...(message.deliveredTo || []),
          { userId: toId(socket.userId), readAt: new Date() },
        ];
        await message.save();
        io.to(String(message.senderId)).emit("messageDelivered", {
          messageId,
          userId: socket.userId,
        });
      }
    });

    socket.on("markRead", async ({ partnerId }) => {
      const count = await appendReadReceipt(
        {
          senderId: toId(partnerId),
          receiverId: toId(socket.userId),
        },
        socket.userId,
      );
      if (count > 0) {
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
      await User.update({ presenceStatus, customStatus }, { where: { id: socket.userId } });
      onlineUsers.set(socket.userId, { userId: socket.userId, presenceStatus });
      broadcastOnlineUsers();
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(socket.userId);
      await User.update(
        { lastSeenAt: new Date(), presenceStatus: "offline" },
        { where: { id: socket.userId } },
      );
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
