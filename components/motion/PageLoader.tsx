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

/**
 * Intro overlay. Hard-guarantees dismissal:
 * - failsafe timer
 * - cleanup always clears is-loading + marks played (Strict Mode safe)
 */
export function PageLoader({ onComplete }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useLayoutEffect(() => {
    let alive = true;

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
      };
    }

    try {
      if (sessionStorage.getItem(LOADER_STORAGE_KEY) === "1") {
        finish(false);
        return () => {
          alive = false;
          window.clearTimeout(failsafe);
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
      };
    }

    const ctx = gsap.context(() => {
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
      ctx.revert();
      // Strict Mode / HMR: never leave the site covered
      document.documentElement.classList.remove("is-loading");
      try {
        sessionStorage.setItem(LOADER_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      doneRef.current = true;
    };
  }, [onComplete]);

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
