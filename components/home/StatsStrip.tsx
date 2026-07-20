"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { prefersReducedMotion } from "@/lib/motion";

const stats = [
  { value: 24, suffix: "ч", label: "на готовый сайт после оплаты и брифа" },
  { value: 10000, suffix: " ₽", label: "фиксированная цена, без скрытых доплат" },
  { value: 0, suffix: "", label: "правок после сдачи — один законченный продукт" },
] as const;

export function StatsStrip() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const numbers = root.querySelectorAll<HTMLElement>("[data-count]");

    if (prefersReducedMotion()) {
      numbers.forEach((node) => {
        const end = Number(node.dataset.count ?? 0);
        node.textContent = end.toLocaleString("ru-RU");
      });
      return;
    }

    const ctx = gsap.context(() => {
      numbers.forEach((node) => {
        const end = Number(node.dataset.count ?? 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: end,
          duration: end >= 1000 ? 1.6 : 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: node,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            node.textContent = Math.round(obj.val).toLocaleString("ru-RU");
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <Section className="pt-0">
      <div
        ref={rootRef}
        className="grid gap-4 rounded-2xl bg-cosmic-deep/40 p-6 sm:grid-cols-3 sm:p-8"
      >
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delayMs={index * 70}>
            <div className="text-center sm:text-left">
              <p className="font-display text-4xl font-semibold tracking-tight text-ember sm:text-5xl">
                <span data-count={stat.value}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-vanilla/65">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
