import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useChatStore } from "./useChatStore";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,
  isSendingOtp: false,
  isVerifyingOtp: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup",data)
      set({authUser: res.data});
      toast.success("Account created successfully !");
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login",data)
      set({authUser: res.data});
      toast.success("Logged in successfully !");
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await axiosInstance.post("/auth/logout")
      set({authUser: null});
      toast.success("Logged out successfully !");
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingOut : false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      useChatStore.getState().syncUserProfile(res.data);
      toast.success("Profile updated successfully !");
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  sendOtp: async (email) => {
  set({ isSendingOtp: true });

  try {
    await axiosInstance.post("/auth/send-otp", {
      email,
    });

    toast.success("OTP sent successfully");

    return true;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to send OTP"
    );

    return false;
  } finally {
    set({ isSendingOtp: false });
  }
},

verifyOtp: async (email, otp) => {
  set({ isVerifyingOtp: true });

  try {
    const res = await axiosInstance.post("/auth/verify-otp", {
      email,
      otp,
    });

    set({
      authUser: res.data.user,
    });

    toast.success("Login successful");

    return true;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "OTP verification failed"
    );

    return false;
  } finally {
    set({
      isVerifyingOtp: false,
    });
  }
},

}));
