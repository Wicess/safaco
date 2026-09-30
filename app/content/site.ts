import type { Lang, PageKey, T } from "~/lib/i18n";

/**
 * Company facts. Anything marked CLIENT_TODO is a placeholder that must be
 * replaced with the client's real data before launch — `pnpm build` prints a
 * warning listing every one still present (scripts/postbuild.ts).
 *
 * House rules (owner-confirmed 2026-09-29):
 *  - No prices are published anywhere. Everything is "on request".
 *  - Never "the first in Cameroon" — only "among the first".
 */

export const CLIENT_TODO = "CLIENT_TODO";

/** Reads a build-time variable in both Vite (import.meta.env) and Node scripts
 *  (process.env, e.g. scripts/postbuild.ts). */
function env(key: string): string | undefined {
  const vite = (import.meta as { env?: Record<string, string | undefined> }).env?.[key];
  const node = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env?.[key];
  return vite || node || undefined;
}

/** Public contact address (owner, 2026-09-30). Mail is sent over SMTP from this mailbox. */
const EMAIL = env("VITE_CONTACT_EMAIL") ?? "sales@safaandcosarl.com";

export const SITE = {
  name: "SAFA & Co",
  legalName: "SAFA & Co SARL",
  // Canonical origin for SEO (canonical, hreflang, sitemap). Set VITE_SITE_URL per environment.
  url: (env("VITE_SITE_URL") ?? "https://safaandcosarl.com").replace(/\/$/, ""),
  city: "Yaoundé",
  country: "Cameroon",
  countryCode: "CM",
  email: EMAIL,
  rccm: "CLIENT_TODO", // Registre du Commerce (RCCM) number
  niu: "CLIENT_TODO", // Numéro d'Identifiant Unique (tax ID)
  founded: "CLIENT_TODO",
  social: {
    facebook: "", // CLIENT_TODO (leave empty to hide)
    instagram: "",
    tiktok: "",
    linkedin: "",
  },
};

export type DivisionKey = "construction" | "apartments" | "designs";

export type Division = {
  key: DivisionKey;
  name: string;
  page: PageKey;
  accentVar: string;
  tagline: T;
  short: T;
  /** Digits only, international format without "+", e.g. 2376XXXXXXXX */
  whatsapp: string;
  phone: string;
  email: string;
  address: {
    /** Landmark-style address, identical everywhere (site, Google, directories) */
    line: T;
    district: string;
    locality: string;
    /** Decimal degrees, 5 places. CLIENT_TODO: exact pin once the address is settled */
    geo?: { lat: number; lng: number };
    mapsUrl?: string;
  };
  hours: T;
};

export const DIVISIONS: Record<DivisionKey, Division> = {
  construction: {
    key: "construction",
    name: "SAFA Construction",
    page: "construction",
    accentVar: "var(--color-construction)",
    tagline: {
      en: "Automatic plastering machines, mast lifts and scaffold platforms for hire.",
      fr: "Location de machines à crépir automatiques, de monte-charges et de plateformes d'échafaudage.",
    },
    short: { en: "Build", fr: "Bâtir" },
    whatsapp: "237600000001", // CLIENT_TODO
    phone: "+237 6 00 00 00 01", // CLIENT_TODO
    email: EMAIL,
    address: {
      line: { en: "Yard address to be confirmed, Yaoundé", fr: "Adresse du dépôt à confirmer, Yaoundé" }, // CLIENT_TODO
      district: "Yaoundé",
      locality: "Yaoundé",
    },
    hours: { en: "Mon–Sat · 7:30–18:00", fr: "Lun–Sam · 7h30–18h00" }, // CLIENT_TODO: confirm
  },
  apartments: {
    key: "apartments",
    name: "SAFA Apartments",
    page: "apartments",
    accentVar: "var(--color-apartments)",
    tagline: {
      en: "Furnished, serviced apartments for short and extended stays in Yaoundé.",
      fr: "Appartements meublés et équipés pour courts et longs séjours à Yaoundé.",
    },
    short: { en: "Stay", fr: "Séjourner" },
    whatsapp: "237600000002", // CLIENT_TODO
    phone: "+237 6 00 00 00 02", // CLIENT_TODO
    email: EMAIL,
    address: {
      line: { en: "Meyo, Yaoundé IV (exact address to be confirmed)", fr: "Meyo, Yaoundé IV (adresse exacte à confirmer)" }, // CLIENT_TODO
      district: "Meyo, Yaoundé IV",
      locality: "Yaoundé",
    },
    hours: { en: "Check-in by arrangement · 7 days", fr: "Arrivée sur rendez-vous · 7j/7" },
  },
  designs: {
    key: "designs",
    name: "SAFA Designs",
    page: "designs",
    accentVar: "var(--color-designs)",
    tagline: {
      en: "Made-to-measure menswear, specialised sewing machines and a MINEFOP-approved training centre.",
      fr: "Tenues homme sur mesure, machines à coudre spécialisées et centre de formation agréé MINEFOP.",
    },
    short: { en: "Wear", fr: "S'habiller" },
    whatsapp: "237600000003", // CLIENT_TODO
    phone: "+237 6 00 00 00 03", // CLIENT_TODO
    email: EMAIL,
    address: {
      line: { en: "Carrefour MEEC, Yaoundé VI (exact address to be confirmed)", fr: "Carrefour MEEC, Yaoundé VI (adresse exacte à confirmer)" }, // CLIENT_TODO
      district: "Carrefour MEEC, Yaoundé VI",
      locality: "Yaoundé",
    },
    hours: { en: "Mon–Sat · 8:00–18:30", fr: "Lun–Sam · 8h00–18h30" }, // CLIENT_TODO: confirm
  },
};

export const DIVISION_LIST = [DIVISIONS.construction, DIVISIONS.apartments, DIVISIONS.designs];

/** MINEFOP approval for the SAFA Designs training centre (owner confirmed it exists). */
export const MINEFOP = {
  agrement: "CLIENT_TODO", // agrément number
  date: "CLIENT_TODO",
  /** Only set true once the client confirms students sit the DQP/CQP exams. */
  preparesDqpCqp: false,
};

/** Group-level contact (used on the home page and generic CTAs). */
export const GROUP_CONTACT = {
  whatsapp: DIVISIONS.construction.whatsapp, // CLIENT_TODO: a group number if they have one
  phone: DIVISIONS.construction.phone,
};

export function waLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function isTodo(v: string | undefined): boolean {
  return !v || v.includes(CLIENT_TODO);
}

export const WA_GREETING: Record<DivisionKey | "group", T> = {
  group: { en: "Hello SAFA & Co, I found you on your website and I'd like some information.", fr: "Bonjour SAFA & Co, je vous ai trouvés sur votre site et j'aimerais des informations." },
  construction: { en: "Hello SAFA Construction, I'd like a quote for machine hire.", fr: "Bonjour SAFA Construction, j'aimerais un devis pour une location de machine." },
  apartments: { en: "Hello SAFA Apartments, I'd like to check availability.", fr: "Bonjour SAFA Apartments, j'aimerais vérifier les disponibilités." },
  designs: { en: "Hello SAFA Designs, I'd like to book a fitting.", fr: "Bonjour SAFA Designs, j'aimerais prendre rendez-vous pour une prise de mesures." },
};

export function greeting(key: DivisionKey | "group", lang: Lang): string {
  return WA_GREETING[key][lang];
}
