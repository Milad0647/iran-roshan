"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import type { Direction } from "@/lib/constants";

const SWIPE_THRESHOLD = 28;
const SCROLL_LOCK_THRESHOLD = 8;

interface UseSwipeOptions {
  onSwipe: (direction: Direction) => void;
  enabled?: boolean;
  targetRef: RefObject<HTMLElement | null>;
}

export function useSwipe({ onSwipe, enabled = true, targetRef }: UseSwipeOptions) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isLocked = useRef(false);
  const onSwipeRef = useRef(onSwipe);

  useEffect(() => {
    onSwipeRef.current = onSwipe;
  }, [onSwipe]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
      isLocked.current = false;
    },
    [enabled],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStart.current) return;

      const touch = e.touches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;

      if (
        !isLocked.current &&
        (Math.abs(dx) > SCROLL_LOCK_THRESHOLD || Math.abs(dy) > SCROLL_LOCK_THRESHOLD)
      ) {
        isLocked.current = true;
      }

      if (isLocked.current) {
        e.preventDefault();
      }
    },
    [enabled],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStart.current) return;

      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        onSwipeRef.current(dx > 0 ? "right" : "left");
      } else {
        onSwipeRef.current(dy > 0 ? "down" : "up");
      }
    },
    [enabled],
  );

  const handleTouchCancel = useCallback(() => {
    touchStart.current = null;
    isLocked.current = false;
  }, []);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    el.addEventListener("touchcancel", handleTouchCancel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [enabled, targetRef, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel]);
}

export function useKeyboard(onMove: (direction: Direction) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };

      const direction = map[e.key];
      if (direction) {
        e.preventDefault();
        onMove(direction);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onMove, enabled]);
}
