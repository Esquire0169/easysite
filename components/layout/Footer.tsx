import Link from "next/link";
import { keyIdeas, navItems, siteConfig } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-vanilla/10 bg-ink">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl font-semibold text-vanilla">
              {siteConfig.name}
            </p>
            <p className="mt-2 text-sm text-vanilla/55">
              Дочерний проект {siteConfig.parent}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-vanilla/70">
              Быстрый и честный сервис сайтов для бизнеса: 24 часа,{" "}
              {siteConfig.price}, без правок, на своей инфраструктуре.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-vanilla/45">
              Навигация
            </p>
            <ul className="mt-4 space-y-2">
              {navItems.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-vanilla/70 transition-colors hover:text-vanilla"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-vanilla/45">
              Ещё
            </p>
            <ul className="mt-4 space-y-2">
              {navItems.slice(5).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-vanilla/70 transition-colors hover:text-vanilla"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-vanilla/45">
              Контакты
            </p>
            <ul className="mt-4 space-y-2 text-sm text-vanilla/70">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-vanilla"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.telegram}
                  className="transition-colors hover:text-vanilla"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.vk}
                  className="transition-colors hover:text-vanilla"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  VK
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {keyIdeas.map((idea) => (
            <span
              key={idea}
              className="rounded-md border border-ink/40 bg-cosmic px-2.5 py-1 text-xs text-vanilla/60"
            >
              {idea}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-vanilla/10 pt-6 text-xs text-vanilla/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.parent}
          </p>
          <p>
            Фиксированная цена · фиксированный срок · фиксированный формат
          </p>
        </div>
      </Container>
    </footer>
  );
}
