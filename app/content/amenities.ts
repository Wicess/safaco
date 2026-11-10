import type { T } from "~/lib/i18n";
import { O } from "./overrides";

/**
 * Apartment amenities. Only what can be backed up is published: by default the
 * ones visible in SAFA's own apartment photos (`seen`). The owner ticks the rest
 * in the admin (Page headers → Apartments) once confirmed; that list, when
 * published, replaces the default entirely.
 */
export type AmenityKey =
  | "generator" | "borehole" | "wifi" | "ac" | "hotWater"
  | "kitchen" | "tv" | "parking" | "security" | "checkin";

export const AMENITY_LIST: { key: AmenityKey; label: T; seen?: boolean }[] = [
  { key: "ac", label: { en: "Air conditioning", fr: "Climatisation" }, seen: true }, // split units in lounge + kitchen photos
  { key: "kitchen", label: { en: "Equipped kitchen", fr: "Cuisine équipée" }, seen: true }, // kitchen-bar, living-dining
  { key: "tv", label: { en: "TV", fr: "Télévision" }, seen: true }, // lounge-tv
  { key: "generator", label: { en: "Backup generator", fr: "Groupe électrogène" } },
  { key: "borehole", label: { en: "Borehole water", fr: "Eau de forage" } },
  { key: "wifi", label: { en: "Wi-Fi", fr: "Wi-Fi" } },
  { key: "hotWater", label: { en: "Hot water", fr: "Eau chaude" } },
  { key: "parking", label: { en: "Secure parking", fr: "Parking sécurisé" } },
  { key: "security", label: { en: "Security guard", fr: "Gardiennage" } },
  { key: "checkin", label: { en: "Flexible check-in", fr: "Heure d’arrivée souple" } },
];

export const DEFAULT_AMENITIES: AmenityKey[] = AMENITY_LIST.filter((a) => a.seen).map((a) => a.key);

/** The amenities to publish, in list order. */
export function amenities() {
  const chosen = new Set<string>(O.apartments?.amenities ?? DEFAULT_AMENITIES);
  return AMENITY_LIST.filter((a) => chosen.has(a.key));
}
