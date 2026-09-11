import { Delete } from "lucide-react";
import { digitClass } from "@/components/nine/settings";
import { useSettings } from "@/lib/settings";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";

export function Keypad({
  disabled,
  counts,
  onDigit,
  onClear,
}: {
  disabled?: boolean;
  counts?: Record<number, number>;
  onDigit: (n: number) => void;
  onClear: () => void;
}) {
  const ink = useSettings((s) => s.ink);

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
          const count = counts ? counts[n] ?? 0 : 0;
          const exhausted = count >= 9;
          return (
            <button
              key={n}
              type="button"
              disabled={disabled || exhausted}
              onClick={() => {
                sfx.place();
                haptic(6);
                onDigit(n);
              }}
              className={cn(
                "nine-key relative flex h-14 flex-col items-center justify-center rounded-xl border border-ink/15 bg-paper-2 font-lexend text-xl tabular-nums",
                "shadow-sm hover:border-ink/40 hover:shadow-md",
                "disabled:opacity-25 disabled:pointer-events-none disabled:shadow-none",
                digitClass(n, ink, false),
              )}
              aria-label={`Digit ${n}${exhausted ? " exhausted" : ""}`}
            >
              <span className="relative z-10">{n}</span>
              {counts && (
                <span className="absolute bottom-1 text-[9px] font-medium text-stone/70 tabular-nums">
                  {9 - count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            haptic(8);
            onClear();
          }}
          aria-label="Clear cell"
          className="nine-key flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-ink/10 bg-paper-2/70 text-xs tracking-wider uppercase text-stone hover:border-ink/30 hover:text-ink disabled:opacity-30"
        >
          <Delete className="size-4" strokeWidth={1.6} />
          <span>clear</span>
        </button>
      </div>
    </div>
  );
}
