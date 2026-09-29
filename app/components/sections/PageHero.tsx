import type { ReactNode } from "react";
import type { Lang, PageKey, T } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { PLACEHOLDER_MEDIA } from "~/content/media-map";
import { Picture } from "../ui/Picture";
import { Breadcrumbs, TraceLine } from "./primitives";

/**
 * Inner-page hero. Type leads; the image sits below as a wide band (on phones
 * the headline is what loads first — the image is lazy and never the LCP
 * unless `imagePriority`).
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
}) {
  return (
    <section className="pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+3rem)]">
      <div className="container-x">
        <div className="text-muted">
          <Breadcrumbs lang={lang} trail={trail} />
        </div>
        <div className="mt-10 grid gap-8 md:mt-16 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow flex items-center gap-3" style={{ color: "var(--accent)" }}>
              <span aria-hidden className="h-px w-8 bg-current" />
              {eyebrow}
            </p>
            <h1 className="vt-title mt-6 text-display-lg">{title}</h1>
          </div>
          <div className="lg:pb-3">
            <p className="text-lede text-muted">{lede}</p>
            {children && <div className="mt-8">{children}</div>}
          </div>
        </div>
        <TraceLine className="mt-12 md:mt-16" scroll={false} />
      </div>
      {image && (
        <div className="container-x mt-6 md:mt-10">
          <Picture
            name={image}
            alt={imageAlt ?? ""}
            priority={imagePriority}
            sizes="(min-width: 88rem) 84rem, 100vw"
            className={cn("grain aspect-[4/3] md:aspect-[21/9]", imageClass)}
          />
          {PLACEHOLDER_MEDIA && (
            <p className="mt-2 text-[0.6875rem] text-muted">{lang === "fr" ? "Photo d'illustration" : "Illustrative photo"}</p>
          )}
        </div>
      )}
    </section>
  );
}
