"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "@/lib/motion";

type StaggerInProps = {
  children: ReactNode;
  className?: string;
  /** Selector for children to animate inside the container */
  itemSelector?: string;
  from?: "start" | "random";
};

/** Random/start stagger scale-in — adapted from 13g press cards. */
export function StaggerIn({
  children,
  className = "",
  itemSelector = "[data-stagger-item]",
  from = "random",
}: StaggerInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const items = root.querySelectorAll(itemSelector);
    if (!items.length) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { clearProps: "all", opacity: 1, scale: 1 });
      return;
    }

    const targets =
      from === "random" ? gsap.utils.shuffle(Array.from(items)) : items;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        scale: 0.94,
        opacity: 0,
        y: 28,
        duration: 1.05,
        ease: EASE.soft,
        immediateRender: false,
        stagger: { amount: 0.65, from: from === "random" ? "random" : "start" },
      });
    }, root);

    return () => ctx.revert();
  }, [from, itemSelector]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
