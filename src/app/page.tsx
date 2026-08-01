"use client";

import { useEffect, useRef } from "react";
import { staggerFadeIn, fadeIn } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGamepadConnection } from "@/hooks/useGamepadConnection";
import { useGamepad } from "@/hooks/useGamepad";
import { useGameLoop } from "@/hooks/useGameLoop";
import { ControllerStatus } from "@/components/controller/ControllerStatus";
import { ENTRANCE_DURATION, ENTRANCE_STAGGER } from "@/constants/animation";

export default function Home() {
  const reducedMotion = useReducedMotion();
  const { connected, controllerId } = useGamepadConnection();
  const { controllerInfo, poll } = useGamepad();

  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  // Poll gamepad state each frame
  useGameLoop(() => {
    poll();
  }, connected);

  // Entrance animation
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const targets = [titleRef, subtitleRef, statusRef, buttonRef]
      .filter((r) => r.current)
      .map((r) => r.current!);

    staggerFadeIn(targets, {
      stagger: ENTRANCE_STAGGER,
      duration: ENTRANCE_DURATION,
      translateY: 16,
    });
  }, [reducedMotion]);

  // Button reveal on controller connect
  useEffect(() => {
    if (connected && buttonRef.current && !reducedMotion) {
      fadeIn(buttonRef.current, { duration: 300 });
    }
  }, [connected, reducedMotion]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 diagnostic-grid">
      <div
        ref={containerRef}
        className="flex flex-col items-center gap-8 max-w-lg text-center"
      >
        {/* Logo / Title */}
        <div ref={titleRef} className="opacity-0">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]">
            STICK<span className="text-[var(--accent)]">CHECK</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm text-[var(--text-secondary)] max-w-[40ch] leading-relaxed opacity-0"
        >
          Gamepad diagnostic and calibration tool. Test your controller&apos;s
          buttons, sticks, and triggers.
        </p>

        {/* Controller Status Card */}
        <div ref={statusRef} className="w-full opacity-0">
          <ControllerStatus
            connected={connected}
            controllerId={controllerId}
            controllerInfo={controllerInfo}
          />
        </div>

        {/* Start Button */}
        <a
          ref={buttonRef}
          href={connected ? "/check" : "#"}
          onClick={(e) => {
            if (!connected) e.preventDefault();
          }}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-sm font-semibold tracking-wide transition-all duration-200 ${
            connected
              ? "bg-[var(--accent)] text-[var(--bg-canvas)] hover:brightness-110 active:scale-[0.98] opacity-0"
              : "bg-[var(--border)] text-[var(--text-secondary)] cursor-not-allowed opacity-40"
          }`}
          aria-disabled={!connected}
        >
          START CHECK
        </a>

        {!connected && (
          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] opacity-40 mt-2">
            Waiting for controller
          </p>
        )}
      </div>
    </div>
  );
}
