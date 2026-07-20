"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type AmbientDriftProps = {
  className?: string;
};

/** Soft infinite drift like 13g .gradient-blur-bg. */
export function AmbientDrift({ className = "" }: AmbientDriftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(node, {
        xPercent: 8,
        yPercent: 6,
        rotation: 3,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(node, {
        scale: 1.12,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${className}`}
    />
  );
}
