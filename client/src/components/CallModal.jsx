import { useEffect, useRef } from "react";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
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

  useEffect(() => {
    if (localVideoRef.current && localStreamUrl) {
      localVideoRef.current.srcObject = localStreamUrl;
    }
  }, [localStreamUrl]);

  useEffect(() => {
    if (callType === "video" && remoteVideoRef.current && remoteStreamUrl) {
      remoteVideoRef.current.srcObject = remoteStreamUrl;
    }
    if (callType === "audio" && remoteAudioRef.current && remoteStreamUrl) {
      remoteAudioRef.current.srcObject = remoteStreamUrl;
    }
  }, [remoteStreamUrl, callType]);

  if (callStatus === "idle") return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-between text-white">
      {errorMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 px-4 py-2 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {/* Remote video (full screen, video calls only) */}
      {callType === "video" && callStatus === "connected" && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Hidden audio element to actually play remote audio */}
      <audio ref={remoteAudioRef} autoPlay />

      {/* Top info */}
      <div className="relative z-10 flex flex-col items-center mt-16">
        <img
          src={remoteUser?.profilePic || "/avatar.png"}
          alt=""
          className="w-28 h-28 rounded-full object-cover border-4 border-white/20"
        />
        <h2 className="text-2xl font-semibold mt-4">{remoteUser?.fullName}</h2>
        <p className="text-white/60 mt-1">
          {callStatus === "calling" && "Calling..."}
          {callStatus === "ringing" && `Incoming ${callType} call`}
          {callStatus === "connected" && "Connected"}
        </p>
      </div>

      {/* Local video preview (small, video calls only) */}
      {callType === "video" && localStreamUrl && (
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-4 w-28 h-40 object-cover rounded-xl border border-white/20 z-10"
        />
      )}

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-6 mb-16">
        {callStatus === "ringing" ? (
          <>
            <button
              onClick={rejectCall}
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
            >
              <PhoneOff size={26} />
            </button>
            <button
              onClick={acceptCall}
              className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center"
            >
              <Phone size={26} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleMute}
              className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {callType === "video" && (
              <button
                onClick={toggleCamera}
                className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
              >
                {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
            )}

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
            >
              <PhoneOff size={26} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CallModal;
