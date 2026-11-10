import type { T } from "~/lib/i18n";
import type { DivisionKey } from "./site";
import { IMG_DEFAULT as IMG, VIDEO, VIDEO_DEFAULT, type VideoKey } from "./media-map";
import { O } from "./overrides";

/**
 * The gallery: SAFA's own photos and videos only (no stock). Each item names
 * its division so the page can filter, and division pages can show a strip.
 * Captions describe what is visible, nothing more: no model numbers, specs
 * or claims that the photo can't back up.
 */
export type GalleryItem = {
  id: string;
  division: DivisionKey;
  /** Media name from the image pipeline (the poster for videos). */
  image: string;
  /** A built-in video key or an uploaded clip name. */
  video?: VideoKey | (string & {});
  alt: T;
};

/** The built-in gallery (code defaults). The admin starts from this list. */
export const DEFAULT_GALLERY: GalleryItem[] = [
  // ── Apartments, Meyo ──
  { id: "building", division: "apartments", image: IMG.building, alt: { en: "The SAFA Apartments building in Meyo: three floors of arched balconies above a paved forecourt", fr: "L’immeuble SAFA Apartments à Meyo : trois niveaux de balcons en arcades au-dessus d’une cour pavée" } },
  { id: "lounge-light", division: "apartments", image: IMG.loungeLight, alt: { en: "Living room with grey corner sofas, a yellow cushion and a sculpted ceiling light", fr: "Salon avec canapés d’angle gris, coussin jaune et plafonnier sculpté" } },
  { id: "bedroom-teal", division: "apartments", image: IMG.bedroomTeal, alt: { en: "Bedroom with a padded headboard, white linen and teal cushions", fr: "Chambre avec tête de lit capitonnée, draps blancs et coussins bleu canard" } },
  { id: "kitchen-bar", division: "apartments", image: IMG.kitchenBar, alt: { en: "Open-plan kitchen bar in black marble looking onto the lounge", fr: "Cuisine ouverte avec bar en marbre noir, donnant sur le salon" } },
  { id: "living-dining", division: "apartments", image: IMG.livingDining, alt: { en: "Dining counter with high stools by the window, under a ring chandelier", fr: "Comptoir-repas et tabourets hauts près de la fenêtre, sous un lustre à anneaux" } },
  { id: "bedroom-rose", division: "apartments", image: IMG.bedroomRose, alt: { en: "Second bedroom with a rose wall, gold curtains and fresh linen", fr: "Deuxième chambre : mur rose, rideaux dorés et linge de lit frais" } },
  { id: "lounge-tv", division: "apartments", image: IMG.loungeTv, alt: { en: "Lounge with a wall-mounted TV unit and marble-effect floor", fr: "Salon avec meuble TV mural et sol effet marbre" } },
  { id: "lounge-sofas", division: "apartments", image: IMG.loungeSofas, alt: { en: "Lounge seen from the kitchen, sofas facing the TV wall", fr: "Le salon vu depuis la cuisine, canapés tournés vers le mur TV" } },

  // ── Construction ──
  { id: "rendering", division: "construction", image: IMG.posterRendering, video: "rendering", alt: { en: "Video: an automatic plastering machine applying render to a wall on site", fr: "Vidéo : une machine à crépir automatique applique l’enduit sur un mur, sur chantier" } },
  { id: "mast-blue", division: "construction", image: IMG.posterMastBlue, video: "mastBlue", alt: { en: "Video: a SAFA operator raising the mast of an automatic plastering machine", fr: "Vidéo : un opérateur SAFA déploie le mât d’une machine à crépir automatique" } },
  { id: "fleet-yard", division: "construction", image: IMG.fleetYard, alt: { en: "Two automatic plastering machines, green and blue, with a mortar pump in the yard", fr: "Deux machines à crépir automatiques, verte et bleue, avec une pompe à mortier au dépôt" } },
  { id: "green-mast", division: "construction", image: IMG.greenMast, alt: { en: "Green automatic plastering unit with its mast raised against a wall", fr: "Machine à crépir automatique verte, mât déployé contre un mur" } },
  { id: "spray-pumps", division: "construction", image: IMG.sprayPumps, alt: { en: "Two orange mortar spray pumps with hoppers and coiled hose", fr: "Deux pompes à mortier orange, avec leurs trémies et un flexible enroulé" } },
  { id: "mast-green", division: "construction", image: IMG.posterMastGreen, video: "mastGreen", alt: { en: "Video: the green plastering machine being operated from its control panel", fr: "Vidéo : la machine à crépir verte, commandée depuis son pupitre" } },
  { id: "blue-unit", division: "construction", image: IMG.blueUnit, alt: { en: "Blue automatic plastering unit beside an orange mortar pump", fr: "Machine à crépir automatique bleue, à côté d’une pompe à mortier orange" } },
  { id: "control-panel", division: "construction", image: IMG.controlPanel, alt: { en: "Close-up of the plastering machine's touch-screen control panel", fr: "Gros plan sur le pupitre à écran tactile de la machine à crépir" } },
  { id: "pumps-pair", division: "construction", image: IMG.pumpsPair, alt: { en: "Two mortar pumps side by side, hoppers open", fr: "Deux pompes à mortier côte à côte, trémies ouvertes" } },
  { id: "fleet", division: "construction", image: IMG.posterFleet, video: "fleet", alt: { en: "Video: the plastering machines lined up at the SAFA yard", fr: "Vidéo : les machines à crépir alignées au dépôt SAFA" } },
  { id: "green-unit", division: "construction", image: IMG.greenUnit, alt: { en: "Green plastering unit and an orange pump against a rendered wall", fr: "Machine à crépir verte et pompe orange devant un mur crépi" } },
  { id: "pump-controls", division: "construction", image: IMG.pumpControls, alt: { en: "Mortar pump with its electrical control box", fr: "Pompe à mortier avec son coffret électrique de commande" } },
  { id: "pumps-depot", division: "construction", image: IMG.pumpsDepot, alt: { en: "Two mortar pumps at the depot", fr: "Deux pompes à mortier au dépôt" } },

  // ── Designs, Carrefour MEEC ──
  { id: "atelier", division: "designs", image: IMG.posterAtelier, video: "atelier", alt: { en: "Video: a walk through the SAFA Designs showroom: shirts, trousers and tunics on the rails", fr: "Vidéo : visite de la salle d’exposition SAFA Designs — chemises, pantalons et tuniques sur les portants" } },
  { id: "maroon-jacket", division: "designs", image: IMG.maroonJacket, alt: { en: "Maroon four-pocket jacket with contrast stitching, on a mannequin", fr: "Veste bordeaux à quatre poches, surpiqûres contrastées, sur mannequin" } },
  { id: "print-shirt", division: "designs", image: IMG.printShirt, alt: { en: "Short-sleeved shirt with a red-and-white print panel, in the showroom", fr: "Chemise à manches courtes avec empiècement imprimé rouge et blanc, en salle d’exposition" } },
  { id: "navy-tunic", division: "designs", image: IMG.navyTunic, alt: { en: "Navy tunic with a gold stitched placket", fr: "Tunique bleu marine, patte de boutonnage surpiquée de fil doré" } },
  { id: "chambray-tunic", division: "designs", image: IMG.chambrayTunic, alt: { en: "Chambray-blue short-sleeved tunic with an asymmetric front", fr: "Tunique bleu chambray à manches courtes et devant asymétrique" } },
  { id: "white-tunic", division: "designs", image: IMG.whiteTunic, alt: { en: "White tunic with a striped pocket detail", fr: "Tunique blanche, détail de poche à rayures" } },
  { id: "striped-shirt", division: "designs", image: IMG.stripedShirt, alt: { en: "White shirt with blue-striped sleeves and pocket details", fr: "Chemise blanche, manches et poches à rayures bleues" } },
];

/** What the site shows: the admin's published list if there is one (hidden
 *  items removed), otherwise the built-in list. */
const listed: GalleryItem[] = O.gallery?.length ? O.gallery.filter((g) => !g.hidden) : DEFAULT_GALLERY;
/** A built-in video whose file or cover was replaced in admin → Photos & videos
 *  shows the new cover here too (unless this item has its own cover). */
export const GALLERY: GalleryItem[] = listed.map((g) => {
  const k = g.video as VideoKey | undefined;
  if (k && k in VIDEO && g.image === VIDEO_DEFAULT[k].poster) return { ...g, image: VIDEO[k].poster };
  return g;
});

export function galleryFor(division: DivisionKey): GalleryItem[] {
  return GALLERY.filter((g) => g.division === division);
}
