import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";
import { getQueue, addToQueue, removeFromQueue } from "../lib/offlineQueue";
import toast from "react-hot-toast";
import { playNotificationSound } from "../lib/sounds";

const isSameUser = (a, b) => String(a) === String(b);

const isDmMessage = (msg, userId, authId) =>
  (isSameUser(msg.senderId, userId) && isSameUser(msg.receiverId, authId)) ||
  (isSameUser(msg.senderId, authId) && isSameUser(msg.receiverId, userId));

const upsertMessage = (messages, message) => {
  const id = String(message._id);
  const existingIdx = messages.findIndex((m) => String(m._id) === id);
  if (existingIdx >= 0) {
    const updated = [...messages];
    updated[existingIdx] = {
      ...updated[existingIdx],
      ...message,
      pending: false,
    };
    return updated;
  }
  const pendingIdx = messages.findIndex((m) => m.pending);
  if (pendingIdx >= 0) {
    const updated = [...messages];
    updated[pendingIdx] = { ...message, pending: false };
    return updated;
  }
  return [...messages, { ...message, pending: false }];
};

const sortChats = (chats) =>
  [...chats].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    const tA = a.lastMessage?.timestamp
      ? new Date(a.lastMessage.timestamp).getTime()
      : 0;
    const tB = b.lastMessage?.timestamp
      ? new Date(b.lastMessage.timestamp).getTime()
      : 0;
    return tB - tA;
  });

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  hasMoreMessages: false,
  activeTab: "chats",
  selectedUser: null,
  isContactsLoading: false,
  isChatsLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  onlineUsers: [],
  onlineMeta: {},
  typingUsers: [],
  typingInList: {},
  lastSeenMap: {},
  unreadCounts: {},
  authUserId: null,
  searchResults: [],
  chatPrefs: { pinned: [], archived: [], muted: {}, blocked: [] },
  showArchivedChats: false,
  blockStatus: { blockedByMe: false, blockedByThem: false },
  blockedUsers: [],

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", String(next));
    set({ isSoundEnabled: next });
    return next;
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (user) => {
    if (user) {
      set({
        selectedUser: user,
        messages: [],
        blockStatus: {
          blockedByMe: get().isUserBlockedByMe(user._id),
          blockedByThem: !!user.blockedByThem,
        },
      });
      get().fetchBlockStatus(user._id);
    } else {
      set({
        selectedUser: null,
        blockStatus: { blockedByMe: false, blockedByThem: false },
      });
    }
  },

  clearUnread: (key) => {
    const { unreadCounts } = get();
    if (unreadCounts[key]) {
      const u = { ...unreadCounts };
      delete u[key];
      set({ unreadCounts: u });
    }
  },

  resetChatState: () =>
    set({
      allContacts: [],
      chats: [],
      messages: [],
      selectedUser: null,
      onlineUsers: [],
      typingUsers: [],
      unreadCounts: {},
      searchResults: [],
      chatPrefs: { pinned: [], archived: [], muted: {}, blocked: [] },
      showArchivedChats: false,
      blockStatus: { blockedByMe: false, blockedByThem: false },
      blockedUsers: [],
    }),

  isUserBlockedByMe: (chatId) =>
    get().chatPrefs.blocked.includes(String(chatId)),

  isMessagingBlocked: () => {
    const { blockStatus } = get();
    return blockStatus.blockedByMe || blockStatus.blockedByThem;
  },

  fetchBlockStatus: async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/block-status/${userId}`);
      set({ blockStatus: res.data });
    } catch {
      set({ blockStatus: { blockedByMe: false, blockedByThem: false } });
    }
  },

  getBlockedUsers: async () => {
    try {
      const res = await axiosInstance.get("/users/blocked");
      set({ blockedUsers: res.data });
      return res.data;
    } catch {
      toast.error("Failed to load blocked users");
      return [];
    }
  },

  isChatPinned: (chatId) => get().chatPrefs.pinned.includes(String(chatId)),

  isChatArchived: (chatId) => get().chatPrefs.archived.includes(String(chatId)),

  isChatMuted: (chatId) => {
    const until = get().chatPrefs.muted[String(chatId)];
    return until && new Date(until) > new Date();
  },

  loadChatPrefs: async () => {
    try {
      const res = await axiosInstance.get("/users/chat-prefs");
      set({ chatPrefs: res.data });
    } catch {
      /* prefs are optional for core chat */
    }
  },

  syncUserProfile: (user) => {
    if (!user?._id) return;
    const id = String(user._id);
    set((state) => ({
      selectedUser:
        state.selectedUser && String(state.selectedUser._id) === id
          ? { ...state.selectedUser, ...user }
          : state.selectedUser,
      chats: state.chats.map((c) =>
        String(c._id) === id ? { ...c, ...user } : c,
      ),
      allContacts: state.allContacts.map((c) =>
        String(c._id) === id ? { ...c, ...user } : c,
      ),
    }));
  },

  markMessagesRead: async (partnerId) => {
    if (!partnerId) return;
    const { blockStatus } = get();
    if (blockStatus.blockedByMe || blockStatus.blockedByThem) return;

    get().clearUnread(`user:${partnerId}`);
    try {
      await axiosInstance.post(`/messages/read/${partnerId}`);
    } catch {
      /* non-critical */
    }
  },

  bumpChatPreview: (partnerId, lastMessage) => {
    const { chats } = get();
    const id = String(partnerId);
    const idx = chats.findIndex((c) => String(c._id) === id);
    if (idx === -1) {
      get().getMyChatPartners();
      return;
    }
    const next = [...chats];
    next[idx] = { ...next[idx], lastMessage };
    set({ chats: sortChats(next) });
  },

  connectSocket: () => {
    const socket = connectSocket();
    if (socket.listeners("newMessage").length > 0) return;

    socket.on("getOnlineUsers", (ids) => set({ onlineUsers: ids }));
    socket.on("onlineUsersMeta", (meta) => {
      const map = {};
      meta.forEach((m) => {
        map[m.userId] = m;
      });
      set({ onlineMeta: map });
    });

    socket.on("newMessage", (message) => {
      const { selectedUser, messages, authUserId } = get();
      if (!authUserId) return;

      const inDm =
        selectedUser && isDmMessage(message, selectedUser._id, authUserId);

      if (inDm) {
        set({ messages: upsertMessage(messages, message) });
        if (!isSameUser(message.senderId, authUserId)) {
          socket.emit("messageDelivered", { messageId: message._id });
          get().markMessagesRead(message.senderId);
        }
        get().bumpChatPreview(
          isSameUser(message.senderId, authUserId)
            ? message.receiverId
            : message.senderId,
          message,
        );
      } else if (!isSameUser(message.senderId, authUserId)) {
        const key = `user:${message.senderId}`;
        const { unreadCounts, isSoundEnabled } = get();
        set({
          unreadCounts: {
            ...unreadCounts,
            [key]: (unreadCounts[key] || 0) + 1,
          },
        });
        if (isSoundEnabled && !get().isChatMuted(message.senderId)) {
          playNotificationSound();
        }
        socket.emit("messageDelivered", { messageId: message._id });
        get().bumpChatPreview(message.senderId, message);
      }
    });

    socket.on("messageUpdated", (msg) => {
      set({
        messages: get().messages.map((m) => (m._id === msg._id ? msg : m)),
      });
    });

    socket.on("messageDeleted", ({ messageId }) => {
      set({ messages: get().messages.filter((m) => m._id !== messageId) });
    });

    socket.on("reactionUpdated", ({ messageId, reactions }) => {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m,
        ),
      });
    });

    socket.on("messageDelivered", ({ messageId, userId }) => {
      set({
        messages: get().messages.map((m) => {
          if (m._id !== messageId) return m;
          const exists = m.deliveredTo?.some(
            (d) => String(d.userId) === String(userId),
          );
          if (exists) return m;
          return {
            ...m,
            deliveredTo: [
              ...(m.deliveredTo || []),
              { userId, readAt: new Date() },
            ],
          };
        }),
      });
    });

    socket.on("messagesRead", ({ readerId }) => {
      const authId = get().authUserId;
      set({
        messages: get().messages.map((m) => {
          if (
            !isSameUser(m.senderId, authId) ||
            !isSameUser(m.receiverId, readerId)
          ) {
            return m;
          }
          const alreadyRead = m.readBy?.some(
            (r) => String(r.userId) === String(readerId),
          );
          if (alreadyRead) return m;
          return {
            ...m,
            readBy: [
              ...(m.readBy || []),
              { userId: readerId, readAt: new Date() },
            ],
          };
        }),
      });
    });

    socket.on("userTyping", ({ senderId }) => {
      const { typingUsers } = get();
      if (!typingUsers.includes(senderId)) {
        set({ typingUsers: [...typingUsers, senderId] });
      }
    });

    socket.on("userStopTyping", ({ senderId }) => {
      set({ typingUsers: get().typingUsers.filter((id) => id !== senderId) });
    });

    socket.on("typingInList", ({ senderId, receiverId }) => {
      if (isSameUser(receiverId, get().authUserId)) {
        set({ typingInList: { ...get().typingInList, [senderId]: true } });
        setTimeout(() => {
          const t = { ...get().typingInList };
          delete t[senderId];
          set({ typingInList: t });
        }, 3000);
      }
    });
  },

  setAuthUserId: (userId) => set({ authUserId: userId }),

  disconnectSocket: () => {
    disconnectSocket();
    get().resetChatState();
  },

  getAllContacts: async (search = "") => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      let contacts = res.data;
      if (search) {
        const q = search.toLowerCase();
        contacts = contacts.filter(
          (c) =>
            c.fullName?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q),
        );
      }
      set({ allContacts: contacts });
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      set({ isContactsLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isChatsLoading: true });
    try {
      const { showArchivedChats } = get();
      const res = await axiosInstance.get("/messages/chats", {
        params: { archived: showArchivedChats ? "true" : "false" },
      });
      const counts = {};
      res.data.forEach((c) => {
        if (c.unread) counts[`user:${c._id}`] = c.unread;
      });
      set({
        chats: res.data,
        unreadCounts: { ...get().unreadCounts, ...counts },
      });
      get().loadChatPrefs();
    } catch {
      toast.error("Failed to load chats");
    } finally {
      set({ isChatsLoading: false });
    }
  },

  setShowArchivedChats: (show) => {
    set({ showArchivedChats: show, selectedUser: null });
    get().getMyChatPartners();
  },

  getMessages: async (loadMore = false) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) return;

    set({ isMessagesLoading: !loadMore });

    try {
      const params = { limit: 50 };
      if (loadMore && messages[0]?.timestamp) {
        params.before = messages[0].timestamp;
      }

      const res = await axiosInstance.get(`/messages/${selectedUser._id}`, {
        params,
      });
      const { messages: msgs, hasMore, blockStatus } = res.data;

      const status = blockStatus || {
        blockedByMe: false,
        blockedByThem: false,
      };
      set({
        messages: loadMore ? [...msgs, ...messages] : msgs,
        hasMoreMessages: hasMore,
        blockStatus: status,
      });
      if (!loadMore && !status.blockedByMe && !status.blockedByThem) {
        get().markMessagesRead(selectedUser._id);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  searchMessages: async (q) => {
    if (!q?.trim()) return set({ searchResults: [] });
    try {
      const res = await axiosInstance.get("/messages/search", {
        params: { q },
      });
      set({ searchResults: res.data });
    } catch {
      toast.error("Search failed");
    }
  },

  sendMessage: async (payload) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      senderId: get().authUserId,
      receiverId: selectedUser._id,
      text: payload.text,
      image: payload.imagePreview,
      timestamp: new Date().toISOString(),
      pending: true,
    };

    set({ isSendingMessage: true, messages: [...get().messages, optimistic] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload,
      );
      const withoutTemp = get().messages.filter((m) => m._id !== tempId);
      set({ messages: upsertMessage(withoutTemp, res.data) });
      get().bumpChatPreview(selectedUser._id, res.data);
    } catch (e) {
      if (!navigator.onLine) {
        addToQueue({ ...payload, targetId: selectedUser._id, tempId });
        toast.error("Offline — message queued");
      } else {
        set({ messages: get().messages.filter((m) => m._id !== tempId) });
        toast.error(e.response?.data?.message || "Failed to send");
      }
    } finally {
      set({ isSendingMessage: false });
    }
  },

  flushOfflineQueue: async () => {
    const queue = getQueue();
    for (const item of queue) {
      try {
        await axiosInstance.post(`/messages/send/${item.targetId}`, item);
        removeFromQueue(item.tempId);
      } catch { }
    }
    if (queue.length) toast.success("Queued messages sent");
  },

  editMessage: async (messageId, text) => {
    try {
      const res = await axiosInstance.put(`/messages/${messageId}`, { text });
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? res.data : m,
        ),
      });
    } catch (e) {
      toast.error(e.response?.data?.message || "Edit failed");
    }
  },

  deleteMessage: async (messageId, forEveryone = false) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`, {
        params: { forEveryone },
      });
      set({ messages: get().messages.filter((m) => m._id !== messageId) });
    } catch {
      toast.error("Delete failed");
    }
  },

  reactToMessage: async (messageId, emoji) => {
    try {
      const res = await axiosInstance.post(`/messages/${messageId}/react`, {
        emoji,
      });
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, reactions: res.data } : m,
        ),
      });
    } catch {
      toast.error("Reaction failed");
    }
  },

  pinChat: async (chatId) => {
    try {
      const pinned = get().isChatPinned(chatId);
      if (pinned) {
        await axiosInstance.post("/users/unpin", { chatId, chatType: "user" });
        toast.success("Chat unpinned");
      } else {
        await axiosInstance.post("/users/pin", { chatId, chatType: "user" });
        toast.success("Chat pinned");
      }
      await get().getMyChatPartners();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not update pin");
    }
  },

  archiveChat: async (chatId) => {
    try {
      const archived = get().isChatArchived(chatId);
      if (archived) {
        await axiosInstance.post("/users/unarchive", {
          chatId,
          chatType: "user",
        });
        toast.success("Chat unarchived");
      } else {
        await axiosInstance.post("/users/archive", {
          chatId,
          chatType: "user",
        });
        toast.success("Chat archived");
        set({ selectedUser: null });
      }
      await get().getMyChatPartners();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not update archive");
    }
  },

  muteChat: async (chatId, hours = 24) => {
    try {
      const muted = get().isChatMuted(chatId);
      if (muted) {
        await axiosInstance.post("/users/unmute", { chatId, chatType: "user" });
        toast.success("Notifications unmuted");
      } else {
        await axiosInstance.post("/users/mute", {
          chatId,
          chatType: "user",
          hours,
        });
        toast.success(`Muted for ${hours}h`);
      }
      await get().getMyChatPartners();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not update mute");
    }
  },

  blockUser: async (userId) => {
    try {
      await axiosInstance.post(`/users/block/${userId}`);
      toast.success("User blocked");
      set({
        blockStatus: { ...get().blockStatus, blockedByMe: true },
      });
      await Promise.all([
        get().loadChatPrefs(),
        get().getMyChatPartners(),
        get().getAllContacts(),
        get().getBlockedUsers(),
      ]);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not block user");
    }
  },

  unblockUser: async (userId) => {
    try {
      await axiosInstance.delete(`/users/block/${userId}`);
      toast.success("User unblocked");
      set({
        blockStatus: { ...get().blockStatus, blockedByMe: false },
      });
      await Promise.all([
        get().loadChatPrefs(),
        get().getMyChatPartners(),
        get().getAllContacts(),
        get().getBlockedUsers(),
      ]);
      if (String(get().selectedUser?._id) === String(userId)) {
        get().fetchBlockStatus(userId);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not unblock user");
    }
  },

  reportUser: async (reportedUserId, reason, messageId) => {
    await axiosInstance.post("/users/report", {
      reportedUserId,
      reason,
      messageId,
    });
    toast.success("Report submitted");
  },

  exportChat: async (userId) => {
    const res = await axiosInstance.get(`/messages/export/${userId}`);
    const blob = new Blob([JSON.stringify(res.data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "syncchat-export.json";
    a.click();
  },

  emitTyping: (receiverId) => {
    getSocket()?.emit("typing", { receiverId });
  },

  emitStopTyping: (receiverId) => {
    getSocket()?.emit("stopTyping", { receiverId });
  },

  isUserOnline: (userId) => get().onlineUsers.includes(String(userId)),

  getLastSeen: async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/profile/${userId}`);
      set({ lastSeenMap: { ...get().lastSeenMap, [userId]: res.data } });
      return res.data;
    } catch {
      return null;
    }
  },
  archivePin: "1234",
  showArchiveLock: false,

  setShowArchiveLock: (value) =>
    set({ showArchiveLock: value }),

  verifyArchivePin: (pin) => {
    const correctPin = get().archivePin;

    if (pin === correctPin) {
      set({
        showArchivedChats: true,
        showArchiveLock: false,
      });

      return true;
    }

    return false;
  },
}));
