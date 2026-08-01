"use client";

import { useState, useCallback } from "react";
import {
  CheckPhase,
  ControllerRating,
  type ButtonCheckResult,
  type StickCheckResult,
  type TriggerCheckResult,
  type OverallScore,
  type CheckResult,
} from "@/types/check";
import { SCORE_WEIGHTS, RATING_THRESHOLDS } from "@/constants/scoring";

/** The ordered sequence of check phases. */
const PHASE_ORDER: CheckPhase[] = [
  CheckPhase.BUTTON_CHECK,
  CheckPhase.STICK_CALIBRATION,
  CheckPhase.STICK_CHECK,
  CheckPhase.TRIGGER_CHECK,
  CheckPhase.RESULTS,
];

/**
 * Calculate the controller rating based on the total score.
 */
function calculateRating(total: number): ControllerRating {
  if (total >= RATING_THRESHOLDS.EXCELLENT) return ControllerRating.EXCELLENT;
  if (total >= RATING_THRESHOLDS.GOOD) return ControllerRating.GOOD;
  if (total >= RATING_THRESHOLDS.FAIR) return ControllerRating.FAIR;
  return ControllerRating.POOR;
}

/**
 * Calculate the weighted total score from individual phase scores.
 */
function calculateTotal(
  button: number,
  stick: number,
  trigger: number
): number {
  return Math.round(
    button * SCORE_WEIGHTS.BUTTON +
      stick * SCORE_WEIGHTS.STICK +
      trigger * SCORE_WEIGHTS.TRIGGER
  );
}

/**
 * Hook for managing controller check flow state.
 *
 * Tracks the current phase, individual results, and provides
 * methods to advance through the check sequence.
 */
export function useCheckState() {
  const [phase, setPhase] = useState<CheckPhase>(CheckPhase.IDLE);
  const [buttonResults, setButtonResults] = useState<ButtonCheckResult[]>([]);
  const [stickResult, setStickResult] = useState<StickCheckResult | null>(null);
  const [triggerResult, setTriggerResult] = useState<TriggerCheckResult | null>(
    null
  );

  /** Start the check flow from the beginning. */
  const startCheck = useCallback(() => {
    setPhase(CheckPhase.BUTTON_CHECK);
    setButtonResults([]);
    setStickResult(null);
    setTriggerResult(null);
  }, []);

  /** Advance to the next phase in the sequence. */
  const advancePhase = useCallback(() => {
    setPhase((current) => {
      const currentIndex = PHASE_ORDER.indexOf(current);
      if (currentIndex < PHASE_ORDER.length - 1) {
        return PHASE_ORDER[currentIndex + 1];
      }
      return current;
    });
  }, []);

  /** Record button check results and advance. */
  const completeButtonCheck = useCallback((results: ButtonCheckResult[]) => {
    setButtonResults(results);
    setPhase(CheckPhase.STICK_CALIBRATION);
  }, []);

  /** Record stick calibration complete and advance to stick check. */
  const completeStickCalibration = useCallback(() => {
    setPhase(CheckPhase.STICK_CHECK);
  }, []);

  /** Record stick check results and advance. */
  const completeStickCheck = useCallback((result: StickCheckResult) => {
    setStickResult(result);
    setPhase(CheckPhase.TRIGGER_CHECK);
  }, []);

  /** Record trigger check results and advance to results. */
  const completeTriggerCheck = useCallback((result: TriggerCheckResult) => {
    setTriggerResult(result);
    setPhase(CheckPhase.RESULTS);
  }, []);

  /** Reset the entire check flow. */
  const resetCheck = useCallback(() => {
    setPhase(CheckPhase.IDLE);
    setButtonResults([]);
    setStickResult(null);
    setTriggerResult(null);
  }, []);

  /** Calculate the current overall score from available results. */
  const getScores = useCallback((): OverallScore => {
    const buttonScore =
      buttonResults.length > 0
        ? Math.round(
            (buttonResults.filter((r) => r.correct).length /
              buttonResults.length) *
              100
          )
        : 0;

    const stickScore = stickResult?.accuracy ?? 0;
    const triggerScore = triggerResult?.smoothness ?? 0;
    const total = calculateTotal(buttonScore, stickScore, triggerScore);

    return {
      button: buttonScore,
      stick: stickScore,
      trigger: triggerScore,
      total,
    };
  }, [buttonResults, stickResult, triggerResult]);

  /** Get the final rating from current scores. */
  const getRating = useCallback((): ControllerRating => {
    const scores = getScores();
    return calculateRating(scores.total);
  }, [getScores]);

  /** Build the complete CheckResult object. */
  const getResult = useCallback((): CheckResult | null => {
    if (!stickResult || !triggerResult) return null;

    return {
      buttonResults,
      stickResult,
      triggerResult,
      scores: getScores(),
      rating: getRating(),
    };
  }, [buttonResults, stickResult, triggerResult, getScores, getRating]);

  /** Get the display name for the current phase. */
  const getPhaseName = useCallback((p: CheckPhase): string => {
    switch (p) {
      case CheckPhase.IDLE:
        return "Ready";
      case CheckPhase.BUTTON_CHECK:
        return "Button Check";
      case CheckPhase.STICK_CALIBRATION:
        return "Stick Calibration";
      case CheckPhase.STICK_CHECK:
        return "Stick Check";
      case CheckPhase.TRIGGER_CHECK:
        return "Trigger Check";
      case CheckPhase.RESULTS:
        return "Results";
      default:
        return p;
    }
  }, []);

  /** Get the next phase name for transition display. */
  const getNextPhaseName = useCallback((): string | null => {
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      return getPhaseName(PHASE_ORDER[currentIndex + 1]);
    }
    return null;
  }, [phase, getPhaseName]);

  return {
    phase,
    buttonResults,
    stickResult,
    triggerResult,
    startCheck,
    advancePhase,
    completeButtonCheck,
    completeStickCalibration,
    completeStickCheck,
    completeTriggerCheck,
    resetCheck,
    getScores,
    getRating,
    getResult,
    getPhaseName,
    getNextPhaseName,
  };
}
