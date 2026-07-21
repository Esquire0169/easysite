import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { canonicalPath, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Технологии и хостинг",
  description:
    "Собственный хостинг EasySite: сервера, SSL, домены с префиксом easysite и FAQ по платформе.",
  alternates: { canonical: canonicalPath("/tech") },
};

const pillars = [
  {
    title: "Сайт за сутки",
    text: "Скорость производства связана с единым стеком платформы: один процесс, предсказуемый деплой, без ручной сборки «с нуля» каждый раз.",
  },
  {
    title: "Своё железо",
    text: "Собственные сервера и настроенный хостинг. SSL, базовая защита и мониторинг включены — клиент не думает об инфраструктуре.",
  },
  {
    title: "Всё на одной платформе",
    text: "Платформа рассчитана на много проектов, а не на один-два. Экосистема быстрых сайтов для малого бизнеса и стартапов.",
  },
];

const techPoints = [
  {
    title: "Собственный хостинг и сервера",
    text: "Все сайты EasySite живут на нашей инфраструктуре. Это платформа, а не разовый фриланс: один стек, единые практики, легко масштабируемая система.",
  },
  {
    title: "SSL и базовая защита",
    text: "HTTPS из коробки, базовая защита и мониторинг доступности. Клиент получает ссылку на уже работающий сайт.",
  },
  {
    title: "Домены с префиксом easysite",
    text: `Форматы: ${siteConfig.domainExamples[0]} или ${siteConfig.domainExamples[1]}. Настройка домена — часть сервиса «под ключ».`,
  },
];

const faq = [
  {
    q: "Можно ли перенести сайт на другой хостинг?",
    a: "Модель EasySite рассчитана на жизнь сайта на нашей платформе. Перенос на сторонний хостинг не входит в стандартный оффер: мы даём скорость и законченность внутри своей инфраструктуры.",
  },
  {
    q: "Какие ограничения по нагрузке и трафику?",
    a: "Платформа покрывает типичную нагрузку лендингов и визиток малого бизнеса. Для аномальных пиков и сложных приложений формат EasySite не предназначен — это часть честных правил сервиса.",
  },
  {
    q: "Что по резервным копиям и доступности?",
    a: "Мы поддерживаем базовые резервные копии и мониторинг доступности на уровне платформы. Это часть «своего железа», а не ответственность клиента.",
  },
];

export default function TechPage() {
  return (
    <>
      <Section className="page-top">
        <PageHeader
          eyebrow="Инфраструктура"
          title="Технологии и хостинг"
          description="Клиент не думает ни о хостинге, ни о серверах, ни о SSL, ни о настройке домена — EasySite делает всё сам. Это платформа: один стек, единая инфраструктура, много бизнесов на общем фундаменте."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 70}>
              <Card hover className="h-full">
                <h2 className="font-display text-lg font-semibold text-vanilla">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                  {item.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-cosmic-deep/40">
        <div className="grid gap-4">
          {techPoints.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 50}>
              <Card>
                <h2 className="font-display text-xl font-semibold text-vanilla">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                  {item.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-vanilla">
            FAQ
          </h2>
        </Reveal>
        <div className="mt-8 space-y-3">
          {faq.map((item, index) => (
            <Reveal key={item.q} delayMs={index * 50}>
              <details className="group rounded-xl border border-vanilla/10 bg-cosmic-lift/70 p-5 open:border-vanilla/20">
                <summary className="cursor-pointer list-none font-display text-lg font-semibold text-vanilla marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-ember transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <Button href="/order" size="lg">
            Заказать сайт на платформе
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
