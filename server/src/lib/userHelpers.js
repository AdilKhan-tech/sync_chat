import { isValidId, toId } from "./sequelizeHelpers.js";

export const normalizeChatId = (chatId) => toId(chatId);

export const chatPrefKey = (chatType, chatId) =>
  `${chatType}:${chatId?.toString?.() ?? chatId}`;

export const buildChatPref = (chatId, chatType = "user") => ({
  chatId: normalizeChatId(chatId),
  chatType,
});

export const isChatMuted = (user, chatId, chatType = "user") => {
  const id = String(chatId);
  const entry = (user.mutedChats || []).find(
    (c) => c.chatType === chatType && String(c.chatId) === id,
  );
  return !!(entry?.mutedUntil && new Date(entry.mutedUntil) > new Date());
};

export const sanitizeUser = (user) => {
  if (!user) return null;
  const obj = user.get ? user.get({ plain: true }) : { ...user };
  obj._id = obj.id ?? obj._id;
  delete obj.password;
  delete obj.twoFactorSecret;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  return obj;
};

export const isBlocked = (user, otherUserId) =>
  (user.blockedUsers || []).some((id) => String(id) === String(otherUserId));

export const getBlockStatus = (viewer, partner, partnerId = partner?._id ?? partner?.id) => ({
  blockedByMe: isBlocked(viewer, partnerId),
  blockedByThem: partner ? isBlocked(partner, viewer._id ?? viewer.id) : false,
});

export { isValidId };
