/**
 * `pnpm preview` — serve build/client like Vercel does (directory index.html,
 * 404.html, "/" language redirect) and mount the Express API on /api.
 * For local checks only; production is Vercel.
 */
import "dotenv/config";
import compression from "compression";
import express from "express";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { app as api } from "../server/app";

const ROOT = resolve("build/client");
const port = Number(process.env.PORT ?? 4173);
const site = express();
site.use(compression()); // Vercel serves brotli/gzip; measure like production

// Mirror vercel.json: cookie → Accept-Language → English (307).
site.get("/", (req, res) => {
  const cookie = /(?:^|;\s*)lang=(en|fr)/.exec(req.headers.cookie ?? "")?.[1];
  const lang = cookie ?? ((req.headers["accept-language"] ?? "").toLowerCase().startsWith("fr") ? "fr" : "en");
  res.redirect(307, `/${lang}`);
});

site.use((req, res, next) => (req.path.startsWith("/api/") ? api(req, res, next) : next()));
site.use(express.static(ROOT, { extensions: ["html"], redirect: false }));
site.use((req, res, next) => {
  const file = join(ROOT, req.path, "index.html");
  if (existsSync(file)) return res.sendFile(file);
  next();
});
site.use((_req, res) => res.status(404).sendFile(join(ROOT, "404.html")));

site.listen(port, () => console.log(`preview → http://localhost:${port}`));
