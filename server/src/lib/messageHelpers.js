import { Op } from "sequelize";
import User from "../models/User.js";
import { toId } from "./sequelizeHelpers.js";

export const buildDmQuery = (userId, partnerId) => ({
  groupId: null,
  [Op.or]: [
    { senderId: toId(userId), receiverId: toId(partnerId) },
    { senderId: toId(partnerId), receiverId: toId(userId) },
  ],
  isDeleted: false,
});

export const isDeletedForUser = (message, userId) =>
  (message.deletedFor || []).some((id) => String(id) === String(userId));

export const filterMessageForUser = (message, userId) => {
  const msg = message.get ? message.get({ plain: true }) : { ...message };
  msg._id = msg.id ?? msg._id;
  if (isDeletedForUser(msg, userId)) return null;
  if (msg.isDeleted) {
    return {
      ...msg,
      text: "This message was deleted",
      image: null,
      fileUrl: null,
      voiceUrl: null,
    };
  }
  return msg;
};

export const incrementUnread = async (_User, userId, chatKey) => {
  const user = await User.findByPk(toId(userId));
  if (!user) return;
  const counts = { ...(user.unreadCounts || {}) };
  counts[chatKey] = (counts[chatKey] || 0) + 1;
  user.unreadCounts = counts;
  await user.save();
};

export const clearUnread = async (_User, userId, chatKey) => {
  const user = await User.findByPk(toId(userId));
  if (!user?.unreadCounts?.[chatKey]) return;
  const counts = { ...user.unreadCounts };
  delete counts[chatKey];
  user.unreadCounts = counts;
  await user.save();
};

export const appendReadReceipt = async (where, userId) => {
  const messages = await import("../models/Message.js").then((m) => m.default.findAll({ where }));
  const myId = toId(userId);
  const now = new Date();

  await Promise.all(
    messages.map(async (message) => {
      const alreadyRead = (message.readBy || []).some((r) => String(r.userId) === String(myId));
      if (alreadyRead) return;
      message.readBy = [...(message.readBy || []), { userId: myId, readAt: now }];
      await message.save();
    }),
  );

  return messages.length;
};
