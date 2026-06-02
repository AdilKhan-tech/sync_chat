import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        await updateProfile({ profilePic: base64Image });
      };
    }
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.jpeg"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change Photo</span>
              </div>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser?.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch((error) => console.log("Audio play error:", error));
              toggleSound();
            }}
            className="p-2 rounded-md bg-slate-700/50 text-slate-300 hover:bg-slate-700/70 transition-colors"
          >
            {isSoundEnabled ? (
              <Volume2Icon className="w-4 h-4" />
            ) : (
              <VolumeOffIcon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-md bg-red-600/50 text-red-300 hover:bg-red-600/70 transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
