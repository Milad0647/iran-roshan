"use client";

import { motion } from "framer-motion";
import { formatPersianNumber, getTileConfig } from "@/lib/constants";
import type { Cell } from "@/lib/game";

interface GameTileProps {
  cell: Cell;
  row: number;
  col: number;
  cellSize: number;
  gap: number;
}

export function GameTile({ cell, row, col, cellSize, gap }: GameTileProps) {
  const config = getTileConfig(cell.value);
  if (!config) return null;

  const x = col * (cellSize + gap);
  const y = row * (cellSize + gap);
  const numberSize = Math.max(16, Math.min(28, cellSize * 0.42));
  const labelSize = Math.max(6, Math.min(9, cellSize * 0.14));
  const iconSize = Math.max(9, Math.min(13, cellSize * 0.18));
  const isMerged = Boolean(cell.mergedFrom);

  return (
    <motion.div
      key={cell.id}
      layout
      layoutId={cell.id}
      initial={
        cell.isNew
          ? { scale: 0, opacity: 0 }
          : isMerged
            ? { scale: 0.85, opacity: 0.9 }
            : false
      }
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: isMerged ? 400 : 300,
        damping: isMerged ? 18 : 25,
        layout: { duration: 0.15 },
      }}
      className={`
        absolute flex flex-col items-center justify-center rounded-lg sm:rounded-xl
        font-bold overflow-hidden shadow-md
        ${config.bg} ${config.text} ${config.border ?? ""}
        ${config.glow ? "tile-glow" : ""}
        ${config.isSpecial ? "tile-glow-gold ring-2 ring-yellow-400/50" : ""}
      `}
      style={{
        width: cellSize,
        height: cellSize,
        left: x,
        top: y,
        zIndex: cell.isNew || isMerged ? 20 : 10,
        boxSizing: "border-box",
      }}
    >
      <span
        className="absolute top-1 left-1 leading-none opacity-60"
        style={{ fontSize: iconSize }}
        aria-hidden
      >
        {config.icon}
      </span>

      <span
        className="font-black leading-none tabular-nums"
        style={{ fontSize: numberSize }}
        dir="ltr"
      >
        {formatPersianNumber(cell.value)}
      </span>

      <span
        className="leading-tight text-center px-0.5 w-full truncate opacity-85 font-semibold"
        style={{ fontSize: labelSize }}
        dir="rtl"
      >
        {config.shortName}
      </span>
    </motion.div>
  );
}
