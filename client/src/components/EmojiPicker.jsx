import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const EMOJI_GROUPS = [
  ["😀", "😂", "😍", "🥰", "😊", "😎", "🤔", "😢", "😡", "👍"],
  ["❤️", "🔥", "✨", "🎉", "👏", "🙏", "💯", "✅", "❌", "⭐"],
  ["👋", "🤝", "💪", "🎯", "🚀", "💡", "📎", "📷", "🎵", "☕"],
  ["😇", "🥳", "😴", "🤯", "🥲", "😬", "🫡", "🤗", "😘", "💀"],
];

function EmojiPicker({ open, onClose, onSelect, anchorRef }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !anchorRef?.current?.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const rect = anchorRef?.current?.getBoundingClientRect();
  const style = rect
    ? {
        position: "fixed",
        left: Math.max(8, rect.left),
        bottom: window.innerHeight - rect.top + 8,
        zIndex: 9999,
      }
    : { position: "fixed", left: 16, bottom: 80, zIndex: 9999 };

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      className="w-64 p-2 rounded-2xl glass-panel shadow-panel-lg ring-1 ring-white/10 animate-fade-in"
    >
      <div className="space-y-1">
        {EMOJI_GROUPS.map((row, i) => (
          <div key={i} className="grid grid-cols-10 gap-0.5">
            {row.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="size-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-lg transition-colors"
                onClick={() => {
                  onSelect(emoji);
                  onClose();
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}

export default EmojiPicker;
