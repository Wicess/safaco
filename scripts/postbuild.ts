/**
 * Runs after `react-router build`:
 *  1. 404.html for Vercel's static 404
 *  2. sitemap.xml with hreflang alternates (indexable pages only)
 *  3. robots.txt (search + AI-search crawlers allowed; /api blocked)
 *  4. llms.txt (short plain-text summary — optional, low value, harmless)
 *  5. CLIENT_TODO report — every placeholder still waiting for client data.
 *     Set STRICT_CONTENT=1 to fail the build while any remain (use for launch).
 */
import "dotenv/config";
import { copyFileSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { DIVISION_LIST, SITE } from "../app/content/site";
import { LANGS, PAGES, PAGE_KEYS } from "../app/lib/i18n";

const OUT = "build/client";
const today = new Date().toISOString().slice(0, 10);

// 1. 404
const nf = join(OUT, "404/index.html");
if (existsSync(nf)) copyFileSync(nf, join(OUT, "404.html"));

// 1b. Images served from R2 → don't ship (or bill) a second copy on Vercel.
if (/^https?:\/\//.test(process.env.VITE_MEDIA_BASE ?? "")) {
  rmSync(join(OUT, "media"), { recursive: true, force: true });
  console.log(`✓ media served from ${process.env.VITE_MEDIA_BASE} — removed build/client/media`);
}

// 2. Sitemap
const urls = PAGE_KEYS.filter((k) => !PAGES[k].noindex).flatMap((k) =>
  LANGS.map((l) => {
    const alts = LANGS.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${SITE.url}${PAGES[k].path[a]}"/>`).join("\n");
    const xdef = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${k === "home" ? "/" : PAGES[k].path.en}"/>`;
    return `  <url>\n    <loc>${SITE.url}${PAGES[k].path[l]}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n${xdef}\n  </url>`;
  }),
);
writeFileSync(
  join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
);

// 3. robots.txt — one open policy; named AI *search* bots listed explicitly
// so their access is unambiguous (they power ChatGPT/Perplexity/Claude answers).
writeFileSync(
  join(OUT, "robots.txt"),
  [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    ...["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User", "Bingbot", "Googlebot"].flatMap((b) => [
      `User-agent: ${b}`,
      "Allow: /",
      "Disallow: /api/",
      "",
    ]),
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
  ].join("\n"),
);

// 4. llms.txt
writeFileSync(
  join(OUT, "llms.txt"),
  [
    `# ${SITE.legalName}`,
    "",
    "> Cameroonian group based in Yaoundé with three divisions. No online booking or prices: contact by WhatsApp, phone or the enquiry form.",
    "",
    ...DIVISION_LIST.flatMap((d) => [`## ${d.name}`, "", `${d.tagline.en}`, `- EN: ${SITE.url}${PAGES[d.page].path.en}`, `- FR: ${SITE.url}${PAGES[d.page].path.fr}`, ""]),
    "## Key pages",
    "",
    `- Automatic plastering machine hire: ${SITE.url}${PAGES.plastering.path.en}`,
    `- Tailoring training (MINEFOP-approved): ${SITE.url}${PAGES.training.path.en}`,
    `- Questions & answers: ${SITE.url}${PAGES.faq.path.en}`,
    `- Contact: ${SITE.url}${PAGES.contact.path.en}`,
    "",
  ].join("\n"),
);

// 5. CLIENT_TODO report
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|json)$/.test(f) ? [p] : [];
  });
}
const todos: string[] = [];
for (const file of walk("app")) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (line.includes("CLIENT_TODO")) todos.push(`  ${relative(".", file)}:${i + 1}  ${line.trim().slice(0, 110)}`);
    });
}
if (todos.length) {
  console.warn(`\n⚠  ${todos.length} CLIENT_TODO placeholder(s) still in the content:\n${todos.join("\n")}\n`);
  if (process.env.STRICT_CONTENT === "1") {
    console.error("STRICT_CONTENT=1 → failing build until every CLIENT_TODO is resolved.");
    process.exit(1);
  }
} else {
  console.log("✓ No CLIENT_TODO placeholders left.");
}
console.log(`✓ postbuild: 404.html, sitemap.xml (${urls.length} urls), robots.txt, llms.txt`);
