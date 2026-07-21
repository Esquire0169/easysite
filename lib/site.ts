/**
 * Central site config — add new nav items / contacts here
 * when extending the site with new pages or sections.
 */

/**
 * Public origin for metadataBase / canonicals (no trailing slash).
 * GitHub Pages deploy uses basePath `/easysite` — keep that path in the URL.
 * Override with NEXT_PUBLIC_SITE_URL when hosting elsewhere.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://esquire0169.github.io/easysite";

export const siteConfig = {
  name: "EasySite",
  parent: "Web Giants",
  tagline: "Сайт за сутки. 10 000 ₽. Никаких правок.",
  description:
    "EasySite — быстрый и честный сервис создания сайтов для бизнеса. Сайт за 24 часа за фиксированные 10 000 ₽, без правок после сдачи, на собственной инфраструктуре.",
  price: "10 000 ₽",
  deadline: "24 часа",
  email: "hello@easysite.ru",
  telegram: "https://t.me/easysite",
  vk: "https://vk.com/easysite",
  domainExamples: ["easysite-projectname.ru", "projectname.easysite.ru"],
  url: siteUrl,
} as const;

/** Trailing-slash path for Metadata `alternates.canonical` (matches `trailingSlash: true`). */
export function canonicalPath(path = "/"): string {
  if (path === "/" || path === "") return "/";
  const trimmed = path.startsWith("/") ? path : `/${path}`;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export type NavItem = {
  href: string;
  label: string;
};

/** Full list — mobile drawer / footer. */
export const navItems: NavItem[] = [
  { href: "/", label: "Главная" },
  { href: "/how-it-works", label: "Как это работает" },
  { href: "/rules", label: "Правила" },
  { href: "/free-sites", label: "Бесплатные сайты" },
  { href: "/cases", label: "Кейсы" },
  { href: "/tech", label: "Технологии" },
  { href: "/about", label: "О нас" },
  { href: "/order", label: "Заказать" },
  { href: "/contact", label: "Контакты" },
];

export const keyIdeas = [
  "бриф → дизайн → код",
  "хостинг в комплекте",
  "домен с префиксом",
  "запуск на наших серверах",
  "один пакет — готово",
  "скорость без лишнего",
] as const;

export const honestLine =
  "Если вам нужны бесконечные правки и долгий процесс — это не к нам. Мы про скорость и законченность.";

export const fixedFormula =
  "Фиксированная цена, фиксированный срок, фиксированный формат проекта.";
