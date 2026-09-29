import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NAV, UI } from "~/content/ui";
import { href, otherLang, pageFromPath, type Lang, type PageKey } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { Logo } from "./Logo";

/** Remember an explicit language choice. vercel.json reads this cookie on "/"
 *  so a returning visitor lands in the language they chose. */
function rememberLang(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

export function LangSwitch({ lang, className }: { lang: Lang; className?: string }) {
  const { pathname } = useLocation();
  const target = otherLang(lang);
  const page = pageFromPath(pathname) ?? "home";
  return (
    <Link
      to={href(page, target)}
      hrefLang={target}
      lang={target}
      onClick={() => rememberLang(target)}
      aria-label={UI.switchLabel[lang]}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 text-[0.75rem] font-semibold tracking-[0.16em]",
        className,
      )}
    >
      <span className="opacity-40">{lang.toUpperCase()}</span>
      <span aria-hidden className="h-3 w-px bg-current opacity-30" />
      <span className="underline-offset-4 hover:underline">{target.toUpperCase()}</span>
    </Link>
  );
}

const navLink = "relative py-2 text-[0.8125rem] font-medium tracking-[0.06em] text-ink/75 transition-colors hover:text-ink aria-[current=page]:text-ink";

export function Header({ lang, tone = "light" }: { lang: Lang; tone?: "light" | "dark" }) {
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
    document.documentElement.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = tone === "dark" && !scrolled;
  const main: { key: PageKey; label: string }[] = [
    { key: "construction", label: NAV.construction.label[lang] },
    { key: "apartments", label: NAV.apartments.label[lang] },
    { key: "designs", label: NAV.designs.label[lang] },
    { key: "about", label: UI.about[lang] },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-500",
        dark ? "on-dark bg-transparent text-ivory" : "bg-ivory/92 text-ink shadow-[0_1px_0_rgb(20_32_42/0.08)] backdrop-blur-md",
      )}
    >
      <div className="container-x flex h-(--header-h) items-center justify-between gap-6">
        <Link to={href("home", lang)} aria-label={`SAFA & Co — ${UI.home[lang]}`} className="-ml-1 p-1">
          <Logo tone={dark ? "light" : "dark"} />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label={UI.divisions[lang]} className="hidden items-center gap-9 lg:flex">
          {main.map((item) => (
            <NavLink
              key={item.key}
              to={href(item.key, lang)}
              viewTransition
              className={cn(navLink, dark && "text-ivory/75 hover:text-ivory aria-[current=page]:text-ivory")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch lang={lang} className={cn("hidden sm:inline-flex", dark ? "text-ivory" : "text-ink")} />
          <Link
            to={href("contact", lang)}
            className={cn(
              "hidden min-h-11 items-center border px-5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors lg:inline-flex",
              dark ? "border-ivory/35 hover:bg-ivory hover:text-navy-950" : "border-ink/25 hover:bg-ink hover:text-ivory",
            )}
          >
            {UI.contact[lang]}
          </Link>

          {/* Mobile menu — <details> works with JavaScript off (Opera Mini). */}
          <details
            ref={menuRef}
            className="group lg:hidden"
            onToggle={(e) => {
              document.documentElement.style.overflow = (e.currentTarget as HTMLDetailsElement).open ? "hidden" : "";
            }}
          >
            <summary
              aria-label={UI.menu[lang]}
              className="relative z-50 flex min-h-11 min-w-11 items-center justify-end gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em]"
            >
              <span className="group-open:hidden">{UI.menu[lang]}</span>
              <span className="hidden group-open:inline text-ivory">{UI.close[lang]}</span>
              <span aria-hidden className="relative block h-3 w-6">
                <span className="absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 group-open:top-1.5 group-open:rotate-45 group-open:bg-ivory" />
                <span className="absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 group-open:bottom-1.5 group-open:-rotate-45 group-open:bg-ivory" />
              </span>
            </summary>
            <MobileMenu lang={lang} />
          </details>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ lang }: { lang: Lang }) {
  const groups: { key: PageKey; label: string; children?: readonly { page: string; label: { en: string; fr: string } }[] }[] = [
    { key: "construction", label: NAV.construction.label[lang], children: NAV.construction.children },
    { key: "apartments", label: NAV.apartments.label[lang] },
    { key: "designs", label: NAV.designs.label[lang], children: NAV.designs.children },
  ];
  return (
    <div className="on-dark fixed inset-0 z-40 overflow-y-auto bg-navy-950 text-ivory">
      <div className="container-x flex min-h-dvh flex-col pb-10 pt-[calc(var(--header-h)+2rem)]">
        <p className="eyebrow text-gold-300">{UI.divisions[lang]}</p>
        <ul className="mt-6 divide-y divide-ivory/10 border-y border-ivory/10">
          {groups.map((g, i) => (
            <li key={g.key} className="py-5">
              <Link to={href(g.key, lang)} className="flex items-baseline justify-between gap-4">
                <span className="font-display text-[2.5rem] leading-none">{g.label}</span>
                <span className="tabular text-xs text-ivory/60">0{i + 1}</span>
              </Link>
              {g.children && (
                <ul className="mt-3 space-y-1 pl-0.5">
                  {g.children.map((c) => (
                    <li key={c.page}>
                      <Link to={href(c.page as PageKey, lang)} className="flex min-h-10 items-center gap-2 text-sm text-ivory/70">
                        <span aria-hidden className="h-px w-4 bg-gold" />
                        {c.label[lang]}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-1 text-[0.9375rem]">
          {(["about", "faq", "contact", "legal"] as const).map((k) => (
            <li key={k}>
              <Link to={href(k, lang)} className="flex min-h-11 items-center gap-1 text-ivory/80">
                {k === "about" ? UI.about[lang] : k === "faq" ? UI.faq[lang] : k === "contact" ? UI.contact[lang] : UI.legal[lang]}
                <ArrowUpRight className="size-3.5 opacity-40" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-10">
          <LangSwitch lang={lang} className="text-ivory" />
          <span className="font-display text-sm italic text-ivory/60">Yaoundé · Cameroun</span>
        </div>
      </div>
    </div>
  );
}
