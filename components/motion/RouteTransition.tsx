"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { MOTION } from "@/lib/motionSystem";
import { prefersReducedMotion } from "@/lib/motion";

type RouteTransitionProps = {
  children: React.ReactNode;
};

/** Soft fade + slight y on route change — no overlay / pixel dissolve. */
export function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const node = ref.current;
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
    gsap.fromTo(
      node,
      { opacity: 0, y: MOTION.route.y },
      {
        opacity: 1,
        y: 0,
        duration: MOTION.route.duration,
        ease: MOTION.route.ease,
        overwrite: true,
      },
    );
  }, [pathname]);

  return (
    <div ref={ref} id="page-shell" className="flex min-h-full flex-1 flex-col">
      {children}
    </div>
  );
}
