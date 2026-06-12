import mongoose from "mongoose";

export const normalizeChatId = (chatId) => new mongoose.Types.ObjectId(chatId);

export const chatPrefKey = (chatType, chatId) =>
  `${chatType}:${chatId?.toString?.() ?? chatId}`;

export const buildChatPref = (chatId, chatType = "user") => ({
  chatId: normalizeChatId(chatId),
  chatType,
});

export const isChatMuted = (user, chatId, chatType = "user") => {
  const id = chatId.toString();
  const entry = user.mutedChats?.find(
    (c) => c.chatType === chatType && c.chatId.toString() === id,
  );
  return !!(entry?.mutedUntil && new Date(entry.mutedUntil) > new Date());
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  if (obj.unreadCounts instanceof Map) {
    obj.unreadCounts = Object.fromEntries(obj.unreadCounts);
  }
  return obj;
};

export const isBlocked = (user, otherUserId) =>
  user.blockedUsers?.some((id) => id.toString() === otherUserId.toString());

export const getBlockStatus = (viewer, partner, partnerId = partner?._id) => ({
  blockedByMe: isBlocked(viewer, partnerId),
  blockedByThem: partner ? isBlocked(partner, viewer._id) : false,
});
