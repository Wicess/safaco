import express, { type Request, type Response } from "express";
import { isbot } from "isbot";
import { db } from "./lib/db";

/**
 * POST /api/hit: one beacon per browsing session (sent when the visitor hides
 * or leaves the tab), carrying the pages they saw. One upsert per visit, never
 * one per page view, so Neon sleeps between visitors. Location comes from
 * Vercel's free edge headers (x-vercel-ip-*). Set ANALYTICS_STORE=off to stop
 * writing entirely.
 */
export const track = express.Router();

const ID = /^[a-z0-9]{8,32}$/;
const clean = (s: unknown, max: number) => (typeof s === "string" ? s.slice(0, max) : undefined);

track.post("/api/hit", express.text({ type: () => true, limit: "8kb" }), async (req: Request, res: Response) => {
  // sendBeacon never waits for this answer, so the write can safely happen
  // before it (on Vercel, work after the response may be frozen and lost).
  const done = () => res.status(204).end();
  try {
    await record(req);
  } finally {
    done();
  }
});

async function record(req: Request) {
  if ((process.env.ANALYTICS_STORE ?? "on").toLowerCase() === "off") return;
  if (isbot(req.get("user-agent") ?? "")) return;

  let b: Record<string, unknown>;
  try {
    b = typeof req.body === "string" ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    return;
  }
  const sid = clean(b.sid, 32);
  const visitor = clean(b.vid, 32);
  if (!sid || !visitor || !ID.test(sid) || !ID.test(visitor)) return;
  const pages = (Array.isArray(b.pages) ? b.pages : [])
    .filter((p): p is string => typeof p === "string" && p.startsWith("/") && !p.startsWith("/admin"))
    .slice(0, 60)
    .map((p) => p.slice(0, 120));
  if (!pages.length) return;

  const prisma = db();
  if (!prisma) return;
  const city = req.get("x-vercel-ip-city");
  try {
    await prisma.visit.upsert({
      where: { id: sid },
      create: {
        id: sid,
        visitor,
        returning: b.ret === true,
        landing: pages[0]!,
        pages,
        views: pages.length,
        lang: clean(b.lang, 2) === "fr" ? "fr" : "en",
        referrer: clean(b.ref, 200) || null,
        device: ["mobile", "tablet", "desktop"].includes(String(b.dev)) ? String(b.dev) : null,
        country: req.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
        region: req.get("x-vercel-ip-country-region") ?? null,
        city: city ? decodeURIComponent(city) : null,
      },
      update: { pages: { push: pages }, views: { increment: pages.length } },
    });
  } catch (err) {
    console.error("[hit] write failed", err);
  }
}
