import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ContactList from "../components/ContactList";
import ChatsList from "../components/ChatsList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative flex w-full max-w-6xl h-[calc(100dvh-2rem)] sm:h-[calc(100dvh-3rem)] md:h-[720px] text-white rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
      {/* Sidebar */}
      <div
        className={`${
          selectedUser ? "hidden md:flex" : "flex"
        } w-full md:w-80 lg:w-96 bg-slate-800/60 backdrop-blur-md flex-col border-r border-slate-700/50`}
      >
        <ProfileHeader />
        <ActiveTabSwitch />
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* Main chat panel */}
      <div
        className={`${
          !selectedUser ? "hidden md:flex" : "flex"
        } flex-1 flex-col bg-slate-900/60 backdrop-blur-md min-w-0`}
      >
        {selectedUser ? (
          <ChatContainer />
        ) : (
          <NoConversationPlaceholder />
        )}
      </div>
    </div>
  );
}

export default ChatPage;
