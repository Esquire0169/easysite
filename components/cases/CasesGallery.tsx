"use client";

import { useMemo, useState } from "react";
import type { CaseCategory, CaseItem } from "@/lib/cases";
import { StaggerIn } from "@/components/motion/StaggerIn";
import { CaseCard } from "./CaseCard";
import { CaseFilters } from "./CaseFilters";

type CasesGalleryProps = {
  items: CaseItem[];
};

export function CasesGallery({ items }: CasesGalleryProps) {
  const [filter, setFilter] = useState<CaseCategory | "all">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.category === filter);
  }, [filter, items]);

  return (
    <div>
      <CaseFilters value={filter} onChange={setFilter} />
      <StaggerIn
        key={filter}
        className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        from="random"
      >
        {filtered.map((item) => (
          <div key={item.slug} data-stagger-item className="h-full">
            <CaseCard item={item} />
          </div>
        ))}
      </StaggerIn>
      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-vanilla/60">
          В этой категории пока нет кейсов.
        </p>
      ) : null}
    </div>
  );
}
