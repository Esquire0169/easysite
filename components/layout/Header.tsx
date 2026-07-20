"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { HeaderScroll } from "@/components/motion/HeaderScroll";
import { Magnetic } from "@/components/motion/Magnetic";
import { MegaPanel } from "@/components/layout/MegaPanel";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArrowIcon, ChevronIcon, LogoMark, MenuIcon } from "@/components/ui/icons";
import { megaMenus } from "@/lib/nav";
import { EASE, prefersReducedMotion } from "@/lib/motion";
import { siteConfig } from "@/lib/site";

export function Header() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef<string | null>(null);

  const expanded = Boolean(openId);
  const panelMenu = megaMenus.find((m) => m.id === renderId) ?? null;

  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  useEffect(() => {
    const panel = panelRef.current;
    const shell = shellRef.current;
    if (!panel || !shell) return;

    const prev = prevOpenRef.current;
    prevOpenRef.current = openId;

    if (prefersReducedMotion()) {
      gsap.set(panel, { gridTemplateRows: openId ? "1fr" : "0fr" });
      gsap.set(shell, { opacity: openId ? 1 : 0, y: 0 });
      if (!openId) {
        queueMicrotask(() => setRenderId(null));
      }
      return;
    }

    if (!openId) {
      const tl = gsap.timeline({
        onComplete: () => setRenderId(null),
      });
      tl.to(shell, {
        opacity: 0,
        y: -8,
        duration: 0.32,
        ease: "power2.in",
      }).to(
        panel,
        {
          gridTemplateRows: "0fr",
          duration: 0.5,
          ease: EASE.inOut,
        },
        "-=0.1",
      );
      return () => {
        tl.kill();
      };
    }

    const items = () =>
      shell.querySelectorAll(
        ".mega-panel__title, .mega-primary, .mega-panel li a, .mega-panel__footer a",
      );

    if (!prev) {
      gsap.set(shell, { opacity: 0, y: 20 });
      gsap.set(items(), { opacity: 0, y: 14 });
      const tl = gsap.timeline();
      tl.to(panel, {
        gridTemplateRows: "1fr",
        duration: 0.58,
        ease: EASE.inOut,
      })
        .to(
          shell,
          { opacity: 1, y: 0, duration: 0.6, ease: EASE.soft },
          "-=0.38",
        )
        .to(
          items(),
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.03,
            ease: EASE.soft,
          },
          "-=0.4",
        );
      return () => {
        tl.kill();
      };
    }

    // Switched between menus
    gsap.fromTo(
      items(),
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.48,
        stagger: 0.028,
        ease: EASE.soft,
        overwrite: true,
      },
    );
  }, [openId]);

  const toggle = (id: string) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setRenderId(id);
    setOpenId(id);
  };

  const close = () => setOpenId(null);

  return (
    <>
      <HeaderScroll />
      <header
        className={[
          "site-header pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5 lg:px-10 lg:pt-8",
          expanded ? "site-header--expanded" : "",
        ].join(" ")}
      >
        <div
          data-scroll-progress
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-ember via-vanilla to-ember"
          aria-hidden
        />

        <button
          type="button"
          aria-label="Закрыть меню"
          className={[
            "site-header__backdrop pointer-events-auto fixed inset-0 -z-10 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            expanded ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={close}
        />

        <div
          data-site-header
          className="pointer-events-auto relative z-10 flex items-center justify-between gap-3"
        >
          <div className="nav-pill flex min-w-0 items-center gap-1 rounded-full bg-[#24066e]/92 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <Link
              href="/"
              data-brand-logo
              aria-label={siteConfig.name}
              onClick={close}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vanilla text-cosmic transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-[#24066e]"
            >
              <LogoMark size={20} />
            </Link>

            <nav
              className="hidden items-center gap-0.5 lg:flex"
              aria-label="Основное меню"
            >
              {megaMenus.map((menu) => {
                const isOpen = openId === menu.id;
                return (
                  <button
                    key={menu.id}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`mega-${menu.id}`}
                    onClick={() => toggle(menu.id)}
                    className={[
                      "menu-btn relative z-0 inline-flex h-12 items-center gap-1.5 rounded-full px-5 text-[13px] font-medium tracking-tight transition-colors duration-500",
                      isOpen
                        ? "menu-btn--active text-cosmic"
                        : "text-vanilla/70 hover:text-vanilla",
                    ].join(" ")}
                  >
                    <span className="relative z-10">{menu.label}</span>
                    <span
                      className={[
                        "menu-btn__chevron relative z-10 inline-flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isOpen ? "rotate-180" : "",
                      ].join(" ")}
                    >
                      <ChevronIcon size={13} />
                    </span>
                  </button>
                );
              })}
            </nav>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-vanilla/80 transition-colors duration-300 hover:bg-white/5 hover:text-vanilla focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember lg:hidden"
              aria-label="Открыть меню"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>

          <Magnetic className="hidden sm:inline-flex" strength={0.22} radius={90}>
            <Link href="/order" className="menu-cta group" onClick={close}>
              <span className="menu-cta__text">
                <span className="menu-cta__text-track">
                  <span>Заказать</span>
                  <span aria-hidden>Заказать</span>
                </span>
              </span>
              <span className="menu-cta__icon" aria-hidden>
                <span className="menu-cta__icon-inner inline-flex">
                  <ArrowIcon size={13} />
                </span>
              </span>
            </Link>
          </Magnetic>
        </div>

        <div
          ref={panelRef}
          className={[
            "mega-wrap pointer-events-auto relative z-10 mx-auto mt-3 max-w-[92rem]",
            expanded || panelMenu ? "" : "pointer-events-none",
          ].join(" ")}
          style={{ display: "grid", gridTemplateRows: "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              ref={shellRef}
              id={panelMenu ? `mega-${panelMenu.id}` : undefined}
              className="mega-shell rounded-[1.75rem] border border-ink/50 bg-ink/95 px-6 py-8 opacity-0 shadow-[0_30px_80px_rgba(29,29,29,0.7)] backdrop-blur-xl sm:px-10 sm:py-10 lg:px-14"
            >
              {panelMenu ? (
                <MegaPanel menu={panelMenu} onNavigate={close} />
              ) : (
                <div className="h-px" aria-hidden />
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
