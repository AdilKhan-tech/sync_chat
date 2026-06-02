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
    <div className="relative flex w-full max-w-6xl h-[700px] text-white ">
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
        <ProfileHeader />
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
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