/**
 * Gamepad constants based on the W3C Gamepad API specification.
 */

/** Standard gamepad button indices (W3C Gamepad spec). */
export const BUTTON_INDEX = {
  CROSS: 0,       // A on Xbox, X on PS
  CIRCLE: 1,      // B on Xbox, O on PS
  SQUARE: 2,      // X on Xbox, □ on PS
  TRIANGLE: 3,    // Y on Xbox, △ on PS
  LB: 4,
  RB: 5,
  LT: 6,
  RT: 7,
  BACK: 8,        // Select/View
  START: 9,       // Start/Menu
  L_STICK: 10,
  R_STICK: 11,
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
  HOME: 16,       // Guide
} as const;

/** Standard gamepad axis indices. */
export const AXIS_INDEX = {
  LEFT_X: 0,
  LEFT_Y: 1,
  RIGHT_X: 2,
  RIGHT_Y: 3,
} as const;

/** Stick dead zone threshold. Values within ±DEAD_ZONE are treated as centered. */
export const DEAD_ZONE = 0.15;

/** Trigger press threshold to register as "pressed". */
export const TRIGGER_THRESHOLD = 0.5;

/** Maximum trigger analog value. */
export const TRIGGER_MAX = 1.0;
