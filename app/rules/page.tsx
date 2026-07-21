import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { fixedFormula, honestLine, siteConfig, canonicalPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Правила EasySite",
  description:
    "Манифест EasySite: фиксированная цена 10 000 ₽, срок 24 часа, без правок, свой хостинг и домены easysite.",
  alternates: { canonical: canonicalPath("/rules") },
};

const rules = [
  {
    title: "Фиксированная цена 10 000 ₽",
    text: "Оффер всегда один. Никаких скрытых доплат, апсейлов и «пакетов». Платите ровно столько — получаете сайт.",
  },
  {
    title: "Срок до 24 часов",
    text: "После оплаты и передачи исходных данных сайт готов за сутки. Скорость — не маркетинг, а формат работы.",
  },
  {
    title: "Без правок после сдачи",
    text: "Мы делаем один законченный продукт. Согласования и бесконечные правки — не наша модель.",
  },
  {
    title: "Формат: лендинг / визитка",
    text: "Примерно 5–7 смысловых блоков. Не сложные сервисы, кабинеты и маркетплейсы — только быстрые сайты для бизнеса.",
  },
  {
    title: "Только наш хостинг и сервера",
    text: "Размещение на инфраструктуре EasySite: собственные сервера, настроенный хостинг, SSL, базовая защита и мониторинг.",
  },
  {
    title: "Домен с префиксом easysite",
    text: `Домены вида ${siteConfig.domainExamples[0]} или ${siteConfig.domainExamples[1]}. Клиент не настраивает DNS вручную — платформа делает это сама.`,
  },
  {
    title: "Публикация в портфолио",
    text: "Мы можем показать проект в кейсах EasySite. Платформа растёт как экосистема быстрых сайтов, а не как закрытый подряд.",
  },
];

export default function RulesPage() {
  return (
    <>
      <Section className="page-top">
        <PageHeader
          eyebrow="Манифест"
          title="Правила EasySite"
          description={
            <>
              Жёсткий и честный оффер. {fixedFormula} Если вам нужны бесконечные
              правки и долгий процесс — это не к нам.
            </>
          }
        />
      </Section>

      <Section className="pt-0">
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <Reveal key={rule.title} delayMs={index * 40}>
              <article className="grid gap-4 rounded-xl border border-vanilla/10 bg-cosmic-lift/70 p-5 sm:grid-cols-[auto_1fr] sm:gap-6 sm:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ember/35 bg-ember/10 font-display text-lg font-semibold text-ember">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-vanilla">
                    {rule.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-vanilla/70">
                    {rule.text}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <blockquote className="rounded-xl border border-ember/25 bg-ember/10 px-6 py-5">
            <p className="font-display text-lg font-semibold text-vanilla">
              {fixedFormula}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
              {honestLine}
            </p>
          </blockquote>
        </Reveal>

        <Reveal className="mt-10">
          <Button href="/order" size="lg">
            Принимаю правила — заказать
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
