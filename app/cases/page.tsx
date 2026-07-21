import type { Metadata } from "next";
import { CasesCoverFlow } from "@/components/cases/CasesCoverFlow";
import { CasesGallery } from "@/components/cases/CasesGallery";
import { TextCycle } from "@/components/motion/TextCycle";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { cases } from "@/lib/cases";
import { canonicalPath } from "@/lib/site";

export const metadata: Metadata = {
  title: "Кейсы",
  description:
    "Галерея проектов EasySite: платные и бесплатные сайты на общей платформе.",
  alternates: { canonical: canonicalPath("/cases") },
};

/* Genitive after «для»: each phrase must agree with that slot */
const CYCLE = [
  "малого бизнеса",
  "стартапов",
  "креатива",
  "социальных проектов",
] as const;

export default function CasesPage() {
  return (
    <>
      <Section className="page-top pb-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Портфолио платформы
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-vanilla sm:text-5xl lg:text-[3.25rem]">
            Кейсы EasySite
          </h1>
          <p className="mt-5 text-base leading-relaxed text-vanilla/75 sm:text-lg">
            Экосистема быстрых сайтов для{" "}
            <TextCycle phrases={CYCLE} className="font-medium text-ember" />.
            Каждый — на общей инфраструктуре.
          </p>
        </div>
      </Section>

      <CasesCoverFlow items={cases} />

      <Section className="pb-24">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Все проекты
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-vanilla sm:text-3xl">
            Галерея с фильтрами
          </h2>
        </Reveal>
        <div className="mt-8">
          <CasesGallery items={cases} />
        </div>
      </Section>
    </>
  );
}
