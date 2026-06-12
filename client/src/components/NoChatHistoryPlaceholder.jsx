import { HandMetal } from "lucide-react";

function NoChatHistoryPlaceholder({ name }) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm w-full text-center glass-panel-subtle rounded-3xl p-8 animate-slide-up">
        <div className="mx-auto mb-5 size-16 flex items-center justify-center rounded-xl theme-chip">
          <HandMetal className="size-7 theme-text-faint" strokeWidth={1.5} />
        </div>

        <h2 className="text-lg font-semibold theme-text mb-2">
          Say hello to {name || "them"}
        </h2>
        <p className="text-sm theme-text-muted leading-relaxed">
          This is the beginning of your conversation. Send a message to get started.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 text-xs text-emerald-400/90 px-3 py-1.5 rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready to chat
        </div>
      </div>
    </div>
  );
}

export default NoChatHistoryPlaceholder;
