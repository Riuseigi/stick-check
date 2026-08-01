"use client";

import { useState, useCallback, useRef } from "react";
import type { ButtonCheckResult } from "@/types/check";
import { BUTTON_CHECK_COUNT } from "@/constants/scoring";
import { BUTTON_INDEX } from "@/constants/gamepad";

/** Names for the face buttons. */
const BUTTON_NAMES: Record<number, string> = {
  [BUTTON_INDEX.CROSS]: "A",
  [BUTTON_INDEX.CIRCLE]: "B",
  [BUTTON_INDEX.SQUARE]: "X",
  [BUTTON_INDEX.TRIANGLE]: "Y",
};

/** Indices of the face buttons used in the check. */
const FACE_BUTTONS = [
  BUTTON_INDEX.CROSS,
  BUTTON_INDEX.CIRCLE,
  BUTTON_INDEX.SQUARE,
  BUTTON_INDEX.TRIANGLE,
];

/**
 * Hook for managing the button check phase.
 *
 * Generates random button prompts, tracks responses,
 * and calculates reaction times and accuracy.
 *
 * Controller logic is completely independent from animation code.
 */
export function useButtonCheck() {
  const [currentPrompt, setCurrentPrompt] = useState<number | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [results, setResults] = useState<ButtonCheckResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [lastResult, setLastResult] = useState<"correct" | "incorrect" | null>(
    null
  );

  const promptStartTimeRef = useRef(0);
  const isProcessingRef = useRef(false);

  /** Generate a random face button prompt. */
  const generatePrompt = useCallback(() => {
    const index = Math.floor(Math.random() * FACE_BUTTONS.length);
    return FACE_BUTTONS[index];
  }, []);

  /** Start the button check phase. */
  const startCheck = useCallback(() => {
    const firstPrompt = generatePrompt();
    setCurrentPrompt(firstPrompt);
    setCurrentPromptIndex(0);
    setResults([]);
    setIsComplete(false);
    setLastResult(null);
    promptStartTimeRef.current = performance.now();
    isProcessingRef.current = false;
  }, [generatePrompt]);

  /** Handle a button press from the gamepad. */
  const handleButtonPress = useCallback(
    (buttonIndex: number) => {
      if (
        isComplete ||
        currentPrompt === null ||
        isProcessingRef.current
      ) {
        return;
      }

      isProcessingRef.current = true;

      const reactionTime = performance.now() - promptStartTimeRef.current;
      const correct = buttonIndex === currentPrompt;

      const result: ButtonCheckResult = {
        name: BUTTON_NAMES[buttonIndex] ?? `Button ${buttonIndex}`,
        expected: currentPrompt,
        correct,
        reactionTime: Math.round(reactionTime),
      };

      setResults((prev) => [...prev, result]);
      setLastResult(correct ? "correct" : "incorrect");

      // Brief delay before next prompt (allows animation to play)
      setTimeout(() => {
        const nextIndex = currentPromptIndex + 1;

        if (nextIndex >= BUTTON_CHECK_COUNT) {
          setIsComplete(true);
          setCurrentPrompt(null);
        } else {
          const nextPrompt = generatePrompt();
          setCurrentPrompt(nextPrompt);
          setCurrentPromptIndex(nextIndex);
          promptStartTimeRef.current = performance.now();
        }
        isProcessingRef.current = false;
      }, 300);
    },
    [currentPrompt, currentPromptIndex, isComplete, generatePrompt]
  );

  /** Get the current button name for display. */
  const getCurrentButtonName = useCallback((): string | null => {
    if (currentPrompt === null) return null;
    return BUTTON_NAMES[currentPrompt] ?? `Button ${currentPrompt}`;
  }, [currentPrompt]);

  /** Get the progress as a fraction. */
  const getProgress = useCallback((): number => {
    return results.length / BUTTON_CHECK_COUNT;
  }, [results]);

  /** Get the accuracy percentage. */
  const getAccuracy = useCallback((): number => {
    if (results.length === 0) return 0;
    const correctCount = results.filter((r) => r.correct).length;
    return Math.round((correctCount / results.length) * 100);
  }, [results]);

  /** Get the average reaction time in ms. */
  const getAverageReactionTime = useCallback((): number => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + r.reactionTime, 0);
    return Math.round(total / results.length);
  }, [results]);

  return {
    currentPrompt,
    currentPromptIndex,
    results,
    isComplete,
    lastResult,
    totalPrompts: BUTTON_CHECK_COUNT,
    startCheck,
    handleButtonPress,
    getCurrentButtonName,
    getProgress,
    getAccuracy,
    getAverageReactionTime,
  };
}
