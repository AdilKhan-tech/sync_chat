import { create } from "zustand";
import { getSocket } from "../lib/socket";

const ICE_SERVERS = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ],
    },
    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
};

let peerConnection = null;
let localStream = null;
let pendingOffer = null; // { callId, sdp } — holds an offer that arrived before peerConnection was ready
let pendingIceCandidates = []; // candidates that arrive before peerConnection is ready

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

    // queue the offer if peerConnection isn't ready yet
    socket.on("call:offer", async ({ callId, sdp }) => {
      if (get().callId !== callId) return;

      console.log("[call:offer] received", { callId, hasPeerConnection: !!peerConnection });

      if (!peerConnection) {
        pendingOffer = { callId, sdp };
        return;
      }

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
      console.log("[call:answer] received", { callId });
      await peerConnection.setRemoteDescription(sdp);
      set({ callStatus: "connected" });
    });

    // queue ICE candidates if peerConnection isn't ready yet
    socket.on("call:ice-candidate", async ({ callId, candidate }) => {
      if (get().callId !== callId || !candidate) return;

      if (!peerConnection) {
        pendingIceCandidates.push(candidate);
        return;
      }

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
      console.log(
        "[startCall] got local stream, tracks:",
        localStream.getTracks().map((t) => t.kind)
      );
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
      console.log(
        "[acceptCall] got local stream, tracks:",
        localStream.getTracks().map((t) => t.kind)
      );
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
      console.log("[_setupPeerConnection] adding local track:", track.kind);
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
      console.log(
        "[ontrack] fired. streams:",
        event.streams.length,
        "tracks in stream[0]:",
        event.streams[0]?.getTracks().map((t) => t.kind)
      );
      set({ remoteStreamUrl: event.streams[0] });
    };

    let disconnectTimeout = null;

    peerConnection.onconnectionstatechange = () => {
      console.log("[connectionState]", peerConnection?.connectionState);

      if (peerConnection?.connectionState === "connected") {
        // agar recover ho gaya, pending disconnect timer cancel karo
        if (disconnectTimeout) {
          clearTimeout(disconnectTimeout);
          disconnectTimeout = null;
        }
      }

      if (peerConnection?.connectionState === "failed") {
        // failed ka matlab permanent hai, turant end karo
        get().endCall();
      }

      if (peerConnection?.connectionState === "disconnected") {
        // disconnected transient ho sakta hai — 5 second wait karo recovery ke liye
        disconnectTimeout = setTimeout(() => {
          if (peerConnection?.connectionState === "disconnected") {
            get().endCall();
          }
        }, 5000);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("[iceConnectionState]", peerConnection?.iceConnectionState);
    };

    // process an offer that arrived before we were ready
    if (pendingOffer && pendingOffer.callId === callId) {
      const offer = pendingOffer;
      pendingOffer = null;
      (async () => {
        try {
          await peerConnection.setRemoteDescription(offer.sdp);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("call:answer", {
            callId,
            sdp: peerConnection.localDescription,
          });
        } catch (err) {
          console.log("Error processing pending offer", err);
        }
      })();
    } else {
      pendingOffer = null;
    }

    // flush any ICE candidates that arrived early
    if (pendingIceCandidates.length > 0) {
      const candidates = pendingIceCandidates;
      pendingIceCandidates = [];
      candidates.forEach(async (candidate) => {
        try {
          await peerConnection.addIceCandidate(candidate);
        } catch (err) {
          console.log("ICE candidate error (flush)", err);
        }
      });
    }
  },

  _createOffer: async () => {
    const socket = getSocket();
    const { callId } = get();
    if (!peerConnection || !callId) return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log("[_createOffer] sending offer");
    socket.emit("call:offer", { callId, sdp: peerConnection.localDescription });
  },

  _cleanup: () => {
    pendingOffer = null;
    pendingIceCandidates = [];

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
