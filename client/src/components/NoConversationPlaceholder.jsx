import { MessageCircleIcon } from "lucide-react";

function NoConversationPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
        <MessageCircleIcon className="w-9 h-9 text-cyan-400" />
      </div>
      <h2 className="text-xl md:text-2xl font-semibold text-slate-100 mb-2">
        No conversation selected
      </h2>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
        Select a chat from the sidebar to start messaging. Your conversations will appear here.
      </p>
    </div>
  );
}

export default NoConversationPlaceholder;