"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

type CaseCardMotionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * mega-reveal-reveal-42 + tigranz-image-mask-reveal
 * Card assembles + media mask wipe on enter.
 */
export function CaseCardMotion({ children, className = "" }: CaseCardMotionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = node.querySelector<HTMLElement>("[data-case-mask]");
    const parts = node.querySelectorAll<HTMLElement>("[data-assemble]");

    const ctx = gsap.context(() => {
      gsap.from(node, {
        y: 56,
        scale: 0.92,
        autoAlpha: 0,
        rotateX: 6,
        duration: 0.95,
        ease: "power4.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: node,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      if (parts.length) {
        gsap.from(parts, {
          y: 24,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: node,
            start: "top 86%",
            toggleActions: "play none none none",
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
            ease: "power4.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, node);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={`h-full overflow-visible will-change-transform ${className}`}>
      {children}
    </div>
  );
}
