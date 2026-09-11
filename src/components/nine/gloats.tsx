import { useEffect, useState } from "react";
import { haptic } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";
import { cn } from "@/lib/utils";

export function GloatBarrage({ lines }: { lines: string[] }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (lines.length === 0) return;
    let i = 1;
    sfx.lose();
    haptic([22, 50, 18, 40, 12]);
    setShown(1);
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      sfx.gloat();
      haptic(14);
      if (i >= lines.length) window.clearInterval(id);
    }, 480);
    return () => window.clearInterval(id);
  }, [lines]);

  const visible = lines.slice(0, shown).slice(-5);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-2 z-20 flex flex-col items-center gap-2.5 px-3">
      {visible.map((line, i) => (
        <p
          key={`${shown - visible.length + i}-${line}`}
          className={cn(
            "nine-gloat-bounce max-w-sm rounded-xl border border-ink/15 bg-paper-2/95 px-4 py-2.5 text-center font-display text-sm leading-snug text-ink shadow-lg backdrop-blur-sm",
          )}
          style={{
            ["--tilt" as string]: `${(i % 2 === 0 ? -1 : 1) * (1.2 + (i % 3) * 0.6)}deg`,
            animationDelay: `${i * 40}ms`,
          }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
