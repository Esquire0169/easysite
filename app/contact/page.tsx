import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { canonicalPath, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контакты EasySite: email, Telegram, VK и заявка на сайт.",
  alternates: { canonical: canonicalPath("/contact") },
};

const channels = [
  {
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    label: "Telegram",
    value: "@easysite",
    href: siteConfig.telegram,
  },
  {
    label: "VK",
    value: "vk.com/easysite",
    href: siteConfig.vk,
  },
];

export default function ContactPage() {
  return (
    <Section className="page-top pb-24">
      <PageHeader
        eyebrow="Связь"
        title="Контакты"
        description={`${siteConfig.name} — дочерний проект ${siteConfig.parent}. Пишите по делу: заказ сайта, программа бесплатных сайтов или вопросы по платформе.`}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {channels.map((channel, index) => (
          <Reveal key={channel.label} delayMs={index * 70}>
            <a
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={
                channel.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="block h-full rounded-xl border border-vanilla/10 bg-cosmic-lift/80 p-6 transition-colors hover:border-vanilla/25 hover:bg-cosmic-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-vanilla/45">
                {channel.label}
              </p>
              <p className="mt-3 font-display text-xl font-semibold text-vanilla">
                {channel.value}
              </p>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8">
        <Card>
          <h2 className="font-display text-2xl font-semibold text-vanilla">
            Нужен сайт за сутки?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-vanilla/70">
            Для платного заказа удобнее форма на странице «Заказать»: там сразу
            собираем бриф под формат EasySite — 10 000 ₽, 24 часа, без правок.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/order" size="lg">
              Перейти к заявке
            </Button>
            <Button href="/free-sites" variant="secondary" size="lg">
              Бесплатные сайты
            </Button>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}
