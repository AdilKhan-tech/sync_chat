import { useState } from "react";
import {
    Moon,
    Sun,
    Monitor,
    Palette,
    Image,
} from "lucide-react";

import { useSettingsStore } from "../../store/useSettingsStore";
import { axiosInstance } from "../../lib/axios";

function AppearanceSettings() {
    const { theme, toggleTheme } = useSettingsStore();

    const [accent, setAccent] = useState("#22c55e");
    const [wallpaper, setWallpaper] = useState("#111827");

    const updateTheme = async (newTheme) => {
        if (theme === newTheme) return;

        // Change instantly in frontend
        toggleTheme();

        try {
            // Save in database
            await axiosInstance.put("/users/settings", {
                theme: newTheme,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b141a] text-white">

            <div className="max-w-7xl mx-auto p-8">

                <h1 className="text-3xl font-bold mb-2">
                    Appearance
                </h1>

                <p className="text-zinc-400 mb-8">
                    Personalize how SyncChat looks.
                </p>

                <div className="space-y-6">

                    {/* Theme */}

                    <div className="bg-[#202c33] rounded-xl p-6">

                        <div className="flex items-center gap-3 mb-6">

                            <Palette className="text-green-500" />

                            <h2 className="text-xl font-semibold">
                                Theme
                            </h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            {/* Light */}

                            <button
                                onClick={() => updateTheme("light")}
                                className={`rounded-xl border p-6 transition-all ${theme === "light"
                                        ? "border-green-500 bg-[#2a3942]"
                                        : "border-zinc-700 hover:border-zinc-500"
                                    }`}
                            >
                                <Sun
                                    className="mx-auto mb-4 text-yellow-400"
                                    size={34}
                                />

                                <p className="font-semibold">
                                    Light
                                </p>

                            </button>

                            {/* Dark */}

                            <button
                                onClick={() => updateTheme("dark")}
                                className={`rounded-xl border p-6 transition-all ${theme === "dark"
                                        ? "border-green-500 bg-[#2a3942]"
                                        : "border-zinc-700 hover:border-zinc-500"
                                    }`}
                            >
                                <Moon
                                    className="mx-auto mb-4 text-blue-400"
                                    size={34}
                                />

                                <p className="font-semibold">
                                    Dark
                                </p>

                            </button>

                            {/* System */}

                            <button
                                disabled
                                className="rounded-xl border border-zinc-700 p-6 opacity-50 cursor-not-allowed"
                            >
                                <Monitor
                                    className="mx-auto mb-4 text-green-400"
                                    size={34}
                                />

                                <p className="font-semibold">
                                    System
                                </p>

                                <p className="text-xs mt-2 text-zinc-500">
                                    Coming Soon
                                </p>

                            </button>

                        </div>

                    </div>

                    {/* Accent Color */}

                    <div className="bg-[#202c33] rounded-xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <Palette className="text-cyan-400" />

                            <h2 className="text-xl font-semibold">
                                Accent Color
                            </h2>

                        </div>

                        <div className="flex items-center gap-5">

                            <input
                                type="color"
                                value={accent}
                                onChange={(e) => setAccent(e.target.value)}
                                className="w-20 h-14 rounded-lg cursor-pointer"
                            />

                            <span className="text-zinc-400 font-medium">
                                {accent}
                            </span>

                        </div>

                    </div>

                    {/* Wallpaper */}

                    <div className="bg-[#202c33] rounded-xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <Image className="text-pink-400" />

                            <h2 className="text-xl font-semibold">
                                Chat Wallpaper
                            </h2>

                        </div>

                        <input
                            type="color"
                            value={wallpaper}
                            onChange={(e) => setWallpaper(e.target.value)}
                            className="w-20 h-14 rounded-lg cursor-pointer"
                        />

                        <div
                            className="mt-6 rounded-xl h-72 border border-zinc-700 flex items-center justify-center"
                            style={{
                                background: wallpaper,
                            }}
                        >
                            <div className="space-y-4">

                                <div className="bg-green-600 text-white rounded-xl px-4 py-2 w-fit ml-auto">
                                    Hello 👋
                                </div>

                                <div className="bg-zinc-700 text-white rounded-xl px-4 py-2 w-fit">
                                    Welcome to SyncChat
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AppearanceSettings;