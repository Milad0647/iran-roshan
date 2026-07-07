"use client";

import { motion } from "framer-motion";
import { formatPersianNumber } from "@/lib/constants";

interface ScoreBarProps {
  score: number;
  bestScore: number;
}

export function ScoreBar({ score, bestScore }: ScoreBarProps) {
  return (
    <div className="flex gap-3 w-full">
      <motion.div
        key={score}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.3 }}
        className="flex-1 rounded-xl bg-campaign-blue text-white px-4 py-2.5 text-center shadow-md"
      >
        <p className="text-xs opacity-80">امتیاز روشنایی</p>
        <p className="text-xl font-bold">{formatPersianNumber(score)}</p>
      </motion.div>
      <div className="flex-1 rounded-xl bg-campaign-dark text-white px-4 py-2.5 text-center shadow-md">
        <p className="text-xs opacity-80">بهترین رکورد</p>
        <p className="text-xl font-bold">{formatPersianNumber(bestScore)}</p>
      </div>
    </div>
  );
}
