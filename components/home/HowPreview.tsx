import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ArrowIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

const steps = [
  {
    n: "01",
    title: "Заявка и оплата",
    text: "Заполняете форму, платите фиксированные 10 000 ₽. Без калькуляторов и скрытых доплат.",
  },
  {
    n: "02",
    title: "24 часа работы",
    text: "Дизайн, тексты, вёрстка и размещение на нашем хостинге — за сутки после передачи данных.",
  },
  {
    n: "03",
    title: "Домен easysite",
    text: "Получаете сайт на домене с префиксом easysite — уже с SSL и базовой защитой.",
  },
  {
    n: "04",
    title: "Без правок",
    text: "Дальше только использование готового продукта. Один выстрел — законченный сайт.",
  },
];

/**
 * How-it-works preview.
 * Desktop: HomeScroll pins `[data-how-stage]` and scrubs children (fill + step accents).
 * Mobile: batch pop only — content always readable (never opacity-killed).
 */
export function HowPreview() {
  return (
    <Section className="section-how">
      <div
        data-scroll-rise
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Как это работает
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Четыре шага до готового сайта
          </h2>
        </div>
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ember transition-colors hover:text-ember-hover"
        >
          Подробный сценарий
          <ArrowIcon size={13} />
        </Link>
      </div>

      <div data-how-stage className="relative mt-8">
        <div className="relative mb-8 hidden max-w-full lg:block" aria-hidden>
          <div className="h-px w-full bg-vanilla/15" />
          <div
            data-how-fill
            className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-ember will-change-transform"
          />
        </div>

        <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.n}
              data-how-step
              data-how-index={index}
              className="will-change-transform"
            >
              <Card hover className="h-full">
                <p
                  data-how-num
                  className="font-display text-sm text-ember will-change-transform"
                >
                  {step.n}
                </p>
                <p
                  data-how-title
                  className="mt-3 font-display text-lg font-semibold text-vanilla"
                >
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-vanilla/70">
                  {step.text}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
