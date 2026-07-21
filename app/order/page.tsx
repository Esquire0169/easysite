import type { Metadata } from "next";
import { OrderForm } from "@/components/forms/OrderForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { fixedFormula, honestLine, siteConfig, canonicalPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Заказать сайт",
  description:
    "Заявка на сайт EasySite за 10 000 ₽: готовый сайт за 24 часа без правок на нашей инфраструктуре.",
  alternates: { canonical: canonicalPath("/order") },
};

const afterOrder = [
  {
    title: "Сайт за сутки",
    text: "После оплаты и передачи исходных данных сайт появляется за 24 часа.",
  },
  {
    title: "Своё железо",
    text: "Хостинг, сервера, SSL и базовая защита — уже внутри EasySite.",
  },
  {
    title: "Всё на одной платформе",
    text: "Домен с префиксом easysite и единая инфраструктура для множества бизнесов.",
  },
];

export default function OrderPage() {
  return (
    <>
      <Section className="page-top">
        <PageHeader
          eyebrow="Платный оффер"
          title="Заказать сайт за 10 000 ₽"
          description={
            <>
              EasySite — быстрый и честный сервис сайтов для бизнеса.{" "}
              {fixedFormula} После отправки заявки и оплаты вы получаете сайт за
              сутки без правок.
            </>
          }
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <Reveal>
            <Card>
              <h2 className="font-display text-2xl font-semibold text-vanilla">
                Заявка
              </h2>
              <p className="mt-3 text-sm text-vanilla/65">
                Чем точнее опишете блоки и стиль — тем лучше сработает один
                выстрел. Формат: лендинг / визитка, примерно 5–7 смысловых
                блоков.
              </p>
              <div className="mt-6">
                <OrderForm />
              </div>
            </Card>
          </Reveal>

          <div className="space-y-4">
            {afterOrder.map((item, index) => (
              <Reveal key={item.title} delayMs={index * 70}>
                <Card hover>
                  <h3 className="font-display text-lg font-semibold text-vanilla">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-vanilla/70">
                    {item.text}
                  </p>
                </Card>
              </Reveal>
            ))}

            <Reveal delayMs={220}>
              <Card className="border-ember/25 bg-ember/10">
                <p className="font-display text-lg font-semibold text-vanilla">
                  Что происходит дальше
                </p>
                <p className="mt-3 text-sm leading-relaxed text-vanilla/75">
                  Подтверждаем заявку → оплата {siteConfig.price} → передаёте
                  исходные данные → через {siteConfig.deadline} получаете
                  ссылку на готовый сайт. Правок после сдачи нет.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-vanilla/60">
                  {honestLine}
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
