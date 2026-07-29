import { useState } from "react";
import {
  Eye,
  Users,
  Lock,
  CheckCheck,
  Shield,
} from "lucide-react";

function PrivacySettings() {
  const [lastSeen, setLastSeen] = useState("everyone");
  const [profilePhoto, setProfilePhoto] = useState("everyone");
  const [about, setAbout] = useState("everyone");
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b141a] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Privacy
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Last Seen */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-green-500" />

              <div>
                <h2 className="font-semibold text-lg">
                  Last Seen & Online
                </h2>

                <p className="text-zinc-400 text-sm">
                  Who can see your last seen
                </p>
              </div>
            </div>

            <select
              value={lastSeen}
              onChange={(e) => setLastSeen(e.target.value)}
              className="w-full bg-[#111b21] rounded-lg p-3 outline-none border border-zinc-700"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* Profile Photo */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-500" />

              <div>
                <h2 className="font-semibold text-lg">
                  Profile Photo
                </h2>

                <p className="text-zinc-400 text-sm">
                  Who can see your profile photo
                </p>
              </div>
            </div>

            <select
              value={profilePhoto}
              onChange={(e) => setProfilePhoto(e.target.value)}
              className="w-full bg-[#111b21] rounded-lg p-3 outline-none border border-zinc-700"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* About */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-yellow-500" />

              <div>
                <h2 className="font-semibold text-lg">
                  About
                </h2>

                <p className="text-zinc-400 text-sm">
                  Who can see your About
                </p>
              </div>
            </div>

            <select
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full bg-[#111b21] rounded-lg p-3 outline-none border border-zinc-700"
            >
              <option value="everyone">Everyone</option>
              <option value="contacts">My Contacts</option>
              <option value="nobody">Nobody</option>
            </select>
          </div>

          {/* Read Receipts */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCheck className="text-cyan-500" />

                <div>
                  <h2 className="font-semibold text-lg">
                    Read Receipts
                  </h2>

                  <p className="text-zinc-400 text-sm">
                    Allow others to know you've read messages
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={readReceipts}
                  onChange={() => setReadReceipts(!readReceipts)}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-zinc-600 rounded-full peer peer-checked:bg-green-500 transition"></div>

                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

        </div>

        {/* Blocked Contacts */}

        <div className="bg-[#202c33] rounded-xl p-6 mt-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Shield className="text-red-500" />

            <div>
              <h2 className="font-semibold text-lg">
                Blocked Contacts
              </h2>

              <p className="text-zinc-400 text-sm">
                Manage blocked users
              </p>
            </div>
          </div>

          <button
            className="mt-6 w-full md:w-auto bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-lg font-medium"
          >
            View Blocked Contacts
          </button>
        </div>

      </div>
    </div>
  );
}

export default PrivacySettings;