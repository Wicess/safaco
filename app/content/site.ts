import type { Lang, PageKey, T } from "~/lib/i18n";
import { O, pickT, val } from "./overrides";

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

/**
 * The live site is served on www: it is the Vercel primary domain (the bare
 * domain 308-redirects to it) and the Google Search Console property. Canonical
 * URLs, hreflang, the sitemap and structured data must all use that exact
 * origin, so an older bare-domain setting is upgraded here.
 */
function canonicalOrigin(u: string): string {
  return u.replace(/\/$/, "").replace(/^https?:\/\/safaandcosarl\.com$/, "https://www.safaandcosarl.com");
}

/** Public contact address (owner, 2026-09-30). Mail is sent over SMTP from this mailbox. */
const EMAIL = val(O.company?.email) ?? env("VITE_CONTACT_EMAIL") ?? "sales@safaandcosarl.com";

export const SITE = {
  name: "SAFA & Co",
  legalName: "SAFA & Co SARL",
  // Canonical origin for SEO (canonical, hreflang, sitemap). Set VITE_SITE_URL per environment.
  url: canonicalOrigin(env("VITE_SITE_URL") ?? "https://www.safaandcosarl.com"),
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
  /** Optional second line, shown under the main number. */
  phone2?: string;
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
      fr: "Location de machines à crépir automatiques, de monte-charges et de plateformes d’échafaudage.",
    },
    short: { en: "Build", fr: "Bâtir" },
    whatsapp: "237600000001", // CLIENT_TODO
    phone: "+237 6 00 00 00 01", // CLIENT_TODO
    email: EMAIL,
    address: {
      line: { en: "Yaoundé, Cameroon", fr: "Yaoundé, Cameroun" }, // CLIENT_TODO: exact yard address
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
      fr: "Appartements meublés avec services, pour courts et longs séjours à Yaoundé.",
    },
    short: { en: "Stay", fr: "Séjourner" },
    // Owner, 2026-11-10: "688654756 / 674134833 · Meyo, Yaoundé".
    // The first number is assumed to be the WhatsApp line (change in admin).
    whatsapp: "237688654756",
    phone: "+237 6 88 65 47 56",
    phone2: "+237 6 74 13 48 33",
    email: EMAIL,
    address: {
      line: { en: "Meyo, Yaoundé", fr: "Meyo, Yaoundé" },
      district: "Meyo, Yaoundé",
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
      en: "Made-to-measure clothing for men and women, specialised sewing machines and a MINEFOP-approved training centre.",
      fr: "Couture sur mesure homme et femme, machines à coudre spécialisées et centre de formation agréé par le MINEFOP.",
    },
    short: { en: "Wear", fr: "S’habiller" },
    // Owner, 2026-11-10: "670986643 / 695356742 · Carrefour MEEC, Yaoundé".
    // The first number is assumed to be the WhatsApp line (change in admin).
    whatsapp: "237670986643",
    phone: "+237 6 70 98 66 43",
    phone2: "+237 6 95 35 67 42",
    email: EMAIL,
    address: {
      line: { en: "Carrefour MEEC, Yaoundé", fr: "Carrefour MEEC, Yaoundé" },
      district: "Carrefour MEEC, Yaoundé",
      locality: "Yaoundé",
    },
    hours: { en: "Mon–Sat · 8:00–18:30", fr: "Lun–Sam · 8h00–18h30" }, // CLIENT_TODO: confirm
  },
};

/* ── Admin overrides (published from /admin, see overrides.ts) ──
   Applied once at module load, so every page, the footer, the action bar and
   the structured data all show the same published details. */
{
  const c = O.company;
  if (c) {
    SITE.rccm = val(c.rccm) ?? SITE.rccm;
    SITE.niu = val(c.niu) ?? SITE.niu;
    for (const k of ["facebook", "instagram", "tiktok", "linkedin"] as const) SITE.social[k] = val(c.social?.[k]) ?? SITE.social[k];
  }
  for (const d of Object.values(DIVISIONS)) {
    const o = O.divisions?.[d.key];
    if (!o) continue;
    d.phone = val(o.phone) ?? d.phone;
    // Empty keeps the default; "-" removes the second line.
    if (val(o.phone2)) d.phone2 = val(o.phone2) === "-" ? undefined : val(o.phone2);
    d.whatsapp = val(o.whatsapp)?.replace(/\D/g, "") ?? d.whatsapp;
    d.email = val(o.email) ?? d.email;
    d.address.line = pickT(o.addressLine, d.address.line as { en: string; fr: string });
    d.address.district = val(o.district) ?? d.address.district;
    d.address.mapsUrl = val(o.mapsUrl) ?? d.address.mapsUrl;
    d.hours = pickT(o.hours, d.hours as { en: string; fr: string });
    d.tagline = pickT(o.tagline, d.tagline as { en: string; fr: string });
  }
}

/* ── Placeholder numbers never reach a visitor ──
   Until the owner enters a real number (admin → Contact & details), a
   placeholder is blanked here, and every Call / WhatsApp button for that
   division gives way to the enquiry form (stored in Neon, read in /admin). */
export function isPlaceholderNumber(v: string | undefined): boolean {
  const digits = (v ?? "").replace(/\D/g, "");
  return digits.length < 8 || /^2376000000\d+$/.test(digits) || (v ?? "").includes(CLIENT_TODO);
}
for (const d of Object.values(DIVISIONS)) {
  if (isPlaceholderNumber(d.phone)) d.phone = "";
  if (d.phone2 && isPlaceholderNumber(d.phone2)) d.phone2 = undefined;
  if (isPlaceholderNumber(d.whatsapp)) d.whatsapp = "";
}

/** Floating contact button: the numbers set in admin → Contact & details →
 *  Company, else the first division with a real number (never a placeholder). */
export const CONTACT_FAB = (() => {
  const phone = val(O.company?.contactPhone);
  const wa = val(O.company?.contactWhatsapp)?.replace(/\D/g, "");
  const real = [DIVISIONS.designs, DIVISIONS.apartments, DIVISIONS.construction];
  return {
    phone: phone && !isPlaceholderNumber(phone) ? phone : (real.find((d) => d.phone)?.phone ?? ""),
    whatsapp: wa && !isPlaceholderNumber(wa) ? wa : (real.find((d) => d.whatsapp)?.whatsapp ?? ""),
    email: EMAIL,
  };
})();

export const DIVISION_LIST = [DIVISIONS.construction, DIVISIONS.apartments, DIVISIONS.designs];

/** MINEFOP approval for the SAFA Designs training centre (owner confirmed it exists). */
export const MINEFOP = {
  agrement: "CLIENT_TODO", // agrément number
  date: "CLIENT_TODO",
  /** Only set true once the client confirms students sit the DQP/CQP exams. */
  preparesDqpCqp: false,
};
MINEFOP.agrement = val(O.company?.minefop) ?? MINEFOP.agrement;

/** Group-level contact (used on the home page and generic CTAs). */
export const GROUP_CONTACT = {
  // Empty while Construction's number is still a placeholder: group CTAs then
  // lead to the enquiry form rather than a number nobody answers.
  whatsapp: DIVISIONS.construction.whatsapp, // CLIENT_TODO: a group number if they have one
  phone: DIVISIONS.construction.phone,
};

/** Enquiry-form link, optionally for a division and with a pre-written message. */
export function enquiryHref(contactPath: string, division?: DivisionKey, message?: string): string {
  const q = new URLSearchParams();
  if (division) q.set("d", division);
  if (message) q.set("m", message.slice(0, 600));
  const qs = q.toString();
  return qs ? `${contactPath}?${qs}` : contactPath;
}

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
  group: { en: "Hello SAFA & Co, I found you on your website and I'd like some information.", fr: "Bonjour SAFA & Co, j’ai découvert votre site et je souhaiterais quelques renseignements." },
  construction: { en: "Hello SAFA Construction, I'd like a quote for machine hire.", fr: "Bonjour SAFA Construction, je souhaiterais un devis pour la location d’une machine." },
  apartments: { en: "Hello SAFA Apartments, I'd like to check availability.", fr: "Bonjour SAFA Apartments, je souhaiterais connaître vos disponibilités." },
  designs: { en: "Hello SAFA Designs, I'd like to book a fitting.", fr: "Bonjour SAFA Designs, je souhaiterais prendre rendez-vous pour une prise de mesures." },
};

export function greeting(key: DivisionKey | "group", lang: Lang): string {
  return WA_GREETING[key][lang];
}
