"use client";

import { useEffect, useRef } from "react";
import type { ControllerInfo } from "@/types/gamepad";
import { fadeIn } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  ConnectionIndicator,
  ControllerInfoDisplay,
} from "./ControllerInfo";

interface ControllerStatusProps {
  connected: boolean;
  controllerId: string | null;
  controllerInfo: ControllerInfo | null;
}

/**
 * Full controller status display.
 * Shows connection indicator, status text, controller details.
 * Animates on connect/disconnect per PRD section 15.2.
 */
export function ControllerStatus({
  connected,
  controllerInfo,
}: ControllerStatusProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statusTextRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  // Animate status text change on connect/disconnect
  useEffect(() => {
    if (reducedMotion || !statusTextRef.current) return;

    fadeIn(statusTextRef.current, { duration: 200 });
  }, [connected, reducedMotion]);

  // Animate hint text change
  useEffect(() => {
    if (reducedMotion || !hintRef.current) return;

    fadeIn(hintRef.current, { duration: 200 });
  }, [connected, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-6"
    >
      {/* Status Row */}
      <div className="flex items-center gap-3">
        <ConnectionIndicator connected={connected} />
        <span
          ref={statusTextRef}
          className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]"
        >
          {connected ? "Controller Connected" : "No Controller Detected"}
        </span>
      </div>

      {/* Controller Details */}
      <ControllerInfoDisplay info={controllerInfo} connected={connected} />

      {/* Hint Text */}
      <p
        ref={hintRef}
        className="mt-3 text-xs text-[var(--text-secondary)]"
      >
        {connected
          ? "Ready to begin diagnostic checks."
          : "Connect a controller via USB or Bluetooth to begin."}
      </p>
    </div>
  );
}
