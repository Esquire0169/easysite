export type MegaLink = {
  label: string;
  href: string;
};

export type MegaMenu = {
  id: string;
  label: string;
  title: string;
  titleHref: string;
  primary: MegaLink[];
  secondaryTitle: string;
  secondaryHref: string;
  secondary: MegaLink[];
};

/** Consensys-style mega menus adapted for EasySite. */
export const megaMenus: MegaMenu[] = [
  {
    id: "service",
    label: "Сервис",
    title: "Соберите свой быстрый сайт",
    titleHref: "/order",
    primary: [
      { label: "Как это работает", href: "/how-it-works" },
      { label: "Правила", href: "/rules" },
      { label: "Технологии", href: "/tech" },
      { label: "Заказать сайт", href: "/order" },
    ],
    secondaryTitle: "Сообщество",
    secondaryHref: "/free-sites",
    secondary: [
      { label: "Бесплатные сайты", href: "/free-sites" },
      { label: "Фиксированная цена", href: "/rules" },
      { label: "Инфраструктура", href: "/tech" },
      { label: "Оферта сервиса", href: "/rules" },
    ],
  },
  {
    id: "cases",
    label: "Кейсы",
    title: "Сайты, которые уже работают",
    titleHref: "/cases",
    primary: [
      { label: "Все кейсы", href: "/cases" },
      { label: "Лендинги", href: "/cases" },
      { label: "Малый бизнес", href: "/cases" },
      { label: "Заказать похожий", href: "/order" },
    ],
    secondaryTitle: "Формат",
    secondaryHref: "/how-it-works",
    secondary: [
      { label: "24 часа", href: "/how-it-works" },
      { label: "10 000 ₽", href: "/rules" },
      { label: "Без правок", href: "/rules" },
      { label: "Префикс easysite", href: "/tech" },
    ],
  },
  {
    id: "company",
    label: "Компания",
    title: "EasySite — часть Web Giants",
    titleHref: "/about",
    primary: [
      { label: "О нас", href: "/about" },
      { label: "Контакты", href: "/contact" },
      { label: "Технологии", href: "/tech" },
      { label: "Правила сервиса", href: "/rules" },
    ],
    secondaryTitle: "Связь",
    secondaryHref: "/contact",
    secondary: [
      { label: "Написать", href: "/contact" },
      { label: "Telegram", href: "https://t.me/easysite" },
      { label: "Заявка", href: "/order" },
      { label: "Web Giants", href: "/about" },
    ],
  },
];
