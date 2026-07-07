"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

interface WinModalProps {
  onShare: () => void;
  onRestart: () => void;
  onContinue: () => void;
}

export function WinModal({ onShare, onRestart, onContinue }: WinModalProps) {
  const flagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flagRef.current) return;
    gsap.fromTo(
      flagRef.current,
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" },
    );
    gsap.to(flagRef.current, {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.8,
    });
  }, []);

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
        <div ref={flagRef} className="text-6xl mb-4 inline-block">
          🇮🇷
        </div>
        <h2 className="text-2xl font-black text-campaign-dark mb-2">تو ایران روشن رو ساختی!</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          با انتخاب‌های کوچک، می‌شه روشنایی رو برای همه حفظ کرد.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={onShare}
            className="w-full py-3 rounded-xl bg-campaign-yellow text-campaign-dark font-bold"
          >
            اشتراک رکورد
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3 rounded-xl bg-campaign-blue text-white font-bold"
          >
            ادامه بازی
          </button>
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm"
          >
            بازی دوباره
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
