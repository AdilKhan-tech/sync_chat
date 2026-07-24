import { useState, useRef } from "react";
import { Camera, LogOut, Volume2, VolumeX, Plus, Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import { playKeystrokeSound } from "../lib/sounds";
import Avatar from "./Avatar";

function ProfileHeader() {
  const navigate = useNavigate();

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

      const updated = await updateProfile({
        profilePic: base64Image,
      });

      if (updated) {
        setSelectedImg(null);
      }
    };
  };

  return (
    <div className="panel-header">
      <div className="flex flex-col gap-4">
        {/* TOP PROFILE AREA */}

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

              <div
                className="
                absolute inset-0 
                rounded-full 
                bg-black/60
                opacity-0
                group-hover:opacity-100
                flex items-center
                justify-center
                transition
                "
              >
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
              <h3
                className="
                text-sm 
                font-semibold 
                theme-text 
                truncate 
                max-w-[140px]
                sm:max-w-[180px]
                "
              >
                {authUser?.fullName}
              </h3>

              <p
                className="
                text-xs 
                text-emerald-400/90 
                flex 
                items-center 
                gap-1.5 
                mt-0.5
                "
              >
                <span
                  className="
                  size-1.5 
                  rounded-full 
                  bg-emerald-400 
                  animate-pulse
                  "
                />
                Active now
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const enabled = toggleSound();

                if (enabled) playKeystrokeSound();
              }}
              className={`icon-btn ${
                isSoundEnabled
                  ? "text-blue-400 ring-1 ring-accent-ring bg-accent-soft"
                  : ""
              }`}
            >
              {isSoundEnabled ? (
                <Volume2 className="size-4" />
              ) : (
                <VolumeX className="size-4" />
              )}
            </button>

            <button type="button" onClick={logout} className="icon-btn-danger">
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        {/* STATUS SECTION */}

        <div
          className="
          border-t 
          border-base-300 
          pt-3
          "
        >
          <div
            className="
            flex 
            items-center 
            justify-between
            "
          >
            <div>
              <h4
                className="
                text-sm 
                font-semibold 
                theme-text
                "
              >
                My Status
              </h4>

              <p
                className="
                text-xs 
                opacity-70
                "
              >
                Share photos, videos and text
              </p>
            </div>

            <div className="flex gap-2">
              {/* ADD STATUS */}

              <button
                onClick={() => navigate("/status")}
                className="
                flex
                items-center
                gap-1
                px-3
                py-2
                rounded-lg
                bg-emerald-500
                text-white
                text-xs
                hover:bg-emerald-600
                transition
                "
              >
                <Plus className="size-4" />
                Add
              </button>

              {/* VIEW STATUS */}

              <button
                onClick={() => navigate("/status")}
                className="
                flex
                items-center
                gap-1
                px-3
                py-2
                rounded-lg
                bg-base-200
                text-xs
                hover:bg-base-300
                transition
                "
              >
                <Eye className="size-4" />
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
