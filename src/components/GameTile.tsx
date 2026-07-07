"use client";

import { motion } from "framer-motion";
import { formatTileNumber, getTileConfig } from "@/lib/constants";
import type { Cell } from "@/lib/game";

interface GameTileProps {
  cell: Cell;
  row: number;
  col: number;
  cellSize: number;
  gap: number;
}

function getTileTypography(value: number, label: string, cellSize: number) {
  const formatted = formatTileNumber(value);
  const charCount = formatted.length;
  const labelLen = label.length;

  let numberSize = cellSize * 0.4;
  if (charCount >= 4) numberSize = cellSize * 0.26;
  else if (charCount === 3) numberSize = cellSize * 0.32;
  numberSize = Math.max(11, Math.min(26, numberSize));

  let labelSize = cellSize * 0.13;
  if (labelLen > 10) labelSize = cellSize * 0.1;
  else if (labelLen > 7) labelSize = cellSize * 0.115;
  labelSize = Math.max(6, Math.min(10, labelSize));

  const iconSize = Math.max(8, Math.min(11, cellSize * 0.16));
  const showIcon = cellSize >= 52 && value < 512;
  const contentGap = value >= 1024 ? 1 : 2;

  return { numberSize, labelSize, iconSize, showIcon, contentGap };
}

export function GameTile({ cell, row, col, cellSize, gap }: GameTileProps) {
  const config = getTileConfig(cell.value);
  if (!config) return null;

  const x = col * (cellSize + gap);
  const y = row * (cellSize + gap);
  const { numberSize, labelSize, iconSize, showIcon, contentGap } = getTileTypography(
    cell.value,
    config.shortName,
    cellSize,
  );
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
        padding: cellSize < 60 ? 3 : 4,
      }}
    >
      {showIcon && (
        <span
          className="absolute top-0.5 left-0.5 leading-none opacity-55"
          style={{ fontSize: iconSize }}
          aria-hidden
        >
          {config.icon}
        </span>
      )}

      <div
        className="flex flex-col items-center justify-center min-w-0 w-full h-full"
        style={{ gap: contentGap }}
      >
        <span
          className="font-black leading-none tabular-nums max-w-full truncate text-center"
          style={{ fontSize: numberSize, lineHeight: 1 }}
          dir="ltr"
        >
          {formatTileNumber(cell.value)}
        </span>

        <span
          className="leading-tight text-center w-full truncate opacity-85 font-semibold max-w-full"
          style={{ fontSize: labelSize, lineHeight: 1.15 }}
          dir="rtl"
        >
          {config.shortName}
        </span>
      </div>
    </motion.div>
  );
}
