export const LOADER_COLORS = [
  "#23212C",
  "#2E2B38",
  "#E8A87C",
  "#F1FEC8",
  "#C98A5F",
  "#23212C",
] as const;

export const LOADER_STORAGE_KEY = "easysite-loader-played";

/** Shared easing — soft openings (canonical tokens also in motionSystem). */
export const EASE = {
  out: "expo.out",
  inOut: "power3.inOut",
  soft: "power4.out",
  spring: "elastic.out(1, 0.55)",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
