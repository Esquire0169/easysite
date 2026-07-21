import { getLenis } from "@/components/motion/SmoothScroll";

const SCROLL_KEY = "__esScroll";

export type HistoryScrollState = {
  [SCROLL_KEY]?: number;
};

function readScrollY(): number {
  const lenis = getLenis();
  if (lenis) return lenis.scroll;
  return window.scrollY || window.pageYOffset || 0;
}

/** Persist current scroll into the active history entry. */
export function saveScrollToHistory() {
  if (typeof window === "undefined") return;
  const y = readScrollY();
  const prev =
    history.state && typeof history.state === "object"
      ? (history.state as Record<string, unknown>)
      : {};
  history.replaceState({ ...prev, [SCROLL_KEY]: y }, "");
}

export function readScrollFromHistory(): number {
  const state = history.state as HistoryScrollState | null;
  const y = state?.[SCROLL_KEY];
  return typeof y === "number" && Number.isFinite(y) ? y : 0;
}

/** Instant scroll — prefers Lenis when active. */
export function scrollToY(y: number) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(y, { immediate: true });
    return;
  }
  window.scrollTo(0, y);
}

export function enableManualScrollRestoration() {
  if (typeof window === "undefined") return;
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
}
