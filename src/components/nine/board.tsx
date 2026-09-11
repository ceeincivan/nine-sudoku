import { digitClass } from "@/components/nine/settings";
import { useSettings } from "@/lib/settings";
import { conflictsAt, rc, sameUnit } from "@/lib/sudoku";
import { cn } from "@/lib/utils";

type Grid = number[];

export function Board({
  puzzle,
  board,
  solution,
  selected,
  notes,
  cheat,
  onSelect,
}: {
  puzzle: Grid;
  board: Grid;
  solution: Grid;
  selected: number | null;
  notes?: number[];
  cheat: boolean;
  onSelect: (index: number) => void;
}) {
  const ink = useSettings((s) => s.ink);
  const selectedValue = selected !== null ? board[selected] : 0;

  return (
    <div
      className="nine-board grid aspect-square w-full max-w-md grid-cols-9 overflow-hidden rounded-md border-2 border-ink shadow-inner"
      role="grid"
      aria-label="Sudoku"
    >
      {Array.from({ length: 81 }, (_, i) => {
        const given = puzzle[i]! !== 0;
        const value = board[i]!;
        const { r, c } = rc(i);
        const isSel = selected === i;
        const inUnit = selected !== null && sameUnit(selected, i);
        const sameNum = Boolean(selectedValue && value === selectedValue);
        const conflict = value !== 0 && conflictsAt(board, i);
        const ghost = cheat && !given && value === 0;
        const boxRight = c === 2 || c === 5;
        const boxBottom = r === 2 || r === 5;
        const lastCol = c === 8;
        const lastRow = r === 8;
        const delay = (Math.floor(r / 3) * 3 + Math.floor(c / 3)) * 22;

        return (
          <button
            key={i}
            type="button"
            role="gridcell"
            aria-selected={isSel}
            aria-label={`Row ${r + 1}, column ${c + 1}${
              given ? `, given ${value}` : value ? `, ${value}` : ", empty"
            }`}
            onClick={() => onSelect(i)}
            className={cn(
              "nine-cell relative flex items-center justify-center font-lexend text-cell leading-none tabular-nums select-none sm:text-cell-lg",
              given ? "font-semibold" : "font-normal",
              isSel && "bg-paper-2 ring-2 ring-ink/50 z-10 nine-cell-selected",
              !isSel && inUnit && "bg-paper-2/50",
              !isSel && sameNum && value !== 0 && "bg-paper-3/90 font-semibold nine-same-highlight",
              conflict && !given && "text-cinnabar nine-shake",
              boxRight && !lastCol && "border-r-2 border-r-ink",
              !boxRight && !lastCol && "border-r border-r-rule/60",
              boxBottom && !lastRow && "border-b-2 border-b-ink",
              !boxBottom && !lastRow && "border-b border-b-rule/60",
            )}
            style={{ animationDelay: `${delay}ms` }}
          >
            {value !== 0 ? (
              <span
                key={`${i}-${value}`}
                className={cn(
                  !given && "nine-place inline-block",
                  conflict && !given ? "text-cinnabar" : digitClass(value, ink, given),
                )}
              >
                {value}
              </span>
            ) : ghost ? (
              <span className="font-editorial text-ghost text-cinnabar/45 animate-pulse">
                {solution[i]}
              </span>
            ) : notes && notes[i] ? (
              <div className="grid size-full grid-cols-3 grid-rows-3 p-0.5 text-3xs font-num text-stone/70 leading-none">
                {Array.from({ length: 9 }, (_, k) => k + 1).map((n) => (
                  <span
                    key={n}
                    className={cn(
                      "flex items-center justify-center transition-opacity duration-150",
                      (notes[i]! & (1 << n)) !== 0 ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {(notes[i]! & (1 << n)) !== 0 ? n : ""}
                  </span>
                ))}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
