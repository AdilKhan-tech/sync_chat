import { useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { useCallStore } from "../store/useCallStore";

const CallModal = () => {
  const {
    callStatus,
    callType,
    remoteUser,
    localStreamUrl,
    remoteStreamUrl,
    isMuted,
    isCameraOff,
    errorMsg,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleCamera,
  } = useCallStore();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);

  // Local Video
  useEffect(() => {
    if (!localVideoRef.current || !localStreamUrl) return;

    localVideoRef.current.srcObject = localStreamUrl;

    localVideoRef.current
      .play()
      .catch((err) => console.log("Local Play Error:", err));
  }, [localStreamUrl]);

  // Remote Video / Audio
  useEffect(() => {
    if (!remoteStreamUrl) return;

    console.log(
      "Remote Stream:",
      remoteStreamUrl.getTracks().map((t) => t.kind)
    );

    if (callType === "video" && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamUrl;

      remoteVideoRef.current
        .play()
        .catch((err) => console.log("Remote Play Error:", err));
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStreamUrl;

      remoteAudioRef.current
        .play()
        .catch((err) => console.log("Remote Audio Error:", err));
    }
  }, [remoteStreamUrl, callType]);

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col justify-between overflow-hidden z-50">

      {errorMsg && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-red-500 px-4 py-2 rounded-lg z-50">
          {errorMsg}
        </div>
      )}

      {/* Remote Video */}
      {callType === "video" &&
        callStatus === "connected" &&
        remoteStreamUrl && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg-black"
          />
        )}

      {/* Remote Audio */}
      <audio ref={remoteAudioRef} autoPlay playsInline />

      {/* Audio Call Avatar */}
      {(callType === "audio" || !remoteStreamUrl) && (
        <div className="relative z-10 flex flex-col items-center mt-20">
          <img
            src={remoteUser?.profilePic || "/avatar.png"}
            alt=""
            className="w-28 h-28 rounded-full object-cover border-4 border-white/20"
          />

          <h2 className="text-2xl font-semibold mt-4">
            {remoteUser?.fullName}
          </h2>

          <p className="text-white/70 mt-2">
            {callStatus === "calling" && "Calling..."}
            {callStatus === "ringing" && `Incoming ${callType} call`}
            {callStatus === "connected" && "Connected"}
          </p>
        </div>
      )}

      {/* Local Video */}
      {callType === "video" && localStreamUrl && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-4 w-32 h-44 rounded-xl object-cover border-2 border-white shadow-lg z-20"
        />
      )}

      {/* Controls */}
      <div className="relative z-20 flex justify-center items-center gap-5 mb-10">

        {callStatus === "ringing" ? (
          <>
            <button
              onClick={rejectCall}
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
            >
              <PhoneOff size={28} />
            </button>

            <button
              onClick={acceptCall}
              className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center"
            >
              <Phone size={28} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {callType === "video" && (
              <button
                onClick={toggleCamera}
                className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
              >
                {isCameraOff ? (
                  <VideoOff size={24} />
                ) : (
                  <Video size={24} />
                )}
              </button>
            )}

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
            >
              <PhoneOff size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CallModal;