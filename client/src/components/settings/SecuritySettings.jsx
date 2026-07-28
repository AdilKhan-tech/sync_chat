import { Shield, KeyRound, Smartphone, Lock } from "lucide-react";

function SecuritySettings() {
    return (
        <div className="p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Security</h1>
            <p className="text-zinc-400 mb-8">
                Manage your account security and login options.
            </p>

            <div className="space-y-5">

                {/* Change Password */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-3">
                        <KeyRound className="text-green-400" size={22} />
                        <div className="flex-1">
                            <h2 className="font-semibold">Change Password</h2>
                            <p className="text-sm text-zinc-400">
                                Update your account password regularly.
                            </p>
                        </div>

                        <button className="btn btn-primary">
                            Change
                        </button>
                    </div>
                </div>

                {/* Two Factor */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-400" size={22} />
                        <div className="flex-1">
                            <h2 className="font-semibold">
                                Two-Factor Authentication
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Add an extra layer of security.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            className="toggle toggle-primary"
                        />
                    </div>
                </div>

                {/* Device Lock */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-3">
                        <Lock className="text-yellow-400" size={22} />
                        <div className="flex-1">
                            <h2 className="font-semibold">
                                App Lock
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Require PIN when opening the app.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            className="toggle toggle-success"
                        />
                    </div>
                </div>

                {/* Devices */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-3">
                        <Smartphone className="text-pink-400" size={22} />
                        <div className="flex-1">
                            <h2 className="font-semibold">
                                Linked Devices
                            </h2>
                            <p className="text-sm text-zinc-400">
                                View and manage logged-in devices.
                            </p>
                        </div>

                        <button className="btn btn-outline">
                            View
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SecuritySettings;