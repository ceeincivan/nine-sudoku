import { useSettings } from "@/lib/settings";

export function haptic(pattern: number | number[] = 8) {
  if (!useSettings.getState().haptics) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // ignore
  }
}
