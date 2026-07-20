import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";

type ShowcaseItem = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  tone: "ember" | "vanilla" | "violet";
  stats: Array<{ value: string; label: string }>;
  visualLabel: string;
};

const items: ShowcaseItem[] = [
  {
    id: "speed",
    eyebrow: "Скорость",
    title: "Запуск без ожидания",
    text: "После оплаты и брифа сайт появляется за сутки. Один выстрел — готовый продукт, без бесконечных итераций.",
    href: "/how-it-works",
    tone: "ember",
    stats: [
      { value: "24ч", label: "до запуска" },
      { value: "1", label: "выстрел — готово" },
    ],
    visualLabel: "Deadline",
  },
  {
    id: "infra",
    eyebrow: "Инфраструктура",
    title: "Своё железо под капотом",
    text: "Хостинг, сервера, SSL и базовая защита уже внутри EasySite. Вам не нужно собирать стек и искать подрядчиков.",
    href: "/tech",
    tone: "violet",
    stats: [
      { value: "SSL", label: "из коробки" },
      { value: "24/7", label: "на нашем железе" },
    ],
    visualLabel: "Stack",
  },
  {
    id: "offer",
    eyebrow: "Оффер",
    title: "Фикс. Без доплат. Без правок",
    text: "Честная формула: фиксированная цена, фиксированный срок, фиксированный формат. Если нужны бесконечные правки — это не к нам.",
    href: "/rules",
    tone: "vanilla",
    stats: [
      { value: "10k", label: "рублей фикс" },
      { value: "0", label: "правок после сдачи" },
    ],
    visualLabel: "Offer",
  },
];

const tones = {
  ember: {
    wash: "rgba(232, 168, 124, 0.38)",
    washSoft: "rgba(201, 138, 95, 0.22)",
    card: "bg-[#1a1820]/80 text-vanilla",
    accent: "text-ember",
  },
  vanilla: {
    wash: "rgba(241, 254, 200, 0.32)",
    washSoft: "rgba(216, 228, 168, 0.2)",
    card: "bg-[#23212c]/80 text-vanilla",
    accent: "text-vanilla",
  },
  violet: {
    wash: "rgba(169, 174, 232, 0.36)",
    washSoft: "rgba(107, 100, 144, 0.24)",
    card: "bg-[#14121a]/80 text-vanilla",
    accent: "text-[#c4c8f0]",
  },
} as const;

/**
 * Feature cards in normal document flow.
 * HomeScroll: ScrollTrigger.batch pop (interval/batchMax, failsafe).
 */
export function ShowcaseStack() {
  return (
    <section className="section-features relative overflow-hidden py-24 sm:py-28 lg:py-32">
      <div
        data-speed="0.75"
        className="pointer-events-none absolute -left-28 top-1/3 h-80 w-80 rounded-full bg-ember/20 blur-3xl"
        aria-hidden
      />
      <div
        data-speed="1.2"
        className="pointer-events-none absolute -right-24 bottom-1/4 h-96 w-96 rounded-full bg-vanilla/12 blur-3xl"
        aria-hidden
      />

      <Container className="relative z-10">
        <div className="mb-14 max-w-2xl sm:mb-20">
          <p
            data-features-intro
            className="text-sm font-medium uppercase tracking-[0.18em] text-ember"
          >
            Платформа
          </p>
          <h2
            data-features-intro
            className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl lg:text-5xl"
          >
            Три опоры EasySite
          </h2>
          <p
            data-features-intro
            className="mt-4 text-base leading-relaxed text-vanilla/70"
          >
            Скорость, своё железо и честный фикс — без швов между обещанием и
            продуктом.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-10">
          {items.map((item, index) => {
            const tone = tones[item.tone];
            const flip = index % 2 === 1;

            return (
              <article
                key={item.id}
                className="feature-card relative overflow-hidden rounded-[1.75rem] will-change-transform"
              >
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `
                        radial-gradient(ellipse 70% 80% at ${flip ? "18%" : "82%"} 45%, ${tone.wash} 0%, transparent 60%),
                        radial-gradient(ellipse 55% 60% at 50% 100%, ${tone.washSoft} 0%, transparent 50%),
                        #23212c
                      `,
                    }}
                  />
                  {/* Micro-moment: diagonal shine sweep on batch enter (HomeScroll) */}
                  <div
                    data-feature-shine
                    className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-vanilla/18 to-transparent opacity-0 will-change-transform"
                  />
                </div>

                <div
                  className={[
                    "relative z-10 grid items-center gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12",
                    flip ? "lg:[&>*:first-child]:order-2" : "",
                  ].join(" ")}
                >
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-vanilla sm:text-3xl lg:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-vanilla/70">
                      {item.text}
                    </p>
                    <Link
                      href={item.href}
                      className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-vanilla text-cosmic transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
                      aria-label={item.title}
                    >
                      <ArrowUpRightIcon size={16} />
                    </Link>

                    <div className="mt-10 grid grid-cols-2 gap-6">
                      {item.stats.map((stat) => (
                        <div key={stat.label}>
                          <p className="font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
                            {stat.value}
                          </p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-vanilla/45">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-[14rem] items-center justify-center lg:min-h-[18rem]">
                    <div
                      data-feature-inner
                      className={[
                        "w-full max-w-sm rounded-2xl border border-white/10 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-md will-change-transform",
                        tone.card,
                      ].join(" ")}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-vanilla/45">
                        {item.visualLabel}
                      </p>
                      <p className="mt-4 font-display text-2xl font-semibold tracking-tight">
                        {item.title}
                      </p>
                      <div className="mt-6 space-y-2">
                        <div className="h-2 w-[80%] rounded-full bg-white/10" />
                        <div className="h-2 w-[60%] rounded-full bg-white/10" />
                        <div className="h-2 w-[68%] rounded-full bg-white/10" />
                      </div>
                      <div className="mt-8 flex items-center justify-between">
                        <span className={`text-sm font-medium ${tone.accent}`}>
                          EasySite
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-vanilla text-cosmic">
                          <ArrowUpRightIcon size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
