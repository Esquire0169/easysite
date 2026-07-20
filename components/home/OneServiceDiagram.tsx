import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const rays = ["Дизайн", "Тексты", "Хостинг", "Домен", "SSL"] as const;

export function OneServiceDiagram() {
  return (
    <Section className="bg-ink/40">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Всё под ключ
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            Один сервис вместо набора подрядчиков
          </h2>
          <p className="mt-5 text-base leading-relaxed text-vanilla/75">
            Вам не нужно искать дизайнера, верстальщика и хостинг — всё уже
            внутри EasySite. Закрываем весь цикл: дизайн, тексты, вёрстку,
            домен, хостинг и техническую настройку. Вы получаете ссылку на
            готовый сайт, который уже работает.
          </p>
        </Reveal>

        <Reveal delayMs={100} direction="left">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-[18%] rounded-full border border-vanilla/15 bg-cosmic-lift/60" />
            <div className="absolute inset-[32%] flex items-center justify-center rounded-full border border-ember/40 bg-cosmic shadow-[0_0_60px_rgba(255,242,117,0.12)]">
              <div className="text-center">
                <p className="font-display text-xl font-semibold text-vanilla">
                  EasySite
                </p>
                <p className="mt-1 text-xs text-vanilla/50">один центр</p>
              </div>
            </div>

            {rays.map((label, index) => {
              const angle = (index / rays.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + Math.cos(rad) * 42;
              const y = 50 + Math.sin(rad) * 42;

              return (
                <div
                  key={label}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-vanilla/20 bg-cosmic px-3 py-1.5 text-xs font-medium text-vanilla/85"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
