import {
  HelpCircle,
  Shield,
  FileText,
  Mail,
  Bug,
  Info,
  LogOut,
  Trash2,
} from "lucide-react";

function HelpSettings() {
  return (
    <div className="min-h-screen bg-[#0b141a] text-white">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-2">
          Help & Support
        </h1>

        <p className="text-zinc-400 mb-8">
          Need help? Find answers and manage your account.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Help Center */}

          <div className="bg-[#202c33] rounded-xl p-5 hover:bg-[#26353d] transition cursor-pointer">

            <div className="flex items-center gap-3 mb-4">

              <HelpCircle className="text-green-500" />

              <div>

                <h2 className="font-semibold">
                  Help Center
                </h2>

                <p className="text-zinc-400 text-sm">
                  Frequently asked questions and tutorials.
                </p>

              </div>

            </div>

          </div>

          {/* Contact Support */}

          <div className="bg-[#202c33] rounded-xl p-5 hover:bg-[#26353d] transition cursor-pointer">

            <div className="flex items-center gap-3 mb-4">

              <Mail className="text-blue-500" />

              <div>

                <h2 className="font-semibold">
                  Contact Support
                </h2>

                <p className="text-zinc-400 text-sm">
                  support@syncchat.com
                </p>

              </div>

            </div>

          </div>

          {/* Report Bug */}

          <div className="bg-[#202c33] rounded-xl p-5 hover:bg-[#26353d] transition cursor-pointer">

            <div className="flex items-center gap-3 mb-4">

              <Bug className="text-red-500" />

              <div>

                <h2 className="font-semibold">
                  Report a Bug
                </h2>

                <p className="text-zinc-400 text-sm">
                  Tell us about any issue you found.
                </p>

              </div>

            </div>

          </div>

          {/* Privacy Policy */}

          <div className="bg-[#202c33] rounded-xl p-5 hover:bg-[#26353d] transition cursor-pointer">

            <div className="flex items-center gap-3 mb-4">

              <Shield className="text-yellow-500" />

              <div>

                <h2 className="font-semibold">
                  Privacy Policy
                </h2>

                <p className="text-zinc-400 text-sm">
                  Read how we protect your data.
                </p>

              </div>

            </div>

          </div>

          {/* Terms */}

          <div className="bg-[#202c33] rounded-xl p-5 hover:bg-[#26353d] transition cursor-pointer">

            <div className="flex items-center gap-3 mb-4">

              <FileText className="text-purple-500" />

              <div>

                <h2 className="font-semibold">
                  Terms & Conditions
                </h2>

                <p className="text-zinc-400 text-sm">
                  Read our terms of service.
                </p>

              </div>

            </div>

          </div>

          {/* Version */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-4">

              <Info className="text-cyan-500" />

              <div>

                <h2 className="font-semibold">
                  App Version
                </h2>

                <p className="text-zinc-400 text-sm">
                  SyncChat v1.0.0
                </p>

              </div>

            </div>

          </div>

          {/* Logout */}

          <div className="md:col-span-2">

            <button
              className="
              w-full
              bg-orange-600
              hover:bg-orange-700
              transition
              rounded-xl
              py-4
              flex
              items-center
              justify-center
              gap-3
              font-semibold
              "
            >
              <LogOut size={20} />
              Logout
            </button>

          </div>

          {/* Delete Account */}

          <div className="md:col-span-2">

            <button
              className="
              w-full
              bg-red-600
              hover:bg-red-700
              transition
              rounded-xl
              py-4
              flex
              items-center
              justify-center
              gap-3
              font-semibold
              "
            >
              <Trash2 size={20} />
              Delete Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default HelpSettings;