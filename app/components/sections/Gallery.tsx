import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { galleryFor, type GalleryItem } from "~/content/gallery";
import { DIVISIONS } from "~/content/site";
import { href, type Lang } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { Picture } from "../ui/Picture";
import { posterUrl, videoUrl } from "../ui/Video";

const L = {
  open: { en: "Open", fr: "Ouvrir" },
  video: { en: "Video", fr: "Vidéo" },
  close: { en: "Close", fr: "Fermer" },
  prev: { en: "Previous", fr: "Précédent" },
  next: { en: "Next", fr: "Suivant" },
  viewer: { en: "Photo viewer", fr: "Visionneuse" },
};

/* ───────────────────────── Lightbox ─────────────────────────
   Native <dialog>: focus trap, Esc to close and an inert page for free.
   Arrow keys and horizontal swipes move through the set. */

export function useLightbox(items: GalleryItem[]) {
  const [index, setIndex] = useState<number | null>(null);
  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  return { index, open, close, setIndex, items };
}

export function Lightbox({
  lang,
  items,
  index,
  setIndex,
  close,
}: {
  lang: Lang;
  items: GalleryItem[];
  index: number | null;
  setIndex: (i: number) => void;
  close: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number; axis?: "x" | "y" } | null>(null);
  // Horizontal drag offset: the photo follows the finger, then snaps.
  const [drag, setDrag] = useState(0);
  const isOpen = index !== null;
  const item = isOpen ? items[index] : undefined;
  const n = items.length;
  const go = useCallback((d: number) => index !== null && setIndex((index + d + n) % n), [index, n, setIndex]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (isOpen && !dlg.open) {
      dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!isOpen && dlg.open) {
      dlg.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, go]);

  const d = item ? DIVISIONS[item.division] : undefined;

  return (
    <dialog
      ref={ref}
      aria-label={L.viewer[lang]}
      onClose={() => {
        document.documentElement.style.overflow = "";
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchMove={(e) => {
        const s0 = touch.current;
        const t = e.touches[0];
        if (!s0 || !t || n < 2) return;
        const dx = t.clientX - s0.x;
        const dy = t.clientY - s0.y;
        s0.axis ??= Math.abs(dx) > 8 || Math.abs(dy) > 8 ? (Math.abs(dx) > Math.abs(dy) ? "x" : "y") : undefined;
        if (s0.axis === "x") setDrag(dx);
      }}
      onTouchEnd={(e) => {
        const s0 = touch.current;
        const t = e.changedTouches[0];
        touch.current = null;
        setDrag(0);
        if (!s0 || !t || s0.axis !== "x") return;
        const dx = t.clientX - s0.x;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
      className="lightbox on-dark m-0 h-dvh max-h-none w-screen max-w-none bg-navy-950 p-0 text-ivory"
    >
      {item && (
        <div className="grid h-full grid-rows-[auto_1fr_auto]">
          <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
            <p className="tabular text-xs tracking-[0.16em] text-ivory/60">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ivory/80 hover:text-ivory"
            >
              {L.close[lang]} <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="relative min-h-0 px-2 md:px-20">
            <figure
              key={item.id}
              className={cn("lightbox-frame flex h-full min-h-0 flex-col items-center justify-center", !drag && "transition-transform duration-300 ease-(--ease-out-quart)")}
              style={drag ? { transform: `translateX(${drag}px)`, opacity: Math.max(0.4, 1 - Math.abs(drag) / 500) } : undefined}
            >
              {item.video ? (
                <video
                  src={videoUrl(item.video)}
                  poster={posterUrl(item.video)}
                  controls
                  autoPlay
                  muted
                  playsInline
                  loop
                  aria-label={item.alt[lang]}
                  className="max-h-full w-auto max-w-full bg-black object-contain"
                />
              ) : (
                <Picture
                  name={item.image}
                  alt={item.alt[lang]}
                  sizes="100vw"
                  priority
                  className="flex h-full w-full items-center justify-center"
                  imgClassName="h-auto max-h-full w-auto max-w-full object-contain"
                />
              )}
            </figure>
            {n > 1 && (
              <>
                <NavButton label={L.prev[lang]} onClick={() => go(-1)} className="left-2 md:left-5">
                  <ArrowLeft className="size-5" aria-hidden />
                </NavButton>
                <NavButton label={L.next[lang]} onClick={() => go(1)} className="right-2 md:right-5">
                  <ArrowRight className="size-5" aria-hidden />
                </NavButton>
              </>
            )}
          </div>

          <div className="mx-auto w-full max-w-3xl px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-4 text-center md:px-6">
            {d && (
              <p className="eyebrow text-gold-300">
                {d.name}
                {item.video ? ` · ${L.video[lang]}` : ""}
              </p>
            )}
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ivory/80 text-pretty">{item.alt[lang].replace(/^(Video|Vidéo)\s?:\s?/, "")}</p>
          </div>
        </div>
      )}
    </dialog>
  );
}

function NavButton({ label, onClick, className, children }: { label: string; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-ivory/20 bg-navy-950/60 text-ivory transition-[background-color,border-color,transform] duration-300 hover:border-ivory/60 hover:bg-navy-900 active:scale-95",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ───────────────────────── Tiles ───────────────────────── */

export function GalleryTile({
  item,
  lang,
  onOpen,
  sizes,
  className,
  ratio,
  priority,
  pictureClass,
}: {
  item: GalleryItem;
  lang: Lang;
  onOpen: () => void;
  sizes: string;
  className?: string;
  /** Force a crop; otherwise the photo keeps its own proportions (masonry). */
  ratio?: string;
  priority?: boolean;
  pictureClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${L.open[lang]}${lang === "fr" ? " : " : ": "}${item.alt[lang]}`}
      className={cn("group/tile relative block w-full overflow-hidden bg-stone text-left", className)}
    >
      <Picture
        name={item.image}
        alt=""
        sizes={sizes}
        ratio={ratio}
        priority={priority}
        className={cn("grain", pictureClass)}
        imgClassName="transition-[transform,filter] duration-[1.2s] ease-(--ease-out-quart) group-hover/tile:scale-[1.035] group-focus-visible/tile:scale-[1.035]"
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100" />
      {item.video && (
        <span aria-hidden className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/75 py-1.5 pl-2 pr-3 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur-sm">
          <Play className="size-3 fill-current" /> {L.video[lang]}
        </span>
      )}
    </button>
  );
}

/** A short run of one division's media on its own page, ending in a link
 *  to the full gallery. Swipe strip on phones, editorial grid from tablet. */
export function GalleryStrip({ lang, items, division }: { lang: Lang; items: GalleryItem[]; division: GalleryItem["division"] }) {
  const lb = useLightbox(items);
  const shown = items.slice(0, 5);
  return (
    <>
      <ul className="fade-x -mx-(--gutter) flex snap-x snap-mandatory scroll-px-(--gutter) gap-3 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
        {shown.map((it, i) => (
          <li key={it.id} className={cn("relative w-[68%] shrink-0 snap-start sm:w-[44%] md:w-auto", i === 0 && "md:col-span-2 md:row-span-2")}>
            <GalleryTile
              item={it}
              lang={lang}
              onOpen={() => lb.open(i)}
              className={i === 0 ? "md:absolute md:inset-0" : undefined}
              pictureClass={i === 0 ? "aspect-[3/4] md:aspect-auto md:h-full" : "aspect-[3/4]"}
              sizes={i === 0 ? "(min-width: 48rem) 48vw, 68vw" : "(min-width: 48rem) 24vw, 68vw"}
            />
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-ink/12 pt-6">
        <p className="text-sm text-muted">
          {lang === "fr"
            ? `${galleryFor(division).length} photos et vidéos de ${DIVISIONS[division].name}, prises sur place.`
            : `${galleryFor(division).length} photos and videos from ${DIVISIONS[division].name}, taken on site.`}
        </p>
        <Link
          to={`${href("gallery", lang)}?c=${division}`}
          className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]"
        >
          {lang === "fr" ? "Voir la galerie" : "View the gallery"}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      <Lightbox lang={lang} items={items} index={lb.index} setIndex={lb.setIndex} close={lb.close} />
    </>
  );
}
