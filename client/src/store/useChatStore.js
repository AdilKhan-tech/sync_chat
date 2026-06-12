import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { connectSocket, disconnectSocket, getSocket } from "../lib/socket";
import toast from "react-hot-toast";

const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // ignore audio errors
  }
};

const isSameUser = (a, b) => String(a) === String(b);

const isConversationMessage = (message, userId, authUserId) =>
  (isSameUser(message.senderId, userId) &&
    isSameUser(message.receiverId, authUserId)) ||
  (isSameUser(message.senderId, authUserId) &&
    isSameUser(message.receiverId, userId));

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",
  onlineUsers: [],
  typingUsers: [],
  unreadCounts: {},
  authUserId: null,

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", String(next));
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => {
    if (selectedUser) {
      const { unreadCounts } = get();
      const userId = selectedUser._id;
      if (unreadCounts[userId]) {
        const updated = { ...unreadCounts };
        delete updated[userId];
        set({ unreadCounts: updated });
      }
    }
    set({ selectedUser });
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
    }),

  connectSocket: () => {
    const socket = connectSocket();
    if (socket.listeners("newMessage").length > 0) return;

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("newMessage", (message) => {
      const { selectedUser, messages, authUserId } = get();
      if (!authUserId) return;

      const isActiveConversation =
        selectedUser &&
        isConversationMessage(message, selectedUser._id, authUserId);

      if (isActiveConversation) {
        const exists = messages.some((m) => m._id === message._id);
        if (!exists) {
          set({ messages: [...messages, message] });
        }
      } else if (!isSameUser(message.senderId, authUserId)) {
        const senderId = String(message.senderId);
        const { unreadCounts, isSoundEnabled } = get();
        set({
          unreadCounts: {
            ...unreadCounts,
            [senderId]: (unreadCounts[senderId] || 0) + 1,
          },
        });
        if (isSoundEnabled) playNotificationSound();
      }

      get().getMyChatPartners();
    });

    socket.on("userTyping", ({ senderId }) => {
      const { typingUsers } = get();
      if (!typingUsers.includes(senderId)) {
        set({ typingUsers: [...typingUsers, senderId] });
      }
    });

    socket.on("userStopTyping", ({ senderId }) => {
      set({
        typingUsers: get().typingUsers.filter((id) => id !== senderId),
      });
    });
  },

  setAuthUserId: (userId) => set({ authUserId: userId }),

  disconnectSocket: () => {
    disconnectSocket();
    get().resetChatState();
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    set({ isSendingMessage: true });
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        text,
        image,
      });
      const { messages } = get();
      const exists = messages.some((m) => m._id === res.data._id);
      if (!exists) {
        set({ messages: [...messages, res.data] });
      }
      get().getMyChatPartners();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  emitTyping: (receiverId) => {
    const socket = getSocket();
    socket?.emit("typing", { receiverId });
  },

  emitStopTyping: (receiverId) => {
    const socket = getSocket();
    socket?.emit("stopTyping", { receiverId });
  },

  isUserOnline: (userId) => {
    return get().onlineUsers.includes(String(userId));
  },
}));
