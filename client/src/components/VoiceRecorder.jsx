import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

function VoiceRecorder({ onRecorded }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = () => onRecorded(reader.result);
      reader.readAsDataURL(blob);
      stream.getTracks().forEach((t) => t.stop());
    };
    mediaRef.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      className={`icon-btn !size-11 ${recording ? "bg-red-500/20 text-red-400 animate-pulse" : ""}`}
      aria-label="Voice message"
    >
      {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
    </button>
  );
}

export default VoiceRecorder;
