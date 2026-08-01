/**
 * Utility functions for reading gamepad state from the Browser Gamepad API.
 *
 * This module is pure logic — no React state, no animations.
 * It reads raw Gamepad API data and converts it to typed structures.
 */

import type {
  GamepadState,
  ButtonState,
  AxisState,
  StickPosition,
  TriggerState,
  ControllerInfo,
} from "@/types/gamepad";
import { DEAD_ZONE, TRIGGER_THRESHOLD, BUTTON_INDEX, AXIS_INDEX } from "@/constants/gamepad";

/**
 * Read the first connected gamepad from the browser API.
 * Returns null if no gamepad is connected.
 */
export function readRawGamepad(): Gamepad | null {
  if (typeof navigator === "undefined") return null;
  const gamepads = navigator.getGamepads();
  for (const gp of gamepads) {
    if (gp) return gp;
  }
  return null;
}

/**
 * Convert a raw Browser Gamepad button to a typed ButtonState.
 */
export function readButton(raw: GamepadButton): ButtonState {
  return {
    pressed: raw.pressed,
    touched: raw.touched ?? false,
    value: raw.value,
  };
}

/**
 * Convert a raw Browser Gamepad axis to a typed AxisState with dead zone detection.
 */
export function readAxis(raw: number, deadZone: number = DEAD_ZONE): AxisState {
  const active = Math.abs(raw) > deadZone;
  return {
    value: active ? raw : 0,
    deadZone,
    active,
  };
}

/**
 * Read stick position from two axes, applying dead zone.
 */
export function readStick(
  rawX: number,
  rawY: number,
  deadZone: number = DEAD_ZONE
): StickPosition {
  const xActive = Math.abs(rawX) > deadZone;
  const yActive = Math.abs(rawY) > deadZone;
  return {
    x: xActive ? rawX : 0,
    y: yActive ? rawY : 0,
  };
}

/**
 * Read trigger state from a raw axis value.
 */
export function readTrigger(
  raw: number,
  completionThreshold: number = TRIGGER_THRESHOLD
): TriggerState {
  const value = Math.max(0, Math.min(1, raw));
  return {
    value,
    completionThreshold,
    completed: value >= completionThreshold,
  };
}

/**
 * Extract controller metadata from a raw Gamepad object.
 */
export function readControllerInfo(raw: Gamepad): ControllerInfo {
  return {
    id: raw.id,
    mapping: raw.mapping || "standard",
    buttonCount: raw.buttons.length,
    axisCount: raw.axes.length,
    connected: raw.connected,
  };
}

/**
 * Read the full gamepad state from the browser API.
 * Returns a typed snapshot of the current controller state.
 */
export function readGamepadState(raw: Gamepad): GamepadState {
  return {
    connected: raw.connected,
    id: raw.id,
    buttons: raw.buttons.map(readButton),
    axes: raw.axes.map((a) => readAxis(a)),
    timestamp: raw.timestamp,
  };
}

/**
 * Get the index of the first pressed button in a button array.
 * Returns -1 if no button is currently pressed.
 */
export function getFirstPressedButton(buttons: ButtonState[]): number {
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].pressed) return i;
  }
  return -1;
}

/**
 * Get left stick position from a GamepadState.
 */
export function getLeftStick(state: GamepadState): StickPosition {
  return readStick(
    state.axes[AXIS_INDEX.LEFT_X]?.value ?? 0,
    state.axes[AXIS_INDEX.LEFT_Y]?.value ?? 0
  );
}

/**
 * Get right stick position from a GamepadState.
 */
export function getRightStick(state: GamepadState): StickPosition {
  return readStick(
    state.axes[AXIS_INDEX.RIGHT_X]?.value ?? 0,
    state.axes[AXIS_INDEX.RIGHT_Y]?.value ?? 0
  );
}

/**
 * Get left trigger value from a GamepadState.
 */
export function getLeftTrigger(state: GamepadState): TriggerState {
  const raw = state.buttons[BUTTON_INDEX.LT]?.value ?? 0;
  return readTrigger(raw);
}

/**
 * Get right trigger value from a GamepadState.
 */
export function getRightTrigger(state: GamepadState): TriggerState {
  const raw = state.buttons[BUTTON_INDEX.RT]?.value ?? 0;
  return readTrigger(raw);
}
