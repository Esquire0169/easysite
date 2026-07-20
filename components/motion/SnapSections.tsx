"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * gsap-observer-snap — enable with ?snap=1
 * Wheel delta snaps between [data-snap-section] elements.
 */
export function SnapSections() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!new URLSearchParams(window.location.search).has("snap")) return;
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(Observer);

    const sections = gsap.utils.toArray<HTMLElement>("[data-snap-section]");
    if (sections.length < 2) return;

    let index = 0;
    let locked = false;

    const goTo = (next: number) => {
      if (locked) return;
      const clamped = Math.max(0, Math.min(sections.length - 1, next));
      if (clamped === index) return;
      locked = true;
      index = clamped;
      sections[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        locked = false;
      }, 700);
    };

    const observer = Observer.create({
      target: window,
      type: "wheel,touch",
      wheelSpeed: -1,
      onDown: () => goTo(index - 1),
      onUp: () => goTo(index + 1),
      tolerance: 60,
      preventDefault: true,
    });

    document.documentElement.classList.add("has-snap");
    return () => {
      observer.kill();
      document.documentElement.classList.remove("has-snap");
    };
  }, []);

  return null;
}
