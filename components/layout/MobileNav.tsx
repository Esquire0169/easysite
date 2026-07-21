"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/lib/focusTrap";
import { navItems } from "@/lib/site";
import { PillButton } from "@/components/ui/PillButton";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  const drawerRef = useRef<HTMLElement>(null);

  useFocusTrap(open, drawerRef, onClose);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div
      className={[
        "fixed inset-0 z-50 md:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Закрыть меню"
        className={[
          "absolute inset-0 bg-cosmic-deep/75 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal={open}
        aria-label="Мобильное меню"
        tabIndex={-1}
        inert={open ? undefined : true}
        className={[
          "absolute right-0 top-0 flex h-full w-[min(100%,22rem)] flex-col border-l border-vanilla/10 bg-cosmic shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b border-vanilla/10 px-5 py-4">
          <span className="font-display text-lg font-semibold text-vanilla">
            Меню
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-vanilla/80 transition-colors hover:bg-vanilla/5 hover:text-vanilla focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block rounded-lg px-3 py-3 text-base text-vanilla/85 transition-colors hover:bg-vanilla/5 hover:text-vanilla"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-3 border-t border-vanilla/10 p-5">
          <PillButton href="/contact" tone="dark" onClick={onClose}>
            Контакты
          </PillButton>
          <PillButton href="/order" tone="yellow" onClick={onClose}>
            Заказать сайт
          </PillButton>
        </div>
      </aside>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
