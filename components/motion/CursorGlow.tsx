"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Soft ember glow that follows the cursor on desktop. */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) {
      node.style.display = "none";
      return;
    }

    gsap.set(node, { xPercent: -50, yPercent: -50, opacity: 0 });

    const onMove = (event: MouseEvent) => {
      gsap.to(node, {
        x: event.clientX,
        y: event.clientY,
        opacity: 0.55,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      gsap.to(node, { opacity: 0, duration: 0.4, ease: "power2.out" });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[30] hidden h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(232,168,124,0.22)_0%,transparent_68%)] blur-2xl lg:block"
    />
  );
}
