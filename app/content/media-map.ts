/**
 * Semantic image slots → media file base names (see scripts/media.ts).
 *
 * Files named `safa-*` are SAFA's OWN photos and video stills (client handover,
 * 2026-10-30): the real machines, the Meyo apartments and the atelier's
 * garments. Everything else is a stock placeholder (credited in
 * media-src/CREDITS.md) and is captioned "Illustrative photo" wherever it is
 * the main image. Stock people must never be presented as SAFA staff,
 * tenants or students.
 *
 * CLIENT_TODO: still stock: scaffold/mast-lift units, materials fabrication,
 * the training classroom and the Yaoundé cityscape on About.
 */

/** True when an image is a stock placeholder rather than SAFA's own photo. */
export function isStock(name: string | undefined): boolean {
  return Boolean(name) && !name!.startsWith("safa-");
}

export const IMG = {
  // ── SAFA Construction (own photos) ──
  fleetYard: "safa-construction-fleet-yard",
  greenUnit: "safa-construction-green-unit",
  greenMast: "safa-construction-green-mast",
  blueUnit: "safa-construction-blue-unit",
  controlPanel: "safa-construction-control-panel",
  sprayPumps: "safa-construction-spray-pumps",
  pumpsPair: "safa-construction-pumps-pair",
  pumpControls: "safa-construction-pump-controls",
  pumpsDepot: "safa-construction-pumps-depot",

  // ── SAFA Apartments (own photos, Meyo) ──
  building: "safa-apartments-building",
  loungeLight: "safa-apartments-lounge-light",
  loungeSofas: "safa-apartments-lounge-sofas",
  loungeTv: "safa-apartments-lounge-tv",
  livingDining: "safa-apartments-living-dining",
  kitchenBar: "safa-apartments-kitchen-bar",
  bedroomTeal: "safa-apartments-bedroom-teal",
  bedroomRose: "safa-apartments-bedroom-rose",

  // ── SAFA Designs (own photos, Carrefour MEEC) ──
  maroonJacket: "safa-designs-maroon-jacket",
  printShirt: "safa-designs-print-panel-shirt",
  chambrayTunic: "safa-designs-chambray-tunic",
  navyTunic: "safa-designs-navy-tunic",
  whiteTunic: "safa-designs-white-tunic",
  stripedShirt: "safa-designs-striped-shirt",

  // ── Video posters (stills from SAFA's own videos) ──
  posterAtelier: "safa-video-designs-atelier",
  posterMastBlue: "safa-video-mast-blue",
  posterMastGreen: "safa-video-mast-green",
  posterFleet: "safa-video-fleet",

  // ── Stock placeholders (see CREDITS.md) ──
  wallRaw: "construction-concrete-blocks-stacked-01",
  wallSmooth: "construction-rendered-wall-texture-01",
  scaffold: "construction-site-douala-scaffold-01",
  mastPlatform: "construction-mast-climbing-platform-01",
  blocks: "construction-concrete-blocks-stacked-01",
  mixer: "construction-block-making-machine-01",
  golden: "construction-building-golden-hour-01",
  sewing: "designs-sewing-machine-closeup-01",
  cutting: "designs-cutting-chalk-fabric-01",
  classroom: "designs-sewing-class-01",
  city: "group-yaounde-cityscape-01",
} as const;

/** SAFA's own videos, served next to the images (public/media, or R2). Silent:
 *  the audio was stripped (site noise and a licensed music track). */
export const VIDEO = {
  atelier: { src: "safa-designs-atelier.mp4", poster: IMG.posterAtelier, w: 540, h: 802 },
  mastBlue: { src: "safa-construction-mast-blue.mp4", poster: IMG.posterMastBlue, w: 540, h: 960 },
  mastGreen: { src: "safa-construction-mast-green.mp4", poster: IMG.posterMastGreen, w: 540, h: 960 },
  fleet: { src: "safa-construction-fleet.mp4", poster: IMG.posterFleet, w: 960, h: 540 },
} as const;

export type VideoKey = keyof typeof VIDEO;
