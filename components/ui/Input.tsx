import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({
  label,
  id,
  error,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-medium text-vanilla/90">{label}</span>
      <input
        id={inputId}
        className={[
          "h-12 w-full rounded-lg border bg-cosmic-deep px-4 text-sm text-vanilla placeholder:text-vanilla/35",
          "transition-colors duration-200",
          "focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30",
          error ? "border-ember/70" : "border-vanilla/15 hover:border-vanilla/30",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? <span className="block text-xs text-ember">{error}</span> : null}
    </label>
  );
}
