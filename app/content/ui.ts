import type { T } from "~/lib/i18n";

/** Interface strings shared across pages. */
export const UI = {
  skip: { en: "Skip to content", fr: "Aller au contenu" },
  menu: { en: "Menu", fr: "Menu" },
  close: { en: "Close", fr: "Fermer" },
  home: { en: "Home", fr: "Accueil" },
  divisions: { en: "Our divisions", fr: "Nos divisions" },
  about: { en: "About", fr: "À propos" },
  faq: { en: "Questions", fr: "Questions" },
  contact: { en: "Contact", fr: "Contact" },
  whatsapp: { en: "WhatsApp", fr: "WhatsApp" },
  call: { en: "Call", fr: "Appeler" },
  quote: { en: "Enquire", fr: "Demande" },
  getQuote: { en: "Request a quote", fr: "Demander un devis" },
  writeWhatsapp: { en: "Message us on WhatsApp", fr: "Écrire sur WhatsApp" },
  callUs: { en: "Call us", fr: "Nous appeler" },
  onRequest: { en: "Rates on request", fr: "Tarifs sur demande" },
  discover: { en: "Discover", fr: "Découvrir" },
  learnMore: { en: "Learn more", fr: "En savoir plus" },
  switchTo: { en: "Français", fr: "English" },
  switchToShort: { en: "FR", fr: "EN" },
  switchLabel: { en: "Voir le site en français", fr: "View the site in English" },
  langBanner: {
    en: "Voir cette page en français ?",
    fr: "View this page in English?",
  },
  langBannerYes: { en: "Oui, en français", fr: "Yes, in English" },
  langBannerNo: { en: "Stay in English", fr: "Rester en français" },
  address: { en: "Address", fr: "Adresse" },
  hours: { en: "Hours", fr: "Horaires" },
  directions: { en: "Directions", fr: "Itinéraire" },
  rights: { en: "All rights reserved.", fr: "Tous droits réservés." },
  legal: { en: "Legal notice", fr: "Mentions légales" },
  developedBy: { en: "Developed by", fr: "Developed by" },
  group: { en: "The group", fr: "Le groupe" },
  followUs: { en: "Follow", fr: "Suivre" },
  breadcrumbHome: { en: "Home", fr: "Accueil" },
} satisfies Record<string, T>;

export const NAV = {
  construction: {
    label: { en: "Construction", fr: "Construction" },
    children: [
      { page: "plastering", label: { en: "Plastering machine hire", fr: "Location machine à crépir" } },
      { page: "scaffold", label: { en: "Scaffolds & mast lifts", fr: "Échafaudages & monte-charges" } },
      { page: "fabrication", label: { en: "Materials fabrication", fr: "Fabrication de matériaux" } },
    ],
  },
  apartments: { label: { en: "Apartments", fr: "Appartements" } },
  designs: {
    label: { en: "Designs", fr: "Designs" },
    children: [{ page: "training", label: { en: "Training centre", fr: "Centre de formation" } }],
  },
} as const;
