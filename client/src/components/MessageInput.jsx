import { useState, useRef, useCallback, useEffect } from "react";
import { ImagePlus, Loader2, Send, X, Smile } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { playKeystrokeSound } from "../lib/sounds";
import { useSettingsStore } from "../store/useSettingsStore";
import VoiceRecorder from "./VoiceRecorder";
import EmojiPicker from "./EmojiPicker";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const emojiBtnRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { selectedUser, sendMessage, isSendingMessage, emitTyping, emitStopTyping, isSoundEnabled } = useChatStore();
  const { replyTo, setReplyTo, editingMessage, setEditingMessage } = useSettingsStore();

  useEffect(() => {
    if (editingMessage) setText(editingMessage.text || "");
  }, [editingMessage]);

  const clearImage = () => {
    setImagePreview(null);
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (file.type.startsWith("image/")) {
        setImagePreview(reader.result);
        setImageData(reader.result);
      } else {
        setImageData(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const playKeySound = useCallback(() => {
    if (isSoundEnabled) playKeystrokeSound();
  }, [isSoundEnabled]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      return;
    }
    if (!isSoundEnabled) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length !== 1) return;
    playKeystrokeSound();
  };

  const handleTyping = useCallback(() => {
    if (!selectedUser) return;
    emitTyping(selectedUser._id);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedUser._id);
    }, 2000);
  }, [selectedUser, emitTyping, emitStopTyping]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isSendingMessage) return;

    if (editingMessage) {
      const { editMessage } = useChatStore.getState();
      await editMessage(editingMessage._id, text.trim());
      setEditingMessage(null);
      setText("");
      return;
    }

    if (!text.trim() && !imageData) return;
    emitStopTyping(selectedUser._id);

    await sendMessage({
      text: text.trim(),
      image: imageData?.startsWith("data:image") ? imageData : undefined,
      file: imageData && !imageData.startsWith("data:image") ? imageData : undefined,
      imagePreview,
      replyTo: replyTo?._id,
    });
    setText("");
    clearImage();
    setReplyTo(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`panel-header !py-3 sm:!py-4 theme-surface safe-bottom transition-colors ${dragOver ? "ring-2 ring-blue-500/30" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {replyTo && (
        <div className="mb-2 flex items-center justify-between px-3 py-2 rounded-lg theme-chip text-xs">
          <span className="theme-text-muted truncate">Replying to: {replyTo.text?.slice(0, 50)}</span>
          <button type="button" onClick={() => setReplyTo(null)}><X className="size-3.5" /></button>
        </div>
      )}
      {editingMessage && (
        <div className="mb-2 flex items-center justify-between px-3 py-2 rounded-lg bg-accent-soft text-xs text-blue-300 ring-1 ring-accent-ring">
          <span>Editing message</span>
          <button type="button" onClick={() => { setEditingMessage(null); setText(""); }}><X className="size-3.5" /></button>
        </div>
      )}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img src={imagePreview} alt="" className="h-28 rounded-xl object-cover ring-1 ring-white/10" />
          <button type="button" onClick={clearImage} className="absolute -top-2 -right-2 size-6 rounded-full theme-surface theme-border border flex items-center justify-center"><X className="size-3 theme-text-muted" /></button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <button ref={emojiBtnRef} type="button" onClick={() => setShowEmoji((v) => !v)} className="icon-btn !size-11 shrink-0">
          <Smile className="size-5" />
        </button>
        <EmojiPicker
          open={showEmoji}
          anchorRef={emojiBtnRef}
          onClose={() => setShowEmoji(false)}
          onSelect={(emoji) => {
            playKeySound();
            setText((t) => t + emoji);
          }}
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="icon-btn !size-11 shrink-0"><ImagePlus className="size-5" /></button>
        <VoiceRecorder onRecorded={(voice) => sendMessage({ voice, voiceDuration: 5 })} />
        <input type="file" accept="image/*,.pdf,.doc,.docx" ref={fileInputRef} onChange={(e) => handleFile(e.target.files?.[0])} className="hidden" />

        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); handleTyping(); }}
          onKeyDown={handleKeyDown}
          onBlur={() => emitStopTyping(selectedUser?._id)}
          placeholder="Write a message..."
          rows={1}
          className="input-field flex-1 resize-none max-h-32 min-h-[44px] py-3"
        />

        <button type="submit" disabled={isSendingMessage || (!text.trim() && !imageData && !editingMessage)} className="shrink-0 size-11 flex items-center justify-center rounded-lg text-white bg-accent hover:bg-accent-hover disabled:opacity-40 transition-colors active:scale-[0.98]">
          {isSendingMessage ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-4" />}
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
