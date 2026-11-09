/**
 * Media pipeline — `pnpm media`
 * media-src/*.jpg|png → public/media/{name}-{w}.{avif,webp,jpg}
 * Widths 360/540/720/1080/1600 (never upscaled), a tiny blurred placeholder,
 * and app/content/media.generated.json for <Picture>.
 * Also turns media-src/CREDITS.md into app/content/credits.generated.json
 * (CC BY / BY-SA photos legally need visible attribution — shown on /legal).
 *
 * Budgets (Cameroon mobile networks): hero ≤ ~130 KB, cards ≤ ~50 KB at 720w.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import sharp, { type Sharp } from "sharp";

const SRC = "media-src";
const OUT = "public/media";
const WIDTHS = [360, 540, 720, 1080, 1600];
/** Re-encode after changing quality settings:
 *   MEDIA_FORCE=1 pnpm media                       → every file
 *   MEDIA_FORCE=2026-11-09T19:00:00Z pnpm media    → files older than that (resumable) */
const FORCE_ENV = process.env.MEDIA_FORCE;
const FORCE_BEFORE = FORCE_ENV === "1" ? Infinity : FORCE_ENV ? Date.parse(FORCE_ENV) : -Infinity;
const stale = (out: string) => !existsSync(out) || statSync(out).mtimeMs < FORCE_BEFORE;
mkdirSync(OUT, { recursive: true });

type Entry = { w: number; h: number; widths: number[]; blur: string; formats: string[] };
const manifest: Record<string, Entry> = {};

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
let bytes = 0;
for (const file of files) {
  const name = basename(file, extname(file));
  const input = sharp(join(SRC, file)).rotate(); // honour EXIF orientation
  const meta = await input.metadata();
  const w0 = meta.width ?? 0;
  const h0 = meta.height ?? 0;
  const widths = WIDTHS.filter((w) => w <= w0);
  // Keep the source's own width too (e.g. 960/1280 px phone photos) so they
  // stay sharp on high-density screens instead of capping at the step below.
  if (!widths.length || (w0 > widths.at(-1)! && w0 < 1600)) widths.push(w0);

  for (const w of widths) {
    // Downscaled copies get a light unsharp mask: resampling softens edges
    // (stitching, fabric weave, machine labels) and this restores the crisp,
    // "HD" read. The native-width copy is left exactly as shot.
    const resized = input.clone().resize({ width: w, withoutEnlargement: true, kernel: "lanczos3" });
    const base = w < w0 ? resized.sharpen({ sigma: 0.55, m1: 0.6, m2: 1.6 }) : resized;
    // Quality tuned for detail over the last few KB (2026-11-09): AVIF 60 /
    // WebP 80 / JPEG 82, still ~45 KB for a 720 px card.
    const targets: [string, Sharp][] = [
      ["avif", base.clone().avif({ quality: 60, effort: 2 })],
      ["webp", base.clone().webp({ quality: 80, effort: 5, smartSubsample: true })],
      ["jpg", base.clone().jpeg({ quality: 82, mozjpeg: true, progressive: true })],
    ];
    for (const [ext, pipe] of targets) {
      const out = join(OUT, `${name}-${w}.${ext}`);
      if (!stale(out)) continue;
      const info = await pipe.toFile(out);
      bytes += info.size;
    }
  }

  const blurBuf = await input.clone().resize(20).webp({ quality: 40 }).toBuffer();
  manifest[name] = {
    w: widths.at(-1)!,
    h: Math.round((widths.at(-1)! / w0) * h0),
    widths,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    formats: ["avif", "webp", "jpg"],
  };
  process.stdout.write(`✓ ${name} (${widths.join("/")})\n`);
}

writeFileSync("app/content/media.generated.json", JSON.stringify(manifest, null, 2) + "\n");

// Credits: parse the markdown table in media-src/CREDITS.md
const credits: { file: string; source: string; author: string; licence: string; licenceUrl: string }[] = [];
const creditsPath = join(SRC, "CREDITS.md");
if (existsSync(creditsPath)) {
  for (const line of readFileSync(creditsPath, "utf8").split("\n")) {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 6 || !cells[1]?.startsWith("`")) continue;
    const link = (s: string) => s.match(/\[(.*?)\]\((.*?)\)/);
    const src = link(cells[2] ?? "");
    const lic = link(cells[4] ?? "");
    credits.push({
      file: cells[1].replace(/`/g, "").replace(/\.\w+$/, ""),
      source: src?.[2] ?? "",
      author: cells[3] ?? "",
      licence: lic?.[1] ?? cells[4] ?? "",
      licenceUrl: lic?.[2] ?? "",
    });
  }
}
writeFileSync("app/content/credits.generated.json", JSON.stringify(credits, null, 2) + "\n");
console.log(`\n${files.length} images → ${OUT} (+${(bytes / 1024 / 1024).toFixed(1)} MB new). ${credits.length} credits.`);
