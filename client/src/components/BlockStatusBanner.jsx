import { Ban, ShieldOff } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function BlockStatusBanner() {
  const { blockStatus, selectedUser, unblockUser } = useChatStore();
  const { blockedByMe, blockedByThem } = blockStatus;

  if (!selectedUser || (!blockedByMe && !blockedByThem)) return null;

  if (blockedByMe) {
    return (
      <div className="mx-4 sm:mx-6 mt-3 flex items-start gap-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3">
        <Ban className="size-4 text-red-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-200">You blocked this user</p>
          <p className="text-xs text-red-300/70 mt-0.5">
            You won&apos;t receive messages from {selectedUser.fullName}. Unblock to chat again.
          </p>
        </div>
        <button
          type="button"
          onClick={() => unblockUser(selectedUser._id)}
          className="shrink-0 text-xs font-medium text-red-200 hover:text-white bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          Unblock
        </button>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 mt-3 flex items-start gap-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 px-4 py-3">
      <ShieldOff className="size-4 text-amber-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-amber-200">You can&apos;t message this user</p>
        <p className="text-xs text-amber-300/70 mt-0.5">
          {selectedUser.fullName} has blocked you. You can still view past messages, but you can&apos;t send new ones.
        </p>
      </div>
    </div>
  );
}

export default BlockStatusBanner;
