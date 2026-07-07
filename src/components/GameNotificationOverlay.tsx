"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { GameNotification } from "@/lib/notifications";

interface GameNotificationOverlayProps {
  notification: GameNotification | null;
  onDismiss: () => void;
}

export function GameNotificationOverlay({
  notification,
  onDismiss,
}: GameNotificationOverlayProps) {
  return (
    <AnimatePresence mode="wait">
      {notification && notification.variant === "card" && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="pointer-events-auto max-w-xs w-full rounded-2xl bg-gradient-to-br from-yellow-400 to-blue-500 p-[2px] shadow-2xl"
            onClick={onDismiss}
          >
            <div className="rounded-2xl bg-white/95 px-5 py-4 text-center">
              {notification.title && (
                <p className="text-base font-black text-campaign-dark mb-1.5">
                  {notification.title}
                </p>
              )}
              <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {notification && notification.variant === "toast" && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md pointer-events-none"
        >
          <div
            className="pointer-events-auto rounded-2xl px-4 py-3.5 shadow-xl bg-campaign-dark text-white cursor-pointer"
            onClick={onDismiss}
          >
            {notification.title && (
              <p className="text-xs font-bold text-campaign-yellow mb-1">{notification.title}</p>
            )}
            <p className="text-sm font-medium leading-relaxed">{notification.message}</p>
          </div>
        </motion.div>
      )}

      {notification && notification.variant === "warning" && (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed bottom-6 left-4 right-4 z-50 mx-auto max-w-md pointer-events-none"
        >
          <div
            className="pointer-events-auto rounded-2xl px-4 py-3.5 shadow-xl bg-red-600 text-white cursor-pointer border border-red-400/40"
            onClick={onDismiss}
          >
            {notification.title && (
              <p className="text-sm font-black mb-1">{notification.title}</p>
            )}
            <p className="text-sm font-medium leading-relaxed opacity-95">{notification.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
