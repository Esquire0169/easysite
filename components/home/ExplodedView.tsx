"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  addLetterShatter,
  collectShatterLetters,
  resetShatterLetters,
  TextShatter,
} from "@/components/motion/TextShatter";
import {
  ArrowIcon,
  ArrowUpRightIcon,
  ChevronIcon,
  LogoMark,
} from "@/components/ui/icons";
import { megaMenus } from "@/lib/nav";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Explosion offsets per layer — site mock (nav → footer).
 * Tuned for a ~920×620 scene so pieces fan out clearly in 3D.
 */
const LAYER_CONFIGS = [
  /* 0 navbar pills   */ { i: 0, z: 560, x: 70, y: -130, rx: -8, ry: 12, delay: 0 },
  /* 1 mega panel     */ { i: 1, z: 620, x: -50, y: -80, rx: 10, ry: -10, delay: 0.04 },
  /* 2 hero copy      */ { i: 2, z: 640, x: -70, y: -200, rx: 18, ry: -8, delay: 0.08 },
  /* 3 hero CTAs      */ { i: 3, z: 560, x: 120, y: -70, rx: -10, ry: 10, delay: 0.12 },
  /* 4 marquee        */ { i: 4, z: 420, x: -130, y: -20, rx: 8, ry: -12, delay: 0.16 },
  /* 5 feature cards  */ { i: 5, z: 580, x: 50, y: 50, rx: -14, ry: 8, delay: 0.22 },
  /* 6 stats strip    */ { i: 6, z: 460, x: -90, y: 100, rx: 10, ry: -10, delay: 0.28 },
  /* 7 footer         */ { i: 7, z: 340, x: 70, y: 150, rx: -8, ry: 6, delay: 0.34 },
] as const;

const NAV_LABELS = megaMenus.map((m) => m.label);
const SERVICE_MENU = megaMenus[0];

const MARQUEE_ITEMS = [
  "бриф → дизайн → код",
  "хостинг в комплекте",
  "домен easysite",
  "запуск за сутки",
  "один пакет — готово",
] as const;

const FEATURES = [
  { title: "Скорость", text: "Запуск за сутки" },
  { title: "Железо", text: "Хостинг + SSL" },
  { title: "Фикс", text: "10 000 ₽ — точка" },
] as const;

const STATS = [
  { value: "24ч", label: "срок" },
  { value: "10к", label: "цена" },
  { value: "0", label: "правок" },
  { value: "1", label: "выстрел" },
] as const;

const FULLSCREEN_CLASS = "exploded-fullscreen";

/** Working mock size — matches CSS `min(920px, 88vw)` / `min(620px, 70vh)`. */
const workingWidth = () => Math.min(920, window.innerWidth * 0.88);
const workingHeight = () => Math.min(620, window.innerHeight * 0.7);

/**
 * Pin + scrub 3D “exploded” site mock.
 *
 * Timeline: 1:1 fullscreen → shrink → explode → offer → hold → evaporate → lift → shatter.
 * Evaporate dissolves only the tilted glass panel (scene); offer copy stays
 * briefly, lifts higher, then letters crumble so ThreePillars never follows a blank purple void.
 * Real site header hides only while this section is pinned in the
 * pre-shrink fullscreen phase — never while Hero still owns the viewport.
 */
export function ExplodedView() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = wrapperRef.current;
    const scene = sceneRef.current;
    const finalText = finalRef.current;
    const panel = panelRef.current;
    if (!wrapper || !scene || !finalText || !panel) return;

    const layers = () =>
      layersRef.current.filter(Boolean) as HTMLDivElement[];

    /**
     * Hide real site header only while the mock is pinned 1:1 fullscreen.
     * Always sync the DOM class (never early-return on local state alone) —
     * HMR / Strict Mode / mid-layout refresh can leave html.exploded-fullscreen
     * stuck while Hero still owns the viewport.
     */
    const setFullscreenChrome = (hidden: boolean) => {
      document.documentElement.classList.toggle(FULLSCREEN_CLASS, hidden);
      const header = document.querySelector<HTMLElement>(".site-header");
      if (header) {
        if (hidden) header.setAttribute("aria-hidden", "true");
        else header.removeAttribute("aria-hidden");
      }
    };

    const restoreChrome = () => setFullscreenChrome(false);

    // Hard reset on mount — never inherit a leftover class from a prior instance.
    restoreChrome();

    /** Offer copy fully readable. Never tied to panel opacity.
     *  Does not reset y — lift/shatter owns vertical position. */
    const showFinal = () => {
      gsap.set(finalText, {
        autoAlpha: 1,
        clearProps: "visibility",
      });
    };

    /** Offer copy hidden, ready to fade in from below. */
    const hideFinal = () => {
      gsap.set(finalText, { autoAlpha: 0, y: 28, scale: 1 });
    };

    /** Glass panel + scene evaporated; copy stays visible. */
    const evaporatePanel = () => {
      gsap.set(panel, { autoAlpha: 0, y: -20, scale: 1.1 });
      gsap.set(scene, { autoAlpha: 0 });
    };

    const showPanel = () => {
      gsap.set(panel, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        clearProps: "visibility",
      });
    };

    const showScene = () => {
      gsap.set(scene, { autoAlpha: 1, clearProps: "visibility" });
      showPanel();
    };

    const resetLayers = () => {
      layers().forEach((el) => {
        gsap.set(el, {
          x: 0,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          clearProps: "visibility",
        });
      });
    };

    const resetMock = (mode: "fullscreen" | "shrunk" | "neutral" = "neutral") => {
      if (mode === "fullscreen") {
        gsap.set(scene, {
          width: window.innerWidth,
          height: window.innerHeight,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          autoAlpha: 1,
          transformOrigin: "50% 50%",
        });
      } else if (mode === "shrunk") {
        gsap.set(scene, {
          width: workingWidth(),
          height: workingHeight(),
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          autoAlpha: 1,
          transformOrigin: "50% 50%",
        });
      } else {
        gsap.set(scene, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          autoAlpha: 1,
          transformOrigin: "50% 50%",
          clearProps: "width,height",
        });
      }
      showPanel();
      resetLayers();
    };

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        resetMock("shrunk");
        showPanel();
        showFinal();
        gsap.set(finalText, { y: 0, scale: 1 });
        restoreChrome();
        return;
      }

      // Visible until ScrollTrigger owns the scene (avoids stuck opacity 0).
      resetMock("shrunk");
      showPanel();
      showFinal();
      gsap.set(finalText, { y: 0, scale: 1 });
      restoreChrome();
      gsap.set(finalText, { transformOrigin: "50% 45%" });
      gsap.set(panel, { transformOrigin: "50% 45%" });

      mm.add("(min-width: 768px)", () => {
        hideFinal();
        resetMock("fullscreen");

        // Progress thresholds — refined after timeline is built.
        let shrinkStartProgress = 0.23;
        let offerVisibleProgress = 0.55;
        let evaporateStartProgress = 0.75;
        let shatterStartProgress = 0.88;

        const shatterLetters = () => collectShatterLetters(finalText);

        const syncChromeFromProgress = (self: ScrollTrigger) => {
          // Hide real nav ONLY while this ST is active, the section is pinned
          // flush to the viewport top, and we are still in the pre-shrink
          // fullscreen hold. Failsafe: if ST is inactive, never keep the class
          // (covers mid-layout refresh that briefly reports progress while
          // Hero is still measuring / scrolling into place).
          if (!self.isActive) {
            restoreChrome();
            return;
          }
          const top = wrapper.getBoundingClientRect().top;
          const sectionPinnedFlush = top > -2 && top <= 1;
          // Require a tiny bit of pin progress so pure load/refresh at the
          // start boundary cannot hide the header on Hero.
          const inFullscreenHold =
            self.progress > 0.01 && self.progress < shrinkStartProgress;
          setFullscreenChrome(sectionPinnedFlush && inFullscreenHold);
        };

        const syncOfferFromProgress = (self: ScrollTrigger) => {
          // Scrub-lag failsafes: keep copy readable until shatter; force-hide
          // only the glass panel past dissolve.
          if (self.progress >= shatterStartProgress) {
            evaporatePanel();
            showFinal();
          } else if (self.progress >= evaporateStartProgress) {
            evaporatePanel();
            showFinal();
          } else if (
            self.progress >= offerVisibleProgress &&
            self.progress < evaporateStartProgress
          ) {
            showFinal();
            showScene();
          }
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            // Extra scroll room for hold + lift + evaporate + letter shatter.
            end: "+=480%",
            pin: true,
            pinSpacing: true,
            // Reparent while pinned so ancestor transforms (e.g. route shell)
            // cannot trap position:fixed and scroll the scene off-screen.
            pinReparent: true,
            scrub: 0.55,
            // No anticipatePin — early pin lead-in was hiding the real
            // header while Hero was still on screen.
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              syncChromeFromProgress(self);
              syncOfferFromProgress(self);
            },
            onLeave: () => {
              // Pin ends post-shatter — panel gone; letters fully crumbled.
              evaporatePanel();
              showFinal();
              restoreChrome();
            },
            onEnter: (self) => syncChromeFromProgress(self),
            onEnterBack: (self) => {
              syncChromeFromProgress(self);
              syncOfferFromProgress(self);
            },
            onRefresh: (self) => {
              syncChromeFromProgress(self);
              syncOfferFromProgress(self);
              if (self.progress <= 0.02) {
                resetMock("fullscreen");
                showPanel();
                hideFinal();
                resetShatterLetters(shatterLetters());
              }
            },
            onLeaveBack: () => {
              resetMock("fullscreen");
              showPanel();
              hideFinal();
              resetShatterLetters(shatterLetters());
              restoreChrome();
            },
          },
        });

        // ── Phase 1 (0–~23%): hold true 1:1 viewport ─────────────────
        // Literal viewport size at scale 1 — no cover-scale enlarge.
        tl.fromTo(
          scene,
          {
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            autoAlpha: 1,
            transformOrigin: "50% 50%",
          },
          {
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            autoAlpha: 1,
            duration: 0.9,
          },
          0,
        );

        // ── Phase 2 (~23–43%): shrink + mild tilt → working mock size ─
        tl.addLabel("shrink", 0.9);
        tl.fromTo(
          scene,
          {
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            autoAlpha: 1,
          },
          {
            width: () => workingWidth(),
            height: () => workingHeight(),
            scale: 1,
            rotateX: 10,
            rotateY: -4,
            autoAlpha: 1,
            duration: 0.75,
            onStart: () => restoreChrome(),
          },
          "shrink",
        );

        // ── Phase 3: explode + offer crossfade ───────────────────────
        // Deeper tilt / slight further shrink while layers fly
        tl.to(
          scene,
          {
            rotateX: 48,
            rotateY: -10,
            scale: 0.72,
            duration: 0.85,
          },
          1.65,
        );

        LAYER_CONFIGS.forEach(({ i, z, x, y, rx, ry, delay }) => {
          const el = layersRef.current[i];
          if (!el) return;
          tl.to(
            el,
            {
              z,
              x,
              y,
              rotateX: rx,
              rotateY: ry,
              scale: 1.08,
              duration: 1.1,
            },
            1.65 + delay,
          );
        });

        // Offer fades IN while layers still readable (crossfade)
        tl.addLabel("offerIn", 2.15);
        tl.to(
          finalText,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
          },
          "offerIn",
        );

        // Only after offer is mostly on, fade layers out
        LAYER_CONFIGS.forEach(({ i, delay }) => {
          const el = layersRef.current[i];
          if (!el) return;
          tl.to(
            el,
            {
              opacity: 0,
              duration: 0.55,
            },
            2.5 + delay * 0.35,
          );
        });

        // ── Phase 4: short hold — offer fully readable ───────────────
        tl.addLabel("offerHold", 3.15);
        tl.set(finalText, { autoAlpha: 1, y: 0, scale: 1 }, "offerHold");
        tl.set(panel, { autoAlpha: 1, y: 0, scale: 1 }, "offerHold");
        tl.to({}, { duration: 0.42 }, "offerHold");

        // ── Phase 5: evaporate glass panel only — copy stays ─────────
        // Transform + opacity only (no blur / no permanent will-change).
        tl.addLabel("evaporate", 3.57);
        tl.to(
          panel,
          {
            autoAlpha: 0,
            scale: 1.1,
            y: -20,
            duration: 0.7,
            ease: "power2.in",
          },
          "evaporate",
        );
        tl.to(
          scene,
          {
            autoAlpha: 0,
            duration: 0.7,
            ease: "power2.in",
          },
          "evaporate",
        );

        // ── Phase 6: brief text-only hold → lift higher → letter shatter ─
        // Lift gives letters more viewport room so the fall reads longer.
        tl.addLabel("offerAlone", 4.27);
        tl.set(finalText, { autoAlpha: 1, y: 0, scale: 1 }, "offerAlone");
        tl.to({}, { duration: 0.32 }, "offerAlone");

        tl.addLabel("lift", 4.59);
        tl.to(
          finalText,
          {
            y: -140,
            duration: 0.55,
            ease: "none",
          },
          "lift",
        );

        tl.addLabel("shatter", 5.0);
        addLetterShatter(tl, shatterLetters(), "shatter");

        shrinkStartProgress = tl.labels.shrink / tl.totalDuration();
        offerVisibleProgress = tl.labels.offerIn / tl.totalDuration();
        evaporateStartProgress = tl.labels.evaporate / tl.totalDuration();
        shatterStartProgress = tl.labels.shatter / tl.totalDuration();

        return () => {
          restoreChrome();
          const rect = wrapper.getBoundingClientRect();
          // Past the section: panel stays gone; copy may remain readable.
          if (rect.bottom < window.innerHeight * 0.4) {
            evaporatePanel();
            showFinal();
          }
        };
      });

      mm.add("(max-width: 767px)", () => {
        hideFinal();
        showPanel();
        restoreChrome();
        // Softer path: mild overscale, no fullscreen pin drama
        gsap.set(scene, {
          scale: 1.08,
          rotateX: 0,
          rotateY: 0,
          autoAlpha: 1,
          transformOrigin: "50% 50%",
          clearProps: "width,height",
        });
        resetLayers();

        let offerVisibleProgress = 0.55;
        let evaporateStartProgress = 0.72;
        let shatterStartProgress = 0.86;

        const shatterLetters = () => collectShatterLetters(finalText);

        const syncOfferFromProgress = (self: ScrollTrigger) => {
          if (self.progress >= shatterStartProgress) {
            evaporatePanel();
            showFinal();
          } else if (self.progress >= evaporateStartProgress) {
            evaporatePanel();
            showFinal();
          } else if (
            self.progress >= offerVisibleProgress &&
            self.progress < evaporateStartProgress
          ) {
            showFinal();
            showScene();
          }
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: wrapper,
            start: "top 70%",
            end: "bottom top",
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => syncOfferFromProgress(self),
            onLeave: () => {
              evaporatePanel();
              showFinal();
            },
            onRefresh: (self) => {
              syncOfferFromProgress(self);
              if (self.progress <= 0.02) {
                resetShatterLetters(shatterLetters());
              }
            },
            onLeaveBack: () => {
              gsap.set(scene, {
                scale: 1.08,
                rotateX: 0,
                rotateY: 0,
                autoAlpha: 1,
                clearProps: "width,height",
              });
              resetLayers();
              showPanel();
              hideFinal();
              resetShatterLetters(shatterLetters());
            },
          },
        });

        // Soft shrink toward working size
        tl.to(
          scene,
          {
            scale: 1,
            rotateX: 8,
            duration: 0.55,
          },
          0,
        );

        // Mild explode
        tl.to(
          scene,
          {
            rotateX: 22,
            scale: 0.88,
            duration: 0.7,
          },
          0.55,
        );

        LAYER_CONFIGS.forEach(({ i, z, x, y, delay }) => {
          const el = layersRef.current[i];
          if (!el) return;
          tl.to(
            el,
            {
              z: z * 0.28,
              x: x * 0.32,
              y: y * 0.28,
              duration: 1,
            },
            0.55 + delay * 0.4,
          );
        });

        tl.addLabel("offerIn", 1.1);
        tl.to(
          finalText,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
          },
          "offerIn",
        );

        LAYER_CONFIGS.forEach(({ i, delay }) => {
          const el = layersRef.current[i];
          if (!el) return;
          tl.to(
            el,
            {
              opacity: 0.2,
              duration: 0.45,
            },
            1.3 + delay * 0.2,
          );
        });

        // Short hold, then evaporate panel only
        tl.addLabel("offerHold", 1.8);
        tl.set(finalText, { autoAlpha: 1, y: 0, scale: 1 }, "offerHold");
        tl.set(panel, { autoAlpha: 1, y: 0, scale: 1 }, "offerHold");
        tl.to({}, { duration: 0.28 }, "offerHold");

        tl.addLabel("evaporate", 2.08);
        tl.to(
          panel,
          {
            autoAlpha: 0,
            scale: 1.08,
            y: -16,
            duration: 0.5,
            ease: "power2.in",
          },
          "evaporate",
        );
        tl.to(
          scene,
          {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          "evaporate",
        );

        tl.addLabel("offerAlone", 2.58);
        tl.set(finalText, { autoAlpha: 1, y: 0, scale: 1 }, "offerAlone");
        tl.to({}, { duration: 0.22 }, "offerAlone");

        tl.addLabel("lift", 2.8);
        tl.to(
          finalText,
          {
            y: -90,
            duration: 0.4,
            ease: "none",
          },
          "lift",
        );

        tl.addLabel("shatter", 3.1);
        addLetterShatter(tl, shatterLetters(), "shatter");

        offerVisibleProgress = tl.labels.offerIn / tl.totalDuration();
        evaporateStartProgress = tl.labels.evaporate / tl.totalDuration();
        shatterStartProgress = tl.labels.shatter / tl.totalDuration();
      });
    }, wrapper);

    const onReady = () => ScrollTrigger.refresh();
    window.addEventListener("easysite:ready", onReady);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const refreshLater = window.setTimeout(() => ScrollTrigger.refresh(), 300);

    // Failsafe: if the section is not flush with the viewport top, never
    // leave the header hidden (covers ST inactive / layout settle / HMR).
    const chromeFailsafe = () => {
      const top = wrapper.getBoundingClientRect().top;
      if (top > 1 || top < -2) restoreChrome();
    };
    window.addEventListener("scroll", chromeFailsafe, { passive: true });
    window.addEventListener("resize", chromeFailsafe);

    return () => {
      window.clearTimeout(refreshLater);
      window.removeEventListener("easysite:ready", onReady);
      window.removeEventListener("scroll", chromeFailsafe);
      window.removeEventListener("resize", chromeFailsafe);
      restoreChrome();
      mm.revert();
      ctx.revert();
    };
  }, []);

  const setLayer = (i: number) => (el: HTMLDivElement | null) => {
    layersRef.current[i] = el;
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-screen min-h-[100svh] overflow-hidden bg-cosmic"
      aria-label="Как EasySite собирает сайт"
    >
      {/* Offer copy — opacity independent of the glass panel.
          Panel lives inside the 3D scene; evaporate targets panel + scene only. */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-5">
        <div
          ref={finalRef}
          className="exploded-final-text flex flex-col items-center justify-center"
        >
          <TextShatter
            as="p"
            mode="external"
            accentDigits={false}
            text="Мы собираем всё это"
            className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-ember/80"
          />
          <TextShatter
            as="h2"
            mode="external"
            lines={[
              { text: "За 24 часа.", className: "text-vanilla" },
              { text: "За 10 000 ₽.", className: "text-ember" },
            ]}
            className="text-center font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-7xl"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 flex items-center justify-center px-3 sm:px-6"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 38%" }}
      >
        <div
          ref={sceneRef}
          className="exploded-scene relative shrink-0 rounded-none"
          style={{
            transformStyle: "preserve-3d",
            width: "min(920px, 88vw)",
            height: "min(620px, 70vh)",
            borderRadius: 0,
          }}
        >
          {/*
            Frame + fill stay on a non-clipping backdrop so exploded
            layers can fly past the sharp window edge.
            `.exploded-final-panel` is the evaporate unit (glass rect).
          */}
          <div
            ref={panelRef}
            className="exploded-final-panel pointer-events-none absolute inset-0 rounded-none border border-vanilla/20 bg-gradient-to-b from-cosmic-lift/40 via-cosmic-deep to-ink/40 shadow-[0_28px_80px_-12px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,242,117,0.06)]"
            aria-hidden
          />

          {/* 0 — Real EasySite navbar (pill + Заказать CTA) */}
          <div
            ref={setLayer(0)}
            className="exploded-nav absolute inset-x-0 top-[2.5%] z-[1] flex items-center justify-between gap-2 px-2.5 sm:px-4"
            style={{ transformStyle: "preserve-3d" }}
            aria-hidden
          >
            <div className="nav-pill flex min-w-0 items-center gap-0.5 rounded-full bg-[#24066e]/92 p-1 shadow-[0_8px_28px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vanilla text-cosmic sm:h-9 sm:w-9">
                <LogoMark size={14} />
              </span>
              <nav className="hidden items-center gap-0 sm:flex">
                {NAV_LABELS.map((label, idx) => (
                  <span
                    key={label}
                    className={[
                      "relative z-0 inline-flex h-8 items-center gap-1 rounded-full px-3 text-[11px] font-medium tracking-tight sm:h-9 sm:px-3.5 sm:text-[12px]",
                      idx === 0
                        ? "menu-btn menu-btn--active text-cosmic"
                        : "text-vanilla/70",
                    ].join(" ")}
                  >
                    <span className="relative z-10">{label}</span>
                    <span
                      className={[
                        "menu-btn__chevron relative z-10 inline-flex",
                        idx === 0 ? "rotate-180" : "",
                      ].join(" ")}
                    >
                      <ChevronIcon size={11} />
                    </span>
                  </span>
                ))}
              </nav>
            </div>

            <span className="menu-cta exploded-nav__cta shrink-0 !min-h-0 !gap-1.5 !py-1 !pl-3 !pr-1 text-[11px] sm:text-[12px]">
              <span className="menu-cta__text">
                <span className="menu-cta__text-track">
                  <span>Заказать</span>
                </span>
              </span>
              <span className="menu-cta__icon !h-6 !w-6" aria-hidden>
                <span className="menu-cta__icon-inner inline-flex">
                  <ArrowIcon size={11} />
                </span>
              </span>
            </span>
          </div>

          {/* 1 — Mega menu panel (Сервис open) */}
          <div
            ref={setLayer(1)}
            className="exploded-mega absolute left-[3%] right-[3%] top-[12%] z-[2] hidden sm:block"
            style={{ transformStyle: "preserve-3d" }}
            aria-hidden
          >
            <div className="mega-shell rounded-none border border-ink/50 bg-ink/95 px-4 py-4 shadow-[0_20px_50px_rgba(29,29,29,0.65)] backdrop-blur-xl sm:px-6 sm:py-5">
              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="inline-flex max-w-full items-center gap-2.5">
                    <span className="font-display text-[15px] font-semibold leading-tight tracking-tight text-vanilla sm:text-lg">
                      {SERVICE_MENU.title}
                    </span>
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vanilla text-cosmic">
                      <ArrowIcon size={12} />
                    </span>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {SERVICE_MENU.primary.map((item) => (
                      <li key={item.label}>
                        <span className="inline-flex items-center gap-1.5 font-display text-[13px] font-semibold tracking-tight text-vanilla sm:text-[15px]">
                          {item.label}
                          <ArrowUpRightIcon size={12} className="opacity-70" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="hidden md:block">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-vanilla/70">
                    {SERVICE_MENU.secondaryTitle}
                    <ArrowIcon size={10} />
                  </span>
                  <ul className="mt-2 border-t border-vanilla/15">
                    {SERVICE_MENU.secondary.map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center justify-between gap-2 border-b border-vanilla/15 py-1.5 text-[11px] text-vanilla/65"
                      >
                        {item.label}
                        <ArrowUpRightIcon size={11} className="opacity-50" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 2 — Hero brand + headline */}
          <div
            ref={setLayer(2)}
            className="absolute left-[4%] right-[4%] top-[42%] z-[3] sm:left-[5%] sm:top-[46%] md:right-[40%]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-vanilla/55 sm:text-xs">
              EasySite
            </p>
            <p className="mt-1.5 font-display text-[clamp(1.15rem,2.4vw,1.85rem)] font-semibold leading-[1.12] tracking-tight text-vanilla">
              Сайт за сутки.
              <br />
              <span className="text-ember">10 000 ₽.</span>
            </p>
            <p className="mt-2 max-w-md text-[12px] leading-relaxed text-vanilla/50 sm:text-[13px]">
              Бриф → дизайн → код → онлайн. Хостинг и домен — уже внутри.
            </p>
          </div>

          {/* 3 — Dual CTAs */}
          <div
            ref={setLayer(3)}
            className="absolute left-[4%] top-[62%] z-[4] flex flex-wrap items-center gap-2 sm:left-[5%] sm:top-[66%] sm:gap-2.5"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ember px-3.5 py-2 text-[12px] font-bold text-ink sm:px-4 sm:text-[13px]">
              Оставить заявку
              <ArrowIcon size={12} />
            </span>
            <span className="inline-flex items-center rounded-full border border-vanilla/20 bg-vanilla/[0.06] px-3.5 py-2 text-[12px] font-medium text-vanilla/70 sm:px-4 sm:text-[13px]">
              Правила
            </span>
          </div>

          {/* 4 — Marquee / key-ideas strip */}
          <div
            ref={setLayer(4)}
            className="absolute inset-x-0 top-[78%] z-[5] hidden overflow-hidden border-y border-vanilla/10 bg-ink/50 md:block"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center gap-6 whitespace-nowrap px-3 py-[0.45rem] sm:gap-8 sm:px-6">
              {MARQUEE_ITEMS.map((item) => (
                <span
                  key={item}
                  className="text-[11px] font-medium uppercase tracking-[0.14em] text-vanilla/40 sm:text-xs"
                >
                  <span className="mr-6 text-ember/70 sm:mr-8" aria-hidden>
                    ◆
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 5 — Three feature cards */}
          <div
            ref={setLayer(5)}
            className="absolute left-[4%] right-[4%] top-[78%] z-[6] grid grid-cols-3 gap-1.5 sm:left-[5%] sm:right-[5%] sm:gap-3 md:hidden"
            style={{ transformStyle: "preserve-3d" }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-none border border-vanilla/12 bg-cosmic-lift/35 p-2 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.4)]"
              >
                <div className="mb-1 h-1 w-7 rounded-full bg-ember/70" />
                <p className="text-[12px] font-semibold text-vanilla">{f.title}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-vanilla/40">
                  {f.text}
                </p>
              </div>
            ))}
          </div>

          {/* 6 — Stats strip (desktop) */}
          <div
            ref={setLayer(6)}
            className="absolute left-[4%] right-[4%] top-[86%] z-[7] hidden items-stretch overflow-hidden rounded-none border border-vanilla/10 bg-ink/40 md:left-[5%] md:right-[5%] md:flex"
            style={{ transformStyle: "preserve-3d" }}
          >
            {STATS.map((s, idx) => (
              <div
                key={s.label}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 px-2 py-1.5 ${
                  idx > 0 ? "border-l border-vanilla/10" : ""
                }`}
              >
                <span className="font-display text-sm font-semibold text-ember">
                  {s.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-vanilla/35">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* 7 — Footer bar */}
          <div
            ref={setLayer(7)}
            className="absolute inset-x-0 bottom-0 z-[8] flex h-[6.5%] min-h-8 items-center justify-between gap-3 rounded-none border-t border-vanilla/10 bg-ink/80 px-3 sm:px-6"
            style={{ transformStyle: "preserve-3d" }}
          >
            <p className="text-[11px] text-vanilla/35 sm:text-xs">
              © EasySite — Web Giants
            </p>
            <div className="flex items-center gap-3 text-[11px] text-vanilla/30 sm:gap-4 sm:text-xs">
              <span>Кейсы</span>
              <span>Контакты</span>
              <span className="hidden sm:inline">hello@easysite.ru</span>
            </div>
          </div>

          {/* Grounding glow under the window */}
          <div
            className="pointer-events-none absolute -bottom-10 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-full bg-ember/15 blur-2xl"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
