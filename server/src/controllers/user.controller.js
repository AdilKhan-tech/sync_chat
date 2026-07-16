import User from "../models/User.js";
import Report from "../models/Report.js";
import {
  sanitizeUser,
  buildChatPref,
  isChatMuted,
  getBlockStatus,
  isValidId,
} from "../lib/userHelpers.js";
import { toId } from "../lib/sequelizeHelpers.js";

const invalidChatId = (chatId) => !chatId || !isValidId(chatId);

const updateUserFields = async (userId, update) => {
  await User.update(update, { where: { id: userId } });
  return User.findByPk(userId, {
    attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
  });
};

export const updateStatus = async (req, res) => {
  try {
    const { presenceStatus, customStatus } = req.body;
    const update = {};
    if (presenceStatus) update.presenceStatus = presenceStatus;
    if (customStatus !== undefined) update.customStatus = customStatus;

    const user = await updateUserFields(req.user._id, update);
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { theme } = req.body;
    const update = {};
    if (theme) update.theme = theme;

    const user = await updateUserFields(req.user._id, update);
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatPrefs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user._id);
    const muted = {};
    (user.mutedChats || []).forEach((c) => {
      if (isChatMuted(user, c.chatId, c.chatType)) {
        muted[String(c.chatId)] = c.mutedUntil;
      }
    });

    res.json({
      pinned: (user.pinnedChats || []).map((c) => String(c.chatId)),
      archived: (user.archivedChats || []).map((c) => String(c.chatId)),
      muted,
      blocked: (user.blockedUsers || []).map((id) => String(id)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findByPk(req.user._id);
    const blockedIds = user.blockedUsers || [];
    if (!blockedIds.length) return res.json([]);

    const blocked = await User.findAll({
      where: { id: blockedIds },
      attributes: ["id", "fullName", "profilePic", "email"],
    });
    res.json(blocked.map((u) => ({ _id: u.id, fullName: u.fullName, profilePic: u.profilePic, email: u.email })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockStatusForUser = async (req, res) => {
  try {
    const partner = await User.findByPk(req.params.id);
    if (!partner) return res.status(404).json({ message: "User not found" });
    res.json(getBlockStatus(req.user, partner));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (String(targetId) === String(req.user._id)) {
      return res.status(400).json({ message: "Cannot block yourself" });
    }
    const user = await User.findByPk(req.user._id);
    const blocked = [...new Set([...(user.blockedUsers || []), toId(targetId)])];
    user.blockedUsers = blocked;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!isValidId(targetId)) {
      return res.status(400).json({ message: "Invalid user" });
    }
    const user = await User.findByPk(req.user._id);
    user.blockedUsers = (user.blockedUsers || []).filter((id) => String(id) !== String(targetId));
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportUser = async (req, res) => {
  try {
    const { reportedUserId, messageId, reason } = req.body;
    await Report.create({
      reporterId: req.user._id,
      reportedUserId,
      messageId: messageId || null,
      reason,
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertChatPref = async (userId, field, chatId, chatType, extra = {}) => {
  const user = await User.findByPk(userId);
  const pref = { ...buildChatPref(chatId, chatType), ...extra };
  const list = (user[field] || []).filter(
    (c) => !(String(c.chatId) === String(pref.chatId) && c.chatType === pref.chatType),
  );
  list.push(pref);
  user[field] = list;
  await user.save();
};

const removeChatPref = async (userId, field, chatId, chatType) => {
  const user = await User.findByPk(userId);
  const pref = buildChatPref(chatId, chatType);
  user[field] = (user[field] || []).filter(
    (c) => !(String(c.chatId) === String(pref.chatId) && c.chatType === pref.chatType),
  );
  await user.save();
};

export const pinChat = async (req, res) => {
  try {
    const { chatId, chatType = "user" } = req.body;
    if (invalidChatId(chatId)) {
      return res.status(400).json({ message: "Invalid chat" });
    }
    await upsertChatPref(req.user._id, "pinnedChats", chatId, chatType);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unpinChat = async (req, res) => {
  try {
    const { chatId, chatType = "user" } = req.body;
    if (invalidChatId(chatId)) {
      return res.status(400).json({ message: "Invalid chat" });
    }
    await removeChatPref(req.user._id, "pinnedChats", chatId, chatType);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const archiveChat = async (req, res) => {
  try {
    const { chatId, chatType = "user" } = req.body;
    if (invalidChatId(chatId)) {
      return res.status(400).json({ message: "Invalid chat" });
    }
    await upsertChatPref(req.user._id, "archivedChats", chatId, chatType);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unarchiveChat = async (req, res) => {
  try {
    const { chatId, chatType = "user" } = req.body;
    if (invalidChatId(chatId)) {
      return res.status(400).json({ message: "Invalid chat" });
    }
    await removeChatPref(req.user._id, "archivedChats", chatId, chatType);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const muteChat = async (req, res) => {
  try {
    const { chatId, chatType = "user", hours = 24 } = req.body;
    if (invalidChatId(chatId)) {
      return res.status(400).json({ message: "Invalid chat" });
    }
    const mutedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);
    await upsertChatPref(req.user._id, "mutedChats", chatId, chatType, { mutedUntil });
    res.json({ success: true, mutedUntil });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unmuteChat = async (req, res) => {
  try {
    const { chatId, chatType = "user" } = req.body;
    if (invalidChatId(chatId)) {
      return res.status(400).json({ message: "Invalid chat" });
    }
    await removeChatPref(req.user._id, "mutedChats", chatId, chatType);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const user = await User.findByPk(req.user._id, { attributes: ["sessions"] });
    res.json(user.sessions || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const revokeSession = async (req, res) => {
  try {
    const user = await User.findByPk(req.user._id);
    user.sessions = (user.sessions || []).filter(
      (s) => String(s.id) !== String(req.params.sessionId),
    );
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ["id", "fullName", "profilePic", "lastSeenAt", "presenceStatus", "customStatus"],
    });
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({
      _id: user.id,
      fullName: user.fullName,
      profilePic: user.profilePic,
      lastSeenAt: user.lastSeenAt,
      presenceStatus: user.presenceStatus,
      customStatus: user.customStatus,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
