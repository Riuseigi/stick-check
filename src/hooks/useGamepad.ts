"use client";

import { useState, useCallback, useRef } from "react";
import type { GamepadState, ControllerInfo } from "@/types/gamepad";
import {
  readRawGamepad,
  readGamepadState,
  readControllerInfo,
} from "@/lib/gamepad";

/**
 * Hook for polling gamepad state via the Browser Gamepad API.
 *
 * Uses navigator.getGamepads() to read the current state.
 * Call `poll()` inside a requestAnimationFrame loop (e.g. via useGameLoop).
 *
 * Controller logic is completely independent from animation code.
 */
export function useGamepad() {
  const [gamepad, setGamepad] = useState<GamepadState | null>(null);
  const [controllerInfo, setControllerInfo] = useState<ControllerInfo | null>(
    null
  );
  const lastTimestampRef = useRef(0);

  /**
   * Read the current gamepad state from the browser API.
   * Returns the new state, or null if no gamepad is connected.
   */
  const poll = useCallback(() => {
    const raw = readRawGamepad();
    if (!raw) {
      setGamepad(null);
      setControllerInfo(null);
      lastTimestampRef.current = 0;
      return null;
    }

    // Only update state if the gamepad has actually changed
    if (raw.timestamp === lastTimestampRef.current) {
      return gamepad;
    }
    lastTimestampRef.current = raw.timestamp;

    const state = readGamepadState(raw);
    const info = readControllerInfo(raw);

    setGamepad(state);
    setControllerInfo(info);
    return state;
  }, [gamepad]);

  return {
    /** Current gamepad state snapshot, or null if not connected. */
    gamepad,
    /** Controller metadata (id, mapping, button/axis counts). */
    controllerInfo,
    /** Whether a gamepad is currently connected. */
    isConnected: !!gamepad?.connected,
    /** Read and update gamepad state. Call this inside a RAF loop. */
    poll,
  };
}
