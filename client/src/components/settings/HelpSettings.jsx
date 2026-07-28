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
        <div className="p-8 text-white max-w-5xl">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Help & Support
                </h1>

                <p className="text-zinc-400 mt-2">
                    Need help? Find answers and manage your account.
                </p>
            </div>

            <div className="space-y-4">

                {/* Help Center */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center hover:bg-zinc-800 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                        <HelpCircle className="text-green-400" />
                        <div>
                            <h3 className="font-semibold">Help Center</h3>
                            <p className="text-sm text-zinc-400">
                                Frequently asked questions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center hover:bg-zinc-800 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                        <Mail className="text-blue-400" />
                        <div>
                            <h3 className="font-semibold">Contact Support</h3>
                            <p className="text-sm text-zinc-400">
                                support@syncchat.com
                            </p>
                        </div>
                    </div>
                </div>

                {/* Report Bug */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center hover:bg-zinc-800 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                        <Bug className="text-red-400" />
                        <div>
                            <h3 className="font-semibold">Report a Bug</h3>
                            <p className="text-sm text-zinc-400">
                                Let us know about any issue.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Privacy Policy */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center hover:bg-zinc-800 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                        <Shield className="text-yellow-400" />
                        <div>
                            <h3 className="font-semibold">Privacy Policy</h3>
                            <p className="text-sm text-zinc-400">
                                Read our privacy policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Terms */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center hover:bg-zinc-800 transition cursor-pointer">
                    <div className="flex items-center gap-4">
                        <FileText className="text-purple-400" />
                        <div>
                            <h3 className="font-semibold">Terms & Conditions</h3>
                            <p className="text-sm text-zinc-400">
                                View our terms of service.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Version */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Info className="text-cyan-400" />
                        <div>
                            <h3 className="font-semibold">App Version</h3>
                            <p className="text-sm text-zinc-400">
                                SyncChat v1.0.0
                            </p>
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button className="w-full bg-orange-600 hover:bg-orange-700 transition rounded-xl p-4 flex items-center justify-center gap-3">
                    <LogOut size={20} />
                    Logout
                </button>

                {/* Delete Account */}
                <button className="w-full bg-red-600 hover:bg-red-700 transition rounded-xl p-4 flex items-center justify-center gap-3">
                    <Trash2 size={20} />
                    Delete Account
                </button>

            </div>

        </div>
    );
}

export default HelpSettings;