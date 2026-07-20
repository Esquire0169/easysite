"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitWords } from "@/components/motion/SplitWords";
import { ArrowIcon, CloseIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { EASE, prefersReducedMotion } from "@/lib/motion";

const OPEN_W = 24 * 16; // 24rem
const OPEN_H = 30 * 16; // 30rem
const PILL_W = 220;
const PILL_H = 80;
const STAGE_PAD = 20;

const items = [
  {
    id: "strong",
    title: "Be strong",
    toneClass: "bg-[#fff275]",
    subtitle: "Скорость платформы",
    text: "Сайт за 24 часа на своём железе: хостинг, сервера, SSL и базовая защита. Вам не нужно искать дизайнера, верстальщика и хостинг.",
    href: "/tech",
    cta: "Про технологии",
    media: "from-[#fff275]/50 via-cosmic-lift to-cosmic",
    start: { x: 14, y: 18 },
    magnet: { radius: 220, strength: 0.16, ease: 1.65 },
  },
  {
    id: "true",
    title: "Be true",
    toneClass: "bg-[#e8dc6a]",
    subtitle: "Честный оффер",
    text: "Фиксированные 10 000 ₽. Без калькуляторов, пакетов и скрытых доплат. Если нужны бесконечные правки — это не к нам.",
    href: "/rules",
    cta: "Читать правила",
    media: "from-[#e8dc6a]/45 via-cosmic-lift to-cosmic-deep",
    start: { x: 48, y: 42 },
    magnet: { radius: 260, strength: 0.22, ease: 2.2 },
  },
  {
    id: "bold",
    title: "Be bold",
    toneClass: "bg-[#a78bfa]",
    subtitle: "Законченный продукт",
    text: "Один выстрел — работающий сайт с доменом easysite. Без правок после сдачи. Дальше только использование.",
    href: "/order",
    cta: "Заказать сайт",
    media: "from-[#a78bfa]/45 via-[#4f1db5] to-cosmic",
    start: { x: 68, y: 22 },
    magnet: { radius: 190, strength: 0.13, ease: 1.35 },
  },
] as const;

function clampHome(
  x: number,
  y: number,
  stageW: number,
  stageH: number,
  cardW: number,
  cardH: number,
) {
  const maxX = Math.max(STAGE_PAD, stageW - cardW - STAGE_PAD);
  const maxY = Math.max(STAGE_PAD, stageH - cardH - STAGE_PAD);
  return {
    x: gsap.utils.clamp(STAGE_PAD, maxX, x),
    y: gsap.utils.clamp(STAGE_PAD, maxY, y),
  };
}

export function BeManifesto() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const cards = Array.from(
      stage.querySelectorAll<HTMLElement>("[data-be-card]"),
    );
    if (!cards.length) return;

    if (prefersReducedMotion()) {
      cards.forEach((card) => card.classList.add("is-open"));
      return;
    }

    const cleanups: Array<() => void> = [];
    const mq = window.matchMedia("(min-width: 1024px)");

    const setup = () => {
      cleanups.splice(0).forEach((fn) => fn());
      const desktop = mq.matches;

      cards.forEach((card) => {
        const shell = card.querySelector<HTMLElement>("[data-be-shell]");
        const face = card.querySelector<HTMLElement>("[data-be-face]");
        const panel = card.querySelector<HTMLElement>("[data-be-panel]");
        const media = card.querySelectorAll<HTMLElement>("[data-be-media]");
        const iconOpen = card.querySelector<HTMLElement>("[data-be-icon-open]");
        const iconClose = card.querySelector<HTMLElement>("[data-be-icon-close]");
        if (!shell || !face || !panel) return;

        gsap.killTweensOf(card);
        gsap.killTweensOf(shell);
        gsap.set(card, { clearProps: "transform,left,top,x,y,zIndex" });

        if (!desktop) {
          gsap.set(shell, { clearProps: "width,height,borderRadius" });
          gsap.set([face, panel, media, iconOpen, iconClose], {
            clearProps: "all",
          });
          card.classList.add("is-open");
          card.classList.remove("z-lift");
          return;
        }

        card.classList.remove("is-open", "z-lift");

        const stageW = stage.clientWidth;
        const stageH = stage.clientHeight;
        const originX = (Number(card.dataset.startX) / 100) * (stageW - PILL_W);
        const originY = (Number(card.dataset.startY) / 100) * (stageH - PILL_H);
        const homePill = clampHome(
          originX,
          originY,
          stageW,
          stageH,
          PILL_W,
          PILL_H,
        );
        let baseX = homePill.x;
        let baseY = homePill.y;

        const radius = Number(card.dataset.magnetRadius ?? 220);
        const strength = Number(card.dataset.magnetStrength ?? 0.16);
        const easeDur = Number(card.dataset.magnetEase ?? 1.6);

        gsap.set(card, { x: baseX, y: baseY, left: 0, top: 0 });
        gsap.set(shell, {
          width: "13.5rem",
          height: "3.6rem",
          borderRadius: "999px",
        });
        gsap.set(face, { opacity: 1 });
        gsap.set(panel, { opacity: 0, y: 16 });
        gsap.set(media, { opacity: 0 });
        gsap.set(iconOpen, { opacity: 1 });
        gsap.set(iconClose, { opacity: 0 });

        let attracted = false;
        let drifting = true;

        // Gentle ambient drift around the home point
        const driftAmpX = gsap.utils.random(14, 28);
        const driftAmpY = gsap.utils.random(10, 22);
        const driftPhase = { t: gsap.utils.random(0, Math.PI * 2) };
        const driftTween = gsap.to(driftPhase, {
          t: `+=${Math.PI * 2}`,
          duration: gsap.utils.random(9, 15),
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            if (card.dataset.locked === "1" || !drifting) return;
            const nextX = homePill.x + Math.sin(driftPhase.t) * driftAmpX;
            const nextY =
              homePill.y + Math.cos(driftPhase.t * 0.87) * driftAmpY;
            const clamped = clampHome(
              nextX,
              nextY,
              stageW,
              stageH,
              PILL_W,
              PILL_H,
            );
            baseX = clamped.x;
            baseY = clamped.y;
            // Settle visually only when not magnet-pulled
            if (!attracted) {
              gsap.set(card, { x: baseX, y: baseY });
            }
          },
        });

        // Per-card magnetism around a drifting home position
        const onMove = (event: MouseEvent) => {
          if (card.dataset.locked === "1") return;

          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const dist = Math.hypot(dx, dy);

          if (dist < radius) {
            attracted = true;
            const falloff = 1 - dist / radius;
            const pull = falloff * falloff;

            gsap.to(card, {
              x: baseX + dx * strength * pull,
              y: baseY + dy * strength * pull,
              duration: easeDur,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else if (attracted) {
            attracted = false;
            gsap.to(card, {
              x: baseX,
              y: baseY,
              duration: easeDur + 0.4,
              ease: "elastic.out(1, 0.42)",
              overwrite: "auto",
            });
          }
        };

        window.addEventListener("mousemove", onMove, { passive: true });

        const pick =
          media[Math.floor(Math.random() * Math.max(media.length, 1))];

        const tl = gsap.timeline({ paused: true });
        tl.to(shell, {
          width: "24rem",
          height: "30rem",
          borderRadius: "1.5rem",
          duration: 0.95,
          ease: EASE.inOut,
        })
          .to(
            face,
            { opacity: 0, duration: 0.35, ease: EASE.inOut },
            "-=0.6",
          )
          .to(
            panel,
            { opacity: 1, y: 0, duration: 0.55, ease: EASE.soft },
            "-=0.45",
          )
          .to(
            pick ?? media,
            { opacity: 1, duration: 0.55, ease: EASE.soft },
            "-=0.5",
          )
          .to(iconOpen, { opacity: 0, duration: 0.25, ease: "power2.inOut" }, "-=0.35")
          .to(iconClose, { opacity: 1, duration: 0.25, ease: "power2.out" }, "-=0.2");

        const open = () => {
          card.dataset.locked = "1";
          drifting = false;
          attracted = false;
          driftTween.pause();
          card.classList.add("is-open", "z-lift");
          const openPos = clampHome(
            homePill.x,
            homePill.y,
            stageW,
            stageH,
            OPEN_W,
            OPEN_H,
          );
          baseX = openPos.x;
          baseY = openPos.y;
          gsap.to(card, {
            x: openPos.x,
            y: openPos.y,
            duration: 0.55,
            ease: EASE.soft,
            overwrite: "auto",
          });
          tl.play();
        };

        const close = () => {
          tl.reverse();
          tl.eventCallback("onReverseComplete", () => {
            card.classList.remove("is-open", "z-lift");
            delete card.dataset.locked;
            attracted = false;
            const pill = clampHome(
              homePill.x,
              homePill.y,
              stageW,
              stageH,
              PILL_W,
              PILL_H,
            );
            baseX = pill.x;
            baseY = pill.y;
            gsap.to(card, {
              x: pill.x,
              y: pill.y,
              duration: 0.7,
              ease: EASE.soft,
              overwrite: "auto",
            });
            gsap.to(media, { opacity: 0, duration: 0.3, ease: "power2.out" });
            drifting = true;
            driftTween.resume();
            tl.eventCallback("onReverseComplete", null);
          });
        };

        card.addEventListener("mouseenter", open);
        card.addEventListener("mouseleave", close);

        cleanups.push(() => {
          window.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseenter", open);
          card.removeEventListener("mouseleave", close);
          driftTween.kill();
          tl.kill();
          gsap.killTweensOf(card);
          delete card.dataset.locked;
          card.classList.remove("is-open", "z-lift");
        });
      });
    };

    setup();
    mq.addEventListener("change", setup);
    window.addEventListener("resize", setup);

    return () => {
      mq.removeEventListener("change", setup);
      window.removeEventListener("resize", setup);
      cleanups.splice(0).forEach((fn) => fn());
    };
  }, []);

  return (
    <Section
      className="relative overflow-visible pb-8"
      data-scroll-rise
    >
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
          Манифест сервиса
        </p>
        <SplitWords
          as="h2"
          className="mt-3 max-w-3xl font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl lg:text-5xl"
          text="Be true. Be strong. Be bold."
        />
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-vanilla/70">
          Три принципа EasySite — наведите, чтобы раскрыть карточку.
        </p>
      </Reveal>

      <div
        ref={stageRef}
        className="be-stage relative mt-10 min-h-[40rem] w-full sm:min-h-[44rem] lg:min-h-[48rem]"
      >
        <div className="flex flex-col gap-4 lg:hidden">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-vanilla/10 bg-cosmic-lift"
            >
              <div
                className={`relative bg-gradient-to-br ${item.media} px-5 py-6`}
              >
                <p className="font-display text-2xl font-semibold text-ink">
                  {item.title}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-cosmic/70">
                  {item.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-cosmic/80">
                  {item.text}
                </p>
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cosmic underline-offset-4 hover:underline"
                >
                  {item.cta}
                  <ArrowIcon size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {items.map((item) => (
            <article
              key={item.id}
              data-be-card
              data-start-x={item.start.x}
              data-start-y={item.start.y}
              data-magnet-radius={item.magnet.radius}
              data-magnet-strength={item.magnet.strength}
              data-magnet-ease={item.magnet.ease}
              className="be-card pointer-events-auto absolute left-0 top-0"
            >
              <div
                data-be-shell
                className={[
                  "be-shell relative overflow-hidden border border-ink/15 shadow-[0_18px_50px_rgba(29,29,29,0.4)]",
                  item.toneClass,
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <div
                    data-be-media
                    className={`be-media absolute inset-0 bg-gradient-to-br ${item.media}`}
                  />
                  <div
                    data-be-media
                    className="be-media be-media--b absolute inset-0"
                  />
                </div>

                <div className="absolute left-1.5 top-1.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-vanilla">
                  <span
                    data-be-icon-open
                    className="inline-flex items-center justify-center"
                  >
                    <ArrowIcon size={14} className="translate-x-px" />
                  </span>
                  <span
                    data-be-icon-close
                    className="absolute inline-flex items-center justify-center opacity-0"
                  >
                    <CloseIcon size={13} />
                  </span>
                </div>

                <div
                  data-be-face
                  className="relative z-10 flex h-full items-center pl-12 pr-4"
                >
                  <span className="font-display text-[15px] font-semibold leading-none tracking-tight text-ink">
                    {item.title}
                  </span>
                </div>

                <div
                  data-be-panel
                  className="absolute inset-x-0 bottom-0 z-10 flex min-h-[14rem] flex-col justify-end px-6 pb-6"
                >
                  <p className="font-display text-3xl font-semibold text-vanilla">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-ember">
                    {item.subtitle}
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-vanilla/85">
                    {item.text}
                  </p>
                  <Link
                    href={item.href}
                    className="btn-arrow mt-5 inline-flex items-center gap-2 text-sm font-medium text-vanilla hover:text-ember"
                  >
                    {item.cta}
                    <span className="btn-arrow__icon inline-flex" aria-hidden>
                      <ArrowIcon size={13} />
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
