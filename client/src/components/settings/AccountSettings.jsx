import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

function AccountSettings() {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [customStatus, setCustomStatus] = useState(authUser?.customStatus || "");
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const [profilePic, setProfilePic] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
      setProfilePic(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await updateProfile({
      fullName,
      customStatus,
      profilePic,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b141a] text-white">

      <div className="max-w-3xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">
          Account
        </h1>

        {/* Profile Photo */}

        <div className="flex justify-center mb-10">

          <div className="relative">

            <img
              src={preview || "/avatar.png"}
              alt=""
              className="w-36 h-36 rounded-full object-cover border-4 border-[#202c33]"
            />

            <label
              htmlFor="profile"
              className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 rounded-full p-3 cursor-pointer"
            >
              <Camera size={18} />

              <input
                id="profile"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </label>

          </div>

        </div>

        {/* Full Name */}

        <div className="mb-6">

          <label className="block mb-2 text-zinc-400">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-[#202c33] rounded-xl p-4 outline-none"
          />

        </div>

        {/* Email */}

        <div className="mb-6">

          <label className="block mb-2 text-zinc-400">
            Email
          </label>

          <input
            value={authUser?.email || ""}
            disabled
            className="w-full bg-[#1a242b] rounded-xl p-4 text-zinc-500 cursor-not-allowed"
          />

        </div>

        {/* About */}

        <div className="mb-8">

          <label className="block mb-2 text-zinc-400">
            About
          </label>

          <textarea
            rows="4"
            value={customStatus}
            onChange={(e) => setCustomStatus(e.target.value)}
            className="w-full bg-[#202c33] rounded-xl p-4 outline-none resize-none"
            placeholder="Hey there! I am using SyncChat."
          />

        </div>

        {/* Save */}

        <button
          onClick={handleSave}
          disabled={isUpdatingProfile}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Save size={18} />

          {isUpdatingProfile
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

    </div>
  );
}

export default AccountSettings;