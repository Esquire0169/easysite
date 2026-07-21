"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { enableScrollDebugIfNeeded } from "@/lib/enableScrollDebug";
import { prefersReducedMotion } from "@/lib/motion";
import { SCROLL_PATTERNS } from "@/lib/scrollPatterns";

/**
 * Reliable home motion (animation-library patterns, no content-hiding pins):
 * - progress bar while hero is in view
 * - data-speed parallax on decorations only
 * - soft rise for [data-scroll-rise]
 *
 * Feature / pillar cards: owned by ThreePillars (fly-in) — do not batch here.
 *
 * HARD RULE: never pin the hero, never set the offer headline to opacity 0.
 */
export function HomeScroll() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    enableScrollDebugIfNeeded();

    if (prefersReducedMotion()) {
      gsap.set(["[data-speed]", ".hero-progress-bar"], {
        clearProps: "all",
      });
      return;
    }

    const ctx = gsap.context(() => {
      /* 1) Hero progress — scrub without pin */
      const hero = document.querySelector<HTMLElement>(".hero");
      const progressBar = document.querySelector<HTMLElement>(
        ".hero-progress-bar",
      );

      if (hero && progressBar) {
        gsap.fromTo(
          progressBar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.4,
            },
          },
        );
      }

      /* 2) Parallax decorations */
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        const speed = Number(el.dataset.speed ?? "1");
        const travel = (1 - speed) * SCROLL_PATTERNS.parallaxTravel;

        gsap.to(el, {
          y: travel,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* 3) Soft rise for marked sections */
      gsap.utils.toArray<HTMLElement>("[data-scroll-rise]").forEach((el) => {
        gsap.from(el, {
          y: 48,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
      window.setTimeout(() => ScrollTrigger.refresh(), 250);
    });

    const onReady = () => ScrollTrigger.refresh();
    window.addEventListener("easysite:ready", onReady);

    return () => {
      window.removeEventListener("easysite:ready", onReady);
      ctx.revert();
    };
  }, []);

  return null;
}
