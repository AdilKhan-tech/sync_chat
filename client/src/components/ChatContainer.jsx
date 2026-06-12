import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser?._id);
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const isPartnerTyping =
    selectedUser && typingUsers.includes(String(selectedUser._id));

  return (
    <>
      <ChatHeader />
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length === 0 ? (
          <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-4 py-2">
            {messages.map((msg) => {
              const isOwn = String(msg.senderId) === String(authUser._id);
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 shadow-md ${
                      isOwn
                        ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-br-md"
                        : "bg-slate-800 text-slate-100 rounded-bl-md ring-1 ring-slate-700/50"
                    }`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className="rounded-lg max-h-56 w-full object-cover mb-1"
                      />
                    )}
                    {msg.text && (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                    )}
                    <p
                      className={`text-[10px] mt-1 ${
                        isOwn ? "text-cyan-100/70" : "text-slate-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            {isPartnerTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3 ring-1 ring-slate-700/50">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <MessageInput />
    </>
  );
}

export default ChatContainer;
