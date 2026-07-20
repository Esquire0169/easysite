import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  id,
  error,
  className = "",
  rows = 4,
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-medium text-vanilla/90">{label}</span>
      <textarea
        id={inputId}
        rows={rows}
        className={[
          "w-full resize-y rounded-lg border bg-cosmic-deep px-4 py-3 text-sm text-vanilla placeholder:text-vanilla/35",
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
