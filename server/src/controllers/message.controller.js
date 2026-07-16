import { Op } from "sequelize";
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
  appendReadReceipt,
  isDeletedForUser,
} from "../lib/messageHelpers.js";
import { extractFirstUrl, fetchLinkPreview } from "../lib/linkPreview.js";
import { textSearchWhere, toId } from "../lib/sequelizeHelpers.js";

const formatMessage = (message) => {
  if (!message) return null;
  const plain = message.get ? message.get({ plain: true }) : { ...message };
  plain._id = plain.id;
  if (plain.replyToMessage) {
    plain.replyTo = {
      _id: plain.replyToMessage.id,
      text: plain.replyToMessage.text,
      senderId: plain.replyToMessage.senderId,
      image: plain.replyToMessage.image,
      messageType: plain.replyToMessage.messageType,
    };
    delete plain.replyToMessage;
  }
  if (plain.sender) {
    plain.senderId = {
      _id: plain.sender.id,
      fullName: plain.sender.fullName,
      profilePic: plain.sender.profilePic,
    };
    delete plain.sender;
  }
  if (plain.receiver) {
    plain.receiverId = {
      _id: plain.receiver.id,
      fullName: plain.receiver.fullName,
      profilePic: plain.receiver.profilePic,
    };
    delete plain.receiver;
  }
  return plain;
};

const emitMessage = (event, message, userIds) => {
  const io = getIO();
  const formatted = formatMessage(message);
  userIds.forEach((id) => io.to(String(id)).emit(event, formatted));
};

const uploadMedia = async (data, resourceType = "image") => {
  if (!data) return null;

  try {
    const result = await cloudinary.uploader.upload(data, {
      resource_type: resourceType,
      timeout: 120000,
    });

    console.log("Cloudinary Upload Success:", result.secure_url);

    return result;

  } catch (error) {
    console.log("Cloudinary Upload Error:");
    console.log(error);
    throw error;
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const blocked = req.user.blockedUsers || [];
    const users = await User.findAll({
      where: {
        id: { [Op.notIn]: [req.user._id, ...blocked] },
      },
      attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
    });
    res.status(200).json(users.map((u) => ({ ...u.get({ plain: true }), _id: u.id })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchMessages = async (req, res) => {
  try {
    const { q, userId } = req.query;
    if (!q?.trim()) return res.status(400).json({ message: "Query required" });

    const filter = {
      ...textSearchWhere(q.trim()),
      isDeleted: false,
      [Op.or]: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    };
    if (userId) {
      filter[Op.or] = [
        { senderId: req.user._id, receiverId: toId(userId) },
        { senderId: toId(userId), receiverId: req.user._id },
      ];
    }

    const messages = await Message.findAll({
      where: filter,
      order: [["timestamp", "DESC"]],
      limit: 50,
      include: [
        { model: User, as: "sender", attributes: ["id", "fullName", "profilePic"] },
        { model: User, as: "receiver", attributes: ["id", "fullName", "profilePic"] },
      ],
    });

    res.json(
      messages
        .filter((m) => !isDeletedForUser(m, req.user._id))
        .map((m) => filterMessageForUser(formatMessage(m), req.user._id))
        .filter(Boolean),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: partnerId } = req.params;
    const partner = await User.findByPk(partnerId);
    if (!partner) return res.status(404).json({ message: "User not found" });
    const blockStatus = getBlockStatus(req.user, partner, partnerId);

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const before = req.query.before;

    const where = buildDmQuery(myId, partnerId);
    if (before && before !== "false" && before !== "undefined") {
      const beforeDate = new Date(before);
      if (!Number.isNaN(beforeDate.getTime())) {
        where.timestamp = { [Op.lt]: beforeDate };
      }
    }

    const messages = await Message.findAll({
      where,
      order: [["timestamp", "DESC"]],
      limit,
      include: [
        {
          model: Message,
          as: "replyToMessage",
          attributes: ["id", "text", "senderId", "image", "messageType"],
        },
      ],
    });

    const sorted = messages
      .reverse()
      .filter((m) => !isDeletedForUser(m, myId))
      .map((m) => filterMessageForUser(formatMessage(m), myId))
      .filter(Boolean);

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

    const receiver = await User.findByPk(receiverId);
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
      receiverId: toId(receiverId),
      text: text?.trim() || "",
      image: imageUrl,
      fileUrl,
      fileName: fileName || "",
      fileSize,
      mimeType,
      voiceUrl,
      voiceDuration,
      messageType,
      replyTo: replyTo ? toId(replyTo) : null,
      linkPreview,
      deliveredTo: [{ userId: senderId, readAt: new Date() }],
    });

    if (replyTo) {
      await newMessage.reload({
        include: [
          {
            model: Message,
            as: "replyToMessage",
            attributes: ["id", "text", "senderId", "image", "messageType"],
          },
        ],
      });
    }

    await incrementUnread(User, receiverId, `user:${senderId}`);

    const formatted = formatMessage(newMessage);
    emitMessage("newMessage", newMessage, [receiverId, senderId]);
    res.status(201).json(formatted);
  } catch (error) {
    console.error("========== SEND MESSAGE ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: error.message,
      stack:
        process.env.NODE_ENV === "development"
          ? error.stack
          : undefined,
    });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = await Message.findByPk(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Not found" });
    if (String(message.senderId) !== String(req.user._id)) {
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

    const targets = message.groupId ? [] : [message.receiverId, message.senderId];
    emitMessage("messageUpdated", message, targets);
    res.json(formatMessage(message));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { forEveryone } = req.query;

    const message = await Message.findByPk(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: "Not found" });
    }

    const isSender = String(message.senderId) === String(req.user._id);

    if (forEveryone === "true" && isSender) {

      const age = Date.now() - new Date(message.timestamp).getTime();

      if (age > 60 * 60 * 1000) {
        return res.status(400).json({
          message: "Delete for everyone window expired"
        });
      }

      // Permanent delete from database
      await message.destroy();

    } else {

      // Delete only for current user
      message.deletedFor = [
        ...(message.deletedFor || []),
        req.user._id
      ];

      await message.save();
    }


    const targets = message.groupId
      ? []
      : [message.receiverId, message.senderId];


    const io = getIO();

    targets.forEach((id) =>
      io.to(String(id)).emit("messageDeleted", {
        messageId: req.params.messageId,
        forEveryone: forEveryone === "true",
      })
    );


    res.json({
      success: true
    });


  } catch (error) {

    console.error("DELETE MESSAGE ERROR:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

export const reactToMessage = async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findByPk(req.params.messageId);
    if (!message) return res.status(404).json({ message: "Not found" });

    message.reactions = (message.reactions || []).filter(
      (r) => String(r.userId) !== String(req.user._id),
    );
    if (emoji) message.reactions.push({ emoji, userId: req.user._id });
    await message.save();

    const targets = message.groupId ? [] : [message.receiverId, message.senderId];
    getIO()
      .to(String(targets[0]))
      .emit("reactionUpdated", { messageId: message.id, reactions: message.reactions });
    if (targets[1]) {
      getIO()
        .to(String(targets[1]))
        .emit("reactionUpdated", { messageId: message.id, reactions: message.reactions });
    }
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

    await appendReadReceipt(
      {
        senderId: toId(partnerId),
        receiverId: toId(myId),
      },
      myId,
    );

    await clearUnread(User, myId, `user:${partnerId}`);
    getIO().to(String(partnerId)).emit("messagesRead", { readerId: myId, partnerId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const exportChat = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: buildDmQuery(req.user._id, req.params.id),
      order: [["timestamp", "ASC"]],
      include: [{ model: User, as: "sender", attributes: ["id", "fullName"] }],
    });
    res.setHeader("Content-Disposition", "attachment; filename=chat-export.json");
    res.json(
      messages.map((m) => {
        const plain = formatMessage(m);
        if (plain.senderId && typeof plain.senderId === "object") {
          plain.senderId = { _id: plain.senderId._id, fullName: plain.senderId.fullName };
        }
        return plain;
      }),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const showArchived = req.query.archived === "true";
    const user = await User.findByPk(loggedInUserId);
    const archived = new Set((user.archivedChats || []).map((c) => chatPrefKey(c.chatType, c.chatId)));
    const pinned = new Set((user.pinnedChats || []).map((c) => chatPrefKey(c.chatType, c.chatId)));

    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        groupId: null,
      },
    });

    const partnerIds = [
      ...new Set(
        messages.map((msg) =>
          String(msg.senderId) === String(loggedInUserId)
            ? String(msg.receiverId)
            : String(msg.senderId),
        ),
      ),
    ];

    const partners = await Promise.all(
      partnerIds.map(async (partnerId) => {
        const partner = await User.findByPk(partnerId, {
          attributes: { exclude: ["password", "twoFactorSecret", "resetPasswordToken", "resetPasswordExpires"] },
        });
        if (!partner || isBlocked(user, partnerId)) return null;

        const lastMessage = await Message.findOne({
          where: buildDmQuery(loggedInUserId, partnerId),
          order: [["timestamp", "DESC"]],
        });

        const key = `user:${partnerId}`;
        const unread = user.unreadCounts?.[key] || 0;

        const muted = isChatMuted(user, partnerId);
        const blockStatus = getBlockStatus(user, partner, partnerId);
        const partnerPlain = { ...partner.get({ plain: true }), _id: partner.id };
        return {
          ...partnerPlain,
          lastMessage: lastMessage ? formatMessage(lastMessage) : null,
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
