"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  GAME_URL,
  WIN_VALUE,
  formatPersianNumber,
  getRank,
  getTileConfig,
} from "@/lib/constants";

interface ShareCardProps {
  score: number;
  highestTile: number;
  hasWon: boolean;
  onClose: () => void;
}

export function ShareCard({ score, highestTile, hasWon, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tileConfig = getTileConfig(highestTile);
  const rank = getRank(highestTile);

  const handleShare = async () => {
    const text = hasWon
      ? `من ایران روشن رو ساختم! امتیاز روشنایی: ${formatPersianNumber(score)} — تو هم بازی کن! ${GAME_URL}`
      : `من تا ${formatPersianNumber(highestTile)} (${tileConfig?.shortName ?? "کاشی"}) رسیدم! امتیاز روشنایی: ${formatPersianNumber(score)} — تو هم بازی کن! ${GAME_URL}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "ایران روشن", text, url: GAME_URL });
        return;
      } catch {
        // User cancelled or share failed
      }
    }

    await navigator.clipboard.writeText(text);
    alert("متن رکورد کپی شد!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={cardRef}
          className="rounded-3xl overflow-hidden shadow-2xl mb-4"
        >
          <div className="bg-gradient-to-br from-yellow-400 via-amber-200 to-blue-500 p-6 text-center">
            <div className="bg-white/90 rounded-2xl p-5">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-3xl">🇮🇷</span>
                <span className="font-black text-campaign-dark text-lg">ایران روشن</span>
              </div>

              {hasWon || highestTile >= WIN_VALUE ? (
                <>
                  <h3 className="text-lg font-black text-campaign-dark mb-2">
                    من ایران روشن رو ساختم!
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">
                    با چند حرکت ساده، روشنایی برای همه حفظ می‌شه.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-black text-campaign-dark mb-2">
                    من تا {formatPersianNumber(highestTile)} رسیدم!
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{tileConfig?.shortName}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    تو هم بازی کن و ایران روشن رو بساز.
                  </p>
                </>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">امتیاز روشنایی</span>
                  <span className="font-bold">{formatPersianNumber(score)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">بالاترین کاشی</span>
                  <span className="font-bold tabular-nums" dir="ltr">
                    {formatPersianNumber(highestTile)} — {tileConfig?.shortName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">رتبه</span>
                  <span className="font-bold text-campaign-blue">{rank}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 mb-2">
                  QR
                </div>
                <p className="text-[10px] text-gray-400">{GAME_URL}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-xl bg-campaign-yellow text-campaign-dark font-bold"
          >
            اشتراک‌گذاری
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white text-campaign-dark font-bold"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
