import { useEffect } from "react";
import { X, Moon, Sun, Download } from "lucide-react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";
import Avatar from "./Avatar";

function SettingsPanel() {
  const { showSettings, setShowSettings, theme, toggleTheme } = useSettingsStore();
  const { authUser } = useAuthStore();
  const { selectedUser, exportChat, blockedUsers, getBlockedUsers, unblockUser } = useChatStore();

  useEffect(() => {
    if (showSettings) getBlockedUsers();
  }, [showSettings, getBlockedUsers]);

  if (!showSettings) return null;

  const updateTheme = async () => {
    toggleTheme();
    await axiosInstance.put("/users/settings", { theme: theme === "dark" ? "light" : "dark" });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end theme-overlay backdrop-blur-sm" onClick={() => setShowSettings(false)}>
      <div className="w-full max-w-md h-full glass-panel border-l theme-border overflow-y-auto scrollbar-thin animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header flex items-center justify-between sticky top-0 theme-surface z-10">
          <h2 className="font-semibold theme-text">Settings</h2>
          <button type="button" onClick={() => setShowSettings(false)} className="icon-btn"><X className="size-4" /></button>
        </div>

        <div className="p-4 space-y-6">
          <section>
            <h3 className="text-xs font-medium theme-text-faint uppercase tracking-wider mb-3">Appearance</h3>
            <button type="button" onClick={updateTheme} className="w-full list-item flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                Theme: {theme}
              </span>
              <span className="text-xs text-blue-400">Toggle</span>
            </button>
          </section>

          <section>
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Blocked users</h3>
            {blockedUsers.length === 0 ? (
              <p className="text-sm text-zinc-500 px-1">No blocked users</p>
            ) : (
              <div className="space-y-1">
                {blockedUsers.map((user) => (
                  <div key={user._id} className="list-item flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={user.profilePic} name={user.fullName} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium theme-text-secondary truncate">{user.fullName}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => unblockUser(user._id)}
                      className="shrink-0 text-xs font-medium text-blue-400 hover:text-blue-300 px-2.5 py-1 rounded-lg hover:bg-blue-500/10 transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {selectedUser && (
            <section>
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Chat</h3>
              <button type="button" onClick={() => exportChat(selectedUser._id)} className="w-full list-item flex items-center gap-2 text-sm">
                <Download className="size-4" /> Export conversation
              </button>
            </section>
          )}

          <section>
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Account</h3>
            <p className="text-sm theme-text-muted">{authUser?.email}</p>
            {authUser?.isAdmin && (
              <a href="/admin" className="btn-primary w-full text-sm mt-3 inline-flex justify-center">Admin Dashboard</a>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
