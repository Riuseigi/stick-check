"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { staggerFadeIn } from "@/lib/animations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCheckState } from "@/hooks/useCheckState";
import { RESULT_STAGGER, ENTRANCE_DURATION } from "@/constants/animation";
import { CheckPhase, ControllerRating } from "@/types/check";

/** Color mapping for ratings. */
const RATING_COLORS: Record<ControllerRating, string> = {
  [ControllerRating.EXCELLENT]: "var(--accent)",
  [ControllerRating.GOOD]: "#4FC3F7",
  [ControllerRating.FAIR]: "#FFB74D",
  [ControllerRating.POOR]: "var(--danger)",
  [ControllerRating.NEEDS_CALIBRATION]: "var(--danger)",
};

export default function ResultsPage() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { phase, getScores, getRating, resetCheck } =
    useCheckState();

  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Redirect to home if no check has been completed
  useEffect(() => {
    if (phase === CheckPhase.IDLE) {
      router.push("/");
    }
  }, [phase, router]);

  // Entrance animation sequence per PRD section 15.7
  useEffect(() => {
    if (reducedMotion || phase === CheckPhase.IDLE) return;

    const targets = [headingRef, scoreRef, cardsRef, ratingRef, actionsRef]
      .filter((r) => r.current)
      .map((r) => r.current!);

    staggerFadeIn(targets, {
      stagger: RESULT_STAGGER,
      duration: ENTRANCE_DURATION,
      translateY: 12,
    });
  }, [phase, reducedMotion]);

  const scores = getScores();
  const rating = getRating();
  const ratingColor = RATING_COLORS[rating];

  const handleRetest = () => {
    resetCheck();
    router.push("/");
  };

  if (phase === CheckPhase.IDLE) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col items-center justify-center px-6 py-24 diagnostic-grid"
    >
      <div className="flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Heading */}
        <div ref={headingRef} className="opacity-0">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)] mb-3">
            Check Complete
          </p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Results
          </h1>
        </div>

        {/* Overall Score */}
        <div ref={scoreRef} className="opacity-0">
          <div className="text-6xl font-mono font-bold text-[var(--text-primary)]">
            {scores.total}
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] mt-1">
            Overall Score
          </p>
        </div>

        {/* Category Cards */}
        <div
          ref={cardsRef}
          className="w-full max-w-sm grid grid-cols-3 gap-3 opacity-0"
        >
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
            <div className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
              {scores.button}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mt-1">
              Button
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
            <div className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
              {scores.stick}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mt-1">
              Stick
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] p-4">
            <div className="text-2xl font-mono font-semibold text-[var(--text-primary)]">
              {scores.trigger}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mt-1">
              Trigger
            </p>
          </div>
        </div>

        {/* Rating */}
        <div ref={ratingRef} className="opacity-0">
          <div
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2"
            style={{
              borderColor: ratingColor,
              backgroundColor: `color-mix(in srgb, ${ratingColor} 10%, transparent)`,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ratingColor }}
            />
            <span
              className="text-xs font-mono font-semibold uppercase tracking-wider"
              style={{ color: ratingColor }}
            >
              {rating.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div ref={actionsRef} className="flex gap-3 opacity-0">
          <button
            onClick={handleRetest}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-xs font-mono uppercase tracking-wider border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all duration-200 active:scale-[0.98]"
          >
            New Test
          </button>
        </div>
      </div>
    </div>
  );
}
