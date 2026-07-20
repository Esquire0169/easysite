/**
 * Mock portfolio data. Extend this list when adding new case studies;
 * pages under /cases read from here automatically.
 */

export type CaseCategory =
  | "small-business"
  | "startup"
  | "creative"
  | "social";

export type CasePricing = "paid" | "free";

export type CaseItem = {
  slug: string;
  title: string;
  businessType: string;
  category: CaseCategory;
  pricing: CasePricing;
  summary: string;
  description: string;
  domain: string;
  externalUrl?: string;
  accent: string;
};

export const categoryLabels: Record<CaseCategory | "all", string> = {
  all: "Все",
  "small-business": "Малый бизнес",
  startup: "Стартапы",
  creative: "Креатив",
  social: "Социальные",
};

export const cases: CaseItem[] = [
  {
    slug: "pekarnya-utro",
    title: "Пекарня Утро",
    businessType: "Локальная пекарня",
    category: "small-business",
    pricing: "paid",
    summary: "Визитка с меню, адресом и заказом торта на выходные.",
    description:
      "Лендинг для районной пекарни: пять смысловых блоков, акцент на свежести и самовывозе. Размещён на инфраструктуре EasySite с доменом easysite-pekarnya-utro.ru.",
    domain: "easysite-pekarnya-utro.ru",
    accent: "#FFF275",
  },
  {
    slug: "nova-fit",
    title: "Nova Fit",
    businessType: "Фитнес-студия",
    category: "startup",
    pricing: "paid",
    summary: "Сайт для набора в первую группу персональных тренировок.",
    description:
      "Короткий лендинг стартапа: оффер, расписание пробных занятий, форма записи. Запущен за сутки на платформе EasySite.",
    domain: "nova-fit.easysite.ru",
    accent: "#FFF8A8",
  },
  {
    slug: "atelier-lin",
    title: "Atelier Lin",
    businessType: "Дизайн-студия",
    category: "creative",
    pricing: "paid",
    summary: "Портфолио-визитка для керамической мастерской.",
    description:
      "Минималистичная визитка с галереей работ и контактами. Фиксированный формат 5–7 блоков, без правок после сдачи.",
    domain: "easysite-atelier-lin.ru",
    accent: "#E8DC6A",
  },
  {
    slug: "dobryi-ugol",
    title: "Добрый угол",
    businessType: "Благотворительный проект",
    category: "social",
    pricing: "free",
    summary: "Бесплатный сайт для сбора вещей нуждающимся семьям.",
    description:
      "Проект из программы бесплатных сайтов: тот же срок 24 часа, та же инфраструктура и префикс easysite — без оплаты клиента.",
    domain: "dobryi-ugol.easysite.ru",
    accent: "#FFF275",
  },
  {
    slug: "craft-tools",
    title: "Craft Tools",
    businessType: "Инструменты для мастеров",
    category: "small-business",
    pricing: "paid",
    summary: "Лендинг каталога ручного инструмента с оптовым запросом.",
    description:
      "Сайт-визитка B2B: ассортимент, условия, контакты. Всё под ключ — дизайн, тексты, SSL и хостинг на серверах EasySite.",
    domain: "easysite-craft-tools.ru",
    accent: "#FFF8A8",
  },
  {
    slug: "signal-lab",
    title: "Signal Lab",
    businessType: "Аудио-стартап",
    category: "startup",
    pricing: "paid",
    summary: "Презентация прототипа и сбор заявок на бета-тест.",
    description:
      "Один выстрел: работающий сайт за сутки. Клиент получил ссылку и сразу начал собирать заявки — без долгих согласований.",
    domain: "signal-lab.easysite.ru",
    accent: "#E8D450",
  },
  {
    slug: "gorod-света",
    title: "Город света",
    businessType: "Городской фестиваль",
    category: "creative",
    pricing: "free",
    summary: "Бесплатный лендинг программы фестиваля света.",
    description:
      "Социально значимый креативный проект в программе 2–3 бесплатных сайтов в месяц. Те же правила EasySite, без счёта клиенту.",
    domain: "easysite-gorod-sveta.ru",
    accent: "#FFF8A8",
  },
  {
    slug: "shkola-ryadom",
    title: "Школа рядом",
    businessType: "Образовательная инициатива",
    category: "social",
    pricing: "free",
    summary: "Сайт волонтёрских занятий для школьников района.",
    description:
      "Бесплатный сайт на общей платформе EasySite: единый стек, SSL, мониторинг. Экосистема быстрых сайтов — не разовый фриланс.",
    domain: "shkola-ryadom.easysite.ru",
    accent: "#FFF275",
  },
];

export function getCaseBySlug(slug: string): CaseItem | undefined {
  return cases.find((item) => item.slug === slug);
}

export function getCasesByCategory(category: CaseCategory | "all"): CaseItem[] {
  if (category === "all") return cases;
  return cases.filter((item) => item.category === category);
}

export function getFreeCases(): CaseItem[] {
  return cases.filter((item) => item.pricing === "free");
}
