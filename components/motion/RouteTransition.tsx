"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import {
  enableManualScrollRestoration,
  readScrollFromHistory,
  saveScrollToHistory,
  scrollToY,
} from "@/lib/scrollRestoration";

type RouteTransitionProps = {
  children: React.ReactNode;
};

/** mega-transition-pixelate — pixel dissolve only. */
export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  /** Set true on popstate (Back/Forward); cleared after scroll apply. */
  const isPopNav = useRef(false);
  /** Suppress history scroll writes during route change / restore. */
  const navLock = useRef(false);

  useEffect(() => {
    enableManualScrollRestoration();
    gsap.registerPlugin(ScrollTrigger);

    const onPopState = () => {
      isPopNav.current = true;
      navLock.current = true;
    };

    // Keep history.state in sync so Back can restore exact position.
    let saveRaf = 0;
    const onScroll = () => {
      if (navLock.current) return;
      cancelAnimationFrame(saveRaf);
      saveRaf = requestAnimationFrame(() => {
        if (navLock.current) return;
        saveScrollToHistory();
      });
    };

    window.addEventListener("popstate", onPopState);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(saveRaf);
    };
  }, []);

  // Runs after Next's layout scroll handler (child layout effects first),
  // before paint — so push→top / pop→restore without a flash.
  useLayoutEffect(() => {
    if (first.current) return;

    if (isPopNav.current) {
      isPopNav.current = false;
      scrollToY(readScrollFromHistory());
    } else {
      scrollToY(0);
      saveScrollToHistory();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        navLock.current = false;
        ScrollTrigger.refresh();
      });
    });
  }, [pathname]);

  useEffect(() => {
    const node = ref.current;
    const pixels = pixelsRef.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      // Never leave transform on #page-shell — it becomes a containing block
      // for position:fixed and breaks ScrollTrigger pins (blank pinned sections).
      gsap.set(node, { clearProps: "all", opacity: 1 });
      first.current = false;
      return;
    }

    if (first.current) {
      first.current = false;
      gsap.set(node, { opacity: 1, clearProps: "transform" });
      return;
    }

    // Mobile: simple fade — skip 48-cell pixel dissolve GPU burst.
    const lightNav =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;

    if (lightNav || !pixels) {
      gsap.fromTo(
        node,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: EASE.soft, clearProps: "transform" },
      );
      return;
    }

    const cells = pixels.querySelectorAll<HTMLElement>("[data-px]");
    const tl = gsap.timeline({ defaults: { ease: EASE.inOut } });

    gsap.set(pixels, { autoAlpha: 1 });
    gsap.set(cells, { opacity: 0, scale: 0.6 });

    tl.to(cells, {
      opacity: 1,
      scale: 1,
      duration: 0.35,
      stagger: { each: 0.012, from: "random" },
    })
      .set(node, { opacity: 1, clearProps: "transform" })
      .to(cells, {
        opacity: 0,
        scale: 0.5,
        duration: 0.35,
        stagger: { each: 0.01, from: "random" },
      })
      .set(pixels, { autoAlpha: 0 });
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (!link || !(link instanceof HTMLAnchorElement)) return;
      if (link.target === "_blank" || link.hasAttribute("download")) return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      // Snapshot scroll on the page we're leaving (push nav).
      saveScrollToHistory();
      navLock.current = true;
      isPopNav.current = false;

      // Unpin / un-reparent before React tears down the page — otherwise
      // GSAP-moved nodes cause removeChild NotFoundError and soft-nav dies.
      ScrollTrigger.getAll().forEach((t) => t.kill(true));

      const shell = ref.current;
      if (!shell) return;

      gsap.to(shell, {
        opacity: 0.35,
        duration: 0.22,
        ease: "power2.in",
        overwrite: true,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const pixelCells = Array.from({ length: 48 }, (_, i) => i);

  return (
    <>
      <div
        ref={pixelsRef}
        className="pointer-events-none fixed inset-0 z-[90] grid grid-cols-8 gap-1 bg-cosmic p-1 opacity-0"
        aria-hidden
      >
        {pixelCells.map((i) => (
          <span
            key={i}
            data-px
            className="rounded-sm bg-ember/90"
            style={{ opacity: 0 }}
          />
        ))}
      </div>

      <div ref={ref} id="page-shell" className="flex min-h-full flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
