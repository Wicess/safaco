import { ChevronRight, Plus } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { UI } from "~/content/ui";
import { href, type Lang, type PageKey, type T } from "~/lib/i18n";
import { cn } from "~/lib/utils";

/** The chalk line — a 1px rule in the current division accent. */
export function TraceLine({ className, scroll = true, style }: { className?: string; scroll?: boolean; style?: CSSProperties }) {
  return <span aria-hidden className={cn("trace-line block", className)} data-trace data-scroll={scroll ? "" : undefined} style={style} />;
}

export function Eyebrow({ children, className, index }: { children: ReactNode; className?: string; index?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-gold-600", className)}>
      {index && <span className="tabular text-ink/55">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}

export function SectionHead({
  index,
  eyebrow,
  title,
  lede,
  className,
  tone = "light",
  as: H = "h2",
}: {
  index?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-3xl", className)} data-reveal>
      {eyebrow && <Eyebrow index={index} className={tone === "dark" ? "text-gold-300 [&_.tabular]:text-ivory/60" : undefined}>{eyebrow}</Eyebrow>}
      <H className={cn("mt-5 text-display-md", tone === "dark" && "text-ivory")}>{title}</H>
      {lede && <p className={cn("mt-6 text-lede", tone === "dark" ? "text-ivory/70" : "text-muted")}>{lede}</p>}
    </div>
  );
}

export function Breadcrumbs({ lang, trail }: { lang: Lang; trail: { key: PageKey; name: T }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-current/60">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to={href("home", lang)} className="hover:underline">
            {UI.breadcrumbHome[lang]}
          </Link>
        </li>
        {trail.map((c, i) => (
          <li key={c.key} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 opacity-50" aria-hidden />
            {i === trail.length - 1 ? (
              <span aria-current="page">{c.name[lang]}</span>
            ) : (
              <Link to={href(c.key, lang)} className="hover:underline">
                {c.name[lang]}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Answer-first FAQ. <details> = works without JS, and the answers stay in the
 *  HTML for search engines and AI crawlers. */
export function FaqList({ lang, items, tone = "light" }: { lang: Lang; items: { q: T; a: T }[]; tone?: "light" | "dark" }) {
  return (
    <div className={cn("divide-y border-y", tone === "dark" ? "divide-ivory/12 border-ivory/12" : "divide-ink/12 border-ink/12")}>
      {items.map((it) => (
        <details key={it.q.en} className="group py-1">
          <summary className="flex min-h-16 items-center justify-between gap-6 py-4">
            <h3 className={cn("font-display text-[1.375rem] leading-snug md:text-[1.625rem]", tone === "dark" && "text-ivory")}>{it.q[lang]}</h3>
            <Plus className="size-5 shrink-0 text-gold-600 transition-transform duration-300 group-open:rotate-45" aria-hidden />
          </summary>
          <p className={cn("max-w-2xl pb-6 pr-10 leading-relaxed", tone === "dark" ? "text-ivory/70" : "text-muted")}>{it.a[lang]}</p>
        </details>
      ))}
    </div>
  );
}

/** Numbered process steps, joined by the chalk line. Compact rows on phones,
 *  a four-column rail from desktop. */
export function Steps({ items, lang }: { items: { title: T; body: T }[]; lang: Lang }) {
  return (
    <ol className="grid border-t border-ink/12 sm:grid-cols-2 sm:gap-px sm:border-t-0 sm:bg-ink/10 lg:grid-cols-4">
      {items.map((s, i) => (
        <li
          key={s.title.en}
          className="grid grid-cols-[3.25rem_1fr] gap-x-4 border-b border-ink/12 py-6 sm:block sm:border-0 sm:bg-ivory sm:p-8"
          data-reveal
          style={{ transitionDelay: `${i * 80}ms` }}
        >
          <span className="tabular font-display text-4xl leading-none text-gold-600 sm:text-5xl">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <TraceLine className="mt-6 hidden w-10 sm:block" scroll={false} />
            <h3 className="text-[1.5rem] leading-tight sm:mt-6 sm:text-2xl">{s.title[lang]}</h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted sm:mt-3">{s.body[lang]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
