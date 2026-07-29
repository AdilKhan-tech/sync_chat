import { useState } from "react";
import {
  Shield,
  KeyRound,
  Smartphone,
  Lock,
} from "lucide-react";

function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [appLock, setAppLock] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b141a] text-white p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Security
        </h1>

        <p className="text-zinc-400 mb-8">
          Manage your account security and login options.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Change Password */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound className="text-green-500" />

              <div>
                <h2 className="font-semibold text-lg">
                  Change Password
                </h2>

                <p className="text-zinc-400 text-sm">
                  Update your account password regularly.
                </p>
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 transition py-3 rounded-lg font-medium">
              Change Password
            </button>
          </div>

          {/* Two Factor */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <Shield className="text-blue-500" />

                <div>
                  <h2 className="font-semibold text-lg">
                    Two-Factor Authentication
                  </h2>

                  <p className="text-zinc-400 text-sm">
                    Add an extra layer of security.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={() => setTwoFactor(!twoFactor)}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-zinc-600 rounded-full peer peer-checked:bg-green-500 transition"></div>

                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>

            </div>
          </div>

          {/* App Lock */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <Lock className="text-yellow-500" />

                <div>
                  <h2 className="font-semibold text-lg">
                    App Lock
                  </h2>

                  <p className="text-zinc-400 text-sm">
                    Require PIN when opening the app.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={appLock}
                  onChange={() => setAppLock(!appLock)}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-zinc-600 rounded-full peer peer-checked:bg-green-500 transition"></div>

                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>

            </div>
          </div>

          {/* Linked Devices */}

          <div className="bg-[#202c33] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="text-pink-500" />

              <div>
                <h2 className="font-semibold text-lg">
                  Linked Devices
                </h2>

                <p className="text-zinc-400 text-sm">
                  View and manage logged-in devices.
                </p>
              </div>
            </div>

            <button className="w-full bg-pink-600 hover:bg-pink-700 transition py-3 rounded-lg font-medium">
              View Devices
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SecuritySettings;