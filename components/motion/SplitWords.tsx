"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

type SplitWordsProps = {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p";
};

/** Word-by-word stagger reveal via SplitText. */
export function SplitWords({
  text,
  className = "",
  as: Tag = "h2",
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node) return;

      node.textContent = text;

      if (prefersReducedMotion()) return;

      const split = SplitText.create(node, {
        type: "words",
        wordsClass: "split-word",
      });

      gsap.from(split.words, {
        y: 28,
        autoAlpha: 0,
        duration: 1.15,
        stagger: 0.04,
        ease: MOTION.ease.soft,
        immediateRender: false,
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      return () => {
        split.revert();
      };
    },
    { dependencies: [text], scope: ref },
  );

  return <Tag ref={ref as never} className={className} />;
}
