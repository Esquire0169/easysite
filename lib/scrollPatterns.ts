/**
 * Scroll / motion patterns from animation-library wired into EasySite.
 * Tokens live in `lib/motionSystem.ts` — this file keeps the inventory map
 * and re-exports SCROLL_PATTERNS for existing imports.
 *
 * | Lab id                         | Where                                              |
 * |--------------------------------|----------------------------------------------------|
 * | gsap-markers-debug             | ?markers=1 → ScrollTrigger.defaults                |
 * | mega-reveal-reveal-42          | CaseCardMotion assemble                            |
 * | tigranz-image-mask-reveal      | CaseCardMotion / hpin [data-case-mask]             |
 * | mega-text-gradient-shine       | TextShine (.text-shine)                            |
 * | mega-text-scramble             | TextScramble (ScrambleTextPlugin)                  |
 * | gsap-plugin-textplugin         | TextCycle                                          |
 * | gsap-plugin-scrambletext       | TextScramble                                       |
 * | gsap-cover-flow                | CasesCoverFlow (Flip + rotateY settle)             |
 * | gsap-lag-trail                 | LagLayers [data-lag]                               |
 * | gsap-observer-snap             | ?snap=1 → SnapSections                             |
 * | batch-reveal                   | HomeScroll feature / how / case cards              |
 * | progress-scroll                | Hero progress bar (scrub, ease none)               |
 * | soft-rise                      | HomeScroll [data-scroll-rise]                      |
 * | parallax-speed                 | HomeScroll [data-speed] decorations                |
 * | grow-line-scrub                | GrowLine / how-stage fill                          |
 * | how-pin-stage                  | HomeScroll desktop how pin (children only)         |
 * | split-text-hero                | Hero enter (SplitText words)                       |
 *
 * Motifs (keep intentional, not noisy):
 * 1) hero enter + scrub progress / illustration
 * 2) batch card pop + shine settle
 * 3) how pin stage (desktop) / soft rise + decoration parallax
 */

import { MOTION } from "@/lib/motionSystem";

export const SCROLL_PATTERNS = {
  batchStart: MOTION.batch.start,
  cardPop: {
    y: MOTION.cardPop.y,
    scale: MOTION.cardPop.scale,
    duration: MOTION.cardPop.duration,
    stagger: MOTION.cardPop.stagger,
    ease: MOTION.cardPop.ease,
    rotate: MOTION.cardPop.rotate,
  },
  howStep: { ...MOTION.howStep },
  softRise: { ...MOTION.softRise },
  heroIllustration: { ...MOTION.heroIllustration },
  parallaxTravel: MOTION.parallaxTravel,
  refreshPriority: { ...MOTION.refreshPriority },
  batch: { ...MOTION.batch },
} as const;
