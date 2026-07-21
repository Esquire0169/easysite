"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { prefersReducedMotion } from "@/lib/motion";

type TextCycleProps = {
  phrases: readonly string[];
  className?: string;
  intervalMs?: number;
};

/**
 * gsap-plugin-textplugin — cycles phrases via TextPlugin.
 * Host span has no React text children so TextPlugin mutations stay safe.
 */
export function TextCycle({
  phrases,
  className = "",
  intervalMs = 2800,
}: TextCycleProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || phrases.length < 2) return;

    node.textContent = phrases[0] ?? "";

    if (prefersReducedMotion()) return;

    gsap.registerPlugin(TextPlugin);

    let i = 0;
    const tick = () => {
      i = (i + 1) % phrases.length;
      gsap.to(node, {
        duration: 0.7,
        text: phrases[i],
        ease: "none",
      });
    };

    const id = window.setInterval(tick, intervalMs);
    return () => {
      window.clearInterval(id);
      gsap.killTweensOf(node);
    };
  }, [phrases, intervalMs]);

  return <span ref={ref} className={className} />;
}
