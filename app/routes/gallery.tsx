import { ArrowRight } from "lucide-react";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { GalleryTile, Lightbox, useLightbox } from "~/components/sections/Gallery";
import { Breadcrumbs } from "~/components/sections/primitives";
import { GALLERY } from "~/content/gallery";
import { DIVISION_LIST, type DivisionKey } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { pageHero } from "~/content/defaults";
import { href, type Lang } from "~/lib/i18n";
import { breadcrumb, pageMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";

const TRAIL = [{ key: "gallery" as const, name: { en: "Gallery", fr: "Galerie" } }];

export const meta = pageMeta({
  key: "gallery",
  title: {
    en: "Gallery: machines, apartments, tailoring, Yaoundé | SAFA",
    fr: "Galerie : machines, meublés, couture à Yaoundé | SAFA",
  },
  description: {
    en: "SAFA's own photos and videos: automatic plastering machines at work, the furnished apartments in Meyo and garments made at the Carrefour MEEC atelier.",
    fr: "Les photos et vidéos de SAFA : machines à crépir en action, appartements meublés à Meyo et tenues confectionnées à l'atelier du Carrefour MEEC.",
  },
  image: "/og/gallery.jpg",
  jsonLd: (lang) => [breadcrumb(lang, TRAIL)],
});

const TABS: DivisionKey[] = ["construction", "apartments", "designs"];
const TAB_LABEL: Record<DivisionKey, Record<Lang, string>> = {
  construction: { en: "Construction", fr: "Construction" },
  apartments: { en: "Apartments", fr: "Appartements" },
  designs: { en: "Designs", fr: "Designs" },
};
const BY_DIVISION = Object.fromEntries(TABS.map((k) => [k, GALLERY.filter((g) => g.division === k)])) as Record<DivisionKey, typeof GALLERY>;

function isTab(v: string | null): v is DivisionKey {
  return v !== null && (TABS as string[]).includes(v);
}

/**
 * One department at a time (owner, 2026-11-09). All three panels are in the
 * prerendered HTML (crawlers see every photo); the inactive ones are `hidden`
 * and their lazy images never load. ?c=<division> picks the tab.
 */
export default function Gallery() {
  const lang = useLang();
  const hero = pageHero("gallery", lang);
  const [tab, setTab] = useState<DivisionKey>("construction");

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (isTab(c)) setTab(c);
  }, []);

  const items = BY_DIVISION[tab];
  const lb = useLightbox(items);

  const choose = (t: DivisionKey, focus = false) => {
    if (focus) document.getElementById(`tab-${t}`)?.focus();
    if (t === tab) return;
    const url = new URL(window.location.href);
    url.searchParams.set("c", t);
    window.history.replaceState(window.history.state, "", url);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => setTab(t));
    else setTab(t);
  };

  // WAI-ARIA tabs: arrows move between departments, Home/End jump to the ends.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(tab);
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: TABS.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    choose(TABS[(next + TABS.length) % TABS.length]!, true);
  };

  return (
    <>
      <section className="pt-[calc(var(--header-h)+0.25rem)] md:pt-[calc(var(--header-h)+1.25rem)]">
        <div className="container-x">
          <div className="text-muted">
            <Breadcrumbs lang={lang} trail={TRAIL} />
          </div>
          <div className="mt-4 grid gap-4 md:mt-6 md:gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
            <h1 className="vt-title text-[clamp(2.375rem,1.5rem+3.4vw,4.75rem)] leading-[0.98] tracking-[-0.015em]">
              {hero.title ??
                (lang === "fr" ? (
                  <>
                    Notre travail, <em className="italic text-gold-600">tel qu'il est.</em>
                  </>
                ) : (
                  <>
                    Our work, <em className="italic text-gold-600">as it is.</em>
                  </>
                ))}
            </h1>
            <p className="max-w-md text-[1.0625rem] leading-relaxed text-muted lg:pb-2">{hero.lede}</p>
          </div>
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-28 md:pt-10">
        <div className="container-x">
          {/* Department tabs: the page's rule line, marked in each house's colour */}
          <div
            role="tablist"
            aria-label={lang === "fr" ? "Galerie par division" : "Gallery by division"}
            onKeyDown={onKey}
            className="sticky-under-header sticky z-20 -mx-(--gutter) grid grid-cols-3 gap-x-2 border-b border-ink/12 bg-ivory/92 px-(--gutter) backdrop-blur-md sm:flex sm:gap-10 md:mx-0 md:gap-12 md:px-0"
          >
            {TABS.map((t) => {
              const active = t === tab;
              const d = DIVISION_LIST.find((x) => x.key === t)!;
              return (
                <button
                  key={t}
                  id={`tab-${t}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`panel-${t}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => choose(t)}
                  style={{ ["--chip" as string]: d.accentVar }}
                  className={cn(
                    "group relative flex min-h-14 min-w-0 items-baseline justify-center gap-2 pt-3 font-display text-[clamp(0.9375rem,4.4vw,1.375rem)] leading-none transition-colors duration-300 sm:justify-start sm:text-[1.375rem] md:min-h-16 md:text-[1.75rem]",
                    active ? "text-ink" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {TAB_LABEL[t][lang]}
                  <span className={cn("tabular hidden font-sans text-[0.75rem] tracking-normal sm:inline", active ? "text-(--chip)" : "text-muted")}>{BY_DIVISION[t].length}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-(--chip) transition-transform duration-500 ease-(--ease-out-quart)",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-[0.35]",
                    )}
                  />
                </button>
              );
            })}
          </div>

          {TABS.map((t) => {
            const d = DIVISION_LIST.find((x) => x.key === t)!;
            const list = BY_DIVISION[t];
            return (
              <div key={t} id={`panel-${t}`} role="tabpanel" aria-labelledby={`tab-${t}`} hidden={t !== tab} tabIndex={0} className="focus-visible:outline-offset-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-5 md:py-6">
                  <p className="max-w-xl text-[0.9375rem] text-muted">
                    <span className="tabular mr-2 font-semibold text-ink sm:hidden">
                      {list.length} {lang === "fr" ? "photos et vidéos ·" : "photos & videos ·"}
                    </span>
                    {d.tagline[lang]}
                  </p>
                  <Link
                    to={href(d.page, lang)}
                    className="group inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: "var(--accent-ink, var(--color-ink))" }}
                  >
                    {lang === "fr" ? `Découvrir ${d.name}` : `Discover ${d.name}`}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
                <ul className="gallery-grid columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4">
                  {list.map((it, i) => (
                    <li key={it.id} className="mb-3 break-inside-avoid sm:mb-4" style={t === tab ? { viewTransitionName: `g-${it.id}` } : undefined}>
                      <GalleryTile
                        item={it}
                        lang={lang}
                        onOpen={() => lb.open(i)}
                        priority={t === "construction" && i < 2}
                        sizes="(min-width: 80rem) 22vw, (min-width: 48rem) 31vw, 48vw"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <Lightbox lang={lang} items={items} index={lb.index} setIndex={lb.setIndex} close={lb.close} />

      <CtaBand
        lang={lang}
        title={{ en: "Seen something you need?", fr: "Vous avez vu ce qu'il vous faut ?" }}
        body={{
          en: "A machine for your site, a stay in Meyo or a garment like these: one message and the right team answers.",
          fr: "Une machine pour votre chantier, un séjour à Meyo ou une tenue comme celles-ci : un message, et la bonne équipe vous répond.",
        }}
      />
    </>
  );
}
