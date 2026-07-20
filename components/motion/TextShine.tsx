import type { ReactNode } from "react";

type TextShineProps = {
  children: ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
};

/**
 * mega-text-gradient-shine — blip across gradient text.
 */
export function TextShine({
  children,
  className = "",
  as: Tag = "span",
}: TextShineProps) {
  return (
    <Tag className={`text-shine ${className}`.trim()}>{children}</Tag>
  );
}
