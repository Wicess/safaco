import express, { type NextFunction, type Request, type Response } from "express";
import { ContactSchema } from "../app/lib/contact-schema";
import { db } from "./lib/db";
import { sendLeadEmails } from "./lib/mail";
import { verifyTurnstile } from "./lib/turnstile";

const PAGES = {
  en: { thanks: "/en/contact/thank-you", contact: "/en/contact" },
  fr: { thanks: "/fr/contact/merci", contact: "/fr/contact" },
} as const;

const MIN_FILL_MS = 3000;

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/contact", async (req: Request, res: Response) => {
  const wantsJson = req.is("application/json") || (req.get("accept") ?? "").includes("application/json");
  const lang = req.body?.lang === "fr" ? "fr" : "en";
  const done = (ok: boolean, status = ok ? 200 : 400) => {
    if (wantsJson) return res.status(status).json({ ok });
    // No-JS form post → Post/Redirect/Get
    return res.redirect(303, ok ? PAGES[lang].thanks : `${PAGES[lang].contact}?error=1`);
  };

  const parsed = ContactSchema.safeParse(req.body ?? {});
  if (!parsed.success) return done(false, 422);
  const lead = parsed.data;

  // Honeypot filled or submitted inhumanly fast → pretend success, store nothing.
  if (lead.website) return done(true);
  if (lead.ts && Date.now() - lead.ts < MIN_FILL_MS) return done(true);

  const ip = (req.get("x-real-ip") ?? req.ip ?? "").split(",")[0]?.trim();
  if (!(await verifyTurnstile(lead["cf-turnstile-response"], ip))) return done(false, 403);

  // Visitor location from Vercel's edge headers (free; no analytics package).
  const geo = {
    country: req.get("x-vercel-ip-country") ?? undefined,
    region: req.get("x-vercel-ip-country-region") ?? undefined,
    city: req.get("x-vercel-ip-city") ? decodeURIComponent(req.get("x-vercel-ip-city")!) : undefined,
  };

  const prisma = db();
  let id: string | undefined;
  if (prisma) {
    try {
      const row = await prisma.lead.create({
        data: {
          division: lead.division,
          topic: lead.topic || null,
          name: lead.name,
          phone: lead.phone,
          email: lead.email || null,
          message: lead.message,
          lang: lead.lang,
          page: lead.page ?? null,
          country: geo.country?.slice(0, 2) ?? null,
          region: geo.region ?? null,
          city: geo.city ?? null,
        },
        select: { id: true },
      });
      id = row.id;
    } catch (err) {
      console.error("[contact] db insert failed", err);
    }
  }

  const emailed = await sendLeadEmails(lead, geo);
  if (prisma && id && emailed) {
    await prisma.lead.update({ where: { id }, data: { emailed: true } }).catch(() => {});
  }

  // Success if the lead reached SOMEONE (DB or inbox). Otherwise the visitor
  // is shown the WhatsApp fallback.
  if (!id && !emailed) return done(false, 503);
  return done(true);
});

app.use((_req, res) => {
  res.status(404).json({ ok: false });
});

// Explicit error handler: never leak stack traces, always answer.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[api] unhandled", err);
  res.status(500).json({ ok: false });
});
