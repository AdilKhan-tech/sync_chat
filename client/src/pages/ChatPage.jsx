import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSettingsStore } from "../store/useSettingsStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ContactList from "../components/ContactList";
import ChatsList from "../components/ChatsList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import SearchModal from "../components/SearchModal";
import SettingsPanel from "../components/SettingsPanel";
import ImageLightbox from "../components/ImageLightbox";
import { MessageCircle, Search } from "lucide-react";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

function ChatPage() {
  const { activeTab, selectedUser, flushOfflineQueue, getAllContacts } = useChatStore();
  const { setShowSearch } = useSettingsStore();
  const [contactSearch, setContactSearch] = useState("");

  useKeyboardShortcuts();

  useEffect(() => {
    flushOfflineQueue();
    window.addEventListener("online", flushOfflineQueue);
    return () => window.removeEventListener("online", flushOfflineQueue);
  }, [flushOfflineQueue]);

  useEffect(() => {
    if (activeTab === "contacts") {
      getAllContacts(contactSearch);
    }
  }, [activeTab, contactSearch, getAllContacts]);

  return (
    <>
      <div className="chat-shell animate-fade-in">
        <aside className={`sidebar-panel ${selectedUser ? "hidden lg:flex" : "flex"}`}>
          <div className="panel-header flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center size-9 rounded-lg bg-accent-soft ring-1 ring-accent-ring">
                <MessageCircle className="size-5 text-accent-muted" />
              </div>
              <div>
                <h1 className="text-base font-semibold tracking-tight theme-text">SyncChat</h1>
                <p className="text-[11px] theme-text-muted">Messages</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="icon-btn !size-9"
              title="Search (Ctrl+K)"
            >
              <Search className="size-4" />
            </button>
          </div>

          <ProfileHeader />
          <ActiveTabSwitch />

          {activeTab === "contacts" && (
            <div className="px-3 pb-2">
              <input
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search contacts..."
                className="input-field !h-9 !text-xs"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-3 pb-3 scrollbar-thin">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </aside>

        <main className={`main-panel ${!selectedUser ? "hidden lg:flex" : "flex"}`}>
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </main>
      </div>

      <SearchModal />
      <SettingsPanel />
      <ImageLightbox />
    </>
  );
}

export default ChatPage;
