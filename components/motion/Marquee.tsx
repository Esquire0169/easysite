"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type MarqueeProps = {
  items: readonly string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const width = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: -width,
      duration: 28,
      ease: "none",
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [items]);

  const loop = [...items, ...items];

  return (
    <div
      className={`overflow-hidden bg-cosmic-deep/30 ${className}`}
      aria-hidden
    >
      <div ref={trackRef} className="flex w-max gap-8 py-4">
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-vanilla/55"
          >
            {item}
            <span className="ml-8 text-ember/70">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
