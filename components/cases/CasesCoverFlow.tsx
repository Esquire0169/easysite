"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import type { CaseItem } from "@/lib/cases";
import { categoryLabels } from "@/lib/cases";
import { ChevronIcon } from "@/components/ui/icons";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(Flip);

type CasesCoverFlowProps = {
  items: CaseItem[];
};

/**
 * Readable cover-flow carousel — Flip side cards + rotateY settle on active.
 * Keyboard a11y intact; not scroll-scrubbed.
 */
export function CasesCoverFlow({ items }: CasesCoverFlowProps) {
  const slice = items.slice(0, 8);
  const [index, setIndex] = useState(0);
  const len = slice.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const dirRef = useRef<1 | -1>(1);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const firstPaint = useRef(true);

  const captureState = useCallback(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion()) return;
    const targets = stage.querySelectorAll<HTMLElement>(
      "[data-cover-active], [data-cover-side]",
    );
    if (targets.length) {
      flipStateRef.current = Flip.getState(targets);
    }
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      captureState();
      dirRef.current = dir;
      setIndex((i) => (i + dir + len) % len);
    },
    [captureState, len],
  );

  const goTo = useCallback(
    (next: number) => {
      captureState();
      dirRef.current = (next > index ? 1 : -1) as 1 | -1;
      setIndex(next);
    },
    [captureState, index],
  );

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion() || len < 2) return;

    const active = stage.querySelector<HTMLElement>("[data-cover-active]");
    const sides = gsap.utils.toArray<HTMLElement>(
      stage.querySelectorAll("[data-cover-side]"),
    );

    if (firstPaint.current) {
      firstPaint.current = false;
      flipStateRef.current = null;
      return;
    }

    const state = flipStateRef.current;
    flipStateRef.current = null;

    if (state) {
      Flip.from(state, {
        duration: 0.5,
        ease: MOTION.ease.out,
        absolute: false,
        nested: true,
        prune: true,
      });
    }

    if (active) {
      gsap.fromTo(
        active,
        {
          rotateY: dirRef.current * 18,
          scale: 0.94,
          transformPerspective: 900,
        },
        {
          rotateY: 0,
          scale: 1,
          duration: 0.58,
          ease: MOTION.ease.soft,
          overwrite: "auto",
        },
      );
    }

    sides.forEach((el) => {
      const side = el.dataset.coverSide === "left" ? -1 : 1;
      gsap.fromTo(
        el,
        { rotateY: side * 12, autoAlpha: 0.35 },
        {
          rotateY: side * 8,
          autoAlpha: 0.5,
          duration: 0.48,
          ease: MOTION.ease.out,
          overwrite: "auto",
        },
      );
    });
  }, [index, len]);

  useEffect(() => {
    if (prefersReducedMotion() || len < 2) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, len]);

  if (!len) return null;

  const active = slice[index]!;
  const prev = slice[(index - 1 + len) % len]!;
  const next = slice[(index + 1) % len]!;

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
          Cover-flow
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-vanilla sm:text-3xl">
          Экосистема в глубину
        </h2>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-5xl items-center gap-3 px-4 sm:gap-5 sm:px-6">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-vanilla/25 bg-cosmic-lift text-vanilla transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          aria-label="Предыдущий кейс"
        >
          <ChevronIcon size={18} className="rotate-90" />
        </button>

        <div
          ref={stageRef}
          className="relative mx-auto grid h-[22rem] w-full max-w-3xl place-items-center [perspective:1000px] sm:h-[24rem]"
        >
          <SideCard item={prev} side="left" />
          <SideCard item={next} side="right" />

          <Link
            data-cover-active
            href={active.externalUrl ?? `/cases/${active.slug}`}
            target={active.externalUrl ? "_blank" : undefined}
            rel={active.externalUrl ? "noopener noreferrer" : undefined}
            className="relative z-20 flex h-[20rem] w-[min(100%,18rem)] flex-col overflow-hidden rounded-[1.5rem] border border-vanilla/20 bg-[#1a1820] shadow-[0_28px_60px_rgba(0,0,0,0.55)] will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember sm:h-[22rem] sm:w-[20rem]"
          >
            <div
              className="relative min-h-[48%] flex-1"
              style={{
                background: `linear-gradient(155deg, ${active.accent}55 0%, #2e2b38 55%, #1a1820 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1820] via-transparent to-transparent" />
            </div>
            <div className="relative z-10 -mt-8 flex flex-1 flex-col px-5 pb-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember">
                {categoryLabels[active.category]}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-vanilla">
                {active.title}
              </p>
              <p className="mt-1 text-xs text-vanilla/55">{active.domain}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-vanilla/75">
                {active.summary}
              </p>
              <p className="mt-auto pt-4 text-sm font-medium text-ember">
                Смотреть кейс →
              </p>
            </div>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-vanilla/25 bg-cosmic-lift text-vanilla transition-colors hover:border-ember hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          aria-label="Следующий кейс"
        >
          <ChevronIcon size={18} className="-rotate-90" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
        {slice.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => goTo(i)}
            className={[
              "h-1.5 rounded-full transition-all",
              i === index
                ? "w-6 bg-ember"
                : "w-1.5 bg-vanilla/25 hover:bg-vanilla/45",
            ].join(" ")}
            aria-label={`Кейс ${i + 1}`}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-vanilla/40">
        {index + 1} / {len}
      </p>
    </section>
  );
}

function SideCard({
  item,
  side,
}: {
  item: CaseItem;
  side: "left" | "right";
}) {
  return (
    <div
      data-cover-side={side}
      aria-hidden
      className={[
        "pointer-events-none absolute top-1/2 z-10 hidden h-[16rem] w-[12rem] -translate-y-1/2 overflow-hidden rounded-2xl border border-vanilla/10 bg-[#14121a] opacity-50 will-change-transform sm:block",
        side === "left"
          ? "left-[4%] -translate-x-0 rotate-[-8deg] scale-90"
          : "right-[4%] translate-x-0 rotate-[8deg] scale-90",
      ].join(" ")}
      style={{
        background: `linear-gradient(160deg, ${item.accent}22, #14121a 70%)`,
      }}
    >
      <div className="flex h-full flex-col justify-end p-4">
        <p className="font-display text-lg font-semibold text-vanilla/80">
          {item.title}
        </p>
      </div>
    </div>
  );
}
