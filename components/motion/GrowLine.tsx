"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

type GrowLineProps = {
  className?: string;
  vertical?: boolean;
};

/** Divider grow — 13g .divider animation. */
export function GrowLine({ className = "", vertical = false }: GrowLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      gsap.set(node, vertical ? { height: "100%" } : { width: "100%" });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(node, vertical ? { height: "0%" } : { width: "0%" });

    const ctx = gsap.context(() => {
      gsap.to(node, {
        ...(vertical ? { height: "100%" } : { width: "100%" }),
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: node.parentElement ?? node,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, node);

    return () => ctx.revert();
  }, [vertical]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={[
        "bg-vanilla/25",
        vertical ? "w-px" : "h-px",
        className,
      ].join(" ")}
    />
  );
}
