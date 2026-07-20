"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

type GrowLineProps = {
  className?: string;
  vertical?: boolean;
};

/** Divider grow — scrubbed scale so progress tracks scroll (ease none). */
export function GrowLine({ className = "", vertical = false }: GrowLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      gsap.set(node, vertical ? { scaleY: 1 } : { scaleX: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.set(node, {
      ...(vertical ? { scaleY: 0 } : { scaleX: 0 }),
      transformOrigin: vertical ? "center top" : "left center",
    });

    const ctx = gsap.context(() => {
      gsap.to(node, {
        ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
        ease: "none",
        scrollTrigger: {
          trigger: node.parentElement ?? node,
          start: "clamp(top 85%)",
          end: "clamp(top 45%)",
          scrub: true,
        },
      });
    }, node);

    return () => ctx.revert();
  }, [vertical]);

  return (
    <div
      ref={ref}
      data-grow-line
      aria-hidden
      className={[
        "origin-left bg-vanilla/25 will-change-transform",
        vertical ? "h-full w-px origin-top" : "h-px w-full",
        className,
      ].join(" ")}
    />
  );
}
