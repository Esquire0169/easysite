export const LOADER_COLORS = [
  "#3A0CA3",
  "#4F1DB5",
  "#1D1D1D",
  "#FFF275",
  "#FFF8A8",
  "#E8D450",
  "#3A0CA3",
] as const;

export const LOADER_STORAGE_KEY = "easysite-loader-played";

/** Shared easing — soft “candy” openings across the site. */
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
