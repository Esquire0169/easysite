/**
 * EasySite signature motion system — shared eases, durations, ST priorities.
 *
 * Motifs (keep intentional, not noisy):
 * 1) Hero enter timeline + scrub illustration / progress (never pin hero, never kill h1)
 * 2) Batch card pop with micro settle (rotation + inner shine)
 * 3) How-it-works desktop pin stage (children only) / mobile batch
 * 4) Magnetic quickTo + lag layers
 *
 * HARD RULES: no scrub+toggleActions together; horizontal containerAnimation → ease none;
 * markers only via ?markers=1; prefers-reduced-motion clears props.
 */

export const MOTION = {
  ease: {
    out: "power3.out",
    soft: "power4.out",
    expo: "expo.out",
    inOut: "power3.inOut",
    spring: "elastic.out(1, 0.45)",
    none: "none",
    sine: "sine.inOut",
  },
  duration: {
    micro: 0.35,
    enter: 0.85,
    hero: 0.95,
    route: 0.32,
    assemble: 0.95,
    scramble: 1.05,
  },
  /** ScrollTrigger.batch defaults */
  batch: {
    start: "clamp(top 88%)",
    interval: 0.1,
    batchMax: 3,
  },
  cardPop: {
    y: 72,
    scale: 0.94,
    rotate: -1.2,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
  },
  howStep: {
    y: 48,
    duration: 0.85,
    stagger: 0.08,
    ease: "power3.out",
  },
  softRise: {
    y: 40,
    duration: 0.9,
    ease: "power3.out",
  },
  heroIllustration: {
    y: 56,
    scaleFrom: 1.05,
    scaleTo: 1,
  },
  route: {
    y: 14,
    duration: 0.32,
    ease: "power3.out",
  },
  magnetic: {
    duration: 0.55,
    ease: "power3.out",
    returnDuration: 1.15,
    returnEase: "elastic.out(1, 0.45)",
  },
  parallaxTravel: 140,
  /**
   * Lower = earlier on page. Refresh runs top → bottom
   * even if triggers are created out of DOM order.
   */
  refreshPriority: {
    hero: 0,
    features: 10,
    manifesto: 20,
    stats: 30,
    oneService: 40,
    how: 50,
    freeSites: 60,
    cases: 70,
    parallax: 80,
    softRise: 90,
  },
} as const;

export type MotionSystem = typeof MOTION;
