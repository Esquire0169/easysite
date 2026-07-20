import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Container } from "./Container";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  containerClassName?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className" | "id">;

export function Section({
  children,
  className = "",
  id,
  containerClassName = "",
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-20 lg:py-24 ${className}`}
      {...rest}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
