"use client";

import { useEffect, useRef } from "react";
import type { ControllerInfo } from "@/types/gamepad";
import { staggerFadeIn, fadeIn } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ConnectionIndicatorProps {
  connected: boolean;
}

/**
 * Animated dot that indicates controller connection status.
 * Pulses green when connected, gray when disconnected.
 */
export function ConnectionIndicator({ connected }: ConnectionIndicatorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !dotRef.current) return;

    fadeIn(dotRef.current, { duration: 200 });
  }, [connected, reducedMotion]);

  return (
    <div
      ref={dotRef}
      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
        connected ? "bg-[var(--accent)]" : "bg-[var(--text-secondary)]"
      }`}
      aria-label={connected ? "Controller connected" : "No controller"}
    />
  );
}

interface ControllerInfoProps {
  info: ControllerInfo | null;
  connected: boolean;
}

/**
 * Displays controller details: name, button count, axis count.
 * Fades in when a controller connects.
 */
export function ControllerInfoDisplay({ info, connected }: ControllerInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !connected) return;

    const children = containerRef.current.querySelectorAll<HTMLElement>(".info-line");
    if (children.length) {
      staggerFadeIn(Array.from(children), {
        stagger: 60,
        duration: 250,
        translateY: 8,
      });
    }
  }, [connected, reducedMotion]);

  if (!connected || !info) return null;

  // Clean up the controller ID for display (truncate long strings)
  const displayName =
    info.id.length > 40 ? info.id.substring(0, 37) + "..." : info.id;

  return (
    <div ref={containerRef} className="mt-3 space-y-1.5">
      <div className="info-line">
        <p className="text-xs font-mono text-[var(--text-primary)] truncate">
          {displayName}
        </p>
      </div>
      <div className="info-line flex gap-4">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          Buttons: {info.buttonCount}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
          Axes: {info.axisCount}
        </span>
      </div>
      {info.mapping && (
        <div className="info-line">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            Mapping: {info.mapping}
          </span>
        </div>
      )}
    </div>
  );
}
