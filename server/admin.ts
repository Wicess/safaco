import express, { type Request, type Response } from "express";
import type { MediaEntry, Overrides } from "../app/content/overrides";
import { clearSession, hashPassword, issueSession, loginLimited, readSession, requireAdmin, sessionConfigured, verifyPassword, type Session } from "./lib/auth";
import { db } from "./lib/db";
import { deleteMedia, newMediaName, processUpload } from "./lib/images";
import { sendTestEmail } from "./lib/mail";
import { deleteKeys, getJson, putJson, putObject, r2Configured } from "./lib/r2";

/**
 * /api/admin/*. Everything here runs only when the owner acts in the admin
 * panel: nothing polls, and pages never call it. Content lives in R2 (no
 * database); only login, statistics and enquiries read Neon, on demand.
 */
export const admin = express.Router();

const DRAFT = "site/draft.json";
const LIVE = "site/content.json";
const PENDING = "site/publish-pending";

const ip = (req: Request) => (req.get("x-real-ip") ?? req.ip ?? "").split(",")[0]!.trim();
const fail = (res: Response, status: number, error: string) => res.status(status).json({ ok: false, error });

// ── Auth ────────────────────────────────────────────────────────────────
admin.post("/api/admin/login", express.json({ limit: "4kb" }), async (req, res) => {
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const password = String(req.body?.password ?? "");
  if (!email || !password) return fail(res, 400, "missing");
  // Checked first, so a missing setting reads as a clear message rather than
  // a 500 after a correct password.
  if (!sessionConfigured()) return fail(res, 503, "session_not_configured");
  if (loginLimited(`ip:${ip(req)}`, 8) || loginLimited(`em:${email}`, 5)) return fail(res, 429, "too_many_attempts");
  const prisma = db();
  if (!prisma) return fail(res, 503, "database_not_configured");
  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    // Verify against a dummy hash when the user is unknown: same timing either way.
    const ok = await verifyPassword(password, user?.passwordHash ?? "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86));
    if (!user || !ok) return fail(res, 401, "invalid_credentials");
    // Bookkeeping only: never block a correct sign-in on it.
    await prisma.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch((e) => console.error("[login] lastLoginAt", e));
    issueSession(res, req, user);
    res.json({ ok: true, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error("[login] failed", err);
    fail(res, 500, "login_failed");
  }
});

admin.post("/api/admin/logout", (_req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

admin.get("/api/admin/me", (req, res) => {
  const s = readSession(req);
  if (!s) return fail(res, 401, "unauthorized");
  res.json({ ok: true, user: { email: s.email, name: s.name } });
});

// Everything below requires a session.
admin.use("/api/admin", requireAdmin);

admin.post("/api/admin/password", express.json({ limit: "4kb" }), async (req, res) => {
  const s = res.locals.session as Session;
  const current = String(req.body?.current ?? "");
  const next = String(req.body?.next ?? "");
  if (next.length < 10) return fail(res, 400, "password_too_short");
  const prisma = db();
  if (!prisma) return fail(res, 503, "database_not_configured");
  const user = await prisma.adminUser.findUnique({ where: { id: s.uid } });
  if (!user || !(await verifyPassword(current, user.passwordHash))) return fail(res, 401, "wrong_password");
  await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  res.json({ ok: true });
});

/** Change the sign-in email (the username) and/or the display name. The
 *  current password is required, so an unattended open session can't be
 *  used to take the account over. */
admin.post("/api/admin/account", express.json({ limit: "4kb" }), async (req, res) => {
  const s = res.locals.session as Session;
  const name = String(req.body?.name ?? "").trim().slice(0, 80);
  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const current = String(req.body?.current ?? "");
  if (!name) return fail(res, 400, "name_required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120) return fail(res, 400, "invalid_email");
  const prisma = db();
  if (!prisma) return fail(res, 503, "database_not_configured");
  const user = await prisma.adminUser.findUnique({ where: { id: s.uid } });
  if (!user || !(await verifyPassword(current, user.passwordHash))) return fail(res, 401, "wrong_password");
  if (email !== user.email && (await prisma.adminUser.findUnique({ where: { email } }))) return fail(res, 409, "email_taken");
  const updated = await prisma.adminUser.update({ where: { id: user.id }, data: { name, email } });
  // The session carries the email and name: re-issue it with the new ones.
  issueSession(res, req, updated);
  res.json({ ok: true, user: { email: updated.email, name: updated.name } });
});

admin.post("/api/admin/test-email", express.json({ limit: "1kb" }), async (_req, res) => {
  const r = await sendTestEmail();
  if (r.ok) return res.json(r);
  res.status(502).json({ ok: false, error: r.error, detail: r.detail });
});

admin.get("/api/admin/status", (_req, res) => {
  res.json({
    ok: true,
    storage: r2Configured(),
    database: Boolean(process.env.DATABASE_URL),
    deployHook: Boolean(process.env.VERCEL_DEPLOY_HOOK_URL),
    email: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    analytics: (process.env.ANALYTICS_STORE ?? "on").toLowerCase() !== "off",
  });
});

// ── Content (R2) ────────────────────────────────────────────────────────
admin.get("/api/admin/content", async (_req, res) => {
  if (!r2Configured()) return fail(res, 503, "storage_not_configured");
  const [draft, live] = await Promise.all([getJson<Overrides>(DRAFT), getJson<Overrides>(LIVE)]);
  const d = draft ?? live ?? {};
  res.json({
    ok: true,
    content: d,
    publishedAt: live?.publishedAt ?? null,
    unpublished: Boolean(draft && (!live || (draft.updatedAt ?? "") > (live.publishedAt ?? ""))),
  });
});

admin.put("/api/admin/content", express.json({ limit: "2mb" }), async (req, res) => {
  if (!r2Configured()) return fail(res, 503, "storage_not_configured");
  const incoming = req.body?.content as Overrides | undefined;
  if (!incoming || typeof incoming !== "object") return fail(res, 400, "invalid");
  const current = (await getJson<Overrides>(DRAFT)) ?? (await getJson<Overrides>(LIVE)) ?? {};
  // The browser never drops uploaded media from the map; only Publish cleans
  // up files nothing uses any more.
  const next: Overrides = { ...incoming, media: { ...(current.media ?? {}), ...(incoming.media ?? {}) }, updatedAt: new Date().toISOString() };
  delete next.publishedAt;
  await putJson(DRAFT, next);
  res.json({ ok: true, updatedAt: next.updatedAt });
});

/** Names of uploaded media still referenced anywhere in the content. */
function referenced(c: Overrides): Set<string> {
  const text = JSON.stringify({ ...c, media: undefined });
  return new Set(Object.keys(c.media ?? {}).filter((n) => text.includes(`"${n}"`)));
}

admin.post("/api/admin/publish", async (_req, res) => {
  if (!r2Configured()) return fail(res, 503, "storage_not_configured");
  const [draft, prev] = await Promise.all([getJson<Overrides>(DRAFT), getJson<Overrides>(LIVE)]);
  if (!draft) return fail(res, 400, "nothing_to_publish");

  // Delete uploads used neither now nor by the version that is still live
  // until the rebuild finishes (those go on the next publish).
  const now = referenced(draft);
  const before = prev ? referenced(prev) : new Set<string>();
  const media: Record<string, MediaEntry> = {};
  const orphans: [string, MediaEntry][] = [];
  for (const [name, entry] of Object.entries(draft.media ?? {})) {
    if (now.has(name) || before.has(name)) media[name] = entry;
    else orphans.push([name, entry]);
  }
  const publishedAt = new Date().toISOString();
  const live: Overrides = { ...draft, media, publishedAt, updatedAt: draft.updatedAt ?? publishedAt };
  await putJson(LIVE, live);
  await putJson(DRAFT, { ...live, publishedAt: undefined });
  for (const [name, entry] of orphans) await deleteMedia(name, entry).catch((e) => console.error("[publish] cleanup", name, e));

  // Local development: write the published copy straight into the app so the
  // dev server shows it immediately (on Vercel the rebuild does this).
  if (!process.env.VERCEL) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync("app/content/overrides.generated.json", JSON.stringify(live, null, 2) + "\n");
  }

  // Ask Vercel to rebuild. The marker lets the Ignored Build Step allow it.
  let deploying = false;
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (hook) {
    await putObject(PENDING, publishedAt, "text/plain", "no-store");
    deploying = (await fetch(hook, { method: "POST" }).catch(() => null))?.ok ?? false;
  }
  res.json({ ok: true, publishedAt, deploying, removed: orphans.length });
});

admin.post("/api/admin/discard", async (_req, res) => {
  const live = await getJson<Overrides>(LIVE);
  if (live) await putJson(DRAFT, { ...live, publishedAt: undefined });
  else await deleteKeys([DRAFT]);
  res.json({ ok: true });
});

// ── Image upload (the browser shrinks photos to ≤ 2000 px first) ────────
admin.post("/api/admin/upload", express.raw({ type: "image/*", limit: "4mb" }), async (req, res) => {
  if (!r2Configured()) return fail(res, 503, "storage_not_configured");
  if (!Buffer.isBuffer(req.body) || !req.body.length) return fail(res, 400, "no_image");
  const name = newMediaName(String(req.query.name ?? "photo"));
  let entry: MediaEntry;
  try {
    entry = await processUpload(req.body, name);
  } catch (err) {
    console.error("[upload]", err);
    return fail(res, 422, "unreadable_image");
  }
  const draft = (await getJson<Overrides>(DRAFT)) ?? (await getJson<Overrides>(LIVE)) ?? {};
  await putJson(DRAFT, { ...draft, media: { ...(draft.media ?? {}), [name]: entry }, updatedAt: new Date().toISOString(), publishedAt: undefined });
  res.json({ ok: true, name, entry });
});

// ── Enquiries (Neon, on demand) ─────────────────────────────────────────
admin.get("/api/admin/leads", async (req, res) => {
  const prisma = db();
  if (!prisma) return fail(res, 503, "database_not_configured");
  const take = Math.min(Number(req.query.take) || 100, 500);
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take });
  res.json({ ok: true, leads });
});

// ── Statistics (Neon, on demand: only when the dashboard is opened) ─────
type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);

admin.get("/api/admin/stats", async (req, res) => {
  const prisma = db();
  if (!prisma) return fail(res, 503, "database_not_configured");
  const days = [7, 30, 90, 365].includes(Number(req.query.days)) ? Number(req.query.days) : 30;
  const since = new Date(Date.now() - days * 86_400_000);
  const prevSince = new Date(since.getTime() - days * 86_400_000);
  const q = <T = Row>(s: TemplateStringsArray, ...v: unknown[]) => prisma.$queryRaw<T[]>(s, ...v);

  const [tot, prev, daily, pages, countries, cities, refs, devices, langs, leads] = await Promise.all([
    q`SELECT count(*) AS visits, coalesce(sum(views),0) AS views, count(DISTINCT visitor) AS visitors,
             count(*) FILTER (WHERE "returning") AS "returning", count(*) FILTER (WHERE views = 1) AS bounces
        FROM "Visit" WHERE "createdAt" >= ${since}`,
    q`SELECT count(*) AS visits, coalesce(sum(views),0) AS views, count(DISTINCT visitor) AS visitors
        FROM "Visit" WHERE "createdAt" >= ${prevSince} AND "createdAt" < ${since}`,
    q`SELECT to_char(date_trunc('day', "createdAt" AT TIME ZONE 'Africa/Douala'), 'YYYY-MM-DD') AS day,
             count(*) AS visits, coalesce(sum(views),0) AS views
        FROM "Visit" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1`,
    q`SELECT p AS label, count(*) AS n FROM "Visit", unnest(pages) AS p
        WHERE "createdAt" >= ${since} GROUP BY p ORDER BY n DESC LIMIT 15`,
    q`SELECT coalesce(country,'??') AS label, count(*) AS n FROM "Visit" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY n DESC LIMIT 12`,
    q`SELECT city || coalesce(', ' || country, '') AS label, count(*) AS n FROM "Visit"
        WHERE "createdAt" >= ${since} AND city IS NOT NULL GROUP BY city, country ORDER BY n DESC LIMIT 12`,
    q`SELECT coalesce(referrer,'Direct') AS label, count(*) AS n FROM "Visit" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY n DESC LIMIT 10`,
    q`SELECT coalesce(device,'unknown') AS label, count(*) AS n FROM "Visit" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY n DESC`,
    q`SELECT coalesce(lang,'en') AS label, count(*) AS n FROM "Visit" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY n DESC`,
    q`SELECT division::text AS label, count(*) AS n FROM "Lead" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY n DESC`,
  ]);
  const list = (rows: Row[]) => rows.map((r) => ({ label: String(r.label), n: num(r.n) }));
  const t = tot[0] ?? {};
  const p = prev[0] ?? {};
  res.json({
    ok: true,
    days,
    totals: { visits: num(t.visits), views: num(t.views), visitors: num(t.visitors), returning: num(t.returning), bounces: num(t.bounces) },
    previous: { visits: num(p.visits), views: num(p.views), visitors: num(p.visitors) },
    daily: daily.map((r) => ({ day: String(r.day), visits: num(r.visits), views: num(r.views) })),
    pages: list(pages),
    countries: list(countries),
    cities: list(cities),
    referrers: list(refs),
    devices: list(devices),
    langs: list(langs),
    leads: list(leads),
  });
});
