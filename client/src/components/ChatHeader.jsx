import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft, Archive, ArchiveRestore, Ban, BellOff, Bell,
  MoreVertical, Pin, PinOff, Search, Settings, ShieldOff, X,
} from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useSettingsStore } from "../store/useSettingsStore";
import Avatar from "./Avatar";

function ChatHeader() {
  const {
    selectedUser, setSelectedUser,
    isUserOnline, getLastSeen, lastSeenMap,
    pinChat, archiveChat, muteChat, blockUser, unblockUser,
    isChatPinned, isChatArchived, isChatMuted,
    blockStatus, isUserBlockedByMe,
  } = useChatStore();
  const { setShowSearch, setShowSettings } = useSettingsStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const online = selectedUser && isUserOnline(selectedUser._id);
  const chatId = selectedUser?._id;
  const pinned = chatId && isChatPinned(chatId);
  const archived = chatId && isChatArchived(chatId);
  const muted = chatId && isChatMuted(chatId);
  const blockedByMe = blockStatus.blockedByMe || (chatId && isUserBlockedByMe(chatId));
  const blockedByThem = blockStatus.blockedByThem;

  useEffect(() => {
    if (selectedUser && !online) getLastSeen(selectedUser._id);
  }, [selectedUser, online, getLastSeen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [selectedUser?._id]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  const lastSeen = selectedUser && lastSeenMap[selectedUser._id];

  const formatLastSeen = (date) => {
    if (!date) return "Offline";
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    if (diff < 60000) return "Last seen just now";
    if (diff < 3600000) return `Last seen ${Math.floor(diff / 60000)}m ago`;
    return `Last seen ${d.toLocaleDateString()}`;
  };

  const runAction = (fn) => {
    setMenuOpen(false);
    fn();
  };

  const statusLine = () => {
    if (blockedByMe) return <span className="text-red-400/90">Blocked by you</span>;
    if (blockedByThem) return <span className="text-amber-400/90">Blocked you</span>;
    if (online) return <span className="text-emerald-400/90">Active now</span>;
    return formatLastSeen(lastSeen?.lastSeenAt);
  };

  return (
    <header className="panel-header theme-surface sticky top-0 z-10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <button type="button" onClick={() => setSelectedUser(null)} className="icon-btn lg:hidden shrink-0">
            <ArrowLeft className="size-4" />
          </button>
          <Avatar src={selectedUser?.profilePic} name={selectedUser?.fullName} size="md" online={online && !blockedByMe && !blockedByThem} />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold truncate">{selectedUser?.fullName}</h3>
            <p className="text-xs text-zinc-500">{statusLine()}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setShowSearch(true)} className="icon-btn !size-9 hidden sm:inline-flex">
            <Search className="size-4" />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="icon-btn !size-9"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <MoreVertical className="size-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 min-w-[180px] py-1 theme-menu z-20 text-sm">
                {!blockedByMe && !blockedByThem && (
                  <>
                    <button type="button" className="theme-menu-item flex items-center gap-2" onClick={() => runAction(() => pinChat(chatId))}>
                      {pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
                      {pinned ? "Unpin" : "Pin"}
                    </button>
                    <button type="button" className="theme-menu-item flex items-center gap-2" onClick={() => runAction(() => muteChat(chatId))}>
                      {muted ? <Bell className="size-3.5" /> : <BellOff className="size-3.5" />}
                      {muted ? "Unmute" : "Mute 24h"}
                    </button>
                    <button type="button" className="theme-menu-item flex items-center gap-2" onClick={() => runAction(() => archiveChat(chatId))}>
                      {archived ? <ArchiveRestore className="size-3.5" /> : <Archive className="size-3.5" />}
                      {archived ? "Unarchive" : "Archive"}
                    </button>
                  </>
                )}
                {blockedByMe ? (
                  <button type="button" className="theme-menu-item flex items-center gap-2 text-emerald-600" onClick={() => runAction(() => unblockUser(chatId))}>
                    <ShieldOff className="size-3.5" /> Unblock
                  </button>
                ) : (
                  <button type="button" className="theme-menu-item flex items-center gap-2 text-red-500" onClick={() => runAction(() => blockUser(chatId))}>
                    <Ban className="size-3.5" /> Block
                  </button>
                )}
              </div>
            )}
          </div>
          <button type="button" onClick={() => setShowSettings(true)} className="icon-btn !size-9"><Settings className="size-4" /></button>
          <button type="button" onClick={() => setSelectedUser(null)} className="icon-btn-danger !size-9 hidden lg:inline-flex"><X className="size-4" /></button>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
