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
    <div className="min-h-screen bg-[#0b141a] text-white">

      <div className="max-w-4xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">
          Privacy
        </h1>

        {/* Last Seen */}

        <div className="bg-[#202c33] rounded-xl p-5 mb-5">

          <div className="flex items-center gap-3 mb-4">

            <Eye className="text-green-500" />

            <div>
              <h2 className="font-semibold">
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
            className="w-full bg-[#111b21] rounded-lg p-3 outline-none"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">My Contacts</option>
            <option value="nobody">Nobody</option>
          </select>

        </div>

        {/* Profile Photo */}

        <div className="bg-[#202c33] rounded-xl p-5 mb-5">

          <div className="flex items-center gap-3 mb-4">

            <Users className="text-blue-500" />

            <div>

              <h2 className="font-semibold">
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
            className="w-full bg-[#111b21] rounded-lg p-3 outline-none"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">My Contacts</option>
            <option value="nobody">Nobody</option>
          </select>

        </div>

        {/* About */}

        <div className="bg-[#202c33] rounded-xl p-5 mb-5">

          <div className="flex items-center gap-3 mb-4">

            <Lock className="text-yellow-500" />

            <div>

              <h2 className="font-semibold">
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
            className="w-full bg-[#111b21] rounded-lg p-3 outline-none"
          >
            <option value="everyone">Everyone</option>
            <option value="contacts">My Contacts</option>
            <option value="nobody">Nobody</option>
          </select>

        </div>

        {/* Read Receipts */}

        <div className="bg-[#202c33] rounded-xl p-5 mb-5">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

              <CheckCheck className="text-cyan-500" />

              <div>

                <h2 className="font-semibold">
                  Read Receipts
                </h2>

                <p className="text-zinc-400 text-sm">
                  Allow others to know you've read messages
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={readReceipts}
              onChange={() =>
                setReadReceipts(!readReceipts)
              }
              className="w-5 h-5"
            />

          </div>

        </div>

        {/* Blocked */}

        <div className="bg-[#202c33] rounded-xl p-5">

          <div className="flex items-center gap-3">

            <Shield className="text-red-500" />

            <div>

              <h2 className="font-semibold">
                Blocked Contacts
              </h2>

              <p className="text-zinc-400 text-sm">
                Manage blocked users
              </p>

            </div>

          </div>

          <button
            className="mt-5 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg"
          >
            View Blocked Contacts
          </button>

        </div>

      </div>

    </div>
  );
}

export default PrivacySettings;