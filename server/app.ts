import express, { type NextFunction, type Request, type Response } from "express";
import { ContactSchema } from "../app/lib/contact-schema";
import { admin } from "./admin";
import { track } from "./track";
import { db } from "./lib/db";
import { sendLeadEmails } from "./lib/mail";
import { verifyTurnstile } from "./lib/turnstile";

const PAGES = {
  en: { thanks: "/en/contact/thank-you", contact: "/en/contact" },
  fr: { thanks: "/fr/contact/merci", contact: "/fr/contact" },
} as const;

const MIN_FILL_MS = 3000;

// ── Cheap in-memory guards (per warm function instance). They are not a
// security boundary — the Vercel WAF rule and Turnstile are — but they stop a
// burst from one visitor, or a double-tap on Send, from waking the database.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_IP = 5;
const hits = new Map<string, number[]>();
const recent = new Map<string, number>();

function limited(ip: string | undefined): boolean {
  if (!ip) return false;
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_IP;
}

/** Same phone + same message within 10 minutes = a resend, not a new enquiry. */
function isDuplicate(phone: string, message: string): boolean {
  const key = `${phone.replace(/\D/g, "")}|${message.trim().toLowerCase().slice(0, 200)}`;
  const now = Date.now();
  const seen = recent.get(key);
  recent.set(key, now);
  if (recent.size > 5000) recent.clear();
  return seen !== undefined && now - seen < WINDOW_MS;
}

/** Link-stuffed messages are advertising, not enquiries. */
function looksLikeSpam(message: string): boolean {
  return (message.match(/https?:\/\/|www\./gi) ?? []).length > 2;
}

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

// Admin + visit beacon come first: they set their own body parsers/limits.
app.use(track);
app.use(admin);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

// Which services are configured (yes/no only, never values), so a broken
// setting can be diagnosed from outside without signing in. No DB query.
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    config: {
      database: Boolean(process.env.DATABASE_URL),
      session: (process.env.SESSION_SECRET ?? "").length >= 32,
      storage: Boolean(process.env.R2_BUCKET && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY),
      email: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      publishHook: Boolean(process.env.VERCEL_DEPLOY_HOOK_URL),
    },
  });
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

  // ── Database cost discipline (Neon bills by time AWAKE; it sleeps after
  // 5 min with zero queries). Everything above this line runs without touching
  // Postgres, so bots, invalid posts and rate-limited IPs never wake it.
  // A real enquiry costs exactly ONE query: mail first, then a single INSERT
  // that already carries the `emailed` flag (no follow-up UPDATE).
  if (limited(ip) || isDuplicate(lead.phone, lead.message) || looksLikeSpam(lead.message)) return done(true);

  const emailed = await sendLeadEmails(lead, geo);

  // LEAD_STORE: "always" (default) keeps every enquiry in Postgres as the
  // durable record. "fallback" writes only when the email could NOT be sent, so
  // the database stays asleep in normal operation. "off" never writes.
  const mode = (process.env.LEAD_STORE ?? "always").toLowerCase();
  const prisma = mode === "off" || (mode === "fallback" && emailed) ? null : db();
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
          emailed,
        },
        select: { id: true },
      });
      id = row.id;
    } catch (err) {
      console.error("[contact] db insert failed", err);
    }
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
  res.status(500).json({ ok: false, error: "server_error" });
});
