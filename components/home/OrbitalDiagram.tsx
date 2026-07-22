"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { prefersReducedMotion } from "@/lib/motion";

type OrbitItem = {
  label: string;
  desc: string;
  angle: number;
};

const ORBIT_ITEMS: OrbitItem[] = [
  {
    label: "Дизайн",
    desc: "Макет и визуальный язык под ваш бриф — без бесконечных вариантов.",
    angle: 0,
  },
  {
    label: "Тексты",
    desc: "Оффер, смыслы и точные формулировки, которые сразу работают.",
    angle: 72,
  },
  {
    label: "Хостинг",
    desc: "Размещение на серверах EasySite 24/7 с мониторингом.",
    angle: 144,
  },
  {
    label: "Домен",
    desc: "Адрес с префиксом easysite — без ручной настройки DNS.",
    angle: 216,
  },
  {
    label: "SSL",
    desc: "Шифрование и базовая защита включены из коробки.",
    angle: 288,
  },
];

const SCRUB_ROTATION = 720;
/** Extra degrees the «Раскрутить» button adds per click. */
const SPIN_DEGREES = 720;
const SPIN_DURATION = 2;

/** Orbit radius as % of stage — slightly tighter on tablet. */
function orbitRadiusPercent(): number {
  if (typeof window === "undefined") return 42;
  return window.matchMedia("(min-width: 1024px)").matches ? 42 : 38;
}

/**
 * One-service orbital diagram — scrub-linked ring + pills, button spin.
 * Outer ring CW, pills CCW; pill labels counter-rotate to stay upright.
 * Pills: CSS 3D flip on hover (front = label, back = description).
 * Mobile (<768): text + compact list only. prefers-reduced-motion: static diagram.
 */
export function OrbitalDiagram() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const pillInnersRef = useRef<(HTMLDivElement | null)[]>([]);
  const spinRef = useRef<(() => void) | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = triggerRef.current;
    const stage = stageRef.current;
    const ring = ringRef.current;
    const pillsContainer = pillsContainerRef.current;
    if (!trigger || !stage || !ring || !pillsContainer) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Reduced motion: static diagram — no scrub or button spin.
        if (prefersReducedMotion()) return;

        const layoutPills = () => {
          const radius = orbitRadiusPercent();
          ORBIT_ITEMS.forEach((item, index) => {
            const slot = pillsContainer.children[index] as
              | HTMLElement
              | undefined;
            if (!slot) return;
            const rad = (item.angle * Math.PI) / 180;
            slot.style.left = `${50 + Math.cos(rad) * radius}%`;
            slot.style.top = `${50 + Math.sin(rad) * radius}%`;
          });
        };

        layoutPills();

        const pillInners = pillInnersRef.current.filter(
          Boolean,
        ) as HTMLDivElement[];

        const state = { scrubRotation: 0, spinOffset: 0 };

        const applyRotation = () => {
          const total = state.scrubRotation + state.spinOffset;
          gsap.set(ring, { rotation: total });
          gsap.set(pillsContainer, { rotation: -total });
          gsap.set(pillInners, { rotation: total });
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "top center",
            end: "bottom center",
            scrub: 2.2,
          },
          onUpdate: applyRotation,
        });

        // Linear scrub path — smoothness comes from scrub lag, not ease curve.
        tl.to(
          state,
          { scrubRotation: SCRUB_ROTATION, duration: 1, ease: "none" },
          0,
        );

        applyRotation();

        spinRef.current = () => {
          gsap.killTweensOf(state, "spinOffset");
          gsap.to(state, {
            spinOffset: `+=${SPIN_DEGREES}`,
            duration: SPIN_DURATION,
            ease: "power2.inOut",
            onUpdate: applyRotation,
          });
        };

        const onResize = () => layoutPills();
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          gsap.killTweensOf(state);
          spinRef.current = null;
        };
      });

      // Mobile: ensure no leftover orbit transforms if breakpoint flips.
      mm.add("(max-width: 767px)", () => {
        spinRef.current = null;
        gsap.set([ring, pillsContainer], { clearProps: "transform" });
        pillInnersRef.current.forEach((el) => {
          if (el) gsap.set(el, { clearProps: "transform" });
        });
      });
    }, trigger);

    return () => {
      spinRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <Section className="overflow-visible bg-ink/40" containerClassName="overflow-visible">
      <div
        ref={triggerRef}
        className="grid items-center gap-12 lg:grid-cols-2"
      >
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Всё под ключ
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Один сервис вместо набора подрядчиков
          </h2>
          <p className="mt-5 text-base leading-relaxed text-vanilla/75">
            Вам не нужно искать дизайнера, верстальщика и хостинг — всё уже
            внутри EasySite. Закрываем весь цикл: дизайн, тексты, вёрстку,
            домен, хостинг и техническую настройку. Вы получаете ссылку на
            готовый сайт, который уже работает.
          </p>

          {/* Mobile-only stack — no orbit / drag / filters */}
          <ul className="mt-8 space-y-4 md:hidden">
            {ORBIT_ITEMS.map((item) => (
              <li key={item.label} className="border-l-2 border-ember/40 pl-4">
                <p className="font-display text-base font-semibold text-vanilla">
                  {item.label}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-vanilla/55">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Orbit + spin — desktop / tablet only */}
        <div className="mx-auto hidden w-full max-w-[380px] flex-col items-center gap-6 overflow-visible md:flex md:max-w-[440px] lg:max-w-lg">
          <div
            ref={stageRef}
            className="orbit-stage relative aspect-square w-full overflow-visible"
            aria-hidden="true"
          >
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-cosmic-lift/40" />

            {/* Inner decorative ring */}
            <div className="pointer-events-none absolute inset-[28%] rounded-full border border-vanilla/10" />

            {/* Outer ring (CW) — dashed + marker so rotation reads */}
            <div className="pointer-events-none absolute inset-[8%]">
              <div
                ref={ringRef}
                className="relative h-full w-full origin-center rounded-full border border-dashed border-vanilla/25"
              >
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/80" />
              </div>
            </div>

            {/* Center hub */}
            <div className="pointer-events-none absolute inset-[32%] z-20 flex items-center justify-center rounded-full border border-ember/40 bg-cosmic shadow-[0_0_60px_rgba(255,242,117,0.12)]">
              <div className="text-center">
                <p className="font-display text-xl font-semibold text-vanilla lg:text-2xl">
                  EasySite
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-vanilla/50">
                  один центр
                </p>
              </div>
            </div>

            {/* Decorative dots (static, inside pill orbit) */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const r = 34;
              return (
                <div
                  key={i}
                  className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-vanilla/25"
                  style={{
                    left: `${50 + Math.cos(angle) * r}%`,
                    top: `${50 + Math.sin(angle) * r}%`,
                  }}
                />
              );
            })}

            {/*
              pillsContainer rotates CCW (-total).
              pillSlot: positioned only (no rotation tween).
              pillInner: counter-rotates (+total) so labels stay horizontal.
              flipper: CSS rotateY on hover — front = label, back = desc.
            */}
            <div
              ref={pillsContainerRef}
              className="absolute inset-0 z-10 origin-center"
            >
              {ORBIT_ITEMS.map((item, index) => {
                const rad = (item.angle * Math.PI) / 180;
                const r = 42;
                return (
                  <div
                    key={item.label}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${50 + Math.cos(rad) * r}%`,
                      top: `${50 + Math.sin(rad) * r}%`,
                    }}
                  >
                    <div
                      ref={(el) => {
                        pillInnersRef.current[index] = el;
                      }}
                      className="origin-center"
                    >
                      <div className="orbit-pill">
                        <div className="orbit-pill-flipper">
                          <div className="orbit-pill-face orbit-pill-face--front">
                            <span className="whitespace-nowrap font-medium">
                              {item.label}
                            </span>
                          </div>
                          <div className="orbit-pill-face orbit-pill-face--back">
                            <span className="line-clamp-3 leading-snug">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="orbit-spin-btn hidden md:inline-flex"
            disabled={reducedMotion}
            onClick={() => spinRef.current?.()}
            aria-label="Раскрутить орбиту"
          >
            <span className="text-pro-shimmer">Раскрутить</span>
          </Button>
        </div>
      </div>
    </Section>
  );
}
