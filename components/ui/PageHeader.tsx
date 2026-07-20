import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      {eyebrow ? (
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-ember">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="font-display text-4xl font-semibold tracking-tight text-vanilla sm:text-5xl lg:text-[3.25rem]">
        {title}
      </h1>
      {description ? (
        <div className="mt-5 text-base leading-relaxed text-vanilla/75 sm:text-lg">
          {description}
        </div>
      ) : null}
    </Reveal>
  );
}
