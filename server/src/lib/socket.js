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

// Tracks active calls: callId -> { callerId, calleeId, type }
const activeCalls = new Map();

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
        attributes: {
          exclude: [
            "password",
            "twoFactorSecret",
            "resetPasswordToken",
            "resetPasswordExpires",
          ],
        },
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

    console.log("SOCKET CONNECTED:", socket.userId, socket.user.fullName); // DEBUG

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
        io.to(partnerId).emit("messagesRead", {
          readerId: socket.userId,
          partnerId,
        });
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
      await User.update(
        { presenceStatus, customStatus },
        { where: { id: socket.userId } },
      );
      onlineUsers.set(socket.userId, { userId: socket.userId, presenceStatus });
      broadcastOnlineUsers();
    });

    // =====================================================
    // CALL SIGNALING (WebRTC)
    // =====================================================

    // Caller starts a call
    socket.on("call:invite", ({ calleeId, type, callId }) => {
      // ===== DEBUG START =====
      console.log("========== CALL INVITE ==========");
      console.log("FROM (caller):", socket.userId);
      console.log(
        "TO (calleeId received):",
        calleeId,
        "| type:",
        typeof calleeId,
      );
      console.log("ONLINE USERS MAP KEYS:", Array.from(onlineUsers.keys()));
      console.log("==================================");
      // ===== DEBUG END =====

      if (!calleeId || !callId) {
        console.log("REJECTED: missing calleeId or callId"); // DEBUG
        return;
      }

      const calleeOnline = onlineUsers.has(String(calleeId));
      console.log("IS CALLEE ONLINE?", calleeOnline); // DEBUG

      if (!calleeOnline) {
        socket.emit("call:unavailable", { callId, calleeId });
        return;
      }

      activeCalls.set(callId, {
        callerId: socket.userId,
        calleeId: String(calleeId),
        type,
      });

      io.to(String(calleeId)).emit("call:incoming", {
        callId,
        type,
        caller: socket.user,
      });

      console.log("call:incoming EMITTED to room:", String(calleeId)); // DEBUG
    });

    // Callee accepts -> tell caller to start WebRTC offer
    socket.on("call:accept", ({ callId }) => {
      const call = activeCalls.get(callId);
      if (!call) return;

      io.to(call.callerId).emit("call:accepted", { callId });
    });

    // Callee rejects, or caller cancels before pickup
    socket.on("call:reject", ({ callId }) => {
      const call = activeCalls.get(callId);
      if (!call) return;

      const otherId =
        call.callerId === socket.userId ? call.calleeId : call.callerId;

      io.to(otherId).emit("call:rejected", { callId });
      activeCalls.delete(callId);
    });

    // WebRTC offer/answer/ICE relay
    socket.on("call:offer", ({ callId, sdp }) => {
      const call = activeCalls.get(callId);
      if (!call) return;
      const targetId =
        call.callerId === socket.userId ? call.calleeId : call.callerId;
      io.to(targetId).emit("call:offer", { callId, sdp });
    });

    socket.on("call:answer", ({ callId, sdp }) => {
      const call = activeCalls.get(callId);
      if (!call) return;
      const targetId =
        call.callerId === socket.userId ? call.calleeId : call.callerId;
      io.to(targetId).emit("call:answer", { callId, sdp });
    });

    socket.on("call:ice-candidate", ({ callId, candidate }) => {
      const call = activeCalls.get(callId);
      if (!call) return;
      const targetId =
        call.callerId === socket.userId ? call.calleeId : call.callerId;
      io.to(targetId).emit("call:ice-candidate", { callId, candidate });
    });

    // Either side ends an ongoing call
    socket.on("call:end", ({ callId }) => {
      const call = activeCalls.get(callId);
      if (!call) return;
      const otherId =
        call.callerId === socket.userId ? call.calleeId : call.callerId;

      io.to(otherId).emit("call:ended", { callId });
      activeCalls.delete(callId);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(socket.userId);

      // End any active calls involving this user
      for (const [callId, call] of activeCalls.entries()) {
        if (
          call.callerId === socket.userId ||
          call.calleeId === socket.userId
        ) {
          const otherId =
            call.callerId === socket.userId ? call.calleeId : call.callerId;
          io.to(otherId).emit("call:ended", { callId });
          activeCalls.delete(callId);
        }
      }

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
