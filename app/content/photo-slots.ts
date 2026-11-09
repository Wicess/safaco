import type { ImgKey } from "./media-map";

/**
 * Every photo on the site that is not already editable elsewhere (page
 * headers, home houses and the gallery have their own screens). Shown in
 * admin → Photos, grouped by page. `where` lists every place the slot appears.
 */
export const PHOTO_SLOTS: { group: string; items: { key: ImgKey; label: string; where: string }[] }[] = [
  {
    group: "Home page",
    items: [
      { key: "controlPanel", label: "Construction detail photo", where: "Home (small photo beside the machine) · Plastering page" },
      { key: "bedroomTeal", label: "Apartments detail photo", where: "Home (small photo beside the building)" },
      { key: "printShirt", label: "Designs detail photo", where: "Home (small photo beside the jacket)" },
    ],
  },
  {
    group: "Construction & fleet",
    items: [
      { key: "greenMast", label: "N° 01 · Automatic plastering unit", where: "Fleet cards · Construction page (plastering card)" },
      { key: "sprayPumps", label: "N° 02 · Render spray machine", where: "Fleet cards" },
      { key: "dualMastLift", label: "N° 03 · Dual-mast site lift", where: "Fleet cards" },
      { key: "scaffoldPlatform", label: "N° 04 · Scaffold platform", where: "Fleet cards" },
      { key: "mastSections", label: "N° 05 · Mast sections", where: "Fleet cards" },
      { key: "liftBase", label: "N° 06 · Mobile lift base", where: "Fleet cards (shows a numbered panel until a photo is set)" },
      { key: "mastPlatform", label: "Mast lifts & scaffold card", where: "Construction page (second service card)" },
      { key: "blocks", label: "Materials fabrication", where: "Construction page (third service card) · Fabrication page" },
    ],
  },
  {
    group: "Plastering, scaffold & fabrication pages",
    items: [
      { key: "wallRaw", label: "Before: raw blockwork wall", where: "Plastering page (before/after)" },
      { key: "wallSmooth", label: "After: rendered wall", where: "Plastering page (before/after)" },
      { key: "scaffold", label: "Scaffold page header", where: "Scaffold & mast-lift page (top)" },
      { key: "golden", label: "Scaffold page photo", where: "Scaffold & mast-lift page (beside “The idea”)" },
      { key: "mixer", label: "Fabrication page photo", where: "Fabrication page" },
    ],
  },
  {
    group: "Apartments page",
    items: [
      { key: "livingDining", label: "The spaces · dining & lounge", where: "Apartments page" },
      { key: "bedroomRose", label: "The spaces · bedroom", where: "Apartments page" },
    ],
  },
  {
    group: "Designs & training",
    items: [
      { key: "sewing", label: "Specialised machines photo", where: "Designs page" },
      { key: "atelierArch", label: "Training section photo", where: "Designs page (Learn tailoring)" },
      { key: "atelierTunic", label: "Training page header", where: "Training page (top)" },
      { key: "cutting", label: "Training page photo", where: "Training page (in the atelier)" },
    ],
  },
  {
    group: "About page",
    items: [{ key: "yaoundeModern", label: "About page header", where: "About page (top)" }],
  },
];
