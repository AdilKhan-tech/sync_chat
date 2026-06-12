import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getIO } from "../lib/socket.js";
import { isBlocked, isChatMuted, chatPrefKey, getBlockStatus } from "../lib/userHelpers.js";
import {
  buildDmQuery,
  filterMessageForUser,
  incrementUnread,
  clearUnread,
} from "../lib/messageHelpers.js";
import { extractFirstUrl, fetchLinkPreview } from "../lib/linkPreview.js";

const emitMessage = (event, message, userIds) => {
  const io = getIO();
  userIds.forEach((id) => io.to(id.toString()).emit(event, message));
};

const uploadMedia = async (data, resourceType = "image") => {
  if (!data) return null;
  return cloudinary.uploader.upload(data, {
    resource_type: resourceType === "auto" ? "auto" : resourceType,
  });
};

export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.blockedUsers || [] },
    }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchMessages = async (req, res) => {
  try {
    const { q, userId } = req.query;
    if (!q?.trim()) return res.status(400).json({ message: "Query required" });

    const filter = {
      $text: { $search: q },
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
      isDeleted: { $ne: true },
    };
    if (userId) {
      filter.$or = [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ];
    }

    const messages = await Message.find(filter)
      .sort({ timestamp: -1 })
      .limit(50)
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic");

    res.json(messages.map((m) => filterMessageForUser(m, req.user._id)).filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: partnerId } = req.params;
    const partner = await User.findById(partnerId);
    if (!partner) return res.status(404).json({ message: "User not found" });
    const blockStatus = getBlockStatus(req.user, partner, partnerId);

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const before = req.query.before;

    const query = buildDmQuery(myId, partnerId);
    if (before && before !== "false" && before !== "undefined") {
      const beforeDate = new Date(before);
      if (!Number.isNaN(beforeDate.getTime())) {
        query.timestamp = { $lt: beforeDate };
      }
    }

    const messages = await Message.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate("replyTo", "text senderId image messageType");

    const sorted = messages.reverse().map((m) => filterMessageForUser(m, myId)).filter(Boolean);

    if (!blockStatus.blockedByMe) {
      await clearUnread(User, myId, `user:${partnerId}`);
    }
    res.status(200).json({ messages: sorted, hasMore: messages.length === limit, blockStatus });
  } catch (error) {
    console.error("getMessagesByUserId:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const {
      text,
      image,
      file,
      fileName,
      voice,
      voiceDuration,
      replyTo,
    } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "User not found" });
    if (isBlocked(req.user, receiverId)) {
      return res.status(403).json({ message: "You have blocked this user", code: "BLOCKED_BY_ME" });
    }
    if (isBlocked(receiver, senderId)) {
      return res.status(403).json({ message: "This user has blocked you", code: "BLOCKED_BY_THEM" });
    }

    if (!text?.trim() && !image && !file && !voice) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    let imageUrl, fileUrl, voiceUrl, mimeType, fileSize;
    if (image) {
      const up = await uploadMedia(image, "image");
      imageUrl = up.secure_url;
    }
    if (file) {
      const up = await uploadMedia(file, "auto");
      fileUrl = up.secure_url;
      mimeType = up.resource_type;
      fileSize = up.bytes;
    }
    if (voice) {
      const up = await uploadMedia(voice, "video");
      voiceUrl = up.secure_url;
    }

    let messageType = "text";
    if (voiceUrl) messageType = "voice";
    else if (fileUrl && !imageUrl) messageType = "file";
    else if (imageUrl) messageType = "image";

    let linkPreview = null;
    const url = extractFirstUrl(text);
    if (url) linkPreview = await fetchLinkPreview(url);

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text?.trim() || "",
      image: imageUrl,
      fileUrl,
      fileName: fileName || "",
      fileSize,
      mimeType,
      voiceUrl,
      voiceDuration,
      messageType,
      replyTo: replyTo || undefined,
      linkPreview,
      deliveredTo: [{ userId: senderId, readAt: new Date() }],
    });

    if (replyTo) await newMessage.populate("replyTo", "text senderId image messageType");

    await incrementUnread(User, receiverId, `user:${senderId}`);

    emitMessage("newMessage", newMessage, [receiverId, senderId]);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Not found" });
    if (message.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const age = Date.now() - new Date(message.timestamp).getTime();
    if (age > 15 * 60 * 1000) {
      return res.status(400).json({ message: "Edit window expired (15 min)" });
    }

    message.text = text?.trim() || message.text;
    message.editedAt = new Date();
    const url = extractFirstUrl(message.text);
    message.linkPreview = url ? await fetchLinkPreview(url) : null;
    await message.save();

    const targets = message.groupId
      ? []
      : [message.receiverId, message.senderId];
    emitMessage("messageUpdated", message, targets);
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { forEveryone } = req.query;
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Not found" });

    const isSender = message.senderId.toString() === req.user._id.toString();
    if (forEveryone === "true" && isSender) {
      const age = Date.now() - new Date(message.timestamp).getTime();
      if (age > 60 * 60 * 1000) {
        return res.status(400).json({ message: "Delete for everyone window expired" });
      }
      message.isDeleted = true;
      message.text = "";
      message.image = null;
      message.fileUrl = null;
      message.voiceUrl = null;
    } else {
      message.deletedFor.push(req.user._id);
    }
    await message.save();

    const targets = message.groupId ? [] : [message.receiverId, message.senderId];
    emitMessage("messageDeleted", { messageId: message._id, forEveryone: forEveryone === "true" }, targets);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Not found" });

    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== req.user._id.toString(),
    );
    if (emoji) message.reactions.push({ emoji, userId: req.user._id });
    await message.save();

    const targets = message.groupId ? [] : [message.receiverId, message.senderId];
    emitMessage("reactionUpdated", { messageId: message._id, reactions: message.reactions }, targets);
    res.json(message.reactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markChatSeen = async (req, res) => {
  try {
    const { partnerId } = req.params;
    await clearUnread(User, req.user._id, `user:${partnerId}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      {
        senderId: partnerId,
        receiverId: myId,
        "readBy.userId": { $ne: myId },
      },
      { $push: { readBy: { userId: myId, readAt: new Date() } } },
    );

    await clearUnread(User, myId, `user:${partnerId}`);
    getIO().to(partnerId).emit("messagesRead", { readerId: myId, partnerId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportChat = async (req, res) => {
  try {
    const messages = await Message.find(buildDmQuery(req.user._id, req.params.id))
      .sort({ timestamp: 1 })
      .populate("senderId", "fullName");
    res.setHeader("Content-Disposition", "attachment; filename=chat-export.json");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const showArchived = req.query.archived === "true";
    const user = await User.findById(loggedInUserId);
    const archived = new Set((user.archivedChats || []).map((c) => chatPrefKey(c.chatType, c.chatId)));
    const pinned = new Set((user.pinnedChats || []).map((c) => chatPrefKey(c.chatType, c.chatId)));

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      groupId: { $exists: false },
    });

    const partnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const partners = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const partner = await User.findById(partnerId).select("-password");
        if (!partner || isBlocked(user, partnerId)) return null;

        const lastMessage = await Message.findOne(buildDmQuery(loggedInUserId, partnerId))
          .sort({ timestamp: -1 });

        const key = `user:${partnerId}`;
        const unread = user.unreadCounts?.get?.(key) || user.unreadCounts?.[key] || 0;

        const muted = isChatMuted(user, partnerId);
        const blockStatus = getBlockStatus(user, partner, partnerId);
        return {
          ...partner.toObject(),
          lastMessage,
          unread,
          isPinned: pinned.has(chatPrefKey("user", partnerId)),
          isArchived: archived.has(chatPrefKey("user", partnerId)),
          isMuted: muted,
          blockedByMe: blockStatus.blockedByMe,
          blockedByThem: blockStatus.blockedByThem,
          chatType: "user",
        };
      }),
    );

    const filtered = partners.filter(Boolean);
    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const tA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const tB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return tB - tA;
    });

    res.json(filtered.filter((c) => (showArchived ? c.isArchived : !c.isArchived)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
