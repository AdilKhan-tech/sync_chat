import { useState } from "react";
import {
    Moon,
    Sun,
    Monitor,
    Palette,
    Image,
} from "lucide-react";

function AppearanceSettings() {
    const [theme, setTheme] = useState("dark");
    const [accent, setAccent] = useState("#22c55e");
    const [wallpaper, setWallpaper] = useState("#111827");

    return (
        <div className="p-8 text-white max-w-5xl">

            {/* Header */}

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Appearance
                </h1>

                <p className="text-zinc-400 mt-2">
                    Personalize how SyncChat looks.
                </p>
            </div>

            <div className="space-y-6">

                {/* Theme */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

                    <div className="flex items-center gap-3 mb-5">

                        <Palette className="text-green-400" />

                        <h2 className="text-xl font-semibold">
                            Theme
                        </h2>

                    </div>

                    <div className="grid md:grid-cols-3 gap-4">

                        <button
                            onClick={() => setTheme("light")}
                            className={`rounded-xl p-5 border transition ${theme === "light"
                                    ? "border-green-500 bg-zinc-800"
                                    : "border-zinc-700"
                                }`}
                        >
                            <Sun className="mx-auto mb-3 text-yellow-400" size={30} />

                            <p>Light</p>
                        </button>

                        <button
                            onClick={() => setTheme("dark")}
                            className={`rounded-xl p-5 border transition ${theme === "dark"
                                    ? "border-green-500 bg-zinc-800"
                                    : "border-zinc-700"
                                }`}
                        >
                            <Moon className="mx-auto mb-3 text-blue-400" size={30} />

                            <p>Dark</p>
                        </button>

                        <button
                            onClick={() => setTheme("system")}
                            className={`rounded-xl p-5 border transition ${theme === "system"
                                    ? "border-green-500 bg-zinc-800"
                                    : "border-zinc-700"
                                }`}
                        >
                            <Monitor className="mx-auto mb-3 text-green-400" size={30} />

                            <p>System</p>
                        </button>

                    </div>

                </div>

                {/* Accent Color */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Accent Color
                    </h2>

                    <div className="flex items-center gap-5">

                        <input
                            type="color"
                            value={accent}
                            onChange={(e) => setAccent(e.target.value)}
                            className="w-20 h-14 cursor-pointer rounded"
                        />

                        <span className="text-zinc-400">
                            {accent}
                        </span>

                    </div>

                </div>

                {/* Wallpaper */}

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">

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
                        className="w-20 h-14 cursor-pointer rounded"
                    />

                    <div
                        className="mt-6 rounded-xl h-64 border border-zinc-700 flex items-center justify-center"
                        style={{
                            background: wallpaper,
                        }}
                    >
                        <div className="space-y-3">

                            <div className="bg-green-600 text-white rounded-xl px-4 py-2">
                                Hello 👋
                            </div>

                            <div className="bg-zinc-700 text-white rounded-xl px-4 py-2">
                                Welcome to SyncChat
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AppearanceSettings;