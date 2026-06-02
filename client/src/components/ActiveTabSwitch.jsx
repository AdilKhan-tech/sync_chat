import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex w-full p-2 gap-2">
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${
            activeTab === "chats"
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${
            activeTab === "contacts"
              ? "bg-cyan-500/20 text-cyan-400"
              : "text-slate-400 hover:text-slate-200"
          }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;