import Link from "next/link";
import { cases } from "@/lib/cases";
import { CaseCard } from "@/components/cases/CaseCard";
import { ArrowIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

export function CasesPreview() {
  const preview = cases.slice(0, 3);

  return (
    <Section className="pb-24 sm:pb-28">
      <div
        data-scroll-rise
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Кейсы
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Сайты на платформе EasySite
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-vanilla/70">
            Мы строим экосистему быстрых сайтов для малого бизнеса и стартапов —
            каждый со своим доменом, на общей инфраструктуре.
          </p>
        </div>
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ember transition-colors hover:text-ember-hover"
        >
          Все кейсы
          <ArrowIcon size={13} />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {preview.map((item) => (
          <div key={item.slug} data-scroll-item className="h-full">
            <CaseCard item={item} />
          </div>
        ))}
      </div>
    </Section>
  );
}
