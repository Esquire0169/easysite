"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

export const TEXT_SHATTER_LETTER = "text-shatter__letter";

type ShatterLine = {
  text: string;
  className?: string;
};

export type TextShatterProps = {
  /** Single-line text. Ignored when `lines` is set. */
  text?: string;
  /** Multi-line offer copy (each line keeps its own tone). */
  lines?: ShatterLine[];
  className?: string;
  as?: "div" | "h2" | "h3" | "p" | "span";
  /**
   * Digits and ₽ get `text-ember` on top of the line class.
   * Other glyphs keep the line / default vanilla tone.
   */
  accentDigits?: boolean;
  /**
   * `external` — only split letters; parent scrub timeline drives shatter.
   * `scrub` — own ScrollTrigger scrub (standalone use).
   */
  mode?: "external" | "scrub";
  scrub?: boolean | number;
  start?: string;
  end?: string;
};

function isAccentChar(char: string): boolean {
  return /\d/.test(char) || char === "₽";
}

function ariaFromProps(text: string | undefined, lines: ShatterLine[] | undefined) {
  if (lines?.length) return lines.map((l) => l.text).join(" ");
  return text ?? "";
}

/** Collect letter nodes inside a root (skips space placeholders if desired). */
export function collectShatterLetters(
  root: ParentNode | null,
  opts?: { includeSpaces?: boolean },
): HTMLElement[] {
  if (!root) return [];
  const nodes = Array.from(
    root.querySelectorAll<HTMLElement>(`.${TEXT_SHATTER_LETTER}`),
  );
  if (opts?.includeSpaces) return nodes;
  return nodes.filter((el) => {
    const t = el.textContent ?? "";
    return t !== " " && t !== "\u00a0";
  });
}

/** Reset letter transforms after scrub reverse / refresh. */
export function resetShatterLetters(letters: HTMLElement[]) {
  if (!letters.length) return;
  gsap.set(letters, {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    scale: 1,
    clearProps: "transform,opacity,scale",
  });
}

/**
 * Add letter-crumble tweens to an existing timeline (scrub-friendly).
 * No permanent will-change; transform + opacity only.
 * Letters fall ~500–1000px so a pre-lift start position reads as a long drop.
 */
export function addLetterShatter(
  tl: gsap.core.Timeline,
  letters: HTMLElement[],
  position: gsap.Position = 0,
) {
  letters.forEach((letter, i) => {
    const randomX = (Math.random() - 0.5) * 220;
    const randomRotate = (Math.random() - 0.5) * 720;
    const fallDistance = 520 + Math.random() * 460;
    const duration = 0.95 + Math.random() * 0.55;
    const delay = i * 0.032;

    tl.to(
      letter,
      {
        y: fallDistance,
        x: randomX,
        rotation: randomRotate,
        opacity: 0,
        scale: 0.35,
        duration,
        delay,
        ease: "power3.in",
      },
      position,
    );
  });
}

function LetterSpans({
  text,
  className,
  accentDigits,
  letterOffset,
}: {
  text: string;
  className?: string;
  accentDigits: boolean;
  letterOffset: number;
}) {
  return (
    <>
      {text.split("").map((char, i) => {
        const index = letterOffset + i;
        if (char === " ") {
          return (
            <span
              key={index}
              className={`${TEXT_SHATTER_LETTER} inline-block w-[0.28em]`}
              aria-hidden="true"
            >
              {"\u00a0"}
            </span>
          );
        }

        const accent = accentDigits && isAccentChar(char);
        return (
          <span
            key={index}
            className={[
              TEXT_SHATTER_LETTER,
              "inline-block",
              className,
              accent ? "text-ember" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ transformOrigin: "center center" }}
            aria-hidden="true"
          >
            {char}
          </span>
        );
      })}
    </>
  );
}

/**
 * Letter-split offer copy for scrub shatter (“распад текста”).
 * Use `mode="external"` inside ExplodedView; `mode="scrub"` for standalone.
 */
export function TextShatter({
  text = "",
  lines,
  className = "",
  as: Tag = "div",
  accentDigits = true,
  mode = "external",
  scrub = 1,
  start = "top center",
  end = "+=180%",
}: TextShatterProps) {
  const containerRef = useRef<HTMLElement>(null);
  const label = ariaFromProps(text, lines);
  const resolvedLines: ShatterLine[] = lines?.length
    ? lines
    : [{ text, className: "text-vanilla" }];

  useEffect(() => {
    if (mode !== "scrub") return;
    const node = containerRef.current;
    if (!node) return;

    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const letters = collectShatterLetters(node);
    if (!letters.length) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start,
          end,
          scrub,
          // scrub only — never pair with toggleActions
        },
      });
      addLetterShatter(tl, letters, 0);
    }, node);

    return () => ctx.revert();
  }, [mode, scrub, start, end, text, lines]);

  let offset = 0;
  const Component = Tag as ElementType;

  return (
    <Component
      ref={containerRef as never}
      className={className}
      aria-label={label}
    >
      {resolvedLines.map((line, lineIdx) => {
        const startAt = offset;
        offset += line.text.length;
        return (
          <span key={lineIdx} className="block">
            <LetterSpans
              text={line.text}
              className={line.className}
              accentDigits={accentDigits}
              letterOffset={startAt}
            />
          </span>
        );
      })}
    </Component>
  );
}
