import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { honestLine, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Как это работает",
  description:
    "Сценарий EasySite: заявка, оплата 10 000 ₽, сайт за 24 часа, домен easysite, без правок после сдачи.",
};

const timeline = [
  {
    title: "Заявка и исходные данные",
    text: "Клиент заполняет форму: компания, деятельность, контакты, пожелания по стилю и обязательные блоки. Чем яснее бриф — тем точнее один выстрел.",
  },
  {
    title: "Оплата 10 000 ₽",
    text: "Фиксированная цена. Никаких скрытых доплат, пакетных опций и сложных калькуляторов. После оплаты стартует срок 24 часа.",
  },
  {
    title: "24 часа на производство",
    text: "Команда делает сайт целиком: дизайн, тексты, вёрстку и размещение на нашем хостинге. Один законченный продукт — не бесконечные согласования.",
  },
  {
    title: "Домен с префиксом easysite",
    text: `Сайт выходит на домене вроде ${siteConfig.domainExamples[0]} или ${siteConfig.domainExamples[1]}. SSL и базовая защита уже включены.`,
  },
  {
    title: "Только использование",
    text: "После сдачи правок нет. Дальше — работа с готовым сайтом. Если нужны бесконечные итерации, EasySite вам не подходит.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Section className="pt-14 sm:pt-16">
        <PageHeader
          eyebrow="Процесс"
          title="Как работает EasySite"
          description={
            <>
              Сайт появляется за 24 часа после оплаты и передачи исходных данных
              — это главный тезис сервиса. Мы не входим в долгие согласования:
              делаем работающий сайт и отдаём его как законченный продукт.
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
        <ol className="relative space-y-4 border-l border-vanilla/15 pl-6 sm:pl-8">
          {timeline.map((item, index) => (
            <Reveal key={item.title} delayMs={index * 60}>
              <li className="relative pb-2">
                <span className="absolute -left-[1.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-ember/50 bg-cosmic text-[11px] font-semibold text-ember sm:-left-[2.35rem]">
                  {index + 1}
                </span>
                <Card>
                  <h2 className="font-display text-xl font-semibold text-vanilla">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                    {item.text}
                  </p>
                </Card>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/order" size="lg">
              Заказать сайт
            </Button>
            <Button href="/rules" variant="secondary" size="lg">
              Читать правила
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
