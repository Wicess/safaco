/**
 * Bilingual route table. Single source of truth for every public URL.
 * English is the default (x-default = "/", which detects the device language).
 * Imported by app/routes.ts at build time, so keep this file free of JSX.
 */

export const LANGS = ["en", "fr"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export type PageKey =
  | "home"
  | "construction"
  | "plastering"
  | "scaffold"
  | "fabrication"
  | "apartments"
  | "designs"
  | "training"
  | "about"
  | "contact"
  | "thanks"
  | "faq"
  | "legal";

type PageDef = {
  file: string;
  path: Record<Lang, string>;
  /** Excluded from sitemap + marked noindex */
  noindex?: boolean;
};

export const PAGES: Record<PageKey, PageDef> = {
  home: { file: "routes/home.tsx", path: { en: "/en", fr: "/fr" } },
  construction: { file: "routes/construction.tsx", path: { en: "/en/construction", fr: "/fr/construction" } },
  plastering: {
    file: "routes/plastering.tsx",
    path: { en: "/en/construction/plastering-machine-hire", fr: "/fr/construction/location-machine-a-crepir" },
  },
  scaffold: {
    file: "routes/scaffold.tsx",
    path: { en: "/en/construction/scaffold-mast-lift-hire", fr: "/fr/construction/echafaudage-monte-charge" },
  },
  fabrication: {
    file: "routes/fabrication.tsx",
    path: { en: "/en/construction/fabrication", fr: "/fr/construction/fabrication" },
  },
  apartments: { file: "routes/apartments.tsx", path: { en: "/en/apartments", fr: "/fr/appartements" } },
  designs: { file: "routes/designs.tsx", path: { en: "/en/designs", fr: "/fr/designs" } },
  training: { file: "routes/training.tsx", path: { en: "/en/designs/training", fr: "/fr/designs/formation" } },
  about: { file: "routes/about.tsx", path: { en: "/en/about", fr: "/fr/a-propos" } },
  contact: { file: "routes/contact.tsx", path: { en: "/en/contact", fr: "/fr/contact" } },
  thanks: { file: "routes/thanks.tsx", path: { en: "/en/contact/thank-you", fr: "/fr/contact/merci" }, noindex: true },
  faq: { file: "routes/faq.tsx", path: { en: "/en/faq", fr: "/fr/questions" } },
  legal: { file: "routes/legal.tsx", path: { en: "/en/legal", fr: "/fr/mentions-legales" } },
};

export const PAGE_KEYS = Object.keys(PAGES) as PageKey[];

export function href(key: PageKey, lang: Lang): string {
  return PAGES[key].path[lang];
}

export function langFromPath(pathname: string): Lang {
  return pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : "en";
}

/** Find which page a pathname belongs to (for the language switcher + hreflang). */
export function pageFromPath(pathname: string): PageKey | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return PAGE_KEYS.find((k) => LANGS.some((l) => PAGES[k].path[l] === clean));
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "fr" : "en";
}

/** Every prerendered path (both languages) + the language-detecting root. */
export function allPaths(): string[] {
  return ["/", ...PAGE_KEYS.flatMap((k) => LANGS.map((l) => PAGES[k].path[l])), "/404"];
}

/** Pick a string for the active language. Content is authored as { en, fr }. */
export type T<V = string> = Record<Lang, V>;
export function t<V>(value: T<V>, lang: Lang): V {
  return value[lang];
}
