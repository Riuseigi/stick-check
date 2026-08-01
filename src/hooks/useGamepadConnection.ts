"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Hook for tracking gamepad connection state via browser events.
 */
export function useGamepadConnection() {
  const [connected, setConnected] = useState(false);
  const [controllerId, setControllerId] = useState<string | null>(null);

  useEffect(() => {
    const handleConnected = (e: GamepadEvent) => {
      setConnected(true);
      setControllerId(e.gamepad.id);
    };
    const handleDisconnected = () => {
      setConnected(false);
      setControllerId(null);
    };

    window.addEventListener("gamepadconnected", handleConnected);
    window.addEventListener("gamepaddisconnected", handleDisconnected);
    return () => {
      window.removeEventListener("gamepadconnected", handleConnected);
      window.removeEventListener("gamepaddisconnected", handleDisconnected);
    };
  }, []);

  return { connected, controllerId };
}
