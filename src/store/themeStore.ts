import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "../types";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
}

interface ThemeStore {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      theme: "dark",
      toggle: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        set({ theme: next });
      },
    }),
    {
      name: "tryspace-theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    },
  ),
);
