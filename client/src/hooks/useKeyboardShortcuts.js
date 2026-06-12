import { useEffect } from "react";
import { useSettingsStore } from "../store/useSettingsStore";
import { useChatStore } from "../store/useChatStore";

export const useKeyboardShortcuts = () => {
  const { setShowSearch, setShowSettings } = useSettingsStore();
  const { setSelectedUser } = useChatStore();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setShowSettings(false);
        setSelectedUser(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setShowSearch, setShowSettings, setSelectedUser]);
};
