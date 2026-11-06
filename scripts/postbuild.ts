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
import { DIVISION_LIST, SITE, isTodo } from "../app/content/site";
import { LANGS, PAGES, PAGE_KEYS } from "../app/lib/i18n";
import { HREFLANG } from "../app/lib/seo";

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
    const alts = LANGS.map((a) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[a]}" href="${SITE.url}${PAGES[k].path[a]}"/>`).join("\n");
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
    "Disallow: /admin",
    "",
    ...["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User", "Bingbot", "Googlebot"].flatMap((b) => [
      `User-agent: ${b}`,
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /admin",
      "",
    ]),
    `Sitemap: ${SITE.url}/sitemap.xml`,
    "",
  ].join("\n"),
);

// 4. llms.txt: plain facts for AI assistants. Only what the site states and
// the owner confirmed (2026-11-06): based in Yaoundé; apartments and machine
// hire in Yaoundé only; tailoring for clients across Cameroon (incl. Douala)
// and abroad. Contact details come from the same data as the pages.
const D = Object.fromEntries(DIVISION_LIST.map((d) => [d.key, d]));
const contact = (k: string) => {
  const d = D[k]!;
  // Placeholder numbers (+237 6 00 00 00 0x) must never be published as facts.
  const real = (v: string) => !isTodo(v) && !/^2376000000\d+$/.test(v.replace(/\D/g, ""));
  const bits = [real(d.phone) && `phone ${d.phone}`, real(d.whatsapp) && `WhatsApp +${d.whatsapp}`, d.email && `email ${d.email}`].filter(Boolean);
  return bits.length ? `- Contact: ${bits.join(", ")}` : "- Contact: via the contact page";
};
writeFileSync(
  join(OUT, "llms.txt"),
  [
    `# ${SITE.legalName}`,
    "",
    "> Cameroonian company based in Yaoundé, Cameroon, with three divisions: automatic plastering machine and mast-lift hire (SAFA Construction), furnished apartments in Meyo, Yaoundé IV (SAFA Apartments), and made-to-measure menswear with a MINEFOP-approved tailoring school at Carrefour MEEC, Yaoundé VI (SAFA Designs). Bilingual French/English. No online booking and no published prices: rates are on request, by WhatsApp, phone or the enquiry form.",
    "",
    "## Where SAFA works",
    "",
    "- Head office and all three divisions: Yaoundé, Centre Region, Cameroon.",
    "- SAFA Construction: machine hire for building sites in Yaoundé only (not other cities at present).",
    "- SAFA Apartments: Meyo, Yaoundé IV. Guests come from Douala and from abroad; bookings by WhatsApp before arrival.",
    "- SAFA Designs: atelier at Carrefour MEEC, Yaoundé VI; sews for clients in Yaoundé, Douala, across Cameroon and abroad, and delivers the finished garment.",
    "",
    "## SAFA Construction (Yaoundé)",
    "",
    D.construction!.tagline.en,
    "SAFA is among the first companies in Cameroon to hire out automatic wall-plastering machines.",
    contact("construction"),
    `- EN: ${SITE.url}${PAGES.construction.path.en} · FR: ${SITE.url}${PAGES.construction.path.fr}`,
    `- Plastering machine hire: ${SITE.url}${PAGES.plastering.path.en} · ${SITE.url}${PAGES.plastering.path.fr}`,
    "",
    "## SAFA Apartments (Meyo, Yaoundé)",
    "",
    D.apartments!.tagline.en,
    contact("apartments"),
    `- EN: ${SITE.url}${PAGES.apartments.path.en} · FR: ${SITE.url}${PAGES.apartments.path.fr}`,
    "",
    "## SAFA Designs (Carrefour MEEC, Yaoundé)",
    "",
    D.designs!.tagline.en,
    contact("designs"),
    `- EN: ${SITE.url}${PAGES.designs.path.en} · FR: ${SITE.url}${PAGES.designs.path.fr}`,
    `- Tailoring training (MINEFOP-approved): ${SITE.url}${PAGES.training.path.en} · ${SITE.url}${PAGES.training.path.fr}`,
    "",
    "## Other pages",
    "",
    `- Photo and video gallery (SAFA's own media): ${SITE.url}${PAGES.gallery.path.en}`,
    `- Questions & answers: ${SITE.url}${PAGES.faq.path.en} · ${SITE.url}${PAGES.faq.path.fr}`,
    `- Contact: ${SITE.url}${PAGES.contact.path.en} · ${SITE.url}${PAGES.contact.path.fr}`,
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
