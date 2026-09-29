import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { DIVISION_LIST, MINEFOP, SITE, isTodo, telLink, waLink, greeting } from "~/content/site";
import { NAV, UI } from "~/content/ui";
import { href, type Lang, type PageKey } from "~/lib/i18n";
import { Logo } from "./Logo";

export function Footer({ lang }: { lang: Lang }) {
  const year = new Date().getFullYear();
  const legalBits = [
    !isTodo(SITE.rccm) && `RCCM ${SITE.rccm}`,
    !isTodo(SITE.niu) && `NIU ${SITE.niu}`,
    !isTodo(MINEFOP.agrement) && `${lang === "fr" ? "Agrément MINEFOP" : "MINEFOP approval"} ${MINEFOP.agrement}`,
  ].filter(Boolean) as string[];

  return (
    <footer className="on-dark relative overflow-hidden bg-navy-950 text-ivory">
      {/* The chalk line that closes every page */}
      <span aria-hidden className="trace-line" data-trace data-scroll style={{ ["--accent" as string]: "var(--color-gold)" }} />

      {/* Bottom padding clears the fixed mobile action bar */}
      <div className="container-x pb-[calc(var(--bar-h)+env(safe-area-inset-bottom)+2.5rem)] pt-16 md:pt-24 lg:pb-10">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-6 max-w-sm font-display text-[1.75rem] italic leading-tight text-ivory/85">
              {lang === "fr" ? "Bâtir, accueillir, habiller — avec précision." : "We build, host and tailor — with precision."}
            </p>
            <p className="mt-4 text-sm text-ivory/55">{lang === "fr" ? "Un groupe camerounais basé à Yaoundé." : "A Cameroonian group based in Yaoundé."}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {DIVISION_LIST.map((d) => (
              <div key={d.key}>
                <p className="eyebrow text-gold-300">{d.name}</p>
                <address className="mt-4 space-y-2 text-sm not-italic leading-relaxed text-ivory/70">
                  <span className="block">{d.address.line[lang]}</span>
                  <span className="block">{d.hours[lang]}</span>
                  <a className="block min-h-6 text-ivory hover:text-gold-300" href={telLink(d.phone)}>
                    {d.phone}
                  </a>
                  <a className="block text-ivory/70 underline-offset-4 hover:underline" href={waLink(d.whatsapp, greeting(d.key, lang))} rel="noopener">
                    WhatsApp
                  </a>
                </address>
                <Link to={href(d.page, lang)} className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-ivory/65 hover:text-ivory">
                  {UI.discover[lang]} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <nav aria-label={UI.group[lang]} className="mt-16 flex flex-wrap gap-x-7 gap-y-2 border-t border-ivory/10 pt-8 text-sm text-ivory/60">
          {(
            [
              ["construction", NAV.construction.label[lang]],
              ["plastering", NAV.construction.children[0].label[lang]],
              ["apartments", NAV.apartments.label[lang]],
              ["designs", NAV.designs.label[lang]],
              ["training", NAV.designs.children[0].label[lang]],
              ["about", UI.about[lang]],
              ["faq", UI.faq[lang]],
              ["contact", UI.contact[lang]],
            ] as [PageKey, string][]
          ).map(([k, label]) => (
            <Link key={k} to={href(k, lang)} className="min-h-8 hover:text-ivory">
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 flex flex-col gap-6 text-xs text-ivory/65 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1.5">
            <p>
              © {year} {SITE.legalName}. {UI.rights[lang]}{" "}
              <Link to={href("legal", lang)} className="underline-offset-4 hover:text-ivory hover:underline">
                {UI.legal[lang]}
              </Link>
            </p>
            {legalBits.length > 0 && <p className="tabular">{legalBits.join(" · ")}</p>}
          </div>
          <DeveloperCredit />
        </div>
      </div>
    </footer>
  );
}

/** Standing developer signature (owner's rule): "Developed by W!CE". */
function DeveloperCredit() {
  const sheen = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = sheen.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) el.setAttribute("data-playing", "");
      else el.removeAttribute("data-playing");
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <a
      href="mailto:kenj52974@gmail.com"
      aria-label="Contact the developer, W!CE"
      className="group inline-flex items-baseline gap-2.5 self-start md:self-auto"
    >
      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.4em] text-ivory/30 transition-colors duration-300 group-hover:text-ivory/60">
        Developed by
      </span>
      <span ref={sheen} className="animate-sheen bg-[linear-gradient(90deg,var(--color-gold-300)_0%,#fff6e6_50%,var(--color-gold-300)_100%)] bg-size-[200%_auto] bg-clip-text font-sans text-[1.0625rem] font-bold leading-none tracking-[0.08em] text-transparent motion-reduce:animate-none">
        W!CE
      </span>
    </a>
  );
}
