/**
 * Types for Browser Gamepad API integration.
 */

/** Individual button state. */
export interface ButtonState {
  /** Whether the button is currently pressed. */
  pressed: boolean;
  /** Whether the button is being touched (touchpads, etc). */
  touched: boolean;
  /** Analog value from 0 (released) to 1 (fully pressed). */
  value: number;
}

/** Axis state with dead zone detection. */
export interface AxisState {
  /** Raw axis value from -1 to 1. */
  value: number;
  /** Dead zone threshold applied. */
  deadZone: number;
  /** Whether the axis is outside the dead zone. */
  active: boolean;
}

/** Normalized stick position. */
export interface StickPosition {
  /** Horizontal position, -1 (left) to 1 (right). */
  x: number;
  /** Vertical position, -1 (up) to 1 (down). */
  y: number;
}

/** Trigger state with completion threshold. */
export interface TriggerState {
  /** Analog value from 0 (released) to 1 (fully pressed). */
  value: number;
  /** Threshold required to consider the trigger "complete". */
  completionThreshold: number;
  /** Whether the trigger has reached the completion threshold. */
  completed: boolean;
}

/** Controller metadata. */
export interface ControllerInfo {
  /** Unique identifier for the connected controller. */
  id: string;
  /** Controller mapping type (e.g. "standard"). */
  mapping: string;
  /** Number of buttons on the controller. */
  buttonCount: number;
  /** Number of axes on the controller. */
  axisCount: number;
  /** Whether the controller is currently connected. */
  connected: boolean;
}

/** Full gamepad state snapshot. */
export interface GamepadState {
  /** Whether the gamepad is currently connected. */
  connected: boolean;
  /** Unique identifier for the connected gamepad. */
  id: string;
  /** Array of button states indexed by button position. */
  buttons: ButtonState[];
  /** Array of axis states indexed by axis position. */
  axes: AxisState[];
  /** Timestamp of the last state update. */
  timestamp: number;
}
