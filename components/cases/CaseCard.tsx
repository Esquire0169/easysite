import Link from "next/link";
import type { CaseItem } from "@/lib/cases";
import { categoryLabels } from "@/lib/cases";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon } from "@/components/ui/icons";
import { CaseCardMotion } from "@/components/motion/CaseCardMotion";

type CaseCardProps = {
  item: CaseItem;
};

export function CaseCard({ item }: CaseCardProps) {
  const href = item.externalUrl ?? `/cases/${item.slug}`;
  const external = Boolean(item.externalUrl);

  return (
    <CaseCardMotion>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/25 bg-cosmic-lift/80 transition-colors duration-200 hover:border-vanilla/25 hover:bg-cosmic-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
      >
        <div
          data-case-mask
          className="relative aspect-[16/10] border-b border-ink/20"
          style={{
            background: `linear-gradient(145deg, ${item.accent}33 0%, #4f1db5 50%, #1d1d1d 100%)`,
          }}
        >
          <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_40%,rgba(255,242,117,0.25),transparent_40%)]" />
          <div className="absolute bottom-4 left-4 right-4" data-assemble>
            <p className="font-display text-lg font-semibold text-vanilla drop-shadow">
              {item.title}
            </p>
            <p className="mt-1 text-xs text-vanilla/70">{item.domain}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap gap-2" data-assemble>
            <Badge tone={item.pricing === "free" ? "ember" : "muted"}>
              {item.pricing === "free" ? "Бесплатный" : "Платный"}
            </Badge>
            <Badge>{categoryLabels[item.category]}</Badge>
          </div>
          <p className="mt-3 text-sm text-vanilla/55" data-assemble>
            {item.businessType}
          </p>
          <p
            className="mt-2 flex-1 text-sm leading-relaxed text-vanilla/75"
            data-assemble
          >
            {item.summary}
          </p>
          <p
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ember transition-colors group-hover:text-ember-hover"
            data-assemble
          >
            Смотреть кейс
            <ArrowIcon
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </p>
        </div>
      </Link>
    </CaseCardMotion>
  );
}
