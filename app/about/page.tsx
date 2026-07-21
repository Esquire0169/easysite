import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { canonicalPath, honestLine, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "EasySite — дочерний проект Web Giants. Быстрый и честный сервис сайтов за 24 часа.",
  alternates: { canonical: canonicalPath("/about") },
};

const principles = [
  {
    title: "Скорость как продукт",
    text: "24 часа — не обещание «по возможности», а формат. Мы проектируем процесс так, чтобы сайт появлялся быстро и целиком.",
  },
  {
    title: "Честность правил",
    text: "Фиксированная цена, фиксированный срок, фиксированный формат. Без театра согласований и скрытых этапов.",
  },
  {
    title: "Студия-автор",
    text: "Мы не собираем комитет на каждый пиксель. Авторский подход: делаем законченный сайт и отдаём его в работу.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section className="page-top">
        <PageHeader
          eyebrow={`${siteConfig.name} × ${siteConfig.parent}`}
          title="О EasySite"
          description="EasySite — быстрый и честный сервис создания сайтов для бизнеса. Дочерний проект группы Web Giants: глобальная линия быстрых сайтов за 24 часа на собственной инфраструктуре."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <h2 className="font-display text-2xl font-semibold text-vanilla">
                Миссия
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-vanilla/75">
                Дать малому бизнесу и стартапам работающий сайт без долгих
                процессов: оплатил, передал данные — через сутки получил ссылку.
                Дизайн, тексты, вёрстка, домен, хостинг и SSL — всё внутри
                одного сервиса.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-vanilla/65">
                {honestLine}
              </p>
            </Card>
          </Reveal>
          <Reveal delayMs={80}>
            <Card className="h-full">
              <h2 className="font-display text-2xl font-semibold text-vanilla">
                Подход к дизайну
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-vanilla/75">
                Чистый модульный визуальный язык, сильный оффер, понятная
                структура. Мы не рисуем «на века» и не уходим в бесконечные
                варианты — собираем сайт, который сразу можно использовать.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-vanilla/65">
                Параллельно развиваем программу бесплатных сайтов: 2–3 проекта в
                месяц для важных и крутых инициатив — по тем же правилам
                платформы.
              </p>
            </Card>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 70}>
              <Card hover className="h-full">
                <h3 className="font-display text-lg font-semibold text-vanilla">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                  {item.text}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/order" size="lg">
              Заказать сайт
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Связаться
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
