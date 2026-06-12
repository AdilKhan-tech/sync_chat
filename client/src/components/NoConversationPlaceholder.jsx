import { MessageCircle } from "lucide-react";

function NoConversationPlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="size-16 rounded-2xl theme-chip flex items-center justify-center mb-5">
        <MessageCircle className="size-8 theme-text-faint" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-medium theme-text mb-1.5">Select a conversation</h3>
      <p className="text-sm theme-text-muted max-w-[240px] leading-relaxed">
        Choose a chat from the sidebar or start a new one from Contacts.
      </p>
    </div>
  );
}

export default NoConversationPlaceholder;
