"use client";

import { GameBoard } from "@/components/GameBoard";
import { ScoreBar } from "@/components/ScoreBar";
import { getRank, type Direction } from "@/lib/constants";
import type { Board } from "@/lib/game";

interface GameScreenViewProps {
  board: Board;
  score: number;
  bestScore: number;
  highestTile: number;
  onRestart: () => void;
  onMove: (direction: Direction) => void;
  isPlaying: boolean;
}

export function GameScreenView({
  board,
  score,
  bestScore,
  highestTile,
  onRestart,
  onMove,
  isPlaying,
}: GameScreenViewProps) {
  const rank = getRank(highestTile);

  return (
    <div className="flex flex-col items-center min-h-dvh px-4 py-4 sm:py-6 safe-bottom">
      <header className="w-full max-w-[min(340px,calc(100vw-2rem))] mb-4 sm:mb-5 shrink-0">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-black text-campaign-dark truncate">ایران روشن</h1>
            <p className="text-xs text-campaign-blue font-medium truncate">{rank}</p>
          </div>
          <button
            onClick={onRestart}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 active:bg-gray-100"
          >
            بازی جدید
          </button>
        </div>
        <ScoreBar score={score} bestScore={bestScore} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full min-h-0">
        <GameBoard board={board} onMove={onMove} interactive={isPlaying} />
        <p className="mt-4 sm:mt-6 text-xs text-gray-400 text-center px-2">
          کاشی‌های هم‌عدد رو ترکیب کن — امتیاز روشنایی دو برابر می‌شه
        </p>
      </main>
    </div>
  );
}
