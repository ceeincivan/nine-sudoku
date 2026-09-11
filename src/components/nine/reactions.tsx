import { useCallback, useEffect, useState } from "react";
import { REACTIONS, type Reaction } from "@/lib/gloats";
import { haptic } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

export interface Floatie {
  id: number;
  e: string;
  x: number;
  size: number;
  delay: number;
  rot: number;
}

export function ReactionBar({
  disabled,
  onSend,
}: {
  disabled?: boolean;
  onSend: (e: Reaction) => void;
}) {
  return (
    <div className="mt-3 flex w-full max-w-md items-center justify-between gap-1">
      {REACTIONS.map((e) => (
        <button
          key={e}
          type="button"
          disabled={disabled}
          onClick={() => {
            sfx.react();
            haptic([10, 30, 10]);
            onSend(e);
          }}
          className={cn(
            "nine-react-btn flex size-11 items-center justify-center rounded-xl text-xl",
            "bg-paper-2/60 border border-ink/5 shadow-sm",
            "disabled:opacity-40 disabled:pointer-events-none",
          )}
          aria-label={`React ${e}`}
        >
          {e}
        </button>
      ))}
    </div>
  );
}

export function ReactionFloats({ items }: { items: Floatie[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {items.map((f) => (
        <span
          key={f.id}
          className="nine-float-fun absolute bottom-10"
          style={{
            left: `${f.x}%`,
            fontSize: `${f.size}rem`,
            animationDelay: `${f.delay}ms`,
            ["--tilt" as string]: `${f.rot}deg`,
          }}
        >
          {f.e}
        </span>
      ))}
    </div>
  );
}

export function useFloaties() {
  const [items, setItems] = useState<Floatie[]>([]);

  const push = useCallback((e: string) => {
    // Spawn a little burst of the same reaction for extra fun
    const count = 1 + Math.floor(Math.random() * 2);
    const baseX = 10 + Math.random() * 75;

    for (let i = 0; i < count; i++) {
      const id = Date.now() + Math.random() + i;
      const x = Math.max(5, Math.min(90, baseX + (Math.random() - 0.5) * 18));
      const size = 1.6 + Math.random() * 1.4;
      const delay = i * 60 + Math.random() * 40;
      const rot = (Math.random() - 0.5) * 30;

      setItems((prev) => [...prev, { id, e, x, size, delay, rot }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((f) => f.id !== id));
      }, 1500 + delay);
    }
  }, []);

  useEffect(() => () => setItems([]), []);

  return { items, push };
}
