"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
};

/** Elastic magnetic pull — adapted from 13g .button-video-stuck. */
export function Magnetic({
  children,
  className = "",
  strength = 0.38,
  radius = 130,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    // Touch / coarse pointers don't get magnetic hover pull.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let active = false;

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        if (!active) {
          node.style.willChange = "transform";
        }
        active = true;
        gsap.to(node, {
          x: dx * strength,
          y: dy * strength,
          duration: 1.15,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else if (active) {
        active = false;
        gsap.to(node, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.45)",
          overwrite: "auto",
          onComplete: () => {
            if (!active) {
              node.style.willChange = "";
              gsap.set(node, { clearProps: "will-change" });
            }
          },
        });
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      node.style.willChange = "";
      gsap.set(node, { clearProps: "transform,will-change" });
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={`inline-flex ${className}`}>
      {children}
    </div>
  );
}
