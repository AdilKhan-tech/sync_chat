import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useSettingsStore } from "../store/useSettingsStore";

function SearchModal() {
  const { showSearch, setShowSearch } = useSettingsStore();
  const { searchMessages, searchResults, setSelectedUser } = useChatStore();
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => searchMessages(q), 300);
    return () => clearTimeout(t);
  }, [q, searchMessages]);

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 theme-overlay backdrop-blur-sm" onClick={() => setShowSearch(false)}>
      <div className="w-full max-w-lg glass-panel rounded-2xl shadow-panel-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b theme-border">
          <Search className="size-5 theme-text-faint" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 bg-transparent outline-none text-sm theme-text placeholder:theme-text-faint"
          />
          <button type="button" onClick={() => setShowSearch(false)} className="icon-btn !size-8">
            <X className="size-4" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
          {searchResults.length === 0 && q && (
            <p className="text-center text-sm text-zinc-500 py-8">No results</p>
          )}
          {searchResults.map((msg) => (
            <button
              key={msg._id}
              type="button"
              className="w-full text-left p-3 rounded-xl hover-theme transition-colors theme-text-secondary"
              onClick={() => {
                const partner = msg.senderId._id === msg.receiverId?._id ? msg.receiverId : (typeof msg.senderId === "object" ? msg.receiverId : msg.senderId);
                const user = typeof msg.receiverId === "object" ? msg.receiverId : msg.senderId;
                setSelectedUser(user._id ? user : { _id: partner });
                setShowSearch(false);
              }}
            >
              <p className="text-xs text-zinc-500 mb-1">
                {msg.senderId?.fullName || "User"} · {new Date(msg.timestamp).toLocaleDateString()}
              </p>
              <p className="text-sm theme-text-secondary truncate">{msg.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
