import type { ReactNode } from "react";
import type { Lang, PageKey, T } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { isStock } from "~/content/media-map";
import { Picture } from "../ui/Picture";
import { Breadcrumbs, TraceLine } from "./primitives";

function StockNote({ lang }: { lang: Lang }) {
  return <p className="mt-2 text-[0.6875rem] text-muted">{lang === "fr" ? "Photo d'illustration" : "Illustrative photo"}</p>;
}

/**
 * Inner-page hero. Two layouts:
 *  - "band" (default): type leads, the image runs below as a wide band;
 *  - "split": type on the left, a portrait photo or video on the right,
 *    for SAFA's own portrait shots, which a 21:9 band would crop away.
 * `media` replaces the image with any node (e.g. an ambient video).
 */
export function PageHero({
  lang,
  trail,
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  imagePriority = true,
  children,
  imageClass,
  media,
  layout = "band",
}: {
  lang: Lang;
  trail: { key: PageKey; name: T }[];
  eyebrow: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  image?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  children?: ReactNode;
  imageClass?: string;
  media?: ReactNode;
  layout?: "band" | "split";
}) {
  const visual =
    media ??
    (image && (
      <Picture
        name={image}
        alt={imageAlt ?? ""}
        priority={imagePriority}
        sizes={layout === "split" ? "(min-width: 64rem) 40vw, 100vw" : "(min-width: 88rem) 84rem, 100vw"}
        className={cn(layout === "split" ? "grain aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]" : "grain aspect-[4/3] md:aspect-[21/9]", imageClass)}
      />
    ));
  const note = !media && isStock(image) && <StockNote lang={lang} />;

  const heading = (
    <>
      <p className="eyebrow flex items-center gap-3" style={{ color: "var(--accent-ink, var(--accent))" }}>
        <span aria-hidden className="h-px w-8 bg-current" />
        {eyebrow}
      </p>
      <h1 className="vt-title mt-6 text-display-lg">{title}</h1>
    </>
  );

  if (layout === "split") {
    return (
      <section className="pt-[calc(var(--header-h)+0.5rem)] md:pt-[calc(var(--header-h)+2.25rem)]">
        <div className="container-x">
          <div className="text-muted">
            <Breadcrumbs lang={lang} trail={trail} />
          </div>
          <div className="mt-6 grid gap-10 md:mt-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-7 lg:pb-4">
              {heading}
              <p className="mt-8 max-w-xl text-lede text-muted">{lede}</p>
              {children && <div className="mt-9">{children}</div>}
              <TraceLine className="mt-12 hidden lg:block" scroll={false} />
            </div>
            <div className="lg:col-span-5">
              {visual}
              {note}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-[calc(var(--header-h)+0.5rem)] md:pt-[calc(var(--header-h)+2.25rem)]">
      <div className="container-x">
        <div className="text-muted">
          <Breadcrumbs lang={lang} trail={trail} />
        </div>
        <div className="mt-6 grid gap-8 md:mt-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>{heading}</div>
          <div className="lg:pb-3">
            <p className="text-lede text-muted">{lede}</p>
            {children && <div className="mt-8">{children}</div>}
          </div>
        </div>
        <TraceLine className="mt-12 md:mt-16" scroll={false} />
      </div>
      {visual && (
        <div className="container-x mt-6 md:mt-10">
          {visual}
          {note}
        </div>
      )}
    </section>
  );
}
