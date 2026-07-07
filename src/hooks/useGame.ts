"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WIN_VALUE, type Direction, type GameScreen, type TileValue } from "@/lib/constants";
import {
  addRandomTile,
  canMove,
  countEmptyCells,
  getHighestTile,
  initBoard,
  moveBoard,
  type Board,
} from "@/lib/game";
import {
  MERGE_STREAK_FOR_ENCOURAGEMENT,
  NEAR_FULL_EMPTY_CELLS,
  PEAK_WARNING_INTERVAL,
  PERIODIC_TIP_INTERVAL,
  buildEncouragement,
  buildIntroNotification,
  buildNearFullWarning,
  buildPeakWarning,
  buildRandomTip,
  buildUnlockNotification,
  getTipIndex,
  type GameNotification,
} from "@/lib/notifications";

interface GameState {
  board: Board;
  score: number;
  bestScore: number;
  highestTile: number;
  screen: GameScreen;
  notification: GameNotification | null;
  hasWon: boolean;
  unlockedTiles: Set<TileValue>;
  moveCount: number;
  mergeStreak: number;
  shownTipIndices: Set<number>;
  nearFullWarned: boolean;
}

const BEST_SCORE_KEY = "iran-roshan-best";

function loadBestScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(BEST_SCORE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function saveBestScore(score: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BEST_SCORE_KEY, String(score));
}

function pickMoveNotification(
  params: {
    mergedValues: TileValue[];
    unlockedTiles: Set<TileValue>;
    moveCount: number;
    mergeStreak: number;
    emptyCells: number;
    nearFullWarned: boolean;
    highestTile: number;
    shownTipIndices: Set<number>;
  },
): { notification: GameNotification | null; newUnlocked: Set<TileValue>; newNearFullWarned: boolean; newShownTips: Set<number>; resetMergeStreak: boolean } {
  const newUnlocked = new Set(params.unlockedTiles);
  let newNearFullWarned = params.nearFullWarned;
  const newShownTips = new Set(params.shownTipIndices);
  let resetMergeStreak = false;

  if (params.mergedValues.length > 0) {
    const sortedMerges = [...params.mergedValues].sort((a, b) => b - a);
    for (const merged of sortedMerges) {
      newUnlocked.add(merged);
    }
    for (const merged of sortedMerges) {
      if (!params.unlockedTiles.has(merged)) {
        return {
          notification: buildUnlockNotification(merged),
          newUnlocked,
          newNearFullWarned,
          newShownTips,
          resetMergeStreak: false,
        };
      }
    }
  }

  if (params.emptyCells > 4) {
    newNearFullWarned = false;
  }

  if (params.mergeStreak >= MERGE_STREAK_FOR_ENCOURAGEMENT && params.mergedValues.length > 0) {
    resetMergeStreak = true;
    return {
      notification: buildEncouragement(params.highestTile),
      newUnlocked,
      newNearFullWarned,
      newShownTips,
      resetMergeStreak,
    };
  }

  if (params.moveCount > 0 && params.moveCount % PEAK_WARNING_INTERVAL === 0) {
    return {
      notification: buildPeakWarning(params.moveCount),
      newUnlocked,
      newNearFullWarned,
      newShownTips,
      resetMergeStreak: false,
    };
  }

  if (params.emptyCells <= NEAR_FULL_EMPTY_CELLS && !params.nearFullWarned) {
    newNearFullWarned = true;
    return {
      notification: buildNearFullWarning(),
      newUnlocked,
      newNearFullWarned,
      newShownTips,
      resetMergeStreak: false,
    };
  }

  if (params.moveCount > 0 && params.moveCount % PERIODIC_TIP_INTERVAL === 0) {
    const tip = buildRandomTip(params.shownTipIndices);
    const tipIndex = getTipIndex(tip);
    if (tipIndex !== null) newShownTips.add(tipIndex);
    return {
      notification: tip,
      newUnlocked,
      newNearFullWarned,
      newShownTips,
      resetMergeStreak: false,
    };
  }

  return {
    notification: null,
    newUnlocked,
    newNearFullWarned,
    newShownTips,
    resetMergeStreak: false,
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => ({
    board: initBoard(),
    score: 0,
    bestScore: 0,
    highestTile: 0,
    screen: "start",
    notification: null,
    hasWon: false,
    unlockedTiles: new Set(),
    moveCount: 0,
    mergeStreak: 0,
    shownTipIndices: new Set(),
    nearFullWarned: false,
  }));

  const notificationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    setState((prev) => ({ ...prev, bestScore: loadBestScore() }));
  }, []);

  const scheduleDismiss = useCallback((duration: number) => {
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    notificationTimer.current = setTimeout(() => {
      setState((s) => ({ ...s, notification: null }));
    }, duration);
  }, []);

  const startGame = useCallback(() => {
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    const board = initBoard();
    const intro = buildIntroNotification();
    setState({
      board,
      score: 0,
      bestScore: loadBestScore(),
      highestTile: getHighestTile(board),
      screen: "game",
      notification: intro,
      hasWon: false,
      unlockedTiles: new Set([2]),
      moveCount: 0,
      mergeStreak: 0,
      shownTipIndices: new Set(),
      nearFullWarned: false,
    });
    scheduleDismiss(intro.duration);
  }, [scheduleDismiss]);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (isProcessing.current) return;
      if (state.screen !== "game") return;

      isProcessing.current = true;

      setState((prev) => {
        const { board, score, hasWon, unlockedTiles, moveCount, mergeStreak, shownTipIndices, nearFullWarned } = prev;
        const result = moveBoard(board, direction);

        if (!result.moved) {
          isProcessing.current = false;
          return prev;
        }

        const newBoard = addRandomTile(result.board);
        const newScore = score + result.scoreGained;
        const newHighest = getHighestTile(newBoard);
        const newBest = Math.max(prev.bestScore, newScore);
        if (newBest > prev.bestScore) saveBestScore(newBest);

        const newMoveCount = moveCount + 1;
        const newMergeStreak = result.mergedValues.length > 0 ? mergeStreak + 1 : 0;
        const emptyCells = countEmptyCells(newBoard);

        const {
          notification,
          newUnlocked,
          newNearFullWarned,
          newShownTips,
          resetMergeStreak,
        } = pickMoveNotification({
          mergedValues: result.mergedValues,
          unlockedTiles,
          moveCount: newMoveCount,
          mergeStreak: newMergeStreak,
          emptyCells,
          nearFullWarned,
          highestTile: newHighest,
          shownTipIndices,
        });

        let newScreen: GameScreen = "game";
        const reachedWin = newHighest >= WIN_VALUE && !hasWon;
        if (reachedWin) {
          newScreen = "win";
        } else if (!canMove(newBoard)) {
          newScreen = "lose";
        }

        if (notification && newScreen === "game") {
          scheduleDismiss(notification.duration);
        }

        setTimeout(() => {
          isProcessing.current = false;
        }, 150);

        return {
          ...prev,
          board: newBoard,
          score: newScore,
          bestScore: newBest,
          highestTile: newHighest,
          screen: newScreen,
          notification: newScreen === "game" ? notification : null,
          hasWon: hasWon || reachedWin,
          unlockedTiles: newUnlocked,
          moveCount: newMoveCount,
          mergeStreak: resetMergeStreak ? 0 : newMergeStreak,
          shownTipIndices: newShownTips,
          nearFullWarned: newNearFullWarned,
        };
      });
    },
    [state.screen, scheduleDismiss],
  );

  const continueAfterWin = useCallback(() => {
    setState((prev) => ({ ...prev, screen: "game" }));
  }, []);

  const dismissNotification = useCallback(() => {
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    setState((prev) => ({ ...prev, notification: null }));
  }, []);

  return {
    ...state,
    startGame,
    handleMove,
    continueAfterWin,
    dismissNotification,
    goToStart: () => setState((prev) => ({ ...prev, screen: "start" })),
  };
}
