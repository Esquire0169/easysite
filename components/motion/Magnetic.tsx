"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
};

/** Elastic magnetic pull via quickTo — performant pointer tracking. */
export function Magnetic({
  children,
  className = "",
  strength = 0.38,
  radius = 130,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(node, "x", {
        duration: MOTION.magnetic.duration,
        ease: MOTION.magnetic.ease,
      });
      const yTo = gsap.quickTo(node, "y", {
        duration: MOTION.magnetic.duration,
        ease: MOTION.magnetic.ease,
      });

      let active = false;

      const onMove = (event: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          active = true;
          xTo(dx * strength);
          yTo(dy * strength);
        } else if (active) {
          active = false;
          gsap.to(node, {
            x: 0,
            y: 0,
            duration: MOTION.magnetic.returnDuration,
            ease: MOTION.magnetic.returnEase,
            overwrite: "auto",
          });
        }
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", onMove);
        gsap.set(node, { clearProps: "transform" });
      };
    },
    { dependencies: [radius, strength] },
  );

  return (
    <div ref={ref} className={`inline-flex will-change-transform ${className}`}>
      {children}
    </div>
  );
}
