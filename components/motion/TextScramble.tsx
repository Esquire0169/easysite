"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ0123456789";

type TextScrambleProps = {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  /** Play on mount instead of scroll */
  immediate?: boolean;
};

/**
 * mega-text-scramble / ScrambleTextPlugin stand-in (Club plugin not required).
 */
export function TextScramble({
  text,
  className = "",
  as: Tag = "span",
  immediate = false,
}: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      node.textContent = text;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const scrambleTo = () => {
      const duration = 1.1;
      const proxy = { t: 0 };
      gsap.to(proxy, {
        t: 1,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          const progress = proxy.t;
          node.textContent = text
            .split("")
            .map((ch, i) => {
              if (ch === " " || ch === "—" || ch === "·") return ch;
              const revealAt = i / text.length;
              if (progress > revealAt + 0.08) return ch;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? ch;
            })
            .join("");
        },
        onComplete: () => {
          node.textContent = text;
        },
      });
    };

    if (immediate) {
      scrambleTo();
      return;
    }

    const st = ScrollTrigger.create({
      trigger: node,
      start: "top 88%",
      once: true,
      onEnter: scrambleTo,
    });

    return () => {
      st.kill();
    };
  }, [text, immediate]);

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
