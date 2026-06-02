import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
        <MessageCircleIcon className="w-8 h-8 text-cyan-500" />
      </div>
      <div>
        <h4 className="text-slate-200 font-medium mb-1">No chats found</h4>
        <p className="text-sm text-slate-400">
          Start a new conversation by searching for contacts.
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="px-4 py-2 bg-cyan-500 text-white rounded-md text-sm font-medium hover:bg-cyan-600 transition"
      >
        Find Contacts
      </button>
    </div>
  );
}
export default NoChatsFound;
