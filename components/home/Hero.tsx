"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextScramble } from "@/components/motion/TextScramble";
import { TextShine } from "@/components/motion/TextShine";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowIcon } from "@/components/ui/icons";
import { prefersReducedMotion } from "@/lib/motion";
import { siteConfig } from "@/lib/site";

/**
 * Hero — always in document flow (never absolute / never autoAlpha:0).
 * Scroll storytelling is driven by HomeScroll on accents only.
 */
export function Hero() {
  const layerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || prefersReducedMotion()) return;

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20;
      const y = (event.clientY / window.innerHeight - 0.5) * 14;
      layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // One-shot entrance after loader — never leaves content hidden
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const words = root.querySelectorAll<HTMLElement>(".hero-word");
    const meta = root.querySelectorAll<HTMLElement>("[data-hero-enter]");
    if (!words.length) return;

    const play = () => {
      gsap.fromTo(
        words,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
          overwrite: true,
        },
      );
      if (meta.length) {
        gsap.fromTo(
          meta,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            delay: 0.25,
            stagger: 0.06,
            ease: "power3.out",
            overwrite: true,
          },
        );
      }
    };

    // Safety: if animation never runs, words stay at opacity 1 from CSS
    gsap.set(words, { opacity: 1, y: 0 });
    gsap.set(meta, { opacity: 1, y: 0 });

    if (document.documentElement.classList.contains("is-loading")) {
      const onReady = () => play();
      window.addEventListener("easysite:ready", onReady, { once: true });
      const t = window.setTimeout(play, 3000);
      return () => {
        window.removeEventListener("easysite:ready", onReady);
        window.clearTimeout(t);
      };
    }

    play();
  }, []);

  return (
    <section
      ref={rootRef}
      className="hero relative isolate min-h-[100svh] overflow-hidden bg-cosmic"
    >
      <div
        ref={layerRef}
        className="hero-illustration pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div
          data-speed="0.7"
          data-lag="0.25"
          className="hero-shape-a absolute -left-28 top-8 h-[22rem] w-[22rem] rounded-full bg-vanilla/12 blur-3xl sm:h-[28rem] sm:w-[28rem]"
        />
        <div
          data-speed="1.15"
          data-lag="0.55"
          className="hero-shape-b absolute -right-20 top-20 h-[24rem] w-[24rem] rounded-full bg-ember/25 blur-3xl sm:h-[32rem] sm:w-[32rem]"
        />
        <div
          data-speed="0.9"
          data-lag="0.4"
          className="hero-shape-c absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-vanilla/10 blur-3xl"
        />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-center pb-24 pt-28">
        <div data-hero-enter>
          <TextScramble
            as="p"
            immediate
            className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-vanilla/70 sm:text-base"
            text={siteConfig.name}
          />
        </div>

        <h1 className="mt-5 max-w-4xl font-display text-[2.35rem] font-semibold leading-[1.08] tracking-tight text-vanilla sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
          <span className="hero-word block">Сайт за сутки.</span>
          <TextShine as="span" className="hero-word block">
            10&nbsp;000&nbsp;₽.
          </TextShine>
          <span className="hero-word block">Никаких правок.</span>
        </h1>

        <p
          data-hero-enter
          className="mt-6 max-w-xl text-lg leading-relaxed text-vanilla/70"
        >
          Бриф → дизайн → код → онлайн за 24 часа. Хостинг и домен easysite —
          уже внутри. Один выстрел — готовый продукт.
        </p>

        <div
          data-hero-enter
          className="hero-cta mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Magnetic>
            <Button href="/order" size="lg" className="btn-arrow">
              Заказать сайт
              <span className="btn-arrow__icon inline-flex" aria-hidden>
                <ArrowIcon size={15} />
              </span>
            </Button>
          </Magnetic>
          <Button href="/rules" variant="secondary" size="lg">
            Правила EasySite
          </Button>
        </div>

        {/* Scroll cue — fills as you leave the hero */}
        <div
          className="hero-progress absolute bottom-8 left-0 right-0 mx-auto flex max-w-xs items-center gap-3 px-4 sm:bottom-10"
          aria-hidden
        >
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-vanilla/15">
            <div className="hero-progress-bar h-full w-full origin-left scale-x-0 bg-ember" />
          </div>
          <span className="text-xs font-medium tracking-widest text-vanilla/45">
            scroll
          </span>
        </div>
      </Container>
    </section>
  );
}
