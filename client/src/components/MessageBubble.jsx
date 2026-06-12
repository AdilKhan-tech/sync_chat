import { useState } from "react";
import {
  Check, CheckCheck, MoreHorizontal, Pencil, Reply, Trash2, Flag,
} from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSettingsStore } from "../store/useSettingsStore";
import Avatar from "./Avatar";
import LinkPreviewCard from "./LinkPreviewCard";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

function DeliveryStatus({ message, authUserId, partnerId }) {
  if (String(message.senderId) !== String(authUserId)) return null;

  const read = message.readBy?.some((r) => String(r.userId) === String(partnerId));
  const delivered = message.deliveredTo?.some((d) => String(d.userId) === String(partnerId));

  if (read) {
    return <CheckCheck className="size-3.5 text-blue-500" aria-label="Read" />;
  }
  if (delivered) {
    return <CheckCheck className="size-3.5 text-zinc-400" aria-label="Delivered" />;
  }
  return <Check className="size-3 text-zinc-500" aria-label="Sent" />;
}

function MessageBubble({ message, showAvatar, partner }) {
  const { authUser } = useAuthStore();
  const { reactToMessage, deleteMessage, reportUser } = useChatStore();
  const { setReplyTo, setEditingMessage, setLightboxImage } = useSettingsStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const isOwn = String(message.senderId) === String(authUser._id);
  const isDeleted = message.isDeleted;

  return (
    <div className={`flex items-end gap-2 group ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div className="w-7 shrink-0">
          {showAvatar && (
            <Avatar src={partner?.profilePic} name={partner?.fullName} size="xs" />
          )}
        </div>
      )}

      <div className="relative max-w-[82%] sm:max-w-[68%]">
        {message.replyTo && (
          <div className="mb-1 px-3 py-1.5 rounded-lg theme-surface-subtle border-l-2 border-accent text-xs theme-text-muted truncate">
            {message.replyTo.text || "Media"}
          </div>
        )}

        <div className={`px-4 py-2.5 ${isOwn ? "bubble-sent" : "bubble-received"}`}>
          {message.voiceUrl && (
            <audio controls src={message.voiceUrl} className="max-w-full h-8" />
          )}
          {message.image && (
            <button type="button" onClick={() => setLightboxImage(message.image)}>
              <img src={message.image} alt="" className="rounded-xl max-h-60 w-full object-cover mb-1.5 cursor-zoom-in" />
            </button>
          )}
          {message.fileUrl && (
            <a href={message.fileUrl} target="_blank" rel="noreferrer" className="text-sm underline text-blue-300 block mb-1">
              📎 {message.fileName || "Download file"}
            </a>
          )}
          {message.text && (
            <p className="text-[13px] sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {isDeleted ? "This message was deleted" : message.text}
            </p>
          )}
          {message.linkPreview?.url && <LinkPreviewCard preview={message.linkPreview} />}

          <div className={`flex items-center gap-1.5 mt-1.5 ${isOwn ? "justify-end" : ""}`}>
            {message.editedAt && <span className="text-[10px] text-zinc-500">edited</span>}
            <span className={`text-[10px] tabular-nums ${isOwn ? "text-blue-100/70" : "text-zinc-500"}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <DeliveryStatus message={message} authUserId={authUser._id} partnerId={partner?._id} />
            {message.pending && <span className="text-[10px] text-zinc-500">sending…</span>}
          </div>
        </div>

        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((r, i) => (
              <span key={i} className="text-xs px-1.5 py-0.5 rounded-full theme-chip">
                {r.emoji}
              </span>
            ))}
          </div>
        )}

        <div className={`absolute top-0 ${isOwn ? "left-0 -translate-x-full pr-1" : "right-0 translate-x-full pl-1"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5`}>
          <button type="button" className="icon-btn !size-7" onClick={() => setShowReactions(!showReactions)}>
            <span className="text-xs">😀</span>
          </button>
          <button type="button" className="icon-btn !size-7" onClick={() => setMenuOpen(!menuOpen)}>
            <MoreHorizontal className="size-3.5" />
          </button>
        </div>

        {showReactions && (
          <div className="absolute z-10 -top-10 flex gap-1 p-1.5 rounded-xl theme-menu shadow-lg">
            {REACTIONS.map((e) => (
              <button key={e} type="button" className="hover:scale-125 transition-transform" onClick={() => { reactToMessage(message._id, e); setShowReactions(false); }}>
                {e}
              </button>
            ))}
          </div>
        )}

        {menuOpen && (
          <div className="absolute z-20 top-8 right-0 min-w-[140px] py-1 theme-menu text-sm">
            <button type="button" className="theme-menu-item flex items-center gap-2" onClick={() => { setReplyTo(message); setMenuOpen(false); }}>
              <Reply className="size-3.5" /> Reply
            </button>
            {isOwn && (
              <button type="button" className="theme-menu-item flex items-center gap-2" onClick={() => { setEditingMessage(message); setMenuOpen(false); }}>
                <Pencil className="size-3.5" /> Edit
              </button>
            )}
            <button type="button" className="theme-menu-item flex items-center gap-2 text-red-500" onClick={() => { deleteMessage(message._id, isOwn); setMenuOpen(false); }}>
              <Trash2 className="size-3.5" /> Delete
            </button>
            {!isOwn && (
              <button type="button" className="theme-menu-item flex items-center gap-2" onClick={() => { reportUser(message.senderId, "Inappropriate", message._id); setMenuOpen(false); }}>
                <Flag className="size-3.5" /> Report
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
