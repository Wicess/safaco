import { O, val, type ClipEntry } from "./overrides";
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

/** True when an image is a stock placeholder rather than SAFA's own photo
 *  (built-in `safa-*` photos and anything uploaded in the admin, `up-*`, are SAFA's). */
export function isStock(name: string | undefined): boolean {
  return Boolean(name) && !name!.startsWith("safa-") && !name!.startsWith("up-");
}

const BASE_IMG = {
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
  // Stills from SAFA's own atelier video (music sticker cropped off)
  atelierArch: "safa-designs-atelier-arch",
  atelierTunic: "safa-designs-atelier-tunic",

  // ── Video posters (stills from SAFA's own videos) ──
  posterAtelier: "safa-video-designs-atelier",
  posterMastBlue: "safa-video-mast-blue",
  posterMastGreen: "safa-video-mast-green",
  posterFleet: "safa-video-fleet",
  posterRendering: "safa-video-rendering",

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
  yaoundeModern: "group-yaounde-modern-01",
  dualMastLift: "construction-dual-mast-lift-01",
  scaffoldPlatform: "construction-scaffold-platform-01",
  mastSections: "construction-mast-sections-01",
  // Empty slot: fleet N° 06 (mobile lift base) until SAFA adds its own photo.
  liftBase: "",
} as const;

export type ImgKey = keyof typeof BASE_IMG;
/** The code's default photo for each slot (the admin shows it as "default"). */
export const IMG_DEFAULT: Record<ImgKey, string> = BASE_IMG;
const chosen = (O.images ?? {}) as Partial<Record<ImgKey, string>>;
/** Every photo slot, with the admin's published choice applied (admin → Photos). */
export const IMG = Object.fromEntries(
  (Object.keys(BASE_IMG) as ImgKey[]).map((k) => [k, val(chosen[k]) ?? BASE_IMG[k]]),
) as Record<ImgKey, string>;
/** Images placed by the admin in a slot: their alt text comes from the
 *  gallery caption rather than the slot's hard-coded description. */
export const IMG_OVERRIDDEN = new Set(
  (Object.keys(BASE_IMG) as ImgKey[]).filter((k) => val(chosen[k]) && val(chosen[k]) !== BASE_IMG[k]).map((k) => IMG[k]),
);


export type VideoInfo = { src: string; poster: string; w: number; h: number };

/** SAFA's own videos, served next to the images (public/media, or R2). Silent:
 *  the audio was stripped (site noise and a licensed music track). */
const BASE_VIDEO = {
  atelier: { src: "safa-designs-atelier.mp4", poster: BASE_IMG.posterAtelier, w: 540, h: 802 },
  mastBlue: { src: "safa-construction-mast-blue.mp4", poster: BASE_IMG.posterMastBlue, w: 540, h: 960 },
  mastGreen: { src: "safa-construction-mast-green.mp4", poster: BASE_IMG.posterMastGreen, w: 540, h: 960 },
  fleet: { src: "safa-construction-fleet.mp4", poster: BASE_IMG.posterFleet, w: 960, h: 540 },
  // Owner, 2026-11-10 (audio track removed, index moved to the front for a fast start).
  rendering: { src: "safa-construction-rendering.mp4", poster: BASE_IMG.posterRendering, w: 576, h: 1024 },
} as const;

export type VideoKey = keyof typeof BASE_VIDEO;
export const VIDEO_KEYS = Object.keys(BASE_VIDEO) as VideoKey[];
/** The cover-photo slot of each built-in video (admin can change it). */
export const VIDEO_POSTER_SLOT: Record<VideoKey, ImgKey> = { atelier: "posterAtelier", mastBlue: "posterMastBlue", mastGreen: "posterMastGreen", fleet: "posterFleet", rendering: "posterRendering" };
export const VIDEO_DEFAULT: Record<VideoKey, VideoInfo> = BASE_VIDEO;

/** Videos uploaded in the admin. `registerClip` lets the admin preview an
 *  upload before it is published. */
const CLIPS: Record<string, ClipEntry> = { ...(O.clips ?? {}) };
export function registerClip(name: string, clip: ClipEntry) {
  CLIPS[name] = clip;
}
export function clipEntry(name: string): ClipEntry | undefined {
  return CLIPS[name];
}

const chosenVideo = (O.videos ?? {}) as Partial<Record<VideoKey, string>>;
/** Each built-in video slot, with the admin's choices applied: an uploaded
 *  clip in place of the original, and a chosen cover photo. */
export const VIDEO: Record<VideoKey, VideoInfo> = Object.fromEntries(
  VIDEO_KEYS.map((k) => {
    const clip = CLIPS[val(chosenVideo[k]) ?? ""];
    const cover = val(chosen[VIDEO_POSTER_SLOT[k]]);
    const v: VideoInfo = clip ? { src: clip.src, poster: clip.poster, w: clip.w, h: clip.h } : { ...BASE_VIDEO[k] };
    if (cover) v.poster = cover;
    return [k, v];
  }),
) as Record<VideoKey, VideoInfo>;

/** A gallery item's `video`: a built-in key or an uploaded clip name. */
export function videoInfo(ref: string): VideoInfo | undefined {
  if (ref in VIDEO) return VIDEO[ref as VideoKey];
  const c = CLIPS[ref];
  return c && { src: c.src, poster: c.poster, w: c.w, h: c.h };
}
