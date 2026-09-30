import { z } from "zod";

/** Shared by the contact form (client) and /api/contact (server). */
export const DIVISION_VALUES = ["GROUP", "CONSTRUCTION", "APARTMENTS", "DESIGNS"] as const;

const clean = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s.replace(/<[^>]*>/g, "").replace(/\s+\n/g, "\n"));

export const ContactSchema = z.object({
  division: z.enum(DIVISION_VALUES).default("GROUP"),
  topic: clean(40).optional(),
  name: clean(80).pipe(z.string().min(2)),
  // Cameroon numbers: +237 6XX XX XX XX — accept any reasonable international number.
  phone: z
    .string()
    .trim()
    .max(24)
    .regex(/^\+?[\d\s().-]{8,24}$/),
  email: z.union([z.literal(""), z.string().trim().max(120).email()]).optional(),
  message: clean(2000).pipe(z.string().min(5)),
  lang: z.enum(["en", "fr"]).default("en"),
  page: z.string().max(160).optional(),
  // Anti-spam
  website: z.string().max(500).optional(), // honeypot: must stay empty (checked in the handler)
  ts: z.coerce.number().optional(), // render time, for a minimum fill time
  "cf-turnstile-response": z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export const FIELD_ERRORS = {
  name: { en: "Please enter your name.", fr: "Veuillez indiquer votre nom." },
  phone: { en: "Please enter a phone number we can reach you on (e.g. +237 6XX XX XX XX).", fr: "Veuillez indiquer un numéro joignable (ex. +237 6XX XX XX XX)." },
  email: { en: "This email address doesn't look right.", fr: "Cette adresse e-mail semble incorrecte." },
  message: { en: "Please tell us a little about your request.", fr: "Dites-nous en quelques mots ce dont vous avez besoin." },
} as const;
