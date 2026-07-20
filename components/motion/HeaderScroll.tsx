"use client";

import { useEffect } from "react";
import gsap from "gsap";

/** Scroll progress + condensed pill state for Consensys-style header. */
export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const root = document.querySelector<HTMLElement>(".site-header");
    if (!header || !root) return;

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? y / max : 0;

      root.classList.toggle("is-condensed", y > 32);

      if (progress) {
        gsap.set(progress, { scaleX: ratio });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
