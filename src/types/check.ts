/**
 * Types for the checking and calibration system.
 */

/** Phases of the controller check flow. */
export enum CheckPhase {
  /** No check in progress. */
  IDLE = "IDLE",
  /** Testing individual button inputs. */
  BUTTON_CHECK = "BUTTON_CHECK",
  /** Calibrating analog stick center positions. */
  STICK_CALIBRATION = "STICK_CALIBRATION",
  /** Testing analog stick accuracy and drift. */
  STICK_CHECK = "STICK_CHECK",
  /** Testing trigger responsiveness and range. */
  TRIGGER_CHECK = "TRIGGER_CHECK",
  /** Displaying final results. */
  RESULTS = "RESULTS",
}

/** Result of a single button check. */
export interface ButtonCheckResult {
  /** Display name of the button (e.g. "Cross", "A"). */
  name: string;
  /** Expected button index that should have been pressed. */
  expected: number;
  /** Whether the correct button was pressed. */
  correct: boolean;
  /** Time in ms from prompt to reaction. */
  reactionTime: number;
}

/** Result of the stick check phase. */
export interface StickCheckResult {
  /** Accuracy score from 0 to 100. */
  accuracy: number;
  /** Detected drift amount (0 = none, higher = worse). */
  drift: number;
  /** Offset from true center position. */
  centerOffset: number;
  /** Number of targets successfully hit. */
  targetsHit: number;
}

/** Result of the trigger check phase. */
export interface TriggerCheckResult {
  /** Smoothness score from 0 to 100. */
  smoothness: number;
  /** Detected deadzone size (0 = none). */
  deadzone: number;
  /** Achieved range from 0 to 1. */
  range: number;
  /** Time in ms to complete all trigger pulls. */
  completionTime: number;
}

/** Overall scores broken down by category. */
export interface OverallScore {
  /** Button check score (0-100). */
  button: number;
  /** Stick check score (0-100). */
  stick: number;
  /** Trigger check score (0-100). */
  trigger: number;
  /** Weighted total score (0-100). */
  total: number;
}

/** Rating assigned based on overall score. */
export enum ControllerRating {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  NEEDS_CALIBRATION = "NEEDS_CALIBRATION",
}

/** Complete result of a controller check session. */
export interface CheckResult {
  /** Individual button check results. */
  buttonResults: ButtonCheckResult[];
  /** Stick check result. */
  stickResult: StickCheckResult;
  /** Trigger check result. */
  triggerResult: TriggerCheckResult;
  /** Aggregate scores per phase. */
  scores: OverallScore;
  /** Final rating based on total score. */
  rating: ControllerRating;
}
