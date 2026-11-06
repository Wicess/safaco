import manifest from "~/content/media.generated.json";
import { O } from "~/content/overrides";
import { cn } from "~/lib/utils";

type Entry = { w: number; h: number; widths: number[]; blur: string; formats: string[]; base?: string };
/** Built-in photos (scripts/media.ts) + photos uploaded in the admin (R2).
 *  `extra` lets the admin preview uploads before they are published. */
const MEDIA: Record<string, Entry> = { ...(manifest as Record<string, Entry>), ...(O.media ?? {}) };
const extra: Record<string, Entry> = {};
export function registerMedia(name: string, entry: Entry) {
  extra[name] = entry;
}
export function mediaEntry(name: string): Entry | undefined {
  return extra[name] ?? MEDIA[name];
}
export function allMediaNames(): string[] {
  return [...new Set([...Object.keys(MEDIA), ...Object.keys(extra)])];
}

/** Where optimized images are served from. Set VITE_MEDIA_BASE to the R2 public
 *  URL (e.g. https://media.<domain>/media) to serve them from Cloudflare R2 —
 *  zero egress, and Vercel then serves no image bytes. Defaults to /media. */
const BASE = ((import.meta.env.VITE_MEDIA_BASE as string | undefined) || "/media").replace(/\/$/, "");

export type MediaName = string;

/**
 * Responsive image from the build-time media pipeline (scripts/media.ts):
 * AVIF → WebP → JPEG, widths 360–1600, intrinsic size set (no layout shift),
 * blurred placeholder painted as background. Lazy unless `priority`.
 * Unknown names render a quiet placeholder so pages still work before the
 * client's photos arrive.
 */
export function Picture({
  name,
  alt,
  sizes = "100vw",
  priority = false,
  className,
  imgClassName,
  ratio,
}: {
  name: MediaName;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Force an aspect ratio box, e.g. "4/5". Image is cropped with object-cover. */
  ratio?: string;
}) {
  const m = mediaEntry(name);
  if (!m) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className={cn("bg-[linear-gradient(135deg,var(--color-stone),var(--color-ivory-2))]", className)}
        style={{ aspectRatio: ratio ?? "4/3" }}
      />
    );
  }
  const base = (m.base ?? BASE).replace(/\/$/, "");
  const set = (fmt: string) => m.widths.map((w) => `${base}/${name}-${w}.${fmt} ${w}w`).join(", ");
  const fallbackW = m.widths.find((w) => w >= 1080) ?? m.widths.at(-1)!;
  return (
    <picture className={cn("block overflow-hidden", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      {m.formats.includes("avif") && <source type="image/avif" srcSet={set("avif")} sizes={sizes} />}
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${base}/${name}-${fallbackW}.jpg`}
        srcSet={set("jpg")}
        sizes={sizes}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={cn("h-full w-full object-cover", imgClassName)}
        style={{ backgroundImage: `url(${m.blur})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}

export function hasMedia(name: string) {
  return Boolean(mediaEntry(name));
}
