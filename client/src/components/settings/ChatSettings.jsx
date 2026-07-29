import { useState } from "react";
import {
  MessageCircle,
  Download,
  CheckCheck,
  Type,
  Image,
} from "lucide-react";

function ChatSettings() {
  const [enterToSend, setEnterToSend] = useState(true);
  const [mediaAutoDownload, setMediaAutoDownload] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [fontSize, setFontSize] = useState("Medium");
  const [wallpaper, setWallpaper] = useState("#111827");

  return (
    <div className="min-h-screen bg-[#0b141a] text-white">

      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-2">
          Chats
        </h1>

        <p className="text-zinc-400 mb-8">
          Customize your chat experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Enter To Send */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <MessageCircle className="text-green-500" />

              <div>

                <h2 className="font-semibold">
                  Enter To Send
                </h2>

                <p className="text-zinc-400 text-sm">
                  Press Enter to send messages.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={enterToSend}
              onChange={() => setEnterToSend(!enterToSend)}
              className="toggle toggle-success"
            />

          </div>

          {/* Read Receipts */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <CheckCheck className="text-cyan-500" />

              <div>

                <h2 className="font-semibold">
                  Read Receipts
                </h2>

                <p className="text-zinc-400 text-sm">
                  Show when you've read messages.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={readReceipts}
              onChange={() => setReadReceipts(!readReceipts)}
              className="toggle toggle-success"
            />

          </div>

          {/* Auto Download */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <Download className="text-blue-500" />

              <div>

                <h2 className="font-semibold">
                  Auto Download Media
                </h2>

                <p className="text-zinc-400 text-sm">
                  Automatically download photos and videos.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={mediaAutoDownload}
              onChange={() =>
                setMediaAutoDownload(!mediaAutoDownload)
              }
              className="toggle toggle-success"
            />

          </div>

          {/* Font Size */}

          <div className="bg-[#202c33] rounded-xl p-5">

            <div className="flex items-center gap-3 mb-5">

              <Type className="text-yellow-500" />

              <div>

                <h2 className="font-semibold">
                  Font Size
                </h2>

                <p className="text-zinc-400 text-sm">
                  Change chat font size.
                </p>

              </div>

            </div>

            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="w-full bg-[#111b21] rounded-lg p-3 outline-none"
            >
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>

          </div>

        </div>

        {/* Wallpaper */}

        <div className="bg-[#202c33] rounded-xl p-5 mt-6">

          <div className="flex items-center gap-3 mb-5">

            <Image className="text-pink-500" />

            <div>

              <h2 className="font-semibold">
                Chat Wallpaper
              </h2>

              <p className="text-zinc-400 text-sm">
                Choose a wallpaper color for chats.
              </p>

            </div>

          </div>

          <input
            type="color"
            value={wallpaper}
            onChange={(e) => setWallpaper(e.target.value)}
            className="w-24 h-12 rounded cursor-pointer"
          />

          <div
            className="mt-6 h-48 rounded-xl flex items-center justify-center"
            style={{ background: wallpaper }}
          >
            <span className="font-semibold">
              Wallpaper Preview
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default ChatSettings;