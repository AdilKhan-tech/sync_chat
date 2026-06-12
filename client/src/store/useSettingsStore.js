import { create } from "zustand";

const applyTheme = (theme) => {
  const isLight = theme === "light";
  document.documentElement.classList.toggle("light", isLight);
  document.documentElement.classList.toggle("dark", !isLight);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", isLight ? "#e8eaef" : "#0c0d10");
};

export const useSettingsStore = create((set, get) => ({
  theme: localStorage.getItem("theme") || "dark",
  showSearch: false,
  showSettings: false,
  lightboxImage: null,
  replyTo: null,
  editingMessage: null,

  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },

  initTheme: () => applyTheme(get().theme),

  setShowSearch: (v) => set({ showSearch: v }),
  setShowSettings: (v) => set({ showSettings: v }),
  setLightboxImage: (v) => set({ lightboxImage: v }),
  setReplyTo: (msg) => set({ replyTo: msg }),
  setEditingMessage: (msg) => set({ editingMessage: msg }),
}));
