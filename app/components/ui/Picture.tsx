import manifest from "~/content/media.generated.json";
import { cn } from "~/lib/utils";

type Entry = { w: number; h: number; widths: number[]; blur: string; formats: string[] };
const MEDIA = manifest as Record<string, Entry>;

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
  const m = MEDIA[name];
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
  const set = (fmt: string) => m.widths.map((w) => `${BASE}/${name}-${w}.${fmt} ${w}w`).join(", ");
  const fallbackW = m.widths.find((w) => w >= 1080) ?? m.widths.at(-1)!;
  return (
    <picture className={cn("block overflow-hidden", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      {m.formats.includes("avif") && <source type="image/avif" srcSet={set("avif")} sizes={sizes} />}
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        src={`${BASE}/${name}-${fallbackW}.jpg`}
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
  return Boolean(MEDIA[name]);
}
