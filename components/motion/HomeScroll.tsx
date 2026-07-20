"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { enableScrollDebugIfNeeded } from "@/lib/enableScrollDebug";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";
import { SCROLL_PATTERNS } from "@/lib/scrollPatterns";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Home scroll story (animation-library patterns, no content-hiding pins):
 * - progress bar + illustration scrub while hero is in view
 * - ScrollTrigger.batch card / step pops + feature shine settle
 * - desktop how-stage pin (children only: fill + accents)
 * - data-speed parallax on decorations only
 * - soft rise for [data-scroll-rise]
 *
 * HARD RULE: never pin the hero, never set the offer headline to opacity 0.
 */
export function HomeScroll() {
  useGSAP(() => {
    enableScrollDebugIfNeeded();

    if (prefersReducedMotion()) {
      gsap.set(
        [
          ".feature-card",
          "[data-speed]",
          "[data-how-step]",
          "[data-how-fill]",
          "[data-scroll-item]",
          "[data-scroll-rise]",
          ".hero-progress-bar",
          ".hero-illustration-motion",
          ".hero-cta",
          ".hero-progress",
          ".section-stats",
          "[data-feature-shine]",
        ],
        { clearProps: "all" },
      );
      return;
    }

    const P = SCROLL_PATTERNS.refreshPriority;

    const clearStuck = (els: HTMLElement[]) => {
      window.setTimeout(() => {
        els.forEach((el) => {
          const op = Number(gsap.getProperty(el, "opacity"));
          if (op < 0.5) {
            gsap.set(el, {
              clearProps: "transform,opacity,visibility",
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotate: 0,
            });
          }
        });
      }, 2000);
    };

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
          ease: MOTION.ease.none,
          scrollTrigger: {
            trigger: hero,
            start: "clamp(top top)",
            end: "clamp(bottom top)",
            scrub: 0.4,
            refreshPriority: P.hero,
          },
        },
      );
    }

    /* 1b) Hero illustration — scale / y on shapes layer only (not headline) */
    const heroMotion = document.querySelector<HTMLElement>(
      ".hero-illustration-motion",
    );
    if (hero && heroMotion) {
      const illo = SCROLL_PATTERNS.heroIllustration;
      gsap.fromTo(
        heroMotion,
        { y: 0, scale: illo.scaleFrom },
        {
          y: illo.y,
          scale: illo.scaleTo,
          ease: MOTION.ease.none,
          scrollTrigger: {
            trigger: hero,
            start: "clamp(top top)",
            end: "clamp(bottom top)",
            scrub: 0.55,
            refreshPriority: P.hero + 1,
          },
        },
      );
    }

    /* 1c) Subtle cue drift — CTA + scroll cue only, never headline opacity */
    const heroCue = gsap.utils.toArray<HTMLElement>(
      ".hero-cta, .hero-progress",
    );
    if (hero && heroCue.length) {
      gsap.to(heroCue, {
        y: 28,
        ease: MOTION.ease.none,
        scrollTrigger: {
          trigger: hero,
          start: "clamp(top top)",
          end: "clamp(bottom top)",
          scrub: 0.5,
          refreshPriority: P.hero + 2,
        },
      });
    }

    /* 2) Feature cards — batch pop + inner shine settle */
    const featureCards = gsap.utils.toArray<HTMLElement>(
      ".section-features .feature-card",
    );

    if (featureCards.length) {
      gsap.set(featureCards, { autoAlpha: 1, y: 0, scale: 1, rotate: 0 });

      const intro = gsap.utils.toArray<HTMLElement>(
        ".section-features [data-features-intro]",
      );

      if (intro.length) {
        gsap.from(intro, {
          y: 36,
          autoAlpha: 0,
          stagger: 0.07,
          duration: 0.85,
          ease: MOTION.ease.out,
          immediateRender: false,
          scrollTrigger: {
            trigger: ".section-features",
            start: "clamp(top 80%)",
            toggleActions: "play none none none",
            refreshPriority: P.features,
          },
        });
      }

      ScrollTrigger.batch(featureCards, {
        start: SCROLL_PATTERNS.batchStart,
        once: true,
        interval: SCROLL_PATTERNS.batch.interval,
        batchMax: SCROLL_PATTERNS.batch.batchMax,
        onEnter: (batch) => {
          const pop = SCROLL_PATTERNS.cardPop;
          gsap.fromTo(
            batch,
            {
              y: pop.y,
              scale: pop.scale,
              autoAlpha: 0,
              rotate: pop.rotate,
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

          batch.forEach((card, i) => {
            const inner = card.querySelector("[data-feature-inner]");
            if (inner) {
              gsap.fromTo(
                inner,
                { y: 22, scale: 0.96 },
                {
                  y: 0,
                  scale: 1,
                  duration: 0.95,
                  delay: 0.05 + i * 0.04,
                  ease: MOTION.ease.out,
                },
              );
            }

            const shine = card.querySelector<HTMLElement>(
              "[data-feature-shine]",
            );
            if (shine) {
              gsap.fromTo(
                shine,
                { xPercent: -120, autoAlpha: 0.55 },
                {
                  xPercent: 120,
                  autoAlpha: 0,
                  duration: 0.9,
                  delay: 0.12 + i * 0.05,
                  ease: MOTION.ease.inOut,
                },
              );
            }
          });
        },
      });

      clearStuck(featureCards);
    }

    /* 3) How steps — desktop pin stage / mobile batch */
    const howStage = document.querySelector<HTMLElement>("[data-how-stage]");
    const howSteps = gsap.utils.toArray<HTMLElement>(
      ".section-how [data-how-step]",
    );
    const howFill = document.querySelector<HTMLElement>("[data-how-fill]");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (!howStage || howSteps.length < 2) return;

      // Always readable — never autoAlpha 0 on step cards
      gsap.set(howSteps, { autoAlpha: 1, y: 0, scale: 1 });
      if (howFill) gsap.set(howFill, { scaleX: 0, transformOrigin: "left center" });

      howSteps.forEach((step, i) => {
        const num = step.querySelector<HTMLElement>("[data-how-num]");
        gsap.set(step, { scale: i === 0 ? 1.02 : 0.98, y: i === 0 ? -4 : 0 });
        if (num) {
          gsap.set(num, {
            scale: i === 0 ? 1.08 : 1,
            opacity: i === 0 ? 1 : 0.72,
          });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: howStage,
          start: "clamp(top 14%)",
          end: () =>
            `+=${gsap.utils.clamp(520, 960, window.innerHeight * 1.05)}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          refreshPriority: P.how,
        },
      });

      if (howFill) {
        tl.to(howFill, { scaleX: 1, ease: MOTION.ease.none }, 0);
      }

      const seg = 1 / Math.max(howSteps.length - 1, 1);

      howSteps.forEach((step, i) => {
        if (i === 0) return;
        const prev = howSteps[i - 1]!;
        const prevNum = prev.querySelector<HTMLElement>("[data-how-num]");
        const num = step.querySelector<HTMLElement>("[data-how-num]");
        const at = (i - 1) * seg;

        tl.to(
          prev,
          { scale: 0.98, y: 0, duration: seg, ease: MOTION.ease.none },
          at,
        );
        if (prevNum) {
          tl.to(
            prevNum,
            { scale: 1, opacity: 0.72, duration: seg, ease: MOTION.ease.none },
            at,
          );
        }
        tl.to(
          step,
          { scale: 1.02, y: -4, duration: seg, ease: MOTION.ease.none },
          at,
        );
        if (num) {
          tl.to(
            num,
            { scale: 1.08, opacity: 1, duration: seg, ease: MOTION.ease.none },
            at,
          );
        }
      });

      return () => {
        gsap.set(howSteps, { clearProps: "transform" });
        howSteps.forEach((step) => {
          const num = step.querySelector<HTMLElement>("[data-how-num]");
          if (num) gsap.set(num, { clearProps: "transform,opacity" });
        });
      };
    });

    mm.add("(max-width: 1023px)", () => {
      if (!howSteps.length) return;
      gsap.set(howSteps, { autoAlpha: 1, y: 0 });

      ScrollTrigger.batch(howSteps, {
        start: SCROLL_PATTERNS.batchStart,
        once: true,
        interval: SCROLL_PATTERNS.batch.interval,
        batchMax: 4,
        onEnter: (batch) => {
          const step = SCROLL_PATTERNS.howStep;
          gsap.fromTo(
            batch,
            { y: step.y, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: step.duration,
              stagger: step.stagger,
              ease: step.ease,
              overwrite: "auto",
            },
          );
        },
      });

      clearStuck(howSteps);
    });

    /* 4) Case / generic preview cards */
    const scrollItems = gsap.utils.toArray<HTMLElement>("[data-scroll-item]");

    if (scrollItems.length) {
      gsap.set(scrollItems, { autoAlpha: 1, y: 0, scale: 1 });

      ScrollTrigger.batch(scrollItems, {
        start: SCROLL_PATTERNS.batchStart,
        once: true,
        interval: SCROLL_PATTERNS.batch.interval,
        batchMax: SCROLL_PATTERNS.batch.batchMax,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 40, autoAlpha: 0, scale: 0.97 },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.85,
              stagger: 0.09,
              ease: MOTION.ease.out,
              overwrite: "auto",
            },
          );
        },
      });

      clearStuck(scrollItems);
    }

    /* 5) Stats — light scale presence (count-up lives in StatsStrip) */
    const stats = document.querySelector<HTMLElement>(".section-stats");
    if (stats) {
      gsap.from(stats, {
        y: 20,
        scale: 0.98,
        duration: 0.85,
        ease: MOTION.ease.out,
        immediateRender: false,
        scrollTrigger: {
          trigger: stats,
          start: "clamp(top 90%)",
          toggleActions: "play none none none",
          refreshPriority: P.stats,
        },
      });
    }

    /* 6) Parallax decorations — scrub ease none */
    gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el, i) => {
      const speed = Number(el.dataset.speed ?? "1");
      const travel = (1 - speed) * SCROLL_PATTERNS.parallaxTravel;

      gsap.to(el, {
        y: travel,
        ease: MOTION.ease.none,
        scrollTrigger: {
          trigger: el.closest("section") ?? el,
          start: "clamp(top bottom)",
          end: "clamp(bottom top)",
          scrub: true,
          refreshPriority: P.parallax + i,
        },
      });
    });

    /* 7) Soft rise — toggleActions only (no scrub) */
    gsap.utils.toArray<HTMLElement>("[data-scroll-rise]").forEach((el, i) => {
      const rise = SCROLL_PATTERNS.softRise;
      gsap.from(el, {
        y: rise.y,
        autoAlpha: 0,
        duration: rise.duration,
        ease: rise.ease,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: "clamp(top 88%)",
          toggleActions: "play none none none",
          refreshPriority: P.softRise + i,
        },
      });
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.setTimeout(() => ScrollTrigger.refresh(), 250);

    const onReady = () => ScrollTrigger.refresh();
    window.addEventListener("easysite:ready", onReady);

    return () => {
      window.removeEventListener("easysite:ready", onReady);
      mm.revert();
    };
  }, []);

  return null;
}
