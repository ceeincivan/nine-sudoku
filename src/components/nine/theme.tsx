import { useEffect } from "react";
import { installAudioUnlock } from "@/lib/sfx";
import { useSettings } from "@/lib/settings";

export function ThemeBoot() {
  const hydrate = useSettings((s) => s.hydrate);
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    hydrate();
    installAudioUnlock();
  }, [hydrate]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.add("theme-transition");
    const t = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 380);
    return () => window.clearTimeout(t);
  }, [theme]);

  return null;
}
