import { create } from "zustand";
import { getSocket } from "../lib/socket";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

let peerConnection = null;
let localStream = null;

const genCallId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useCallStore = create((set, get) => ({
  // idle | calling | ringing | connected
  callStatus: "idle",

  callId: null,
  callType: null, // "audio" | "video"

  remoteUser: null, // { id, fullName, profilePic } — the other party

  localStreamUrl: null,
  remoteStreamUrl: null,

  isMuted: false,
  isCameraOff: false,

  errorMsg: null,

  // ===========================================
  // INIT SOCKET LISTENERS (call once on app mount)
  // ===========================================
  initCallSocket: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.off("call:incoming");
    socket.off("call:accepted");
    socket.off("call:rejected");
    socket.off("call:offer");
    socket.off("call:answer");
    socket.off("call:ice-candidate");
    socket.off("call:ended");
    socket.off("call:unavailable");

    socket.on("call:incoming", ({ callId, type, caller }) => {
      // Ignore if already in a call
      if (get().callStatus !== "idle") {
        socket.emit("call:reject", { callId });
        return;
      }

      set({
        callStatus: "ringing",
        callId,
        callType: type,
        remoteUser: {
          id: caller.id || caller._id,
          fullName: caller.fullName,
          profilePic: caller.profilePic,
        },
      });
    });

    socket.on("call:accepted", async ({ callId }) => {
      if (get().callId !== callId) return;
      await get()._createOffer();
    });

    socket.on("call:rejected", ({ callId }) => {
      if (get().callId !== callId) return;
      get()._cleanup();
      set({ callStatus: "idle", callId: null, errorMsg: "Call declined" });
      setTimeout(() => set({ errorMsg: null }), 3000);
    });

    socket.on("call:unavailable", ({ callId }) => {
      if (get().callId !== callId) return;
      get()._cleanup();
      set({
        callStatus: "idle",
        callId: null,
        errorMsg: "User is unavailable",
      });
      setTimeout(() => set({ errorMsg: null }), 3000);
    });

    socket.on("call:offer", async ({ callId, sdp }) => {
      if (get().callId !== callId || !peerConnection) return;
      await peerConnection.setRemoteDescription(sdp);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("call:answer", {
        callId,
        sdp: peerConnection.localDescription,
      });
    });

    socket.on("call:answer", async ({ callId, sdp }) => {
      if (get().callId !== callId || !peerConnection) return;
      await peerConnection.setRemoteDescription(sdp);
      set({ callStatus: "connected" });
    });

    socket.on("call:ice-candidate", async ({ callId, candidate }) => {
      if (get().callId !== callId || !peerConnection || !candidate) return;
      try {
        await peerConnection.addIceCandidate(candidate);
      } catch (err) {
        console.log("ICE candidate error", err);
      }
    });

    socket.on("call:ended", ({ callId }) => {
      if (get().callId !== callId) return;
      get()._cleanup();
      set({ callStatus: "idle", callId: null, remoteUser: null });
    });
  },

  // ===========================================
  // START A CALL (caller side)
  // ===========================================
  startCall: async (calleeUser, type) => {
    const socket = getSocket();
    if (!socket || get().callStatus !== "idle") return;

    const callId = genCallId();

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
    } catch (err) {
      set({ errorMsg: "Camera/Microphone permission denied" });
      setTimeout(() => set({ errorMsg: null }), 3000);
      return;
    }

    set({
      callStatus: "calling",
      callId,
      callType: type,
      remoteUser: {
        id: calleeUser._id || calleeUser.id,
        fullName: calleeUser.fullName,
        profilePic: calleeUser.profilePic,
      },
      localStreamUrl: localStream,
    });

    get()._setupPeerConnection(callId);

    socket.emit("call:invite", {
      calleeId: calleeUser._id || calleeUser.id,
      type,
      callId,
    });
  },

  // ===========================================
  // ACCEPT INCOMING CALL (callee side)
  // ===========================================
  acceptCall: async () => {
    const socket = getSocket();
    const { callId, callType } = get();
    if (!socket || !callId) return;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === "video",
      });
    } catch (err) {
      set({ errorMsg: "Camera/Microphone permission denied" });
      get().rejectCall();
      return;
    }

    set({ localStreamUrl: localStream });

    get()._setupPeerConnection(callId);

    socket.emit("call:accept", { callId });
  },

  rejectCall: () => {
    const socket = getSocket();
    const { callId } = get();
    if (socket && callId) socket.emit("call:reject", { callId });

    get()._cleanup();
    set({ callStatus: "idle", callId: null, remoteUser: null });
  },

  endCall: () => {
    const socket = getSocket();
    const { callId } = get();
    if (socket && callId) socket.emit("call:end", { callId });

    get()._cleanup();
    set({ callStatus: "idle", callId: null, remoteUser: null });
  },

  toggleMute: () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    set({ isMuted: !audioTrack.enabled });
  },

  toggleCamera: () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    set({ isCameraOff: !videoTrack.enabled });
  },

  // ===========================================
  // INTERNAL HELPERS
  // ===========================================
  _setupPeerConnection: (callId) => {
    const socket = getSocket();

    peerConnection = new RTCPeerConnection(ICE_SERVERS);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("call:ice-candidate", {
          callId,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.ontrack = (event) => {
      set({ remoteStreamUrl: event.streams[0] });
    };

    peerConnection.onconnectionstatechange = () => {
      if (
        peerConnection?.connectionState === "disconnected" ||
        peerConnection?.connectionState === "failed"
      ) {
        get().endCall();
      }
    };
  },

  _createOffer: async () => {
    const socket = getSocket();
    const { callId } = get();
    if (!peerConnection || !callId) return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("call:offer", { callId, sdp: peerConnection.localDescription });
  },

  _cleanup: () => {
    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream = null;
    }
    set({
      localStreamUrl: null,
      remoteStreamUrl: null,
      isMuted: false,
      isCameraOff: false,
      callType: null,
    });
  },
}));
