/**
 * Scoring constants for the controller check system.
 */

/** Weight of each check category toward the total score. */
export const SCORE_WEIGHTS = {
  BUTTON: 0.4,
  STICK: 0.35,
  TRIGGER: 0.25,
} as const;

/** Number of button prompts during the button check phase. */
export const BUTTON_CHECK_COUNT = 10;

/** Number of targets to hit during the stick check phase. */
export const STICK_TARGET_COUNT = 5;

/** Number of trigger pull repetitions per trigger check. */
export const TRIGGER_REPEAT_COUNT = 3;

/** Score thresholds for each controller rating tier. */
export const RATING_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 75,
  FAIR: 60,
  POOR: 0,
} as const;

/** Reaction time threshold in ms below which a bonus is applied. */
export const REACTION_TIME_BONUS_THRESHOLD = 500;

/** Stick drift penalty threshold. Values above this trigger a penalty. */
export const DRIFT_PENALTY_THRESHOLD = 0.05;
