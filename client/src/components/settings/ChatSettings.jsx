import { useState } from "react";

function ChatSettings() {
    const [enterToSend, setEnterToSend] = useState(true);
    const [mediaAutoDownload, setMediaAutoDownload] = useState(true);
    const [readReceipts, setReadReceipts] = useState(true);
    const [fontSize, setFontSize] = useState("Medium");
    const [wallpaper, setWallpaper] = useState("#111827");

    return (
        <div className="p-8 text-white max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Chats</h1>
            <p className="text-zinc-400 mb-8">
                Customize your chat experience.
            </p>

            <div className="space-y-6">

                {/* Enter to Send */}
                <div className="bg-zinc-900 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Enter to Send</h3>
                        <p className="text-sm text-zinc-400">
                            Press Enter to send messages.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={enterToSend}
                        onChange={() => setEnterToSend(!enterToSend)}
                    />
                </div>

                {/* Read Receipts */}
                <div className="bg-zinc-900 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Read Receipts</h3>
                        <p className="text-sm text-zinc-400">
                            Let others know when you've read their messages.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={readReceipts}
                        onChange={() => setReadReceipts(!readReceipts)}
                    />
                </div>

                {/* Media Auto Download */}
                <div className="bg-zinc-900 rounded-xl p-5 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Auto Download Media</h3>
                        <p className="text-sm text-zinc-400">
                            Automatically download received photos and videos.
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={mediaAutoDownload}
                        onChange={() =>
                            setMediaAutoDownload(!mediaAutoDownload)
                        }
                    />
                </div>

                {/* Font Size */}
                <div className="bg-zinc-900 rounded-xl p-5">
                    <h3 className="font-semibold mb-3">Chat Font Size</h3>

                    <select
                        className="select select-bordered w-full bg-zinc-800 border-zinc-700"
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                    >
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                    </select>
                </div>

                {/* Wallpaper */}
                <div className="bg-zinc-900 rounded-xl p-5">
                    <h3 className="font-semibold mb-3">
                        Chat Wallpaper Color
                    </h3>

                    <input
                        type="color"
                        value={wallpaper}
                        onChange={(e) => setWallpaper(e.target.value)}
                        className="w-20 h-12 rounded cursor-pointer"
                    />

                    <div
                        className="mt-5 rounded-xl h-36 flex items-center justify-center"
                        style={{ background: wallpaper }}
                    >
                        <span className="text-white font-medium">
                            Wallpaper Preview
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ChatSettings;