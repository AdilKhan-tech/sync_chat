import { MessageSquarePlus } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound({ message }) {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-14 px-4 text-center animate-fade-in">
      <div className="size-16 rounded-2xl theme-chip flex items-center justify-center mb-5">
        <MessageSquarePlus className="size-7 theme-text-faint" strokeWidth={1.5} />
      </div>
      <h4 className="text-sm font-semibold theme-text-secondary mb-1">
        {message || "No conversations yet"}
      </h4>
      {!message && (
        <>
          <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed mb-6">
            Browse your contacts and start your first chat.
          </p>
          <button type="button" onClick={() => setActiveTab("contacts")} className="btn-primary text-xs">
            Browse contacts
          </button>
        </>
      )}
    </div>
  );
}

export default NoChatsFound;
