/**
 * Central site config — add new nav items / contacts here
 * when extending the site with new pages or sections.
 */

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
} as const;

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
