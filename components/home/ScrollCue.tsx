"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Consensys-style “scroll to explore” cue under the hero. */
export function ScrollCue() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const line = node.querySelector<HTMLElement>("[data-scroll-line]");
    if (!line) return;

    const tween = gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        duration: 1.4,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      },
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-vanilla/45"
      aria-hidden
    >
      <span className="text-[10px] uppercase tracking-[0.2em]">Листайте</span>
      <span className="relative h-10 w-px overflow-hidden bg-vanilla/15">
        <span
          data-scroll-line
          className="absolute inset-0 bg-ember"
          style={{ transform: "scaleY(0)" }}
        />
      </span>
    </div>
  );
}
