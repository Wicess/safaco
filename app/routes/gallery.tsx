import { useEffect, useMemo, useState } from "react";
import { CtaBand } from "~/components/sections/CtaBand";
import { GalleryTile, Lightbox, useLightbox } from "~/components/sections/Gallery";
import { Breadcrumbs, TraceLine } from "~/components/sections/primitives";
import { GALLERY } from "~/content/gallery";
import { DIVISION_LIST, type DivisionKey } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { pageHero } from "~/content/defaults";
import type { Lang } from "~/lib/i18n";
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

type Filter = "all" | DivisionKey;
const FILTERS: Filter[] = ["all", "construction", "apartments", "designs"];
const FILTER_LABEL: Record<Filter, Record<Lang, string>> = {
  all: { en: "Everything", fr: "Tout" },
  construction: { en: "Construction", fr: "Construction" },
  apartments: { en: "Apartments", fr: "Appartements" },
  designs: { en: "Designs", fr: "Designs" },
};

/** "Everything" deals the three divisions out in turn, so every column of the
 *  masonry (which fills top-to-bottom) mixes machines, rooms and garments. */
const MIXED = (() => {
  const queues = DIVISION_LIST.map((d) => GALLERY.filter((g) => g.division === d.key));
  const out: typeof GALLERY = [];
  while (queues.some((q) => q.length)) for (const q of queues) if (q.length) out.push(q.shift()!);
  return out;
})();

function isFilter(v: string | null): v is Filter {
  return v !== null && (FILTERS as string[]).includes(v);
}

export default function Gallery() {
  const lang = useLang();
  const hero = pageHero("gallery", lang);
  const [filter, setFilter] = useState<Filter>("all");

  // Prerendered HTML shows everything (crawlers see every photo); the
  // ?c= filter from a division page is applied once JS runs.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (isFilter(c)) setFilter(c);
  }, []);

  const items = useMemo(() => (filter === "all" ? MIXED : GALLERY.filter((g) => g.division === filter)), [filter]);
  const lb = useLightbox(items);

  const choose = (f: Filter) => {
    if (f === filter) return;
    const url = new URL(window.location.href);
    if (f === "all") url.searchParams.delete("c");
    else url.searchParams.set("c", f);
    window.history.replaceState(window.history.state, "", url);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => setFilter(f));
    else setFilter(f);
  };

  const count = (f: Filter) => (f === "all" ? GALLERY.length : GALLERY.filter((g) => g.division === f).length);

  return (
    <>
      <section className="pt-[calc(var(--header-h)+0.5rem)] md:pt-[calc(var(--header-h)+2.25rem)]">
        <div className="container-x">
          <div className="text-muted">
            <Breadcrumbs lang={lang} trail={TRAIL} />
          </div>
          <div className="mt-6 grid gap-8 md:mt-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <h1 className="vt-title text-display-lg">
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
            <p className="text-lede text-muted lg:pb-3">{hero.lede}</p>
          </div>
          <TraceLine className="mt-12 md:mt-16" scroll={false} />
        </div>
      </section>

      <section className="pb-20 pt-6 md:pb-28 md:pt-8">
        <div className="container-x">
          <div
            role="group"
            aria-label={lang === "fr" ? "Filtrer par division" : "Filter by division"}
            className="sticky-under-header fade-x sticky z-20 -mx-(--gutter) flex gap-2 overflow-x-auto bg-ivory/92 px-(--gutter) py-3 backdrop-blur-md [scrollbar-width:none]"
          >
            {FILTERS.map((f) => {
              const active = f === filter;
              const accent = f === "all" ? "var(--color-ink)" : DIVISION_LIST.find((d) => d.key === f)!.accentVar;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => choose(f)}
                  style={{ ["--chip" as string]: accent }}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-full border px-4 text-[0.8125rem] font-medium transition-[background-color,border-color,color] duration-300",
                    active ? "border-(--chip) bg-(--chip) text-ivory" : "border-ink/15 text-ink/80 hover:border-ink/40 hover:text-ink",
                  )}
                >
                  {FILTER_LABEL[f][lang]}
                  <span className={cn("tabular text-[0.6875rem]", active ? "text-ivory/75" : "text-muted")}>{count(f)}</span>
                </button>
              );
            })}
          </div>

          <ul className="gallery-grid mt-6 columns-2 gap-3 sm:gap-4 md:columns-3 xl:columns-4" aria-live="polite">
            {items.map((it, i) => (
              <li key={it.id} className="mb-3 break-inside-avoid sm:mb-4" style={{ viewTransitionName: `g-${it.id}` }}>
                <GalleryTile
                  item={it}
                  lang={lang}
                  onOpen={() => lb.open(i)}
                  priority={i < 2}
                  sizes="(min-width: 80rem) 22vw, (min-width: 48rem) 31vw, 48vw"
                />
              </li>
            ))}
          </ul>
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
