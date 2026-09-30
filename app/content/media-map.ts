/**
 * Semantic image slots → media file base names (see scripts/media.ts).
 * Stock placeholders until the client's own shoot; swap names here only.
 * Stock people must never be presented as SAFA staff, tenants or students.
 * CLIENT_TODO: replace with SAFA's own photos (see docs/RESEARCH.md §5 shot list).
 */
/** True while IMG points at stock placeholders — shows an "illustrative photo" note. */
export const PLACEHOLDER_MEDIA = true; // CLIENT_TODO: set false once SAFA's own photos are in

export const IMG = {
  heroTexture: "construction-rendered-wall-texture-01",
  construction: "construction-mast-climbing-platform-01",
  constructionSite: "construction-site-yaounde-01",
  plasteringAction: "construction-plastering-wall-01",
  wallRaw: "construction-concrete-blocks-stacked-01",
  wallSmooth: "construction-rendered-wall-texture-01",
  trowel: "construction-trowel-01",
  scaffold: "construction-site-douala-scaffold-01",
  blocks: "construction-concrete-blocks-stacked-01",
  mixer: "construction-block-making-machine-01",
  golden: "construction-building-golden-hour-01",
  apartments: "apartments-living-room-01",
  bedroom: "apartments-bedroom-linen-01",
  kitchen: "apartments-kitchen-01",
  balcony: "apartments-living-room-view-01",
  aptDetail: "apartments-detail-coffee-01",
  designs: "designs-tailor-at-work-cameroon-01",
  tape: "designs-tape-measure-fitting-01",
  sewing: "designs-sewing-machine-closeup-01",
  fabric: "designs-fabric-bolts-01",
  menswear: "designs-mens-tailored-jacket-01",
  cutting: "designs-cutting-chalk-fabric-01",
  classroom: "designs-sewing-class-01",
  city: "group-yaounde-cityscape-01",
  concrete: "group-concrete-architecture-01",
} as const;
