import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { getSocket } from "../lib/socket";

export const useStatusStore = create((set, get) => ({
  // =====================
  // STATES
  // =====================

  statuses: [],

  myStatus: [],

  currentUserStatuses: [],

  selectedStatus: null,

  viewerOpen: false,

  viewers: [],

  replies: [],

  loading: false,

  uploading: false,

  // =====================
  // CREATE STATUS
  // =====================

  uploadStatus: async (data) => {
    try {
      set({
        uploading: true,
      });

      const res = await axiosInstance.post("/status", data);

      const newStatus = res.data.status;

      set((state) => ({
        myStatus: [...state.myStatus, newStatus],
      }));

      toast.success("Status uploaded");

      return newStatus;
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      set({
        uploading: false,
      });
    }
  },

  // =====================
  // GET MY STATUS
  // =====================

  getMyStatus: async () => {
    try {
      const res = await axiosInstance.get("/status/me");

      set({
        myStatus: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // =====================
  // GET STATUS FEED
  // =====================

  getStatusFeed: async () => {
    try {
      set({
        loading: true,
      });

      const res = await axiosInstance.get("/status/feed");

      set({
        statuses: res.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      set({
        loading: false,
      });
    }
  },

  // =====================
  // OPEN VIEWER
  // =====================

  openViewer: (status) => {
    set({
      selectedStatus: status,

      viewerOpen: true,
    });
  },

  closeViewer: () => {
    set({
      viewerOpen: false,

      selectedStatus: null,

      currentUserStatuses: [],
    });
  },

  // =====================
  // GET USER STATUSES
  // =====================

  getUserStatuses: async (userId) => {
    try {
      const res = await axiosInstance.get(`/status/user/${userId}`);

      set({
        currentUserStatuses: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // =====================
  // VIEW STATUS
  // =====================

  viewStatus: async (statusId) => {
    try {
      await axiosInstance.post(`/status/${statusId}/view`);
    } catch (error) {
      console.log(error);
    }
  },

  // =====================
  // GET VIEWERS
  // =====================

  getStatusViews: async (statusId) => {
    try {
      const res = await axiosInstance.get(`/status/${statusId}/views`);

      set({
        viewers: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // =====================
  // REPLY STATUS
  // =====================

  replyStatus: async (statusId, message) => {
    try {
      const res = await axiosInstance.post(`/status/${statusId}/reply`, {
        message,
      });

      set((state) => ({
        replies: [...state.replies, res.data.reply],
      }));

      toast.success("Reply sent");
    } catch (error) {
      console.log(error);
    }
  },

  // =====================
  // DELETE STATUS
  // =====================

  deleteStatus: async (statusId) => {
    try {
      await axiosInstance.delete(`/status/${statusId}`);

      set((state) => ({
        myStatus: state.myStatus.filter((item) => item.id !== statusId),
      }));

      toast.success("Status deleted");
    } catch (error) {
      console.log(error);
    }
  },

  // =====================
  // SOCKET EVENTS
  // =====================

  initStatusSocket: () => {
    const socket = getSocket();

    if (!socket) return;

    socket.off("status:new");

    socket.off("status:view");

    socket.off("status:reply");

    socket.off("status:delete");

    socket.on("status:new", (status) => {
      set((state) => ({
        statuses: [status, ...state.statuses],
      }));
    });

    socket.on("status:view", (data) => {
      console.log("Status viewed", data);
    });

    socket.on("status:reply", (reply) => {
      set((state) => ({
        replies: [...state.replies, reply],
      }));
    });

    socket.on("status:delete", ({ statusId }) => {
      set((state) => ({
        statuses: state.statuses.filter((item) => item.id !== statusId),
      }));
    });
  },
}));
