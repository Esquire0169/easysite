import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import {
  canonicalPath,
  fixedFormula,
  honestLine,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Как это работает",
  description:
    "Подробный сценарий EasySite: заявка и оплата → 24 часа работы → домен easysite → без правок. Фиксированные 10 000 ₽.",
  alternates: { canonical: canonicalPath("/how-it-works") },
};

const steps = [
  {
    id: "01",
    title: "Заявка и оплата",
    lead: "Один бриф. Фиксированная цена.",
    text: "Заполняете форму: компания, деятельность, контакты, пожелания по стилю и обязательные блоки. Оплачиваете фиксированные 10 000 ₽ — без калькуляторов, пакетов и скрытых доплат. После оплаты и передачи данных стартует срок 24 часа.",
  },
  {
    id: "02",
    title: "24 часа работы",
    lead: "Дизайн, тексты, вёрстка, размещение.",
    text: "Команда собирает сайт целиком: визуал, смыслы, вёрстку и публикацию на хостинге EasySite. Это не серия согласований, а один законченный продукт — готовый к использованию через сутки.",
  },
  {
    id: "03",
    title: "Домен easysite",
    lead: "Ссылка уже работает.",
    text: `Вы получаете сайт на домене с префиксом easysite — например ${siteConfig.domainExamples[0]} или ${siteConfig.domainExamples[1]}. SSL и базовая защита уже включены. DNS и сервера настраиваем мы.`,
  },
  {
    id: "04",
    title: "Без правок",
    lead: "Дальше только использование.",
    text: "После сдачи правок нет. Один выстрел — законченный сайт. Если нужны бесконечные итерации и долгий процесс, EasySite вам не подходит. Мы про скорость и законченность.",
  },
] as const;

const highlights = [
  {
    title: "Фиксированная цена",
    text: "Всегда 10 000 ₽. Никаких апсейлов и «пакетов».",
  },
  {
    title: "Срок до 24 часов",
    text: "После оплаты и брифа сайт готов за сутки.",
  },
  {
    title: "Свой хостинг",
    text: "Сервера EasySite, SSL, мониторинг — в комплекте.",
  },
  {
    title: "Формат визитки",
    text: "Лендинг / визитка на 5–7 блоков. Не кабинеты и маркетплейсы.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <Section className="page-top">
        <PageHeader
          eyebrow="Подробный сценарий"
          title="Как работает EasySite"
          description={
            <>
              Четыре шага от заявки до готовой ссылки. {fixedFormula} Сайт
              появляется за 24 часа — как законченный продукт, а не как черновик
              для бесконечных правок.
            </>
          }
        />
        <Reveal className="mt-6 max-w-2xl">
          <p className="rounded-xl border border-vanilla/10 bg-cosmic-lift/60 px-5 py-4 text-sm leading-relaxed text-vanilla/70">
            {honestLine}
          </p>
        </Reveal>
      </Section>

      <Section className="pt-0">
        <ol className="grid gap-4 lg:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.id} className="h-full list-none">
              <Reveal delayMs={index * 50} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-vanilla/10 bg-cosmic/60 p-6 backdrop-blur-sm sm:p-7">
                  <span className="mb-4 font-mono text-xs uppercase tracking-widest text-ember/70">
                    Шаг {step.id}
                  </span>
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-vanilla">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-ember">
                    {step.lead}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-vanilla/70">
                    {step.text}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="bg-ink/40">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Правила в двух словах
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Что важно знать заранее
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 40}>
              <article className="rounded-xl border border-vanilla/10 bg-cosmic-lift/70 p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold text-vanilla">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-vanilla/70">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Button href="/rules" variant="secondary">
            Читать полный манифест
          </Button>
        </Reveal>
      </Section>

      <Section>
        <Reveal>
          <div className="flex flex-col gap-5 rounded-2xl border border-ember/25 bg-cosmic-lift/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-semibold text-vanilla sm:text-3xl">
                Готовы к одному выстрелу?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                Оставьте заявку — и через сутки получите работающий сайт на
                инфраструктуре EasySite.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button href="/order" size="lg">
                Заказать сайт
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Связаться
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
