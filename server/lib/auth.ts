import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { NextFunction, Request, Response } from "express";

/**
 * Admin auth without extra dependencies:
 *  - passwords: scrypt (node:crypto), stored as "scrypt$salt$hash";
 *  - sessions: a signed, httpOnly, SameSite=Strict cookie (HMAC-SHA256 with
 *    SESSION_SECRET). Verifying it needs no database, so an open admin tab
 *    never keeps Neon awake; only login reads the AdminUser table.
 */
const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const COOKIE = "safa_admin";
const MAX_AGE_S = 60 * 60 * 24 * 14; // 14 days

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [algo, s, h] = stored.split("$");
  if (algo !== "scrypt" || !s || !h) return false;
  const expected = Buffer.from(h, "base64");
  const got = await scrypt(pw, Buffer.from(s, "base64"), expected.length);
  return got.length === expected.length && timingSafeEqual(got, expected);
}

export type Session = { uid: string; email: string; name: string; exp: number };

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (≥ 32 chars)");
  return s;
}

const b64 = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function issueSession(res: Response, req: Request, user: { id: string; email: string; name: string }) {
  const payload: Session = { uid: user.id, email: user.email, name: user.name, exp: Math.floor(Date.now() / 1000) + MAX_AGE_S };
  const body = b64(JSON.stringify(payload));
  res.cookie(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: req.secure || process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_S * 1000,
  });
}

export function clearSession(res: Response) {
  res.clearCookie(COOKIE, { path: "/" });
}

function readCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.cookie ?? "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return undefined;
}

export function readSession(req: Request): Session | null {
  const v = readCookie(req, COOKIE);
  if (!v) return null;
  const [body, sig] = v.split(".");
  if (!body || !sig) return null;
  let expected: string;
  try {
    expected = sign(body);
  } catch {
    return null;
  }
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const s = JSON.parse(Buffer.from(body, "base64url").toString()) as Session;
    return s.exp > Date.now() / 1000 ? s : null;
  } catch {
    return null;
  }
}

/** Express guard for /api/admin/* (except login). JSON-only + SameSite=Strict
 *  cookie together block cross-site request forgery. */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const s = readSession(req);
  if (!s) return res.status(401).json({ ok: false, error: "unauthorized" });
  if (req.method !== "GET" && !req.is("application/json") && !req.is("image/*")) {
    return res.status(415).json({ ok: false, error: "unsupported" });
  }
  res.locals.session = s;
  next();
}

// Login throttle per IP and per email (per warm instance; the WAF rule is the real wall).
const attempts = new Map<string, number[]>();
export function loginLimited(key: string, max: number): boolean {
  const now = Date.now();
  const list = (attempts.get(key) ?? []).filter((t) => now - t < 15 * 60_000);
  list.push(now);
  attempts.set(key, list);
  if (attempts.size > 5000) attempts.clear();
  return list.length > max;
}
