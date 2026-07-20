"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LOADER_COLORS,
  LOADER_STORAGE_KEY,
  prefersReducedMotion,
} from "@/lib/motion";
import { siteConfig } from "@/lib/site";

type PageLoaderProps = {
  onComplete?: () => void;
};

const FAILSAFE_MS = 1400;
/** Absolute cap — survives Strict Mode effect re-entry races. */
const HARD_FAILSAFE_MS = 2800;

/**
 * Intro overlay. Hard-guarantees dismissal:
 * - animation complete
 * - failsafe timer
 * - hard failsafe (independent of animation effect)
 * - Strict Mode safe: cleanup must NOT mark done / block re-run finish
 */
export function PageLoader({ onComplete }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useLayoutEffect(() => {
    let alive = true;
    let ctx: gsap.Context | undefined;

    // Strict Mode: effect cleanup+re-run keeps the same refs.
    // Previous cleanup must not leave doneRef=true or finish() becomes a no-op
    // and the overlay stays forever.
    doneRef.current = false;

    const finish = (markPlayed: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      document.documentElement.classList.remove("is-loading");
      if (markPlayed) {
        try {
          sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
        } catch {
          // ignore
        }
      }
      if (alive) setVisible(false);
      window.dispatchEvent(new CustomEvent("easysite:ready"));
      requestAnimationFrame(() => ScrollTrigger.refresh());
      onComplete?.();
    };

    const failsafe = window.setTimeout(() => finish(true), FAILSAFE_MS);

    if (prefersReducedMotion()) {
      finish(true);
      return () => {
        alive = false;
        window.clearTimeout(failsafe);
        document.documentElement.classList.remove("is-loading");
      };
    }

    try {
      if (sessionStorage.getItem(LOADER_STORAGE_KEY) === "1") {
        finish(false);
        return () => {
          alive = false;
          window.clearTimeout(failsafe);
          document.documentElement.classList.remove("is-loading");
        };
      }
    } catch {
      // ignore
    }

    document.documentElement.classList.add("is-loading");

    const root = rootRef.current;
    const logo = logoRef.current;

    if (!root || !logo) {
      finish(true);
      return () => {
        alive = false;
        window.clearTimeout(failsafe);
        document.documentElement.classList.remove("is-loading");
      };
    }

    ctx = gsap.context(() => {
      const exit = () => {
        gsap.to(root, {
          yPercent: -100,
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => finish(true),
        });
      };

      const flash = (index = 0) => {
        if (!alive || doneRef.current) return;
        if (index >= LOADER_COLORS.length) {
          exit();
          return;
        }
        gsap.to(root, {
          backgroundColor: LOADER_COLORS[index],
          duration: 0.1,
          ease: "power1.inOut",
          onComplete: () => {
            if (index < LOADER_COLORS.length - 1) {
              gsap.delayedCall(0.07, () => flash(index + 1));
            } else {
              exit();
            }
          },
        });
      };

      gsap.set(logo, { y: 16, opacity: 0 });
      gsap
        .timeline()
        .to(logo, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" })
        .to(logo, {
          yPercent: -100,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
          onComplete: () => flash(0),
        });
    }, root);

    return () => {
      alive = false;
      window.clearTimeout(failsafe);
      ctx?.revert();
      // Clear scroll lock only — do NOT set doneRef or sessionStorage.
      // Marking done here blocked Strict Mode's second run from dismissing.
      document.documentElement.classList.remove("is-loading");
    };
  }, [onComplete]);

  // Independent hard failsafe — not tied to animation ctx / doneRef races
  useLayoutEffect(() => {
    if (!visible) return;

    const hard = window.setTimeout(() => {
      document.documentElement.classList.remove("is-loading");
      setVisible(false);
      try {
        sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      window.dispatchEvent(new CustomEvent("easysite:ready"));
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, HARD_FAILSAFE_MS);

    return () => window.clearTimeout(hard);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="page-loader fixed inset-0 z-[100] flex items-center justify-center bg-cosmic"
      aria-hidden
    >
      <div ref={logoRef} className="text-center">
        <p className="font-display text-4xl font-semibold tracking-tight text-vanilla sm:text-5xl">
          {siteConfig.name}
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.22em] text-vanilla/50">
          сайт за сутки
        </p>
      </div>
    </div>
  );
}
