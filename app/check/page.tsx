"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fadeIn, fadeOut } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCheckState } from "@/hooks/useCheckState";
import { CHECK_TRANSITION_DURATION } from "@/constants/animation";
import { CheckPhase } from "@/types/check";
import { ButtonCheck } from "@/components/checks/ButtonCheck";
import type { ButtonCheckResult } from "@/types/check";

/** Ordered list of phases to display. */
const DISPLAY_PHASES: { phase: CheckPhase; label: string }[] = [
  { phase: CheckPhase.BUTTON_CHECK, label: "Button Check" },
  { phase: CheckPhase.STICK_CALIBRATION, label: "Stick Calibration" },
  { phase: CheckPhase.STICK_CHECK, label: "Stick Check" },
  { phase: CheckPhase.TRIGGER_CHECK, label: "Trigger Check" },
];

export default function CheckPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const {
    phase,
    startCheck,
    advancePhase,
    completeButtonCheck,
    getPhaseName,
    getNextPhaseName,
  } = useCheckState();

  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<HTMLDivElement>(null);
  const [transitioning, setTransitioning] = useState(false);

  // Start the check flow on mount
  useEffect(() => {
    if (phase === CheckPhase.IDLE) {
      startCheck();
    }
  }, [phase, startCheck]);

  // Animate phase entrance
  useEffect(() => {
    if (reducedMotion || !phaseRef.current || phase === CheckPhase.IDLE) return;

    fadeIn(phaseRef.current, { duration: CHECK_TRANSITION_DURATION });
  }, [phase, reducedMotion]);

  // Handle phase advancement with transition animation
  const handleAdvance = useCallback(() => {
    if (transitioning) return;

    if (phase === CheckPhase.RESULTS) {
      router.push("/results");
      return;
    }

    setTransitioning(true);

    if (reducedMotion || !phaseRef.current) {
      advancePhase();
      setTransitioning(false);
      return;
    }

    fadeOut(phaseRef.current, {
      duration: CHECK_TRANSITION_DURATION / 2,
    });

    setTimeout(() => {
      advancePhase();
      setTransitioning(false);
    }, CHECK_TRANSITION_DURATION / 2 + 50);
  }, [phase, transitioning, reducedMotion, advancePhase, router]);

  // Handle button check completion
  const handleButtonCheckComplete = useCallback(
    (results: ButtonCheckResult[]) => {
      completeButtonCheck(results);
    },
    [completeButtonCheck]
  );

  // Auto-advance through stub phases (stick calibration, stick check, trigger check)
  // Button check has its own completion handler, so skip it here
  useEffect(() => {
    if (
      phase === CheckPhase.IDLE ||
      phase === CheckPhase.BUTTON_CHECK ||
      phase === CheckPhase.RESULTS ||
      transitioning
    ) {
      return;
    }

    const timer = setTimeout(() => {
      handleAdvance();
    }, 1500);

    return () => clearTimeout(timer);
  }, [phase, transitioning, handleAdvance]);

  const currentPhase = DISPLAY_PHASES.find((p) => p.phase === phase);
  const nextPhaseName = getNextPhaseName();

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 diagnostic-grid"
    >
      <div className="flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Phase Header */}
        <div ref={phaseRef} className="opacity-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-3">
            {phase !== CheckPhase.RESULTS
              ? `Phase ${DISPLAY_PHASES.findIndex((p) => p.phase === phase) + 1} of ${DISPLAY_PHASES.length}`
              : "Complete"}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {currentPhase?.label ?? getPhaseName(phase)}
          </h1>

          {/* Transition preview */}
          {nextPhaseName && (
            <p className="mt-4 text-xs font-mono text-[var(--text-secondary)]">
              Next: {nextPhaseName}
            </p>
          )}
        </div>

        {/* Phase content */}
        <div className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-8">
          {phase === CheckPhase.BUTTON_CHECK && (
            <ButtonCheck onComplete={handleButtonCheckComplete} />
          )}

          {phase === CheckPhase.STICK_CALIBRATION && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Release both sticks to center position for calibration.
              </p>
              <div className="w-32 h-32 rounded-full border border-[var(--border)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
              </div>
            </div>
          )}

          {phase === CheckPhase.STICK_CHECK && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Move the stick to reach each target in the arena.
              </p>
              <div className="w-full h-40 rounded-lg border border-[var(--border)] relative diagnostic-grid">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)]" />
              </div>
            </div>
          )}

          {phase === CheckPhase.TRIGGER_CHECK && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Pull each trigger from 0% to 100% smoothly.
              </p>
              <div className="w-full h-4 rounded-full bg-[var(--border)] overflow-hidden">
                <div className="h-full w-1/2 bg-[var(--accent)] rounded-full" />
              </div>
              <div className="flex gap-4 text-xs font-mono text-[var(--text-secondary)]">
                <span>L2</span>
                <span>R2</span>
              </div>
            </div>
          )}

          {phase === CheckPhase.RESULTS && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--text-secondary)]">
                Check complete. Viewing results...
              </p>
            </div>
          )}
        </div>

        {/* Skip / Continue button */}
        <button
          onClick={handleAdvance}
          disabled={transitioning || phase === CheckPhase.BUTTON_CHECK}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-xs font-mono uppercase tracking-wider border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all duration-200 active:scale-[0.98] disabled:opacity-40"
        >
          {phase === CheckPhase.RESULTS ? "View Results" : "Skip"}
        </button>
      </div>
    </div>
  );
}
