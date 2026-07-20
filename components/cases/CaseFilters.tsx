"use client";

import type { CaseCategory } from "@/lib/cases";
import { categoryLabels } from "@/lib/cases";

const filters: Array<CaseCategory | "all"> = [
  "all",
  "small-business",
  "startup",
  "creative",
  "social",
];

type CaseFiltersProps = {
  value: CaseCategory | "all";
  onChange: (value: CaseCategory | "all") => void;
};

export function CaseFilters({ value, onChange }: CaseFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Фильтр кейсов">
      {filters.map((filter) => {
        const active = value === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter)}
            className={[
              "rounded-lg border px-3.5 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember",
              active
                ? "border-ember/50 bg-ember/15 text-ember"
                : "border-vanilla/15 bg-transparent text-vanilla/70 hover:border-vanilla/30 hover:text-vanilla",
            ].join(" ")}
          >
            {categoryLabels[filter]}
          </button>
        );
      })}
    </div>
  );
}
