import { randomBytes } from "node:crypto";
import sharp from "sharp";
import type { MediaEntry } from "../../app/content/overrides";
import { deleteKeys, mediaBase, putObject } from "./r2";

/** Same renditions as scripts/media.ts, so uploads look and load like the
 *  built-in photos: AVIF → WebP → JPEG, 360–1600 px, plus a blur placeholder. */
const WIDTHS = [360, 540, 720, 1080, 1600];
const FORMATS = ["avif", "webp", "jpg"] as const;

export function slug(s: string): string {
  return (
    s
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "photo"
  );
}

/** Uploaded names start with "up-" (never "safa-" or stock names). */
export function newMediaName(hint: string): string {
  return `up-${slug(hint)}-${randomBytes(3).toString("hex")}`;
}

/** Uploaded videos: "up-v-…", so a clip name never prefixes a photo name. */
export function newClipName(hint: string): string {
  return `up-v-${slug(hint)}-${randomBytes(3).toString("hex")}`;
}

export async function processUpload(buf: Buffer, name: string): Promise<MediaEntry> {
  const input = sharp(buf, { failOn: "error" }).rotate();
  const meta = await input.metadata();
  const w0 = meta.autoOrient?.width ?? meta.width ?? 0;
  const h0 = meta.autoOrient?.height ?? meta.height ?? 0;
  if (!w0 || !h0) throw new Error("not an image");
  if (w0 * h0 > 40_000_000) throw new Error("image too large");

  const widths = WIDTHS.filter((w) => w <= w0);
  if (!widths.length || (w0 > widths.at(-1)! && w0 < 1600)) widths.push(w0);

  const jobs: Promise<void>[] = [];
  for (const w of widths) {
    const base = input.clone().resize({ width: w, withoutEnlargement: true });
    const enc = {
      avif: () => base.clone().avif({ quality: 52, effort: 2 }).toBuffer(),
      webp: () => base.clone().webp({ quality: 70, effort: 4 }).toBuffer(),
      jpg: () => base.clone().jpeg({ quality: 72, mozjpeg: true, progressive: true }).toBuffer(),
    };
    for (const f of FORMATS) {
      jobs.push(enc[f]().then((b) => putObject(`media/${name}-${w}.${f}`, b, f === "jpg" ? "image/jpeg" : `image/${f}`)));
    }
  }
  const blurBuf = await input.clone().resize(20).webp({ quality: 40 }).toBuffer();
  await Promise.all(jobs);

  const last = widths.at(-1)!;
  return {
    w: last,
    h: Math.round((last / w0) * h0),
    widths,
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
    formats: [...FORMATS],
    base: mediaBase(),
  };
}

export async function deleteMedia(name: string, entry: MediaEntry): Promise<void> {
  await deleteKeys(entry.widths.flatMap((w) => entry.formats.map((f) => `media/${name}-${w}.${f}`)));
}
