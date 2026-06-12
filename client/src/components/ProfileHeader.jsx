import { useState, useRef } from "react";
import { Camera, LogOut, Volume2, VolumeX } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { playKeystrokeSound } from "../lib/sounds";
import Avatar from "./Avatar";

function ProfileHeader() {
  const { logout, authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      const updated = await updateProfile({ profilePic: base64Image });
      if (updated) setSelectedImg(null);
    };
  };

  return (
    <div className="panel-header">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="relative group rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUpdatingProfile}
          >
            <Avatar
              src={selectedImg || authUser?.profilePic}
              name={authUser?.fullName}
              size="lg"
              online
            />
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
              <Camera className="size-4 text-white" />
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="min-w-0">
            <h3 className="text-sm font-semibold theme-text truncate max-w-[140px] sm:max-w-[180px]">
              {authUser?.fullName}
            </h3>
            <p className="text-xs text-emerald-400/90 flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              const enabled = toggleSound();
              if (enabled) playKeystrokeSound();
            }}
            className={`icon-btn ${isSoundEnabled ? "text-blue-400 ring-1 ring-accent-ring bg-accent-soft" : ""}`}
            aria-label={isSoundEnabled ? "Sound on (keystrokes & notifications)" : "Sound off"}
            title={isSoundEnabled ? "Sound on" : "Sound off"}
          >
            {isSoundEnabled ? (
              <Volume2 className="size-4" />
            ) : (
              <VolumeX className="size-4" />
            )}
          </button>
          <button
            type="button"
            onClick={logout}
            className="icon-btn-danger"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
