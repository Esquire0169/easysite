"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { CaseItem } from "@/lib/cases";
import { categoryLabels } from "@/lib/cases";
import { ChevronIcon } from "@/components/ui/icons";
import { EASE, prefersReducedMotion } from "@/lib/motion";

type CasesCoverFlowProps = {
  items: CaseItem[];
};

const AUTO_MS = 4500;
const SPACING_DESKTOP = 210;
const SPACING_MOBILE = 168;
const CELL = 240;

function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches
  );
}

function wrapIndex(n: number, len: number) {
  return ((Math.round(n) % len) + len) % len;
}

/**
 * mega-slider-drag — 3D cover-flow carousel with drag scrub, dots, and gentle autoplay.
 * Pointer/touch drag + keyboard + dots (not scroll-scrubbed).
 */
export function CasesCoverFlow({ items }: CasesCoverFlowProps) {
  const slice = items.slice(0, 8);
  const len = slice.length;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const indexRef = useRef(0);
  const dragMovedRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const reducedRef = useRef(false);
  const flatRef = useRef(false);
  const layoutRef = useRef<(progress: number) => void>(() => {});

  const [index, setIndex] = useState(0);

  const syncIndex = useCallback(
    (next: number) => {
      const wrapped = wrapIndex(next, len);
      if (indexRef.current === wrapped) return;
      indexRef.current = wrapped;
      setIndex(wrapped);
    },
    [len],
  );

  const layout = useCallback(
    (progress: number) => {
      const cards = cardsRef.current;
      if (!cards.length || !len) return;

      const spacing = flatRef.current ? SPACING_MOBILE : SPACING_DESKTOP;
      const flat = flatRef.current || reducedRef.current;

      cards.forEach((card, i) => {
        if (!card) return;

        let d = i - progress;
        while (d > len / 2) d -= len;
        while (d < -len / 2) d += len;

        const abs = Math.abs(d);
        const x = d * spacing;
        const rotateY = flat ? 0 : gsap.utils.clamp(-55, 55, d * -32);
        const z = flat ? 0 : -abs * 110;
        const scale = flat
          ? gsap.utils.clamp(0.88, 1, 1 - abs * 0.08)
          : gsap.utils.clamp(0.72, 1, 1 - abs * 0.1);
        const opacity =
          abs > 2.4 ? 0 : gsap.utils.clamp(0.28, 1, 1 - abs * 0.28);
        const zIndex = Math.round(40 - abs * 10);
        const isFront = abs < 0.55;

        card.style.pointerEvents = isFront ? "auto" : "none";
        card.setAttribute("aria-hidden", isFront ? "false" : "true");
        card.tabIndex = isFront ? 0 : -1;

        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x,
          y: 0,
          z,
          rotateY,
          scale,
          opacity,
          zIndex,
          transformPerspective: flat ? 0 : 1200,
          force3D: !flat,
        });
      });
    },
    [len],
  );

  // Sync during render so mount layout effect never calls a noop stub.
  layoutRef.current = layout;

  const goTo = useCallback(
    (raw: number, { animate = true, fromUser = false } = {}) => {
      if (!len) return;
      if (fromUser) pauseUntilRef.current = Date.now() + AUTO_MS * 2;

      const proxy = proxyRef.current;
      const apply = layoutRef.current;

      if (!proxy) {
        syncIndex(raw);
        apply(raw);
        return;
      }

      const current = -Number(gsap.getProperty(proxy, "x")) / CELL;
      let target = raw;
      while (target - current > len / 2) target -= len;
      while (target - current < -len / 2) target += len;

      const x = -target * CELL;

      if (!animate || reducedRef.current) {
        gsap.set(proxy, { x });
        apply(target);
        syncIndex(target);
        return;
      }

      gsap.to(proxy, {
        x,
        duration: 0.7,
        ease: EASE.out,
        overwrite: true,
        onUpdate: () => {
          apply(-Number(gsap.getProperty(proxy, "x")) / CELL);
        },
        onComplete: () => {
          const normalized = wrapIndex(target, len);
          gsap.set(proxy, { x: -normalized * CELL });
          apply(normalized);
          syncIndex(normalized);
        },
      });
    },
    [len, syncIndex],
  );

  const go = useCallback(
    (dir: -1 | 1) => {
      goTo(indexRef.current + dir, { fromUser: true });
    },
    [goTo],
  );

  useLayoutEffect(() => {
    if (!len) return;

    reducedRef.current = prefersReducedMotion();
    flatRef.current = isMobileViewport();

    const stage = stageRef.current;
    if (!stage) return;

    // Cover-flow layout first — independent of plugins / scroll gates.
    const applyInitial = () => {
      cardsRef.current.forEach((card) => {
        if (card) gsap.set(card, { autoAlpha: 1 });
      });
      layout(0);
    };
    applyInitial();
    const raf = window.requestAnimationFrame(applyInitial);

    const onResize = () => {
      const nextFlat = isMobileViewport();
      if (nextFlat !== flatRef.current) {
        flatRef.current = nextFlat;
        layout(
          proxyRef.current
            ? -Number(gsap.getProperty(proxyRef.current, "x")) / CELL
            : indexRef.current,
        );
      }
    };
    window.addEventListener("resize", onResize);

    if (reducedRef.current) {
      return () => {
        window.cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
    }

    gsap.registerPlugin(Draggable, InertiaPlugin);

    const proxy = document.createElement("div");
    proxyRef.current = proxy;
    gsap.set(proxy, { x: 0 });

    const applyFromProxy = () => {
      const progress = -Number(gsap.getProperty(proxy, "x")) / CELL;
      layout(progress);
      syncIndex(progress);
    };

    const normalizeProxy = () => {
      const progress = -Number(gsap.getProperty(proxy, "x")) / CELL;
      const snapped = Math.round(progress);
      const normalized = wrapIndex(snapped, len);
      gsap.set(proxy, { x: -normalized * CELL });
      layout(normalized);
      syncIndex(normalized);
    };

    const mobile = flatRef.current;

    const [draggable] = Draggable.create(proxy, {
      type: "x",
      trigger: stage,
      inertia: !mobile,
      dragResistance: mobile ? 0.22 : 0.12,
      // Let vertical page scroll win until a clear horizontal intent.
      minimumMovement: mobile ? 14 : 4,
      allowNativeTouchScrolling: true,
      allowContextMenu: true,
      onPress() {
        dragMovedRef.current = false;
        pauseUntilRef.current = Date.now() + AUTO_MS * 3;
        gsap.killTweensOf(proxy);
      },
      onDrag() {
        if (Math.abs(this.deltaX) > (mobile ? 10 : 4)) {
          dragMovedRef.current = true;
        }
        applyFromProxy();
      },
      onThrowUpdate: applyFromProxy,
      onThrowComplete: normalizeProxy,
      onDragEnd() {
        // Tiny throws may skip inertia — still snap to a slide
        if (!this.tween) normalizeProxy();
      },
      snap: {
        x: (value: number) => gsap.utils.snap(CELL, value),
      },
    });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      draggable.kill();
      gsap.killTweensOf(proxy);
      proxyRef.current = null;
    };
  }, [layout, len, syncIndex]);

  // Keyboard when section (or child) is focused
  useEffect(() => {
    if (len < 2) return;
    const section = sectionRef.current;
    if (!section) return;

    const onKey = (e: KeyboardEvent) => {
      if (!section.contains(document.activeElement)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };

    section.addEventListener("keydown", onKey);
    return () => section.removeEventListener("keydown", onKey);
  }, [go, len]);

  // Autoplay armed on mount — first advance after AUTO_MS (not gated on scroll).
  useEffect(() => {
    if (len < 2 || prefersReducedMotion()) return;

    const id = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      if (document.hidden) return;
      goTo(indexRef.current + 1, { fromUser: false });
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [goTo, len]);

  // Block link navigation after a real drag
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onClickCapture = (e: MouseEvent) => {
      if (dragMovedRef.current) {
        e.preventDefault();
        e.stopPropagation();
        dragMovedRef.current = false;
      }
    };

    stage.addEventListener("click", onClickCapture, true);
    return () => stage.removeEventListener("click", onClickCapture, true);
  }, []);

  if (!len) return null;

  const active = slice[index]!;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20"
      aria-roledescription="carousel"
      aria-label="Экосистема в глубину"
      tabIndex={0}
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
          <span className="md:hidden">Свайп · Карусель</span>
          <span className="hidden md:inline">Drag · Cover-flow</span>
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-vanilla sm:text-3xl">
          Экосистема в глубину
        </h2>
        <p className="mt-3 text-sm text-vanilla/55 sm:text-base">
          <span className="md:hidden">Листайте проекты стрелками или свайпом.</span>
          <span className="hidden md:inline">
            Тяните карусель — проекты уходят в перспективу.
          </span>
        </p>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-5xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-vanilla/25 bg-cosmic-lift text-vanilla transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember sm:h-12 sm:w-12"
          aria-label="Предыдущий кейс"
        >
          <ChevronIcon size={18} className="rotate-90" />
        </button>

        <div
          ref={stageRef}
          className="relative mx-auto h-[22rem] w-full max-w-3xl cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[24rem] md:touch-none"
          style={{ perspective: "1200px" }}
          role="group"
          aria-live="polite"
          aria-atomic="true"
        >
          {slice.map((item, i) => {
            const href = item.externalUrl ?? `/cases/${item.slug}`;
            const external = Boolean(item.externalUrl);
            return (
              <Link
                key={item.slug}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                ref={(node) => {
                  cardsRef.current[i] = node;
                }}
                className="cover-card t-resize absolute left-1/2 top-1/2 flex flex-col overflow-hidden rounded-[1.5rem] border border-ink/40 bg-ink shadow-[0_28px_60px_rgba(29,29,29,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                style={{
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
                aria-label={`${item.title} — ${categoryLabels[item.category]}`}
              >
                <div
                  className="relative min-h-[44%] flex-1"
                  style={{
                    background: `linear-gradient(155deg, ${item.accent}55 0%, #4f1db5 45%, #1d1d1d 100%)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                </div>
                <div className="relative z-10 -mt-8 flex flex-1 flex-col px-5 pb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember">
                    {categoryLabels[item.category]}
                  </p>
                  <p className="mt-2 font-display text-xl font-semibold tracking-tight text-vanilla sm:text-2xl">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-vanilla/55">{item.domain}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-vanilla/75">
                    {item.summary}
                  </p>
                  <p className="mt-auto pt-4 text-sm font-medium text-ember">
                    Смотреть кейс →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-vanilla/25 bg-cosmic-lift text-vanilla transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember sm:h-12 sm:w-12"
          aria-label="Следующий кейс"
        >
          <ChevronIcon size={18} className="-rotate-90" />
        </button>
      </div>

      <div
        className="mt-6 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Слайды кейсов"
      >
        {slice.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Кейс ${i + 1}: ${item.title}`}
            onClick={() => goTo(i, { fromUser: true })}
            className={[
              "h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
              i === index
                ? "w-6 bg-ember"
                : "w-1.5 bg-vanilla/25 hover:bg-vanilla/45",
            ].join(" ")}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-vanilla/40" aria-hidden>
        {active.title} · {index + 1} / {len}
      </p>
    </section>
  );
}
