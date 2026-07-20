/**
 * Scroll / motion patterns from animation-library wired into EasySite.
 *
 * | Lab id                         | Where                                              |
 * |--------------------------------|----------------------------------------------------|
 * | gsap-markers-debug             | ?markers=1 → ScrollTrigger.defaults                |
 * | mega-reveal-reveal-42          | CaseCardMotion assemble                            |
 * | tigranz-image-mask-reveal      | CaseCardMotion / hpin [data-case-mask]             |
 * | mega-text-gradient-shine       | TextShine (.text-shine)                            |
 * | mega-text-scramble             | TextScramble                                       |
 * | gsap-plugin-textplugin         | TextCycle                                          |
 * | gsap-plugin-scrambletext       | TextScramble (custom stand-in)                     |
 * | gsap-cover-flow                | CasesCoverFlow                                     |
 * | mega-slider-drag               | CasesCoverFlow (Draggable + Inertia cover-flow)    |
 * | gsap-lag-trail                 | LagLayers [data-lag]                               |
 * | mega-transition-trans-extra-6  | RouteTransition wipe                               |
 * | mega-transition-pixelate       | RouteTransition pixels                             |
 * | gsap-gooey-overlay             | RouteTransition circle clip                        |
 * | gsap-observer-snap             | ?snap=1 → SnapSections                             |
 * | batch-reveal                   | HomeScroll feature cards                           |
 * | progress-scroll                | Hero progress bar                                  |
 */

export const SCROLL_PATTERNS = {
  batchStart: "top 88%",
  cardPop: {
    y: 120,
    scale: 0.9,
    duration: 0.95,
    stagger: 0.14,
    ease: "power4.out",
  },
  parallaxTravel: 160,
} as const;
