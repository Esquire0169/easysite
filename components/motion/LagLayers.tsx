"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * gsap-lag-trail — layers trail the scroll with different lag.
 * Targets [data-lag] elements (number = lag strength 0.1–1).
 */
export function LagLayers() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-lag]").forEach((el) => {
        const lag = Number(el.dataset.lag ?? "0.35");
        gsap.to(el, {
          y: () => lag * 140,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6 + lag,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
