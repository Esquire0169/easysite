"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  /** Direction of entrance — mirrors 13g fade-up / fade-left / fade-right */
  direction?: "up" | "left" | "right" | "nav";
};

export function Reveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) {
      gsap.set(node, { clearProps: "all", opacity: 1, x: 0, y: 0 });
      return;
    }

    const from =
      direction === "left"
        ? { x: 48, y: 0, opacity: 0 }
        : direction === "right"
          ? { x: -48, y: 0, opacity: 0 }
          : direction === "nav"
            ? { x: 0, y: -40, opacity: 0 }
            : { x: 0, y: 40, opacity: 0 };

    const ctx = gsap.context(() => {
      gsap.fromTo(node, from, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: direction === "up" ? 1.25 : 1.1,
        delay: delayMs / 1000,
        ease: EASE.soft,
        immediateRender: false,
        scrollTrigger: {
          trigger: node,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, node);

    return () => ctx.revert();
  }, [delayMs, direction]);

  return (
    <div ref={ref} className={`reveal-gsap ${className}`}>
      {children}
    </div>
  );
}
