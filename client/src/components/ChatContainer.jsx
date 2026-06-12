import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import BlockStatusBanner from "./BlockStatusBanner";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageBubble from "./MessageBubble";

function ChatContainer() {
  const {
    selectedUser,
    getMessages,
    messages,
    isMessagesLoading,
    typingUsers,
    hasMoreMessages,
    isMessagingBlocked,
  } = useChatStore();

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    getMessages(false);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (el?.scrollTop === 0 && hasMoreMessages && !isMessagesLoading) {
      getMessages(true);
    }
  };

  const isTyping = selectedUser && typingUsers.includes(String(selectedUser._id));

  return (
    <>
      <ChatHeader />
      <BlockStatusBanner />
      <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4 sm:p-6 min-h-full flex flex-col">
          {hasMoreMessages && (
            <button type="button" onClick={() => getMessages(true)} className="text-xs text-blue-400 hover:text-blue-300 mx-auto mb-4">
              Load older messages
            </button>
          )}
          {isMessagesLoading && messages.length === 0 ? (
            <MessagesLoadingSkeleton />
          ) : messages.length === 0 ? (
            <NoChatHistoryPlaceholder name={selectedUser?.fullName} />
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-3 sm:space-y-4 mt-auto">
              {messages.map((msg, index) => {
                const showAvatar =
                  index === 0 ||
                  String(messages[index - 1]?.senderId) !== String(msg.senderId);
                return (
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    showAvatar={showAvatar}
                    partner={selectedUser}
                  />
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bubble-received px-4 py-3.5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>
      </div>
      {!isMessagingBlocked() && <MessageInput />}
    </>
  );
}

export default ChatContainer;
