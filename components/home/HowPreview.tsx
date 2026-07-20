import Link from "next/link";
import { GrowLine } from "@/components/motion/GrowLine";
import { StaggerIn } from "@/components/motion/StaggerIn";
import { Card } from "@/components/ui/Card";
import { ArrowIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
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

export function HowPreview() {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Как это работает
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Четыре шага до готового сайта
          </h2>
        </Reveal>
        <Reveal delayMs={80}>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ember transition-colors hover:text-ember-hover"
          >
            Подробный сценарий
            <ArrowIcon size={13} />
          </Link>
        </Reveal>
      </div>

      <div className="relative mt-8">
        <GrowLine className="mb-8 hidden max-w-full lg:block" />
      </div>

      <StaggerIn
        className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        from="start"
      >
        {steps.map((step) => (
          <div key={step.n} data-stagger-item>
            <Card hover className="h-full">
              <p className="font-display text-sm text-ember">{step.n}</p>
              <p className="mt-3 font-display text-lg font-semibold text-vanilla">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-vanilla/70">
                {step.text}
              </p>
            </Card>
          </div>
        ))}
      </StaggerIn>
    </Section>
  );
}
