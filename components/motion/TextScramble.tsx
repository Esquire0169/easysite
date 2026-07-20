"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin, ScrollTrigger);

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЫЭЮЯ0123456789";

type TextScrambleProps = {
  text: string;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  /** Play on mount instead of scroll */
  immediate?: boolean;
};

/** ScrambleTextPlugin reveal — mega-text-scramble. */
export function TextScramble({
  text,
  className = "",
  as: Tag = "span",
  immediate = false,
}: TextScrambleProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      if (prefersReducedMotion()) {
        node.textContent = text;
        return;
      }

      const scrambleTo = () => {
        gsap.to(node, {
          duration: MOTION.duration.scramble,
          scrambleText: {
            text,
            chars: CHARS,
            speed: 0.55,
            revealDelay: 0.12,
          },
          ease: "none",
        });
      };

      if (immediate) {
        scrambleTo();
        return;
      }

      ScrollTrigger.create({
        trigger: node,
        start: "top 88%",
        once: true,
        onEnter: scrambleTo,
      });
    },
    { dependencies: [text, immediate] },
  );

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
