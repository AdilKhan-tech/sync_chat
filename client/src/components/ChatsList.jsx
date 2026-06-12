import { useEffect } from "react";
import { Archive, BellOff, Pin, ShieldOff } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import Avatar from "./Avatar";

function formatLastMessage(lastMessage) {
  if (!lastMessage) return "No messages yet";
  if (lastMessage.image && !lastMessage.text) return "Photo";
  return lastMessage.text || "Message";
}

function formatTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ChatsList() {
  const {
    getMyChatPartners,
    chats,
    isChatsLoading,
    setSelectedUser,
    selectedUser,
    isUserOnline,
    unreadCounts,
    typingInList,
    showArchivedChats,
    setShowArchivedChats,
  } = useChatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isChatsLoading && chats.length === 0) return <UsersLoadingSkeleton />;

  return (
    <div className="space-y-2 animate-slide-up">
      <div className="flex gap-1 p-1 rounded-xl theme-chip">
        <button
          type="button"
          onClick={() => setShowArchivedChats(false)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${
            !showArchivedChats ? "bg-accent-soft text-blue-300" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setShowArchivedChats(true)}
          className={`flex-1 text-xs py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
            showArchivedChats ? "bg-accent-soft text-blue-300" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Archive className="size-3" />
          Archived
        </button>
      </div>

      {chats.length === 0 ? (
        <NoChatsFound message={showArchivedChats ? "No archived chats" : undefined} />
      ) : (
        <div className="space-y-0.5">
          {chats.map((chat) => {
            const isSelected = selectedUser?._id === chat._id;
            const unread = unreadCounts[`user:${chat._id}`] || chat.unread || 0;
            const online = isUserOnline(chat._id);
            const isTyping = typingInList[chat._id];

            return (
              <button
                key={chat._id}
                type="button"
                onClick={() => setSelectedUser(chat)}
                className={`list-item ${isSelected ? "list-item-active" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={chat.profilePic}
                    name={chat.fullName}
                    size="md"
                    online={online}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-center gap-1 min-w-0">
                        {chat.isPinned && <Pin className="size-3 text-blue-400 shrink-0" />}
                        {chat.isMuted && <BellOff className="size-3 text-zinc-500 shrink-0" />}
                        {chat.blockedByThem && <ShieldOff className="size-3 text-amber-400 shrink-0" />}
                        <h4
                          className={`text-sm truncate ${
                            unread > 0 && !chat.isMuted ? "font-semibold theme-text" : "font-medium theme-text-secondary"
                          }`}
                        >
                          {chat.fullName}
                        </h4>
                      </div>
                      <span className="text-[10px] text-zinc-500 shrink-0 tabular-nums">
                        {formatTime(chat.lastMessage?.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p
                        className={`text-xs truncate ${
                          isTyping
                            ? "text-blue-400"
                            : chat.blockedByThem
                              ? "text-amber-400/80"
                              : unread > 0 && !chat.isMuted
                                ? "text-zinc-300 font-medium"
                                : "text-zinc-500"
                        }`}
                      >
                        {isTyping
                          ? "typing..."
                          : chat.blockedByThem
                            ? "Blocked you"
                            : formatLastMessage(chat.lastMessage)}
                      </p>
                      {unread > 0 && (
                        <span
                          className={`shrink-0 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 ${
                            chat.isMuted
                              ? "bg-zinc-600 text-zinc-300"
                              : "bg-accent text-white"
                          }`}
                        >
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
      )}
    </div>
  );
}

export default ChatsList;
