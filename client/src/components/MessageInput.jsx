import { useState, useRef, useCallback } from "react";
import { ImageIcon, Loader2, SendIcon, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const {
    selectedUser,
    sendMessage,
    isSendingMessage,
    emitTyping,
    emitStopTyping,
  } = useChatStore();

  const clearImage = () => {
    setImagePreview(null);
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTyping = useCallback(() => {
    if (!selectedUser) return;
    emitTyping(selectedUser._id);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedUser._id);
    }, 2000);
  }, [selectedUser, emitTyping, emitStopTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSendingMessage) return;
    if (!text.trim() && !imageData) return;

    emitStopTyping(selectedUser._id);
    await sendMessage({ text: text.trim(), image: imageData });
    setText("");
    clearImage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="h-24 rounded-lg object-cover ring-1 ring-slate-600"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 rounded-xl bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-cyan-400 transition-colors shrink-0"
          aria-label="Attach image"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelect}
          className="hidden"
        />

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => emitStopTyping(selectedUser?._id)}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 resize-none max-h-32 min-h-[44px] px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
        />

        <button
          type="submit"
          disabled={isSendingMessage || (!text.trim() && !imageData)}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 shadow-lg shadow-cyan-500/20"
          aria-label="Send message"
        >
          {isSendingMessage ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
