import { create } from "zustand";

interface SettingsState {
  ink: string;
  theme: string;
  haptics: boolean;
  hydrate: () => void;
  setInk: (ink: string) => void;
  setTheme: (theme: string) => void;
  setHaptics: (enabled: boolean) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  ink: "colorful",
  theme: "dark",
  haptics: true,
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const storedInk = localStorage.getItem("nine_ink");
      const storedTheme = localStorage.getItem("nine_theme");
      const storedHaptics = localStorage.getItem("nine_haptics");

      set({
        ink: storedInk || "colorful",
        theme: storedTheme || "dark",
        haptics: storedHaptics !== null ? storedHaptics === "true" : true,
      });
    } catch {
      // ignore
    }
  },
  setInk: (ink: string) => {
    try {
      localStorage.setItem("nine_ink", ink);
    } catch {
      // ignore
    }
    set({ ink });
  },
  setTheme: (theme: string) => {
    try {
      localStorage.setItem("nine_theme", theme);
    } catch {
      // ignore
    }
    set({ theme });
  },
  setHaptics: (enabled: boolean) => {
    try {
      localStorage.setItem("nine_haptics", String(enabled));
    } catch {
      // ignore
    }
    set({ haptics: enabled });
  },
}));
