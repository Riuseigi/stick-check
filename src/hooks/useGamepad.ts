"use client";

import { useState, useCallback } from "react";
import type { GamepadState } from "@/types/gamepad";

/**
 * Hook for polling and managing gamepad state via the Browser Gamepad API.
 *
 * TODO: Implement navigator.getGamepads() polling in a requestAnimationFrame loop.
 */
export function useGamepad() {
  const [gamepad, setGamepad] = useState<GamepadState | null>(null);

  const getGamepads = useCallback(() => {
    // TODO: Implement navigator.getGamepads() polling
  }, []);

  return { gamepad, getGamepads, isConnected: !!gamepad?.connected };
}
