"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook that provides a requestAnimationFrame game loop.
 *
 * @param callback - Called each frame with the delta time in ms.
 * @param active - Whether the loop should be running.
 */
export function useGameLoop(callback: (deltaTime: number) => void, active: boolean = true) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!active) return;

    let lastTime = performance.now();
    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      callbackRef.current(delta);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);
}
