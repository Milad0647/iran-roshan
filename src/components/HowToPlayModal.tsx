"use client";

import { motion } from "framer-motion";

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-campaign-dark mb-4">راهنمای بازی</h2>
        <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
          <p>کاشی‌های هم‌عدد رو به هم برسون.</p>
          <p>
            هر ترکیب، امتیاز روشنایی رو دو برابر می‌کنه و یک رفتار بهتر مصرف برق رو باز
            می‌کنه.
          </p>
          <p>
            هدف نهایی: ساختن{" "}
            <strong className="text-campaign-blue">ایران روشن (۲۰۴۸)</strong>
          </p>
        </div>

        <div className="mt-5 p-3 bg-yellow-50 rounded-xl text-xs text-amber-800 space-y-2">
          <p className="font-bold">مثال ترکیب:</p>
          <p className="tabular-nums" dir="ltr">
            ۲ + ۲ = ۴ → دور کند کولر
          </p>
          <p className="tabular-nums" dir="ltr">
            ۸ + ۸ = ۱۶ → کولر ۲۵
          </p>
          <p className="text-[11px] mt-1 opacity-80">
            عددها اصل بازی هستن؛ رفتارها فقط برچسب آموزشی هر سطح‌اند.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-xl bg-campaign-blue text-white font-bold"
        >
          فهمیدم
        </button>
      </motion.div>
    </motion.div>
  );
}
