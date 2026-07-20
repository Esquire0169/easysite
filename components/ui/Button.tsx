import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember text-ink hover:bg-ember-hover active:bg-ember-deep focus-visible:ring-ember",
  secondary:
    "bg-transparent text-vanilla border border-vanilla/35 hover:border-vanilla hover:bg-vanilla/5 active:bg-vanilla/10 focus-visible:ring-vanilla",
  ghost:
    "bg-transparent text-vanilla/85 hover:text-vanilla hover:bg-vanilla/5 focus-visible:ring-vanilla",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-13 px-7 py-3.5 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

function buttonClasses(
  variant: Variant,
  size: Size,
  className: string,
): string {
  return [
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight",
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");
}

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if ("href" in props && props.href) {
    const {
      children,
      variant = "primary",
      size = "md",
      className = "",
      href,
      target,
      rel,
      onClick,
    } = props;

    return (
      <Link
        href={href}
        className={buttonClasses(variant, size, className)}
        target={target}
        rel={rel}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    ...rest
  } = props;

  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
