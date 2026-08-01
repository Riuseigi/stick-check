"use client";

import { useEffect, useRef, useCallback } from "react";
import { scalePulse, shake, fadeIn, staggerFadeIn } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGamepad } from "@/hooks/useGamepad";
import { useGameLoop } from "@/hooks/useGameLoop";
import { useButtonCheck } from "@/hooks/useButtonCheck";
import type { ButtonCheckResult } from "@/types/check";

interface ButtonCheckProps {
  onComplete: (results: ButtonCheckResult[]) => void;
}

/**
 * Button Check component.
 *
 * Displays button prompts and detects correct/incorrect inputs.
 * Uses Anime.js for feedback animations (PRD section 15.4):
 * - Correct: scale pulse on prompt
 * - Incorrect: horizontal shake on prompt
 *
 * Controller logic is independent from animation code.
 */
export function ButtonCheck({ onComplete }: ButtonCheckProps) {
  const reducedMotion = useReducedMotion();
  const { gamepad, poll } = useGamepad();
  const {
    currentPrompt,
    currentPromptIndex,
    results,
    isComplete,
    lastResult,
    totalPrompts,
    startCheck,
    handleButtonPress,
    getCurrentButtonName,
    getProgress,
    getAccuracy,
    getAverageReactionTime,
  } = useButtonCheck();

  const promptRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const prevButtonStateRef = useRef<boolean[]>([]);

  // Start the check on mount
  useEffect(() => {
    startCheck();
  }, [startCheck]);

  // Poll gamepad each frame
  useGameLoop(() => {
    poll();
  }, true);

  // Detect button presses (edge detection: only on press, not hold)
  useEffect(() => {
    if (!gamepad || isComplete) return;

    const currentStates = gamepad.buttons.map((b) => b.pressed);
    const prevStates = prevButtonStateRef.current;

    for (let i = 0; i < currentStates.length; i++) {
      if (currentStates[i] && !prevStates[i]) {
        // Button was just pressed (not held)
        handleButtonPress(i);
        break;
      }
    }

    prevButtonStateRef.current = currentStates;
  }, [gamepad, isComplete, handleButtonPress]);

  // Animation: correct input feedback
  useEffect(() => {
    if (reducedMotion || lastResult !== "correct" || !promptRef.current) return;
    scalePulse(promptRef.current, { scale: 1.08, duration: 200 });
  }, [lastResult, reducedMotion]);

  // Animation: incorrect input feedback
  useEffect(() => {
    if (reducedMotion || lastResult !== "incorrect" || !promptRef.current) return;
    shake(promptRef.current, { duration: 300, distance: 6 });
  }, [lastResult, reducedMotion]);

  // Animation: indicator fade in
  useEffect(() => {
    if (reducedMotion || !indicatorRef.current) return;
    fadeIn(indicatorRef.current, { duration: 150 });
  }, [lastResult, reducedMotion]);

  // Animation: score update
  useEffect(() => {
    if (reducedMotion || !scoreRef.current) return;
    fadeIn(scoreRef.current, { duration: 200 });
  }, [results.length, reducedMotion]);

  // Notify parent when complete
  useEffect(() => {
    if (isComplete) {
      onComplete(results);
    }
  }, [isComplete, results, onComplete]);

  const buttonName = getCurrentButtonName();
  const progress = getProgress();
  const accuracy = getAccuracy();
  const avgReaction = getAverageReactionTime();

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      {/* Progress bar */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Progress
          </span>
          <span className="text-[10px] font-mono text-[var(--text-secondary)]">
            {results.length} / {totalPrompts}
          </span>
        </div>
        <div className="h-1 w-full rounded-full bg-[var(--border)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Button prompt */}
      <div className="flex flex-col items-center gap-3">
        {buttonName && (
          <>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">
              Press
            </p>
            <div
              ref={promptRef}
              className="keycap text-2xl min-w-[4rem] min-h-[4rem]"
            >
              {buttonName}
            </div>
          </>
        )}
      </div>

      {/* Feedback indicator */}
      <div ref={indicatorRef} className="h-6 flex items-center justify-center">
        {lastResult === "correct" && (
          <span className="text-xs font-mono text-[var(--accent)]">
            Correct
          </span>
        )}
        {lastResult === "incorrect" && (
          <span className="text-xs font-mono text-[var(--danger)]">
            Incorrect
          </span>
        )}
      </div>

      {/* Live score */}
      <div ref={scoreRef} className="flex gap-6 text-center">
        <div>
          <div className="text-lg font-mono font-semibold text-[var(--text-primary)]">
            {accuracy}%
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Accuracy
          </p>
        </div>
        <div>
          <div className="text-lg font-mono font-semibold text-[var(--text-primary)]">
            {avgReaction > 0 ? `${avgReaction}` : "--"}
            <span className="text-xs text-[var(--text-secondary)]">ms</span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Avg Reaction
          </p>
        </div>
      </div>
    </div>
  );
}
