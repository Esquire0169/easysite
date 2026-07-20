"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";

type RouteTransitionProps = {
  children: React.ReactNode;
};

/** mega-transition-pixelate — pixel dissolve only. */
export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const pixelsRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const node = ref.current;
    const pixels = pixelsRef.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      gsap.set(node, { clearProps: "all", opacity: 1, y: 0 });
      return;
    }

    if (first.current) {
      first.current = false;
      gsap.set(node, { opacity: 1, y: 0 });
      return;
    }

    window.scrollTo(0, 0);

    if (!pixels) {
      gsap.fromTo(
        node,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: EASE.soft },
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
      .set(node, { opacity: 1, y: 0 })
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
