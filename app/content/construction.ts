import type { PageKey, T } from "~/lib/i18n";
import { IMG } from "./media-map";

/**
 * SAFA Construction fleet — names taken from the client's own flyer
 * ("Equipment on hire": dual-mast site lift, scaffold platform, auto plastering
 * unit, render spray machine, delivery-ready masts, mobile lift base).
 * CLIENT_TODO: confirm models, max heights and capacities before publishing specs.
 */
export type Unit = { code: string; name: T; body: T; img: string; page: PageKey };

export const FLEET: Unit[] = [
  {
    code: "01",
    name: { en: "Automatic plastering unit", fr: "Machine à crépir automatique" },
    body: {
      en: "Mast-mounted rendering machine that lays plaster in one even vertical pass.",
      fr: "Machine montée sur mât qui applique l'enduit en une passe verticale régulière.",
    },
    img: IMG.plasteringAction,
    page: "plastering",
  },
  {
    code: "02",
    name: { en: "Render spray machine", fr: "Machine à projeter l'enduit" },
    body: {
      en: "Pumps and sprays mortar through a hose for walls and ceilings.",
      fr: "Pompe et projette le mortier par flexible, pour murs et plafonds.",
    },
    img: IMG.trowel,
    page: "plastering",
  },
  {
    code: "03",
    name: { en: "Dual-mast site lift", fr: "Monte-charge bi-mât" },
    body: {
      en: "Twin-mast platform that carries crew and materials up the façade.",
      fr: "Plateforme sur deux mâts qui monte équipe et matériaux le long de la façade.",
    },
    img: IMG.construction,
    page: "scaffold",
  },
  {
    code: "04",
    name: { en: "Scaffold platform", fr: "Plateforme d'échafaudage" },
    body: {
      en: "A stable, railed working deck for façade and finishing work at height.",
      fr: "Un plancher de travail stable, avec garde-corps, pour les façades et finitions en hauteur.",
    },
    img: IMG.scaffold,
    page: "scaffold",
  },
  {
    code: "05",
    name: { en: "Mast sections", fr: "Éléments de mât" },
    body: {
      en: "Delivery-ready mast sections, assembled on site to the height you need.",
      fr: "Éléments de mât prêts à livrer, assemblés sur place à la hauteur voulue.",
    },
    img: IMG.golden,
    page: "scaffold",
  },
  {
    code: "06",
    name: { en: "Mobile lift base", fr: "Base mobile de levage" },
    body: {
      en: "A movable base so the lift follows the work around the building.",
      fr: "Une base mobile pour que le levage suive le chantier autour du bâtiment.",
    },
    img: IMG.constructionSite,
    page: "scaffold",
  },
];

/**
 * Indicative output figures for the manual-vs-machine calculator.
 * CLIENT_TODO: replace with SAFA's OWN measured figures for their machine.
 * Manufacturer literature quotes far higher machine output (~80 m²/h); we keep
 * these conservative and label them "indicative" on the page.
 */
export const PLASTER_RATES = {
  /** m² rendered per day by one machine with its crew */
  machinePerDay: 250,
  machineCrew: 3,
  /** m² rendered per day by one skilled mason, by hand */
  manualPerMasonDay: 20,
  manualCrew: 4,
};

export const HIRE_STEPS: { title: T; body: T }[] = [
  {
    title: { en: "Tell us about the site", fr: "Parlez-nous du chantier" },
    body: {
      en: "Surface, height, location and dates — on WhatsApp, by phone or through the form.",
      fr: "Surface, hauteur, localisation et dates — sur WhatsApp, par téléphone ou via le formulaire.",
    },
  },
  {
    title: { en: "Site visit & quote", fr: "Visite & devis" },
    body: {
      en: "We check access and ground, recommend the right unit and send a clear quote.",
      fr: "Nous vérifions l'accès et le sol, recommandons la bonne machine et envoyons un devis clair.",
    },
  },
  {
    title: { en: "Delivery & set-up", fr: "Livraison & montage" },
    body: {
      en: "Our own crew delivers, assembles and checks the machine on your site.",
      fr: "Notre équipe livre, monte et vérifie la machine sur votre chantier.",
    },
  },
  {
    title: { en: "Work, then pickup", fr: "Travaux, puis reprise" },
    body: {
      en: "Hire runs to your schedule. When the job is done, we dismantle and collect.",
      fr: "La location suit votre calendrier. Une fois le travail fini, nous démontons et reprenons.",
    },
  },
];
