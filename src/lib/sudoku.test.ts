import assert from "node:assert";
import { test } from "node:test";
import { conflictsAt, countDigits, generateSudoku, isSolved, rc, sameUnit } from "./sudoku.ts";

test("rc calculates row and column correctly", () => {
  assert.deepStrictEqual(rc(0), { r: 0, c: 0 });
  assert.deepStrictEqual(rc(8), { r: 0, c: 8 });
  assert.deepStrictEqual(rc(9), { r: 1, c: 0 });
  assert.deepStrictEqual(rc(80), { r: 8, c: 8 });
});

test("sameUnit identifies cells in same row, column, or box", () => {
  // Same row
  assert.strictEqual(sameUnit(0, 1), true);
  // Same column
  assert.strictEqual(sameUnit(0, 9), true);
  // Same 3x3 box (r0,c0 vs r2,c2 = idx 0 vs 20)
  assert.strictEqual(sameUnit(0, 20), true);
  // Different unit (r0,c0 vs r8,c8 = idx 0 vs 80)
  assert.strictEqual(sameUnit(0, 80), false);
});

test("conflictsAt detects conflicting values in same unit", () => {
  const board = new Array(81).fill(0);
  board[0] = 5;
  board[1] = 5; // same row conflict

  assert.strictEqual(conflictsAt(board, 0), true);
  assert.strictEqual(conflictsAt(board, 1), true);
  assert.strictEqual(conflictsAt(board, 2), false);
});

test("generateSudoku produces valid puzzle and solution", () => {
  const { puzzle, solution } = generateSudoku(36);
  assert.strictEqual(puzzle.length, 81);
  assert.strictEqual(solution.length, 81);

  // Solution should have no empty cells
  assert.strictEqual(solution.includes(0), false);

  // Check if puzzle matches solution where puzzle is non-zero
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] !== 0) {
      assert.strictEqual(puzzle[i], solution[i]);
    }
  }

  // Count given clues in puzzle
  const clues = puzzle.filter((val) => val !== 0).length;
  assert.strictEqual(clues, 36);
});

test("isSolved correctly evaluates completed board", () => {
  const { solution } = generateSudoku(36);
  assert.strictEqual(isSolved(solution, solution), true);

  const incomplete = [...solution];
  incomplete[0] = 0;
  assert.strictEqual(isSolved(incomplete, solution), false);
});

test("countDigits counts digit occurrences", () => {
  const board = new Array(81).fill(0);
  board[0] = 1;
  board[1] = 1;
  board[2] = 2;

  const counts = countDigits(board);
  assert.strictEqual(counts[1], 2);
  assert.strictEqual(counts[2], 1);
  assert.strictEqual(counts[3], 0);
});
