import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/icons";

type PillButtonProps = {
  href: string;
  children: ReactNode;
  /** dark = Contact style; colored = Be manifesto pills */
  tone?: "dark" | "green" | "yellow" | "blue";
  className?: string;
  onClick?: () => void;
};

const tones = {
  dark: {
    shell: "bg-ink text-vanilla border border-vanilla/15",
    badge: "bg-ember text-ink",
  },
  green: {
    shell: "bg-ember text-ink border border-ink/10",
    badge: "bg-cosmic text-vanilla",
  },
  yellow: {
    shell: "bg-vanilla-muted text-ink border border-ink/10",
    badge: "bg-cosmic text-vanilla",
  },
  blue: {
    shell: "bg-[#a78bfa] text-ink border border-ink/10",
    badge: "bg-cosmic text-vanilla",
  },
} as const;

export function PillButton({
  href,
  children,
  tone = "dark",
  className = "",
  onClick,
}: PillButtonProps) {
  const t = tones[tone];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "pill-button group inline-flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-5",
        "transition-[transform,box-shadow] duration-300",
        "hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic",
        t.shell,
        className,
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          "transition-transform duration-300 group-hover:scale-105",
          t.badge,
        ].join(" ")}
        aria-hidden
      >
        <ArrowIcon size={15} className="translate-x-px" />
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight leading-none">
        {children}
      </span>
    </Link>
  );
}
