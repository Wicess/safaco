import { DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 (S3 API). Holds the media and the admin's content documents:
 *   site/draft.json    — what the admin is editing
 *   site/content.json  — the published copy the build reads
 *   site/publish-pending — marker that tells the Vercel build step to run
 * Zero egress fees; none of this touches Neon.
 */
let client: S3Client | null = null;

export function r2Configured(): boolean {
  const e = process.env;
  return Boolean(e.R2_ENDPOINT && e.R2_ACCESS_KEY_ID && e.R2_SECRET_ACCESS_KEY && e.R2_BUCKET);
}

function s3(): S3Client {
  if (!r2Configured()) throw new Error("R2 is not configured (R2_* variables)");
  client ??= new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  });
  return client;
}

const bucket = () => process.env.R2_BUCKET!;

/** Public base for media objects, e.g. https://pub-…r2.dev/media */
export function mediaBase(): string {
  const explicit = process.env.VITE_MEDIA_BASE;
  if (explicit && /^https?:\/\//.test(explicit)) return explicit.replace(/\/$/, "");
  return `${(process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "")}/media`;
}

export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const out = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    const text = await out.Body?.transformToString();
    return text ? (JSON.parse(text) as T) : null;
  } catch (err) {
    if ((err as { name?: string }).name === "NoSuchKey") return null;
    throw err;
  }
}

export async function putJson(key: string, data: unknown): Promise<void> {
  await s3().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
      CacheControl: "no-store",
    }),
  );
}

export async function getBuffer(key: string): Promise<Buffer | null> {
  try {
    const out = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    const bytes = await out.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  } catch (err) {
    if ((err as { name?: string }).name === "NoSuchKey") return null;
    throw err;
  }
}

/** Keys under a prefix with their last-modified time (first 1000). */
export async function listKeys(prefix: string): Promise<{ key: string; modified: Date }[]> {
  const out = await s3().send(new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefix, MaxKeys: 1000 }));
  return (out.Contents ?? []).filter((o) => o.Key).map((o) => ({ key: o.Key!, modified: o.LastModified ?? new Date(0) }));
}

export async function putObject(key: string, body: Buffer | string, contentType: string, cache = "public, max-age=31536000, immutable"): Promise<void> {
  await s3().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType, CacheControl: cache }));
}

export async function deleteKeys(keys: string[]): Promise<void> {
  for (let i = 0; i < keys.length; i += 900) {
    const chunk = keys.slice(i, i + 900);
    if (!chunk.length) continue;
    await s3().send(new DeleteObjectsCommand({ Bucket: bucket(), Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true } }));
  }
}
