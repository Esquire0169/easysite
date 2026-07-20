import Link from "next/link";
import type { MegaMenu } from "@/lib/nav";
import { siteConfig } from "@/lib/site";
import { ArrowIcon, ArrowUpRightIcon } from "@/components/ui/icons";

type MegaPanelProps = {
  menu: MegaMenu;
  onNavigate: () => void;
};

export function MegaPanel({ menu, onNavigate }: MegaPanelProps) {
  return (
    <div className="mega-panel grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <Link
          href={menu.titleHref}
          onClick={onNavigate}
          className="mega-panel__title group inline-flex items-center gap-4"
        >
          <span className="font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {menu.title}
          </span>
          <span className="mega-panel__title-btn inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vanilla text-cosmic transition-transform duration-300 group-hover:scale-105">
            <ArrowIcon size={16} />
          </span>
        </Link>

        <ul className="mt-10 space-y-4 sm:mt-12 sm:space-y-5">
          {menu.primary.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="mega-primary group inline-flex items-center gap-3 font-display text-2xl font-semibold tracking-tight text-vanilla transition-colors hover:text-vanilla/80 sm:text-3xl"
              >
                {item.label}
                <ArrowUpRightIcon
                  size={18}
                  className="opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:pt-2">
        <Link
          href={menu.secondaryHref}
          onClick={onNavigate}
          className="inline-flex items-center gap-2 text-sm font-medium text-vanilla/70 transition-colors hover:text-vanilla"
        >
          {menu.secondaryTitle}
          <ArrowIcon size={12} />
        </Link>

        <ul className="mt-5 border-t border-vanilla/15">
          {menu.secondary.map((item) => (
            <li key={item.href + item.label} className="border-b border-vanilla/15">
              <Link
                href={item.href}
                onClick={onNavigate}
                className="group flex items-center justify-between gap-4 py-4 text-[15px] text-vanilla/70 transition-colors hover:text-vanilla"
              >
                {item.label}
                <ArrowUpRightIcon
                  size={14}
                  className="opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-90"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mega-panel__footer col-span-full flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-vanilla/10 pt-6 text-sm text-vanilla/45">
        <a
          href={siteConfig.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-vanilla"
        >
          Telegram
          <ArrowUpRightIcon size={12} />
        </a>
        <a
          href={siteConfig.vk}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-vanilla"
        >
          VK
          <ArrowUpRightIcon size={12} />
        </a>
        <a
          href={`mailto:${siteConfig.email}`}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-vanilla"
        >
          Email
          <ArrowUpRightIcon size={12} />
        </a>
      </div>

    </div>
  );
}
