import type { T } from "~/lib/i18n";
import { O } from "./overrides";

/**
 * Apartment amenities, grouped. Owner-confirmed on 2026-11-10 ("totally
 * equipped, even with a heater", plus the building's generator, borehole,
 * guard and parking, and the services listed below), so every item is on by
 * default. The owner can untick any of them in the admin (Page headers →
 * Apartments); a published list there replaces this default entirely.
 */
export type AmenityKey =
  | "ac" | "hotWater" | "wifi" | "tv" | "furnished" | "balcony"
  | "kitchen" | "microwave" | "utensils" | "washer" | "iron"
  | "generator" | "borehole"
  | "security" | "parking" | "linen" | "housekeeping" | "checkin";

export type AmenityGroup = "comfort" | "kitchen" | "utilities" | "services";

export const AMENITY_GROUPS: { key: AmenityGroup; label: T }[] = [
  { key: "comfort", label: { en: "Comfort", fr: "Confort" } },
  { key: "kitchen", label: { en: "Kitchen & laundry", fr: "Cuisine et linge" } },
  { key: "utilities", label: { en: "Water & power", fr: "Eau et électricité" } },
  { key: "services", label: { en: "Security & services", fr: "Sécurité et services" } },
];

export const AMENITY_LIST: { key: AmenityKey; group: AmenityGroup; label: T }[] = [
  { key: "ac", group: "comfort", label: { en: "Air conditioning", fr: "Climatisation" } },
  { key: "hotWater", group: "comfort", label: { en: "Hot water (water heater)", fr: "Eau chaude (chauffe-eau)" } },
  { key: "wifi", group: "comfort", label: { en: "Wi-Fi internet", fr: "Internet Wi-Fi" } },
  { key: "tv", group: "comfort", label: { en: "Television", fr: "Télévision" } },
  { key: "furnished", group: "comfort", label: { en: "Fully furnished", fr: "Entièrement meublé" } },
  { key: "balcony", group: "comfort", label: { en: "Balcony", fr: "Balcon" } },

  { key: "kitchen", group: "kitchen", label: { en: "Equipped kitchen", fr: "Cuisine équipée" } },
  { key: "microwave", group: "kitchen", label: { en: "Microwave", fr: "Micro-ondes" } },
  { key: "utensils", group: "kitchen", label: { en: "Cookware & tableware", fr: "Ustensiles de cuisine et vaisselle" } },
  { key: "washer", group: "kitchen", label: { en: "Washing machine", fr: "Machine à laver" } },
  { key: "iron", group: "kitchen", label: { en: "Iron & ironing board", fr: "Fer et table à repasser" } },

  { key: "generator", group: "utilities", label: { en: "Standby generator", fr: "Groupe électrogène de secours" } },
  { key: "borehole", group: "utilities", label: { en: "Borehole water", fr: "Eau de forage" } },

  { key: "security", group: "services", label: { en: "Security guard", fr: "Gardiennage" } },
  { key: "parking", group: "services", label: { en: "Secure parking", fr: "Parking sécurisé" } },
  { key: "linen", group: "services", label: { en: "Bed linen & towels", fr: "Linge de lit et serviettes" } },
  { key: "housekeeping", group: "services", label: { en: "Housekeeping", fr: "Ménage" } },
  { key: "checkin", group: "services", label: { en: "Flexible arrival time", fr: "Heure d’arrivée souple" } },
];

export const DEFAULT_AMENITIES: AmenityKey[] = AMENITY_LIST.map((a) => a.key);

/** The amenities to publish, in list order. */
export function amenities() {
  const chosen = new Set<string>(O.apartments?.amenities ?? DEFAULT_AMENITIES);
  return AMENITY_LIST.filter((a) => chosen.has(a.key));
}

/** Published amenities grouped for display; empty groups are dropped. */
export function amenityGroups() {
  const list = amenities();
  return AMENITY_GROUPS.map((g) => ({ ...g, items: list.filter((a) => a.group === g.key) })).filter((g) => g.items.length);
}
