"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { prefersReducedMotion } from "@/lib/motion";

const pillars = [
  {
    title: "Скорость",
    subtitle: "Запуск без ожидания",
    text: "Сайт появляется через сутки после оплаты и заполнения брифа. Один выстрел — готовый продукт.",
  },
  {
    title: "Своё железо",
    subtitle: "Под капотом",
    text: "Хостинг, серверы, SSL и базовая защита уже включены. Стек собирать не нужно.",
  },
  {
    title: "Фикс",
    subtitle: "Без доплат и правок",
    text: "Честная формула: фиксированная цена, срок и формат. Если нужны бесконечные правки — это не к нам.",
  },
] as const;

const FLASH = "rgba(255, 242, 117, 0.1)";
const DESKTOP_GAP = 32;

/**
 * Three pillars — shared absolute stage, non-overlapping push on one x-axis.
 * Plays once per page view (no reverse on scroll back). Hard reload always replays.
 *
 * Choreography:
 * 1. Card2 drives in → slot 2
 * 2. Card3 pushes card2 all the way to slot 0; card3 lands in slot 2 (middle empty)
 * 3. Card1 enters and rearranges: final 1→0, 2→1, 3→2
 */
export function ThreePillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length !== 3) return;

    const [card1, card2, card3] = cards;

    const flashCard = (el: HTMLElement, at: number, tl: gsap.core.Timeline) => {
      tl.fromTo(
        el,
        { backgroundColor: "transparent" },
        {
          backgroundColor: FLASH,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: "power1.out",
          overwrite: "auto",
        },
        at,
      );
    };

    const clearDesktopLayout = () => {
      stage.style.height = "";
      cards.forEach((card) => {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.height = "";
      });
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const getLayout = () => {
          const stageW = stage.offsetWidth;
          const slotW = (stageW - DESKTOP_GAP * 2) / 3;
          const d = slotW + DESKTOP_GAP;
          return { slotW, d };
        };

        const applyLayout = () => {
          const { slotW, d } = getLayout();
          cards.forEach((card) => {
            card.style.position = "absolute";
            card.style.top = "0";
            card.style.left = "0";
            card.style.width = `${slotW}px`;
            card.style.height = "auto";
          });
          const maxH = Math.max(...cards.map((c) => c.offsetHeight));
          stage.style.height = `${maxH}px`;
          cards.forEach((card) => {
            card.style.height = `${maxH}px`;
          });
          return { slotW, d };
        };

        const slot = (i: number) => () => getLayout().d * i;
        const offLeft = () => -getLayout().d * 1.5 - 60;
        const offRight = () => stage.offsetWidth + 60;

        applyLayout();

        if (prefersReducedMotion()) {
          gsap.set(card1, { autoAlpha: 1, x: slot(0)(), y: 0, scale: 1 });
          gsap.set(card2, { autoAlpha: 1, x: slot(1)(), y: 0, scale: 1 });
          gsap.set(card3, { autoAlpha: 1, x: slot(2)(), y: 0, scale: 1 });
          return () => clearDesktopLayout();
        }

        // Start: card2 from right, card3 further right, card1 waiting off left
        gsap.set(card1, { autoAlpha: 0, x: offLeft(), y: 0, scale: 1 });
        gsap.set(card2, { autoAlpha: 0, x: offRight(), y: 0, scale: 1 });
        gsap.set(card3, {
          autoAlpha: 0,
          x: () => offRight() + getLayout().d,
          y: 0,
          scale: 1,
        });

        const tl = gsap.timeline({
          defaults: { overwrite: "auto" },
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none none",
            once: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              applyLayout();
            },
          },
        });

        // 1. Card2 enters → slot 2
        tl.to(
          card2,
          {
            autoAlpha: 1,
            x: slot(2),
            duration: 1,
            ease: "power3.out",
          },
          0,
        );
        flashCard(card2, 0.06, tl);

        // 2. Card3 pushes card2: slot 2 → slot 0; card3 lands slot 2 (middle empty)
        const pushAt = 0.95;
        tl.to(
          card2,
          {
            x: slot(0),
            duration: 1.1,
            ease: "power2.inOut",
          },
          pushAt,
        );
        tl.to(
          card3,
          {
            autoAlpha: 1,
            x: slot(2),
            duration: 1.1,
            ease: "power2.inOut",
          },
          pushAt,
        );
        flashCard(card3, pushAt + 0.05, tl);

        // 3. Card1 enters and rearranges everyone into final 0-1-2
        const settleAt = 2.15;
        tl.to(
          card1,
          {
            autoAlpha: 1,
            x: slot(0),
            duration: 1.15,
            ease: "power3.inOut",
          },
          settleAt,
        );
        tl.to(
          card2,
          {
            x: slot(1),
            duration: 1.15,
            ease: "power3.inOut",
          },
          settleAt,
        );
        tl.to(
          card3,
          {
            x: slot(2),
            duration: 1.15,
            ease: "power3.inOut",
          },
          settleAt,
        );
        flashCard(card1, settleAt + 0.08, tl);

        return () => {
          tl.kill();
          clearDesktopLayout();
        };
      });

      // Mobile: stacked layout, staggered fade once per page view
      mm.add("(max-width: 767px)", () => {
        clearDesktopLayout();
        // Equal-height stack without absolute stage / horizontal push.
        stage.style.height = "";
        cards.forEach((card) => {
          card.style.position = "";
          card.style.top = "";
          card.style.left = "";
          card.style.width = "100%";
          card.style.height = "auto";
          card.style.maxWidth = "100%";
        });

        if (prefersReducedMotion()) {
          gsap.set(cards, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: "transform" });
          return;
        }

        gsap.set(cards, { autoAlpha: 0, y: 20, x: 0, scale: 1 });

        const tl = gsap.timeline({
          defaults: { overwrite: "auto" },
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        tl.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(cards, { clearProps: "transform" });
          },
        });

        return () => {
          tl.kill();
        };
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-pillars relative overflow-x-clip overflow-y-visible py-24 sm:py-28 lg:py-32"
    >
      <div
        className="pointer-events-none absolute -left-28 top-1/3 h-80 w-80 rounded-full bg-ember/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-vanilla/10 blur-3xl"
        aria-hidden
      />

      <Container className="relative z-10 overflow-visible">
        <div className="mb-14 max-w-2xl sm:mb-16">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Платформа
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl lg:text-5xl">
            Три опоры EasySite
          </h2>
          <p className="mt-4 text-base leading-relaxed text-vanilla/70">
            Скорость, своё железо и честный фикс — без швов между обещанием и
            продуктом.
          </p>
        </div>

        <div
          ref={stageRef}
          className="relative flex flex-col gap-6 overflow-visible md:block md:gap-0"
        >
          {pillars.map((pillar, i) => (
            <div
              key={pillar.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="w-full max-w-full overflow-visible md:will-change-transform"
            >
              <Card
                hover
                className="group relative flex h-full flex-col overflow-visible border-vanilla/10 bg-cosmic-lift/70"
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ember/0 to-transparent transition-colors duration-500 group-hover:from-ember/10"
                  aria-hidden
                />
                <span className="relative mb-3 block text-xs font-medium uppercase tracking-[0.2em] text-ember/80">
                  0{i + 1}
                </span>
                <h3 className="relative font-display text-2xl font-semibold text-vanilla">
                  {pillar.title}
                </h3>
                <p className="relative mt-1 text-sm font-medium text-vanilla/60">
                  {pillar.subtitle}
                </p>
                <p className="relative mt-4 text-sm leading-relaxed text-vanilla/50">
                  {pillar.text}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
