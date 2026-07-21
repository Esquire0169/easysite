import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

const steps = [
  {
    id: "01",
    title: "Заявка и оплата",
    desc: "Заполняете форму, платите фиксированные 10 000 ₽. Без калькуляторов и скрытых доплат.",
  },
  {
    id: "02",
    title: "24 часа работы",
    desc: "Дизайн, тексты, вёрстка и размещение на нашем хостинге — за сутки после передачи данных.",
  },
  {
    id: "03",
    title: "Домен easysite",
    desc: "Получаете сайт на домене с префиксом easysite — уже с SSL и базовой защитой.",
  },
  {
    id: "04",
    title: "Без правок",
    desc: "Дальше только использование готового продукта. Один выстрел — законченный сайт.",
  },
] as const;

/** Keep in sync with `app/how-it-works` (trailingSlash: true). */
const HOW_IT_WORKS_HREF = "/how-it-works/";

export function FourSteps() {
  return (
    <Section>
      {/* z-20: hover-scaled cards (z-2) must not cover this CTA */}
      <div className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Как это работает
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Четыре шага до готового сайта
          </h2>
        </div>
        <Button
          href={HOW_IT_WORKS_HREF}
          variant="secondary"
          className="shrink-0 self-start sm:self-auto"
        >
          Подробный сценарий
          <ArrowIcon size={13} />
        </Button>
      </div>

      <div className="four-steps-grid relative z-0 mt-10 grid gap-4 overflow-visible sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((step) => (
          <article
            key={step.id}
            className="four-step-card rounded-2xl border border-vanilla/10 bg-cosmic/60 p-6 backdrop-blur-sm"
          >
            <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-ember/70">
              {step.id}
            </span>
            <h3 className="mb-3 font-display text-xl font-semibold text-vanilla">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-vanilla/60">{step.desc}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
