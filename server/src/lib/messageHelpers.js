export const buildDmQuery = (userId, partnerId) => ({
  groupId: { $exists: false },
  $or: [
    { senderId: userId, receiverId: partnerId },
    { senderId: partnerId, receiverId: userId },
  ],
  deletedFor: { $nin: [userId] },
  isDeleted: { $ne: true },
});

export const filterMessageForUser = (message, userId) => {
  const msg = message.toObject ? message.toObject() : { ...message };
  if (msg.deletedFor?.some((id) => id.toString() === userId.toString())) {
    return null;
  }
  if (msg.isDeleted) {
    return { ...msg, text: "This message was deleted", image: null, fileUrl: null, voiceUrl: null };
  }
  return msg;
};

export const incrementUnread = async (User, userId, chatKey) => {
  const user = await User.findById(userId);
  if (!user) return;
  const counts = user.unreadCounts || new Map();
  const current = counts.get(chatKey) || 0;
  counts.set(chatKey, current + 1);
  user.unreadCounts = counts;
  await user.save();
};

export const clearUnread = async (User, userId, chatKey) => {
  const user = await User.findById(userId);
  if (!user?.unreadCounts) return;

  const count =
    typeof user.unreadCounts.get === "function"
      ? user.unreadCounts.get(chatKey)
      : user.unreadCounts[chatKey];

  if (!count) return;

  if (typeof user.unreadCounts.delete === "function") {
    user.unreadCounts.delete(chatKey);
  } else {
    delete user.unreadCounts[chatKey];
  }
  await user.save();
};
