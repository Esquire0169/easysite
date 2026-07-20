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
 * - ScrollTrigger.batch card pop
 * - data-speed parallax on decorations only
 *
 * HARD RULE: never pin the hero, never set the offer headline to opacity 0.
 */
export function HomeScroll() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    enableScrollDebugIfNeeded();

    if (prefersReducedMotion()) {
      gsap.set([".feature-card", "[data-speed]", ".hero-progress-bar"], {
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

      /* 2) Feature cards — batch pop (library: batch-reveal) */
      const featureCards = gsap.utils.toArray<HTMLElement>(
        ".section-features .feature-card",
      );

      if (featureCards.length) {
        // Ensure visible by default before animation
        gsap.set(featureCards, { autoAlpha: 1, y: 0, scale: 1 });

        const intro = gsap.utils.toArray<HTMLElement>(
          ".section-features [data-features-intro]",
        );

        if (intro.length) {
          gsap.from(intro, {
            y: 40,
            autoAlpha: 0,
            stagger: 0.07,
            duration: 0.85,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: ".section-features",
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }

        ScrollTrigger.batch(featureCards, {
          start: SCROLL_PATTERNS.batchStart,
          once: true,
          onEnter: (batch) => {
            const pop = SCROLL_PATTERNS.cardPop;
            gsap.fromTo(
              batch,
              {
                y: pop.y,
                scale: pop.scale,
                autoAlpha: 0,
                rotate: -1.2,
              },
              {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                rotate: 0,
                duration: pop.duration,
                stagger: pop.stagger,
                ease: pop.ease,
                overwrite: "auto",
              },
            );

            batch.forEach((card) => {
              const inner = card.querySelector("[data-feature-inner]");
              if (!inner) return;
              gsap.fromTo(
                inner,
                { y: 28, scale: 0.95 },
                {
                  y: 0,
                  scale: 1,
                  duration: 1,
                  delay: 0.06,
                  ease: "power3.out",
                },
              );
            });
          },
        });

        // Failsafe — cards must never stay invisible
        window.setTimeout(() => {
          featureCards.forEach((card) => {
            const op = Number(gsap.getProperty(card, "opacity"));
            if (op < 0.5) {
              gsap.set(card, {
                clearProps: "transform,opacity,visibility",
                autoAlpha: 1,
                y: 0,
                scale: 1,
              });
            }
          });
        }, 2000);
      }

      /* 3) Parallax decorations */
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

      /* 4) Soft rise for marked sections */
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
