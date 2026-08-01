"use client";

import { animate, createScope, stagger, type Scope, type AnimationOptions } from "animejs";

/** Type for any DOM element target. */
type Target = string | HTMLElement | HTMLElement[];

/**
 * Clean up an animation scope, reverting all animations within it.
 */
export function cleanupScope(scope: Scope | null) {
  if (scope) {
    scope.revert();
  }
}

/**
 * Fade in a single element or group.
 */
export function fadeIn(
  target: Target,
  options?: { duration?: number; delay?: number; easing?: string }
) {
  return animate(target, {
    opacity: [0, 1],
    duration: options?.duration ?? 400,
    delay: options?.delay ?? 0,
    easing: options?.easing ?? "easeOutCubic",
  });
}

/**
 * Staggered fade-in for a group of elements.
 */
export function staggerFadeIn(
  target: Target,
  options?: { stagger?: number; duration?: number; translateY?: number }
) {
  return animate(target, {
    opacity: [0, 1],
    translate:
      options?.translateY !== undefined
        ? [`${options.translateY}px`, "0px"]
        : ["20px", "0px"],
    duration: options?.duration ?? 400,
    delay: stagger(options?.stagger ?? 80),
    easing: "easeOutCubic",
  });
}

/**
 * Scale pulse for button feedback.
 */
export function scalePulse(
  target: Target,
  options?: { scale?: number; duration?: number }
) {
  return animate(target, {
    scale: [1, options?.scale ?? 1.08, 1],
    duration: options?.duration ?? 200,
    easing: "easeOutCubic",
  });
}

/**
 * Shake animation for incorrect input.
 */
export function shake(
  target: Target,
  options?: { duration?: number; distance?: number }
) {
  const dist = options?.distance ?? 6;
  return animate(target, {
    translateX: [
      `-${dist}px`,
      `${dist}px`,
      `-${dist / 2}px`,
      `${dist / 2}px`,
      "0px",
    ],
    duration: options?.duration ?? 300,
    easing: "easeOutCubic",
  });
}

/**
 * Count-up animation for score display.
 */
export function countUp(
  target: Target,
  options: {
    from: number;
    to: number;
    duration?: number;
    onUpdate?: (value: number) => void;
  }
) {
  const obj = { value: options.from };
  return animate(obj, {
    value: options.to,
    duration: options.duration ?? 800,
    easing: "easeOutCubic",
    onUpdate: () => {
      options.onUpdate?.(Math.round(obj.value));
    },
  });
}

/**
 * Slide up and fade in.
 */
export function slideUp(
  target: Target,
  options?: { duration?: number; distance?: number }
) {
  return animate(target, {
    opacity: [0, 1],
    translate: [`${options?.distance ?? 24}px`, "0px"],
    duration: options?.duration ?? 400,
    easing: "easeOutCubic",
  });
}

/**
 * Fade out.
 */
export function fadeOut(target: Target, options?: { duration?: number }) {
  return animate(target, {
    opacity: [1, 0],
    duration: options?.duration ?? 300,
    easing: "easeInCubic",
  });
}
