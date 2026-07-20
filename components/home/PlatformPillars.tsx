import { AmbientDrift } from "@/components/motion/AmbientDrift";
import { StaggerIn } from "@/components/motion/StaggerIn";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const pillars = [
  {
    title: "Сайт за сутки",
    text: "После оплаты и передачи исходных данных сайт появляется за 24 часа. Один выстрел — готовый продукт, без долгих согласований.",
  },
  {
    title: "Своё железо",
    text: "Собственные сервера, хостинг, SSL и базовая защита. Клиент не настраивает инфраструктуру — всё уже внутри EasySite.",
  },
  {
    title: "Всё на одной платформе",
    text: "Множество бизнесов живут на общей надёжной инфраструктуре. Это экосистема быстрых сайтов, а не разовый фриланс.",
  },
];

export function PlatformPillars() {
  return (
    <Section className="relative overflow-hidden">
      <AmbientDrift className="-right-20 top-10 h-72 w-72 bg-ember/15" />
      <AmbientDrift className="-left-16 bottom-0 h-64 w-64 bg-vanilla/10" />

      <Reveal>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
          Скорость + инфраструктура
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
          Три опоры EasySite
        </h2>
      </Reveal>

      <StaggerIn className="mt-10 grid gap-4 md:grid-cols-3" from="start">
        {pillars.map((pillar) => (
          <div key={pillar.title} data-stagger-item>
            <Card hover className="h-full">
              <p className="font-display text-lg font-semibold text-vanilla">
                {pillar.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-vanilla/70">
                {pillar.text}
              </p>
            </Card>
          </div>
        ))}
      </StaggerIn>
    </Section>
  );
}
