import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let applied = false;

/** Call before creating ScrollTriggers — supports ?markers=1 */
export function enableScrollDebugIfNeeded() {
  if (applied || typeof window === "undefined") return;
  applied = true;
  gsap.registerPlugin(ScrollTrigger);
  if (new URLSearchParams(window.location.search).has("markers")) {
    ScrollTrigger.defaults({ markers: true });
    document.documentElement.setAttribute("data-markers", "");
  }
}
