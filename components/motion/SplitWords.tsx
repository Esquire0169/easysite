"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

type SplitWordsProps = {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "p";
};

/** Word-by-word stagger reveal — 13g .tricksword style, without SplitType. */
export function SplitWords({
  text,
  className = "",
  as: Tag = "h2",
}: SplitWordsProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const inners = node.querySelectorAll<HTMLElement>(".split-word__inner");

    if (prefersReducedMotion()) {
      gsap.set(inners, { clearProps: "all", y: 0, opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(inners, {
        y: 28,
        opacity: 0,
        duration: 1.15,
        stagger: 0.04,
        ease: "power4.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });
    }, node);

    return () => ctx.revert();
  }, [text]);

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          {index > 0 ? " " : null}
          <span className="split-word inline-block whitespace-nowrap">
            <span className="split-word__inner inline-block">{word}</span>
          </span>
        </span>
      ))}
    </Tag>
  );
}
