export function rc(i: number): { r: number; c: number } {
  return {
    r: Math.floor(i / 9),
    c: i % 9,
  };
}

export function sameUnit(i1: number, i2: number): boolean {
  if (i1 === i2) return true;
  const r1 = Math.floor(i1 / 9);
  const c1 = i1 % 9;
  const r2 = Math.floor(i2 / 9);
  const c2 = i2 % 9;

  if (r1 === r2 || c1 === c2) return true;
  const b1 = Math.floor(r1 / 3) * 3 + Math.floor(c1 / 3);
  const b2 = Math.floor(r2 / 3) * 3 + Math.floor(c2 / 3);
  return b1 === b2;
}

export function conflictsAt(board: number[], i: number): boolean {
  const val = board[i];
  if (!val) return false;
  for (let j = 0; j < 81; j++) {
    if (i !== j && board[j] === val && sameUnit(i, j)) {
      return true;
    }
  }
  return false;
}

export function countDigits(board: number[]): Record<number, number> {
  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
  for (let i = 0; i < 81; i++) {
    const val = board[i];
    if (val && val >= 1 && val <= 9) {
      counts[val] = (counts[val] || 0) + 1;
    }
  }
  return counts;
}

export function isSolved(board: number[], solution: number[]): boolean {
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0 || board[i] !== solution[i]) {
      return false;
    }
  }
  return true;
}

// Simple Sudoku generator & solver helpers
export function solveSudoku(board: number[]): number[] | null {
  const grid = [...board];

  function findEmpty(): number {
    for (let i = 0; i < 81; i++) {
      if (grid[i] === 0) return i;
    }
    return -1;
  }

  function isValid(idx: number, num: number): boolean {
    for (let j = 0; j < 81; j++) {
      if (grid[j] === num && sameUnit(idx, j)) {
        return false;
      }
    }
    return true;
  }

  function solve(): boolean {
    const emptyIdx = findEmpty();
    if (emptyIdx === -1) return true;

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // shuffle numbers for random puzzle generation
    for (let i = nums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nums[i], nums[j]] = [nums[j]!, nums[i]!];
    }

    for (const num of nums) {
      if (isValid(emptyIdx, num)) {
        grid[emptyIdx] = num;
        if (solve()) return true;
        grid[emptyIdx] = 0;
      }
    }
    return false;
  }

  if (solve()) return grid;
  return null;
}

const SAMPLE_SOLVED = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
];

export function generateSudoku(clues = 36): { puzzle: number[]; solution: number[] } {
  const solution = solveSudoku(new Array(81).fill(0)) ?? SAMPLE_SOLVED;
  const puzzle = [...solution];

  const indices = Array.from({ length: 81 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j]!, indices[i]!];
  }

  const toRemove = 81 - clues;
  for (let i = 0; i < toRemove; i++) {
    puzzle[indices[i]!] = 0;
  }

  return { puzzle, solution };
}
