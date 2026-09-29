import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { Unit } from "~/content/construction";
import { href, type Lang } from "~/lib/i18n";
import { Picture } from "../ui/Picture";

/** Fleet cards. On phones: a horizontal swipe strip with snap (native scroll,
 *  no JS). From tablet up: a grid. */
export function FleetGrid({ lang, units, link = true }: { lang: Lang; units: Unit[]; link?: boolean }) {
  return (
    <ul className="-mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
      {units.map((u) => {
        const inner = (
          <>
            <div className="relative">
              <Picture name={u.img} alt="" sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 45vw, 80vw" className="grain aspect-[4/3]" />
              <span className="tabular absolute left-3 top-3 bg-navy-950/85 px-2 py-1 text-[0.625rem] font-semibold tracking-[0.18em] text-gold-300">
                N° {u.code}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 pt-5">
              <div>
                <h3 className="text-[1.5rem] leading-tight">{u.name[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{u.body[lang]}</p>
                <p className="eyebrow mt-4 text-gold-600">{lang === "fr" ? "Disponible à la location" : "Available for hire"}</p>
              </div>
              {link && <ArrowUpRight className="mt-1 size-4 shrink-0 opacity-40 transition group-hover:opacity-100" aria-hidden />}
            </div>
          </>
        );
        return (
          <li key={u.code} className="w-[80%] shrink-0 snap-start md:w-auto" data-reveal>
            {link ? (
              <Link to={href(u.page, lang)} className="group block">
                {inner}
              </Link>
            ) : (
              <div>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
