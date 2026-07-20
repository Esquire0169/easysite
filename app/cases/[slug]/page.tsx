import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import {
  cases,
  categoryLabels,
  getCaseBySlug,
} from "@/lib/cases";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) return { title: "Кейс" };
  return {
    title: item.title,
    description: item.summary,
  };
}

export default async function CaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) notFound();

  return (
    <Section className="pt-14 sm:pt-16 pb-24">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
          Кейс
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-vanilla sm:text-5xl">
          {item.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone={item.pricing === "free" ? "ember" : "muted"}>
            {item.pricing === "free" ? "Бесплатный" : "Платный"}
          </Badge>
          <Badge>{categoryLabels[item.category]}</Badge>
          <Badge tone="muted">{item.businessType}</Badge>
        </div>
      </Reveal>

      <div
        className="mt-10 aspect-[21/9] overflow-hidden rounded-2xl border border-vanilla/10"
        style={{
          background: `linear-gradient(135deg, ${item.accent}40 0%, #4f1db5 50%, #3a0ca3 100%)`,
        }}
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Reveal>
          <Card>
            <h2 className="font-display text-2xl font-semibold text-vanilla">
              О проекте
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vanilla/75">
              {item.description}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-vanilla/60">
              Проект размещён на платформе EasySite: единый стек, собственный
              хостинг, SSL и домен с префиксом easysite. Это часть экосистемы
              быстрых сайтов — не разовая фриланс-сборка.
            </p>
          </Card>
        </Reveal>

        <Reveal delayMs={80}>
          <Card className="h-full">
            <h2 className="font-display text-xl font-semibold text-vanilla">
              Инфраструктура
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-vanilla/45">Домен</dt>
                <dd className="mt-1 text-vanilla">{item.domain}</dd>
              </div>
              <div>
                <dt className="text-vanilla/45">Модель</dt>
                <dd className="mt-1 text-vanilla">
                  {item.pricing === "free"
                    ? "Бесплатный сайт по правилам EasySite"
                    : "Платный сайт за 10 000 ₽"}
                </dd>
              </div>
              <div>
                <dt className="text-vanilla/45">Срок</dt>
                <dd className="mt-1 text-vanilla">До 24 часов</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-3">
              <Button href="/order">Заказать такой же</Button>
              <Link
                href="/cases"
                className="text-center text-sm text-vanilla/65 transition-colors hover:text-vanilla"
              >
                ← Ко всем кейсам
              </Link>
            </div>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
