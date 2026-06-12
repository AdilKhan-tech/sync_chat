import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function formatLastMessage(lastMessage) {
  if (!lastMessage) return "No messages yet";
  if (lastMessage.image && !lastMessage.text) return "📷 Photo";
  return lastMessage.text || "Message";
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isUsersLoading,
    setSelectedUser,
    selectedUser,
    isUserOnline,
    unreadCounts,
  } = useChatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-1">
      {chats.map((chat) => {
        const isSelected = selectedUser?._id === chat._id;
        const unread = unreadCounts[chat._id] || 0;
        const online = isUserOnline(chat._id);

        return (
          <button
            key={chat._id}
            type="button"
            onClick={() => setSelectedUser(chat)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
              isSelected
                ? "bg-cyan-500/20 ring-1 ring-cyan-500/30"
                : "hover:bg-slate-700/40"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src={chat.profilePic || "/avatar.jpeg"}
                  alt={chat.fullName}
                  className="size-11 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-slate-800 ${
                    online ? "bg-emerald-400" : "bg-slate-500"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-slate-200 font-medium text-sm truncate">
                    {chat.fullName}
                  </h4>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {formatTime(chat.lastMessage?.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-slate-400 truncate">
                    {formatLastMessage(chat.lastMessage)}
                  </p>
                  {unread > 0 && (
                    <span className="shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-cyan-500 text-white text-[10px] font-bold px-1">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ChatsList;
