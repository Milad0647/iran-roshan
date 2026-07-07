"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { StartScreen } from "@/components/StartScreen";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { GameScreenView } from "@/components/GameScreenView";
import { GameNotificationOverlay } from "@/components/GameNotificationOverlay";
import { WinModal } from "@/components/WinModal";
import { LoseModal } from "@/components/LoseModal";
import { ShareCard } from "@/components/ShareCard";
import { useGame } from "@/hooks/useGame";
import { useKeyboard } from "@/hooks/useSwipe";

export default function HomePage() {
  const {
    board,
    score,
    bestScore,
    highestTile,
    screen,
    notification,
    hasWon,
    startGame,
    handleMove,
    continueAfterWin,
    dismissNotification,
  } = useGame();

  const [showGuide, setShowGuide] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const isPlaying = screen === "game";

  useKeyboard(handleMove, isPlaying);

  return (
    <>
      <AnimatePresence mode="wait">
        {screen === "start" && (
          <StartScreen
            key="start"
            onStart={startGame}
            onShowGuide={() => setShowGuide(true)}
          />
        )}

        {(screen === "game" || screen === "win" || screen === "lose") && (
          <GameScreenView
            key="game"
            board={board}
            score={score}
            bestScore={bestScore}
            highestTile={highestTile}
            onRestart={startGame}
            onMove={handleMove}
            isPlaying={isPlaying}
          />
        )}
      </AnimatePresence>

      <GameNotificationOverlay
        notification={notification}
        onDismiss={dismissNotification}
      />

      <AnimatePresence>
        {showGuide && <HowToPlayModal onClose={() => setShowGuide(false)} />}
      </AnimatePresence>

      {screen === "win" && (
        <WinModal
          onShare={() => setShowShare(true)}
          onRestart={startGame}
          onContinue={continueAfterWin}
        />
      )}

      {screen === "lose" && (
        <LoseModal
          score={score}
          highestTile={highestTile}
          onRestart={startGame}
          onShare={() => setShowShare(true)}
        />
      )}

      <AnimatePresence>
        {showShare && (
          <ShareCard
            score={score}
            highestTile={highestTile}
            hasWon={hasWon}
            onClose={() => setShowShare(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
