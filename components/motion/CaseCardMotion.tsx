"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type CaseCardMotionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * mega-reveal-reveal-42 + tigranz-image-mask-reveal
 * Card assembles + media mask wipe on enter.
 */
export function CaseCardMotion({
  children,
  className = "",
}: CaseCardMotionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = ref.current;
      if (!node || prefersReducedMotion()) return;

      const media = node.querySelector<HTMLElement>("[data-case-mask]");
      const parts = node.querySelectorAll<HTMLElement>("[data-assemble]");

      gsap.from(node, {
        y: 56,
        scale: 0.92,
        autoAlpha: 0,
        rotateX: 6,
        duration: MOTION.duration.assemble,
        ease: MOTION.ease.soft,
        immediateRender: false,
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          toggleActions: "play none none none",
          refreshPriority: MOTION.refreshPriority.cases,
        },
      });

      if (parts.length) {
        gsap.from(parts, {
          y: 24,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 0.7,
          ease: MOTION.ease.out,
          immediateRender: false,
          scrollTrigger: {
            trigger: node,
            start: "top 86%",
            toggleActions: "play none none none",
            refreshPriority: MOTION.refreshPriority.cases + 1,
          },
        });
      }

      if (media) {
        gsap.fromTo(
          media,
          { clipPath: "inset(12% 12% 12% 12% round 12px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 1.05,
            ease: MOTION.ease.soft,
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              toggleActions: "play none none none",
              refreshPriority: MOTION.refreshPriority.cases + 2,
            },
          },
        );
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`h-full will-change-transform ${className}`}>
      {children}
    </div>
  );
}
