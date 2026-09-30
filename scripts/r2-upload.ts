/**
 * `pnpm media:upload` — sync public/media → Cloudflare R2 (bucket R2_BUCKET).
 * Skips objects that already exist with the same size. Sets long-lived cache
 * headers (file names are content-stable; re-run `pnpm media` for new photos).
 * R2 has zero egress fees, so serving images from it costs nothing per view.
 */
import "dotenv/config";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
  console.error("Missing R2_* variables in .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

const TYPES: Record<string, string> = { ".avif": "image/avif", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".webm": "video/webm" };
const DIR = "public/media";
const files = readdirSync(DIR).filter((f) => TYPES[extname(f)]);

let uploaded = 0;
let skipped = 0;
const queue = [...files];
async function worker() {
  for (let f = queue.shift(); f; f = queue.shift()) {
    const key = `media/${f}`;
    const size = statSync(join(DIR, f)).size;
    try {
      const head = await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
      if (head.ContentLength === size) {
        skipped++;
        continue;
      }
    } catch {
      /* not there yet */
    }
    await s3.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: readFileSync(join(DIR, f)),
        ContentType: TYPES[extname(f)],
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    uploaded++;
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`R2 ${R2_BUCKET}: ${uploaded} uploaded, ${skipped} unchanged (${files.length} files).`);
