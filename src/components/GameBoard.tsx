"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { GameTile } from "@/components/GameTile";
import { useSwipe } from "@/hooks/useSwipe";
import type { Direction } from "@/lib/constants";
import type { Board } from "@/lib/game";
import { GRID_SIZE } from "@/lib/constants";

const GAP = 8;

interface GameBoardProps {
  board: Board;
  onMove: (direction: Direction) => void;
  interactive?: boolean;
}

export function GameBoard({ board, onMove, interactive = true }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(64);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const updateSize = () => {
      const width = el.clientWidth;
      const size = Math.floor((width - GAP * (GRID_SIZE - 1)) / GRID_SIZE);
      setCellSize(Math.max(size, 48));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useSwipe({
    onSwipe: onMove,
    enabled: interactive,
    targetRef: boardRef,
  });

  const boardHeight = cellSize * GRID_SIZE + GAP * (GRID_SIZE - 1);

  return (
    <div className="w-full max-w-[min(340px,calc(100vw-2rem))] mx-auto rounded-2xl bg-campaign-dark/10 p-2 sm:p-3">
      <div
        ref={boardRef}
        dir="ltr"
        className="relative w-full overflow-hidden rounded-xl select-none touch-none"
        style={{
          height: boardHeight,
          touchAction: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        aria-label="برد بازی 2048"
      >
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => (
            <div
              key={`bg-${row}-${col}`}
              className="absolute rounded-lg sm:rounded-xl bg-campaign-dark/8"
              style={{
                width: cellSize,
                height: cellSize,
                left: col * (cellSize + GAP),
                top: row * (cellSize + GAP),
              }}
            />
          )),
        )}

        <AnimatePresence mode="popLayout">
          {board.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <GameTile
                  key={cell.id}
                  cell={cell}
                  row={r}
                  col={c}
                  cellSize={cellSize}
                  gap={GAP}
                />
              ) : null,
            ),
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
