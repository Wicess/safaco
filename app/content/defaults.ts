import type { T } from "~/lib/i18n";
import { DEFAULT_GALLERY } from "./gallery";
import { IMG_DEFAULT as IMG } from "./media-map";
import { O, val, type DivisionKeyO, type PageHeroKey } from "./overrides";
import type { Lang } from "~/lib/i18n";

/**
 * Default wording and photos for everything the admin can edit on the home
 * page and the page heroes. Pages render override ?? default; the admin shows
 * these defaults as placeholders.
 */
export const HOME_HERO = {
  eyebrow: { en: "SAFA & Co SARL · Yaoundé, Cameroon", fr: "SAFA & Co SARL · Yaoundé, Cameroun" },
  title: { en: "Everything starts with", fr: "Tout commence par" },
  emphasis: { en: "a line.", fr: "un trait." },
  lede: {
    en: "Plastering machines for hire, furnished apartments in Meyo, made-to-measure clothing for men and women: in Yaoundé, three trades served with the same standard of precision.",
    fr: "Machines à crépir en location, appartements meublés à Meyo, couture sur mesure homme et femme : à Yaoundé, trois métiers servis avec la même exigence de précision.",
  },
} satisfies Record<string, T>;

export const HOUSE_IMAGES: Record<DivisionKeyO, string> = {
  construction: IMG.greenMast,
  apartments: IMG.building,
  designs: IMG.maroonJacket,
};

/** Page heroes. `title` here is the plain-text version shown in the admin; the
 *  pages keep their typographic default (italic word) until it is overridden. */
export const PAGE_HEROES: Record<PageHeroKey, { label: string; title: T; lede: T; image?: string }> = {
  construction: {
    label: "Construction",
    title: { en: "Equipment that moves the site forward.", fr: "Le matériel qui fait avancer le chantier." },
    lede: {
      en: "Automatic plastering machines, mast lifts and scaffold platforms for hire in Yaoundé. We deliver, assemble and collect every unit with our own crew.",
      fr: "Machines à crépir automatiques, monte-charges et plateformes d’échafaudage en location à Yaoundé. Livraison, montage et reprise de chaque machine par nos propres équipes.",
    },
  },
  plastering: {
    label: "Plastering machine hire",
    title: { en: "Automatic plastering machine hire in Yaoundé.", fr: "Location de machine à crépir automatique à Yaoundé." },
    lede: {
      en: "SAFA Construction is among the first companies in Cameroon to hire out automatic plastering machines. The machine lays render in one steady pass: walls finished faster, a constant thickness, fewer hands needed.",
      fr: "SAFA Construction compte parmi les premières entreprises au Cameroun à louer des machines à crépir automatiques. La machine projette l’enduit en une passe régulière : des murs finis plus vite, une épaisseur constante, moins de main-d’œuvre.",
    },
    image: IMG.fleetYard,
  },
  apartments: {
    label: "Apartments",
    title: { en: "A home in Yaoundé, ready to live in.", fr: "Un chez-soi à Yaoundé, prêt à habiter." },
    lede: {
      en: "Furnished, fully equipped apartments in our guest residence in Meyo, Yaoundé IV, for a few nights or several months. Coming from Douala or from abroad? You arrive; everything is ready.",
      fr: "Des appartements meublés et entièrement équipés, dans notre résidence de Meyo, Yaoundé IV, pour quelques nuits ou plusieurs mois. Vous venez de Douala ou de l’étranger ? À votre arrivée, tout est prêt.",
    },
    image: IMG.building,
  },
  designs: {
    label: "Designs",
    title: { en: "Cut for you. Sewn to last.", fr: "Coupé pour vous. Cousu pour durer." },
    lede: {
      en: "Made-to-measure clothing for men and women, from suits and dresses to African wear, finished on our specialised machines at Carrefour MEEC, Yaoundé. By appointment, with delivery to Douala, across Cameroon and abroad.",
      fr: "Couture sur mesure pour hommes et femmes, du costume à la robe et à la tenue africaine, finie sur nos machines spécialisées au Carrefour MEEC, à Yaoundé. Sur rendez-vous, avec livraison à Douala, partout au Cameroun et à l’étranger.",
    },
  },
  gallery: {
    label: "Gallery",
    title: { en: "Our work, as it is.", fr: "Notre travail, tel qu’il est." },
    lede: {
      en: "No stock photos here: our own machines, apartments and garments, photographed in Yaoundé.",
      fr: "Aucune photo de banque d’images : nos machines, nos appartements et nos tenues, photographiés à Yaoundé.",
    },
  },
};

/** Resolved hero for a page: `title` is set only when the admin overrode it
 *  (otherwise the page renders its own styled default). */
export function pageHero(key: PageHeroKey, lang: Lang) {
  const o = O.pages?.[key];
  const d = PAGE_HEROES[key];
  const image = val(o?.image) ?? d.image;
  return {
    title: val(o?.title?.[lang]),
    lede: val(o?.lede?.[lang]) ?? d.lede[lang],
    image,
    /** Set when the admin chose a different photo: its gallery caption. */
    imageAlt: image && image !== d.image ? altFor(image, lang) : undefined,
  };
}

export function houseImage(key: DivisionKeyO): string {
  return val(O.home?.houseImages?.[key]) ?? HOUSE_IMAGES[key];
}

/** Caption of a photo from the (admin) gallery, for alt text. */
export function altFor(image: string, lang: Lang): string {
  const item = (O.gallery ?? DEFAULT_GALLERY).find((g) => g.image === image);
  return item?.alt[lang].replace(/^(Video|Vidéo)\s?:\s?/, "") ?? "";
}
