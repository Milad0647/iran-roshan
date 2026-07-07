import {
  GRID_SIZE,
  SPECIAL_BONUS,
  type Direction,
  type TileValue,
} from "./constants";

export interface Cell {
  value: number;
  id: string;
  mergedFrom?: [string, string];
  isNew?: boolean;
}

export type Board = (Cell | null)[][];

export interface MoveResult {
  board: Board;
  scoreGained: number;
  moved: boolean;
  mergedValues: TileValue[];
  highestTile: number;
}

let tileIdCounter = 0;

export function createCell(value: number, isNew = false): Cell {
  tileIdCounter += 1;
  return { value, id: `tile-${tileIdCounter}`, isNew };
}

export function resetTileIdCounter(): void {
  tileIdCounter = 0;
}

export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null),
  );
}

function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!board[r][c]) {
        cells.push([r, c]);
      }
    }
  }
  return cells;
}

export function addRandomTile(board: Board): Board {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return board;

  const [row, col] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  const newBoard = board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
  newBoard[row][col] = createCell(value, true);
  return newBoard;
}

export function initBoard(): Board {
  resetTileIdCounter();
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function slideAndMerge(line: (Cell | null)[]): {
  result: (Cell | null)[];
  scoreGained: number;
  mergedValues: TileValue[];
} {
  const filtered = line.filter((cell): cell is Cell => cell !== null);
  const result: (Cell | null)[] = [];
  const mergedValues: TileValue[] = [];
  let scoreGained = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
      const mergedValue = filtered[i].value * 2;
      const mergedCell: Cell = {
        value: mergedValue,
        id: `tile-${++tileIdCounter}`,
        mergedFrom: [filtered[i].id, filtered[i + 1].id],
      };
      result.push(mergedCell);
      scoreGained += mergedValue;
      const bonus = SPECIAL_BONUS[mergedValue as TileValue];
      if (bonus) scoreGained += bonus;
      mergedValues.push(mergedValue as TileValue);
      i += 2;
    } else {
      result.push({ ...filtered[i], isNew: false });
      i += 1;
    }
  }

  while (result.length < GRID_SIZE) {
    result.push(null);
  }

  return { result, scoreGained, mergedValues };
}

function boardsEqual(a: Board, b: Board): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cellA = a[r][c];
      const cellB = b[r][c];
      if (!cellA && !cellB) continue;
      if (!cellA || !cellB) return false;
      if (cellA.value !== cellB.value) return false;
    }
  }
  return true;
}

export function moveBoard(board: Board, direction: Direction): MoveResult {
  const newBoard = createEmptyBoard();
  let totalScore = 0;
  const allMerged: TileValue[] = [];
  let moved = false;

  if (direction === "left" || direction === "right") {
    for (let r = 0; r < GRID_SIZE; r++) {
      let line = board[r].map((cell) => (cell ? { ...cell, isNew: false } : null));
      if (direction === "right") line = [...line].reverse();
      const { result, scoreGained, mergedValues } = slideAndMerge(line);
      const finalLine = direction === "right" ? [...result].reverse() : result;
      newBoard[r] = finalLine;
      totalScore += scoreGained;
      allMerged.push(...mergedValues);
    }
  } else {
    for (let c = 0; c < GRID_SIZE; c++) {
      let line: (Cell | null)[] = [];
      for (let r = 0; r < GRID_SIZE; r++) {
        line.push(board[r][c] ? { ...board[r][c]!, isNew: false } : null);
      }
      if (direction === "down") line = [...line].reverse();
      const { result, scoreGained, mergedValues } = slideAndMerge(line);
      const finalLine = direction === "down" ? [...result].reverse() : result;
      for (let r = 0; r < GRID_SIZE; r++) {
        newBoard[r][c] = finalLine[r];
      }
      totalScore += scoreGained;
      allMerged.push(...mergedValues);
    }
  }

  moved = !boardsEqual(board, newBoard);

  let highestTile = 0;
  for (const row of newBoard) {
    for (const cell of row) {
      if (cell && cell.value > highestTile) highestTile = cell.value;
    }
  }

  return {
    board: moved ? newBoard : board,
    scoreGained: moved ? totalScore : 0,
    moved,
    mergedValues: moved ? allMerged : [],
    highestTile,
  };
}

export function canMove(board: Board): boolean {
  if (getEmptyCells(board).length > 0) return true;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = board[r][c];
      if (!current) continue;
      if (r + 1 < GRID_SIZE && board[r + 1][c]?.value === current.value) return true;
      if (c + 1 < GRID_SIZE && board[r][c + 1]?.value === current.value) return true;
    }
  }

  return false;
}

export function countEmptyCells(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (!cell) count += 1;
    }
  }
  return count;
}

export function getHighestTile(board: Board): number {
  let highest = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell && cell.value > highest) highest = cell.value;
    }
  }
  return highest;
}
