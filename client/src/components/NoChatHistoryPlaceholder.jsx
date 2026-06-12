import { MessageCircleMore } from "lucide-react";

function NoChatHistoryPlaceholder({ name }) {
  return (
    <div className="flex items-center justify-center min-h-full px-6">
      <div className="max-w-md w-full text-center bg-base-200/40 backdrop-blur-sm rounded-3xl p-8 border border-base-300 shadow-lg">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 animate-pulse">
          <MessageCircleMore className="h-10 w-10 text-primary" />
        </div>

        <h2 className="text-2xl font-bold mb-3">
          No Messages Yet
        </h2>

        <p className="text-base-content/70 leading-relaxed">
          Start a conversation with{" "}
          <span className="font-semibold text-primary">
            {name || "this user"}
          </span>
          . Send your first message and begin chatting instantly.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-base-300 px-4 py-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          Ready to start chatting
        </div>

      </div>
    </div>
  );
}

export default NoChatHistoryPlaceholder;