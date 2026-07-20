import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function FreeSitesTeaser() {
  return (
    <Section>
      <Reveal>
        <div
          data-speed="0.92"
          className="overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(255,242,117,0.16),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,242,117,0.1),transparent_40%),#4f1db5] p-8 sm:p-10 lg:p-12"
        >
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-ember">
            Программа сообщества
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-vanilla sm:text-4xl">
            2–3 бесплатных сайта в месяц
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-vanilla/75">
            EasySite не только продаёт быстрые сайты. Каждый месяц мы делаем
            2–3 бесплатных проекта для топовых, социально значимых и просто
            крутых инициатив — по тем же правилам: 24 часа, без правок, наш
            хостинг и префикс easysite.
          </p>
          <div className="mt-8">
            <Magnetic strength={0.3} radius={110}>
              <Button href="/free-sites" variant="secondary" className="btn-arrow">
                Узнать о бесплатных сайтах
                <span className="btn-arrow__icon inline-flex" aria-hidden>
                  <ArrowIcon size={15} />
                </span>
              </Button>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
