/**
 * Admin-editable content. The admin panel saves a draft of this shape to R2
 * (`site/draft.json`); "Publish" copies it to `site/content.json` and triggers
 * a rebuild. At build time `scripts/content-pull.ts` downloads the published
 * copy into `overrides.generated.json`, so every page stays prerendered static
 * HTML: no function or database runs when someone views the site.
 *
 * Every field is optional: an empty or missing value falls back to the default
 * written in the code (site.ts, the page files, gallery.ts).
 */
import raw from "./overrides.generated.json";
import type { Lang } from "~/lib/i18n";

/** A bilingual string where either side may be blank (= use the default). */
export type TT = { en?: string; fr?: string };

export type DivisionKeyO = "construction" | "apartments" | "designs";
export type PageHeroKey = "construction" | "plastering" | "apartments" | "designs" | "gallery";

export type MediaEntry = {
  w: number;
  h: number;
  widths: number[];
  blur: string;
  formats: string[];
  /** Absolute base URL for uploaded images (they live only on R2). */
  base?: string;
};

export type GalleryItemO = {
  id: string;
  division: DivisionKeyO;
  image: string;
  video?: "atelier" | "mastBlue" | "mastGreen" | "fleet";
  alt: { en: string; fr: string };
  hidden?: boolean;
};

export type Overrides = {
  updatedAt?: string;
  publishedAt?: string;
  company?: {
    email?: string;
    rccm?: string;
    niu?: string;
    minefop?: string;
    social?: { facebook?: string; instagram?: string; tiktok?: string; linkedin?: string };
  };
  divisions?: Partial<
    Record<
      DivisionKeyO,
      {
        phone?: string;
        whatsapp?: string;
        email?: string;
        addressLine?: TT;
        district?: string;
        hours?: TT;
        mapsUrl?: string;
        tagline?: TT;
      }
    >
  >;
  home?: {
    heroEyebrow?: TT;
    heroTitle?: TT;
    heroEmphasis?: TT;
    heroLede?: TT;
    /** Photo shown for each house in the hero and the home sections. */
    houseImages?: Partial<Record<DivisionKeyO, string>>;
  };
  pages?: Partial<Record<PageHeroKey, { title?: TT; lede?: TT; image?: string }>>;
  apartments?: {
    /** Amenity keys (amenities.ts) the owner confirmed. Missing = photo-backed defaults. */
    amenities?: string[];
  };
  construction?: {
    /** SAFA's own measured outputs for the calculator, m² per day. */
    machinePerDay?: number;
    manualPerMasonDay?: number;
  };
  settings?: {
    /** Language for visitors whose device is neither French nor English (or
     *  sends no language). French and English devices always get their own. */
    defaultLang?: "en" | "fr";
  };
  /** Photo slots (media-map IMG keys) the owner replaced in admin → Photos. */
  images?: Record<string, string>;
  /** The whole gallery, once edited in the admin (order = display order). */
  gallery?: GalleryItemO[];
  /** Images uploaded through the admin (manifest entries, served from R2). */
  media?: Record<string, MediaEntry>;
};

export const O = raw as Overrides;

/** Non-empty trimmed string or undefined. */
export function val(s: string | undefined | null): string | undefined {
  const t = s?.trim();
  return t ? t : undefined;
}

/** Bilingual override for `lang`, else the default. */
export function pick(o: TT | undefined, lang: Lang, fallback: string): string {
  return val(o?.[lang]) ?? fallback;
}

/** Same as pick() for a full {en, fr} default. */
export function pickT(o: TT | undefined, def: { en: string; fr: string }): { en: string; fr: string } {
  return { en: val(o?.en) ?? def.en, fr: val(o?.fr) ?? def.fr };
}
