import { MessageSquare, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  const tabs = [
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "contacts", label: "Contacts", icon: Users },
  ];

  return (
    <div className="px-3 pt-1 pb-2">
      <div className="flex gap-1 p-1 rounded-xl theme-chip">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`tab-pill flex items-center justify-center gap-2 ${
              activeTab === id ? "tab-pill-active" : "tab-pill-inactive"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActiveTabSwitch;
