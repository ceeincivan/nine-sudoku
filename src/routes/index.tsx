import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Board } from "@/components/nine/board";
import { GloatBarrage } from "@/components/nine/gloats";
import { Keypad } from "@/components/nine/keypad";
import { ReactionBar, ReactionFloats, useFloaties } from "@/components/nine/reactions";
import { Button } from "@/components/ui/button";
import { getRandomTaunts, Reaction } from "@/lib/gloats";
import { haptic } from "@/lib/haptics";
import { sfx } from "@/lib/sfx";

import { useSettings } from "@/lib/settings";
import { countDigits, generateSudoku, isSolved } from "@/lib/sudoku";

export const Route = createFileRoute("/")({
  component: NineGame,
});

function NineGame() {
  const [puzzleData, setPuzzleData] = useState(() => generateSudoku(36));
  const [board, setBoard] = useState<number[]>(() => [...puzzleData.puzzle]);
  const [selected, setSelected] = useState<number | null>(null);
  const [cheat, setCheat] = useState(false);
  const [gloats, setGloats] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const { items: floaties, push: pushFloat } = useFloaties();
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);

  const startNewGame = useCallback((clues = 36) => {
    const next = generateSudoku(clues);
    setPuzzleData(next);
    setBoard([...next.puzzle]);
    setSelected(null);
    setGloats([]);
    setTimer(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    if (isWon) return;
    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isWon]);

  const handleDigit = useCallback(
    (digit: number) => {
      if (selected === null) return;
      if (puzzleData.puzzle[selected] !== 0) return; // cannot change given digits

      const newBoard = [...board];
      newBoard[selected] = digit;
      setBoard(newBoard);

      // Check if mistake was placed
      if (digit !== puzzleData.solution[selected]) {
        sfx.lose();
        setGloats(getRandomTaunts(3));
      } else {
        sfx.place();
      }

      // Check win condition
      if (isSolved(newBoard, puzzleData.solution)) {
        setIsWon(true);
        sfx.win();
        haptic([50, 100, 50, 100, 100]);
      }
    },
    [selected, puzzleData, board],
  );

  const handleClear = useCallback(() => {
    if (selected === null) return;
    if (puzzleData.puzzle[selected] !== 0) return;

    const newBoard = [...board];
    newBoard[selected] = 0;
    setBoard(newBoard);
    sfx.clear();
  }, [selected, puzzleData, board]);

  const handleReaction = useCallback(
    (e: Reaction) => {
      pushFloat(e);
      sfx.react();
    },
    [pushFloat],
  );

  // Long press on "NINE" title to toggle cheat mode as described in README
  const handleTitleTouchStart = () => {
    const timerId = setTimeout(() => {
      setCheat((c) => !c);
      haptic([30, 30, 30]);
    }, 1000);
    setLongPressTimer(timerId);
  };

  const handleTitleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const counts = countDigits(board);
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between p-4 sm:p-6">
      <GloatBarrage lines={gloats} />
      <ReactionFloats items={floaties} />

      {/* Header */}
      <header className="flex w-full max-w-md items-center justify-between py-2">
        <h1
          onMouseDown={handleTitleTouchStart}
          onMouseUp={handleTitleTouchEnd}
          onTouchStart={handleTitleTouchStart}
          onTouchEnd={handleTitleTouchEnd}
          className="cursor-pointer font-black text-3xl tracking-tight select-none hover:opacity-80"
          title="Long press for secret cheat mode"
        >
          NINE {cheat && <span className="text-xs font-normal text-cinnabar">(cheat mode)</span>}
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-stone">{formatTime(timer)}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>
          <Button variant="default" size="sm" onClick={() => startNewGame(36)}>
            New Game
          </Button>
        </div>
      </header>

      {/* Win Banner */}
      {isWon && (
        <div className="my-2 w-full max-w-md rounded-xl bg-emerald-500/20 p-4 text-center border border-emerald-500/40">
          <h2 className="font-bold text-xl text-emerald-400">🎉 Victory! 🎉</h2>
          <p className="text-sm">Completed in {formatTime(timer)}!</p>
        </div>
      )}

      {/* Main Board */}
      <main className="flex w-full max-w-md flex-1 items-center justify-center py-2">
        <Board
          puzzle={puzzleData.puzzle}
          board={board}
          solution={puzzleData.solution}
          selected={selected}
          cheat={cheat}
          onSelect={setSelected}
        />
      </main>

      {/* Keypad & Reactions */}
      <footer className="flex w-full max-w-md flex-col items-center gap-2 pb-2">
        <Keypad counts={counts} onDigit={handleDigit} onClear={handleClear} />
        <ReactionBar onSend={handleReaction} />
      </footer>
    </div>
  );
}
