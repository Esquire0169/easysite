import type { Metadata } from "next";
import { CaseCard } from "@/components/cases/CaseCard";
import { FreeSiteForm } from "@/components/forms/FreeSiteForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getFreeCases } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Бесплатные сайты",
  description:
    "Программа EasySite: 2–3 бесплатных сайта в месяц для крутых и социально значимых проектов.",
};

const conditions = [
  "Отбираем топовые, социально значимые или просто выдающиеся проекты.",
  "Бесплатные сайты идут по той же модели: 24 часа, без правок, наш хостинг и префикс easysite.",
  "Формат тот же — лендинг / визитка на 5–7 смысловых блоков.",
  "Публикация в портфолио возможна — это часть экосистемы платформы.",
];

export default function FreeSitesPage() {
  const freeCases = getFreeCases();

  return (
    <>
      <Section className="pt-14 sm:pt-16">
        <PageHeader
          eyebrow="Сообщество"
          title="Бесплатные сайты"
          description="Каждый месяц EasySite делает 2–3 сайта бесплатно для крутых и важных бизнесов и инициатив. Платформа не только зарабатывает — она помогает сообществу."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full">
              <h2 className="font-display text-2xl font-semibold text-vanilla">
                Правила отбора
              </h2>
              <ul className="mt-5 space-y-3">
                {conditions.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-vanilla/75"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>

          <Reveal delayMs={80}>
            <Card>
              <h2 className="font-display text-2xl font-semibold text-vanilla">
                Подать заявку
              </h2>
              <p className="mt-3 text-sm text-vanilla/65">
                Расскажите о проекте. Если отберём — сделаем сайт по стандарту
                EasySite, просто без оплаты с вашей стороны.
              </p>
              <div className="mt-6">
                <FreeSiteForm />
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>

      <Section>
        <Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-vanilla">
            Уже сделанные бесплатные сайты
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-vanilla/70">
            Те же сроки, та же инфраструктура, те же правила — без счёта
            клиенту.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {freeCases.map((item, index) => (
            <Reveal key={item.slug} delayMs={index * 70}>
              <CaseCard item={item} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
