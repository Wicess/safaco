import type { MetaDescriptor } from "react-router";
import { DIVISIONS, DIVISION_LIST, MINEFOP, SITE, isTodo, type DivisionKey } from "~/content/site";
import { LANGS, PAGES, type Lang, type PageKey, type T, langFromPath } from "./i18n";

export const OG_LOCALE: Record<Lang, string> = { en: "en_GB", fr: "fr_FR" };
/** hreflang values: language + Cameroon. */
export const HREFLANG: Record<Lang, string> = { en: "en-CM", fr: "fr-CM" };

type PageSeo = {
  key: PageKey;
  title: T;
  description: T;
  /** Absolute path under /public, e.g. /og/construction.jpg */
  image?: string;
  jsonLd?: (lang: Lang) => Record<string, unknown>[];
};

export function abs(path: string): string {
  return `${SITE.url}${path}`;
}

/** Build the full <head> for a bilingual page: title, description, canonical,
 *  hreflang (both languages + x-default), Open Graph, and JSON-LD. */
export function pageMeta(seo: PageSeo) {
  return ({ location }: { location: { pathname: string } }): MetaDescriptor[] => {
    const lang = langFromPath(location.pathname);
    const page = PAGES[seo.key];
    const self = page.path[lang];
    const title = seo.title[lang];
    const image = abs(seo.image ?? "/og/default.jpg");
    const tags: MetaDescriptor[] = [
      { title },
      { name: "description", content: seo.description[lang] },
      { tagName: "link", rel: "canonical", href: abs(self) },
      // The audience is Cameroon: both language versions are tagged for CM;
      // x-default (the language picker at /) serves everyone else.
      ...LANGS.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: HREFLANG[l], href: abs(page.path[l]) })),
      { tagName: "link", rel: "alternate", hrefLang: "x-default", href: abs(seo.key === "home" ? "/" : page.path.en) },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:title", content: title },
      { property: "og:description", content: seo.description[lang] },
      { property: "og:url", content: abs(self) },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: OG_LOCALE[lang] },
      { property: "og:locale:alternate", content: OG_LOCALE[lang === "en" ? "fr" : "en"] },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "CM-CE" },
      { name: "geo.placename", content: "Yaoundé" },
    ];
    if (page.noindex) tags.push({ name: "robots", content: "noindex, follow" });
    const graph = [...baseGraph(lang), ...(seo.jsonLd?.(lang) ?? [])];
    tags.push({ "script:ld+json": { "@context": "https://schema.org", "@graph": graph } });
    return tags;
  };
}

/* ───────────── Structured data (schema.org) ─────────────
   Only facts that are visible on the page. No prices (owner rule), no review
   stars (self-serving reviews are not eligible), no FAQ rich-result bait. */

const ORG_ID = () => `${SITE.url}/#organization`;
const divId = (k: DivisionKey) => `${SITE.url}/#${k}`;

function sameAs(): string[] {
  return Object.values(SITE.social).filter(Boolean);
}

function postalAddress(k: DivisionKey, lang: Lang) {
  const a = DIVISIONS[k].address;
  return {
    "@type": "PostalAddress",
    streetAddress: a.line[lang],
    addressLocality: a.locality,
    addressRegion: "Centre",
    addressCountry: SITE.countryCode,
  };
}

const DIVISION_TYPE: Record<DivisionKey, string | string[]> = {
  construction: "HomeAndConstructionBusiness",
  apartments: "LodgingBusiness",
  designs: ["ClothingStore", "EducationalOrganization"],
};

/* Places as unambiguous entities, so search engines and AI answers resolve
   "Yaoundé" to the capital of Cameroon (verified Wikidata IDs). */
const CAMEROON = { "@type": "Country", name: "Cameroon", alternateName: "Cameroun", sameAs: ["https://www.wikidata.org/wiki/Q1009", "https://en.wikipedia.org/wiki/Cameroon"] };
const YAOUNDE = {
  "@type": "City",
  name: "Yaoundé",
  sameAs: ["https://www.wikidata.org/wiki/Q3808", "https://en.wikipedia.org/wiki/Yaound%C3%A9"],
  containedInPlace: { "@type": "AdministrativeArea", name: "Centre Region", sameAs: "https://www.wikidata.org/wiki/Q739951", containedInPlace: CAMEROON },
};
const DOUALA = { "@type": "City", name: "Douala", sameAs: ["https://www.wikidata.org/wiki/Q132830", "https://en.wikipedia.org/wiki/Douala"], containedInPlace: CAMEROON };

/** Where each division really works (owner, 2026-11-06): everything is based
 *  in Yaoundé; apartments and machine hire are Yaoundé only; the atelier sews
 *  for clients across Cameroon (Douala included) and abroad. */
const AREA_SERVED: Record<DivisionKey, unknown> = {
  construction: YAOUNDE,
  apartments: YAOUNDE,
  designs: [YAOUNDE, DOUALA, CAMEROON],
};

function division(k: DivisionKey, lang: Lang): Record<string, unknown> {
  const d = DIVISIONS[k];
  const node: Record<string, unknown> = {
    "@type": DIVISION_TYPE[k],
    "@id": divId(k),
    name: d.name,
    description: d.tagline[lang],
    url: abs(PAGES[d.page].path[lang]),
    parentOrganization: { "@id": ORG_ID() },
    address: postalAddress(k, lang),
    areaServed: AREA_SERVED[k],
    location: YAOUNDE,
    knowsLanguage: ["fr", "en"],
  };
  if (!isTodo(d.phone)) node.telephone = d.phone;
  if (!isTodo(d.email)) node.email = d.email;
  if (d.address.geo) node.geo = { "@type": "GeoCoordinates", latitude: d.address.geo.lat, longitude: d.address.geo.lng };
  if (k === "designs" && !isTodo(MINEFOP.agrement)) {
    node.hasCredential = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Agrément MINEFOP",
      identifier: MINEFOP.agrement,
      recognizedBy: { "@type": "GovernmentOrganization", name: "Ministère de l'Emploi et de la Formation Professionnelle (MINEFOP)" },
    };
  }
  return node;
}

export function baseGraph(lang: Lang): Record<string, unknown>[] {
  const org: Record<string, unknown> = {
    "@type": "Organization",
    "@id": ORG_ID(),
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: abs("/brand/safa-monogram.png"),
    address: { "@type": "PostalAddress", addressLocality: "Yaoundé", addressRegion: "Centre", addressCountry: "CM" },
    location: YAOUNDE,
    areaServed: CAMEROON,
    knowsLanguage: ["fr", "en"],
    subOrganization: DIVISION_LIST.map((d) => ({ "@id": divId(d.key) })),
  };
  const same = sameAs();
  if (same.length) org.sameAs = same;
  return [
    org,
    { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, inLanguage: HREFLANG[lang], publisher: { "@id": ORG_ID() } },
    ...DIVISION_LIST.map((d) => division(d.key, lang)),
  ];
}

export function breadcrumb(lang: Lang, trail: { key: PageKey; name: T }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name[lang],
      item: abs(PAGES[c.key].path[lang]),
    })),
  };
}

/** A hire/sale service offered by a division. businessFunction: LeaseOut | Sell | ProvideService */
export function service(
  lang: Lang,
  opts: { key: PageKey; name: T; description: T; division: DivisionKey; fn: "LeaseOut" | "Sell" | "ProvideService" },
) {
  return {
    "@type": "Service",
    name: opts.name[lang],
    description: opts.description[lang],
    url: abs(PAGES[opts.key].path[lang]),
    provider: { "@id": divId(opts.division) },
    areaServed: AREA_SERVED[opts.division],
    offers: {
      "@type": "Offer",
      businessFunction: `http://purl.org/goodrelations/v1#${opts.fn}`,
      availability: "https://schema.org/InStock",
    },
  };
}

export function faqPage(lang: Lang, items: { q: T; a: T }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q[lang],
      acceptedAnswer: { "@type": "Answer", text: i.a[lang] },
    })),
  };
}
