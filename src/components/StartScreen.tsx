"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
  onShowGuide: () => void;
}

export function StartScreen({ onStart, onShowGuide }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-dvh px-6 py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-8"
      >
        <div className="text-6xl mb-4">🇮🇷</div>
        <h1 className="text-4xl font-black text-campaign-dark mb-2">ایران روشن</h1>
        <p className="text-campaign-blue font-medium text-sm">
          از یک حرکت ساده تا روشنایی یک کشور
        </p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-600 text-balance max-w-sm mb-10 leading-relaxed"
      >
        کاشی‌ها رو ترکیب کن، اثر روشنایی رو دو برابر کن. هر عدد جدید، یک رفتار بهتر
        مصرف برق رو باز می‌کنه.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-campaign-blue text-white font-bold text-lg shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
        >
          شروع بازی
        </button>
        <button
          onClick={onShowGuide}
          className="w-full py-3 rounded-2xl border-2 border-campaign-blue text-campaign-blue font-bold hover:bg-blue-50 active:scale-95 transition-all"
        >
          راهنمای بازی
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-xs text-gray-400"
      >
        هر ترکیب یعنی اثر بیشتر برای روشنایی
      </motion.p>
    </motion.div>
  );
}
