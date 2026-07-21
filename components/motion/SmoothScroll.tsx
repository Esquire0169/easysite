"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { enableScrollDebugIfNeeded } from "@/lib/enableScrollDebug";
import { prefersReducedMotion } from "@/lib/motion";

let lenisInstance: Lenis | null = null;

/** Active Lenis instance from SmoothScroll (null when reduced-motion or unmounted). */
export function getLenis() {
  return lenisInstance;
}

/**
 * Consensys-style Lenis: window scroll + GSAP ticker, no scrollerProxy.
 * Sticky + scrub stacks break when proxy fights native sticky.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    enableScrollDebugIfNeeded();

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.95,
      // driven by gsap.ticker — avoid double RAF clocks
      autoRaf: false,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis", "lenis-smooth");

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisInstance = null;
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
    };
  }, []);

  return null;
}
