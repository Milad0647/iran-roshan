"use client";

import { motion } from "framer-motion";
import { formatPersianNumber, getRank, getTileConfig } from "@/lib/constants";
import { buildLoseSummary } from "@/lib/notifications";

interface LoseModalProps {
  score: number;
  highestTile: number;
  onRestart: () => void;
  onShare: () => void;
}

export function LoseModal({ score, highestTile, onRestart, onShare }: LoseModalProps) {
  const tileConfig = getTileConfig(highestTile);
  const rank = getRank(highestTile);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="text-5xl mb-3">🌙</div>
        <h2 className="text-xl font-black text-campaign-dark mb-2">مسیر روشنایی متوقف شد!</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          {buildLoseSummary(highestTile)}
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-2">
          {tileConfig && (
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-3xl font-black text-campaign-dark tabular-nums" dir="ltr">
                {formatPersianNumber(highestTile)}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{tileConfig.icon}</span>
                <span className="font-bold text-campaign-dark text-sm">{tileConfig.shortName}</span>
              </div>
            </div>
          )}
          <p className="text-sm text-campaign-blue font-bold">رتبه: {rank}</p>
          <p className="text-sm text-gray-500">
            امتیاز روشنایی: {formatPersianNumber(score)}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-campaign-blue text-white font-bold"
          >
            تلاش دوباره
          </button>
          <button
            onClick={onShare}
            className="w-full py-3 rounded-xl bg-campaign-yellow text-campaign-dark font-bold"
          >
            اشتراک رکورد
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
