import mongoose from "mongoose";
import User from "../models/User.js";
import Report from "../models/Report.js";
import {
  sanitizeUser,
  buildChatPref,
  isChatMuted,
  getBlockStatus,
} from "../lib/userHelpers.js";

const invalidChatId = (chatId) => !chatId || !mongoose.Types.ObjectId.isValid(chatId);

export const updateStatus = async (req, res) => {
  try {
    const { presenceStatus, customStatus } = req.body;
    const update = {};
    if (presenceStatus) update.presenceStatus = presenceStatus;
    if (customStatus !== undefined) update.customStatus = customStatus;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
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

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
    res.json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatPrefs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const muted = {};
    (user.mutedChats || []).forEach((c) => {
      if (isChatMuted(user, c.chatId, c.chatType)) {
        muted[c.chatId.toString()] = c.mutedUntil;
      }
    });

    res.json({
      pinned: (user.pinnedChats || []).map((c) => c.chatId.toString()),
      archived: (user.archivedChats || []).map((c) => c.chatId.toString()),
      muted,
      blocked: (user.blockedUsers || []).map((id) => id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "blockedUsers",
      "fullName profilePic email",
    );
    res.json(user.blockedUsers || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockStatusForUser = async (req, res) => {
  try {
    const partner = await User.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "User not found" });
    res.json(getBlockStatus(req.user, partner));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot block yourself" });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { blockedUsers: targetId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid user" });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { blockedUsers: new mongoose.Types.ObjectId(targetId) },
    });
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
      messageId,
      reason,
    });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertChatPref = async (userId, field, chatId, chatType, extra = {}) => {
  const pref = { ...buildChatPref(chatId, chatType), ...extra };
  await User.findByIdAndUpdate(userId, {
    $pull: { [field]: { chatId: pref.chatId, chatType } },
  });
  await User.findByIdAndUpdate(userId, {
    $addToSet: { [field]: pref },
  });
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
    const pref = buildChatPref(chatId, chatType);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { pinnedChats: { chatId: pref.chatId, chatType } },
    });
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
    const pref = buildChatPref(chatId, chatType);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { archivedChats: { chatId: pref.chatId, chatType } },
    });
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
    const pref = buildChatPref(chatId, chatType);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { mutedChats: { chatId: pref.chatId, chatType } },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("sessions");
    res.json(user.sessions || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const revokeSession = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { sessions: { _id: req.params.sessionId } },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({
      _id: user._id,
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
