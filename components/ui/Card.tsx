import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-ink/20 bg-cosmic-lift/80 p-6 sm:p-7",
        hover
          ? "transition-colors duration-200 hover:border-vanilla/25 hover:bg-cosmic-lift"
          : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
