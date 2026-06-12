import { ArrowLeftIcon, XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

function ChatHeader() {
  const { selectedUser, setSelectedUser, isUserOnline } = useChatStore();

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  const online = isUserOnline(selectedUser?._id);

  return (
    <div className="p-4 sm:p-5 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 transition-colors shrink-0"
            aria-label="Back to chats"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>

          <div className="relative shrink-0">
            <img
              src={selectedUser?.profilePic || "/avatar.jpeg"}
              alt={selectedUser?.fullName}
              className="size-11 sm:size-12 rounded-full object-cover ring-2 ring-slate-700/50"
            />
            <span
              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-slate-800 ${
                online ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-slate-100 font-medium text-sm sm:text-base truncate">
              {selectedUser?.fullName}
            </h3>
            <p className="text-xs text-slate-400">
              {online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="hidden md:flex p-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-red-200 transition-all"
          aria-label="Close chat"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
