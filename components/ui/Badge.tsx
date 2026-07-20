import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "vanilla" | "ember" | "muted";
  className?: string;
};

const tones = {
  vanilla: "border-vanilla/25 bg-vanilla/10 text-vanilla",
  ember: "border-ember/40 bg-ember/15 text-ember",
  muted: "border-vanilla/15 bg-cosmic text-vanilla/70",
};

export function Badge({
  children,
  tone = "vanilla",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
