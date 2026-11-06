import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import manifest from "~/content/media.generated.json";
import { VIDEO, type VideoKey } from "~/content/media-map";
import type { Lang } from "~/lib/i18n";
import { cn } from "~/lib/utils";

const BASE = ((import.meta.env.VITE_MEDIA_BASE as string | undefined) || "/media").replace(/\/$/, "");
type Entry = { widths: number[]; blur: string };
const MEDIA = manifest as Record<string, Entry>;

export function videoUrl(key: VideoKey) {
  return `${BASE}/${VIDEO[key].src}`;
}

/** Poster URL: the widest JPEG ≤ 720 px from the image pipeline. */
export function posterUrl(key: VideoKey) {
  const name = VIDEO[key].poster;
  const m = MEDIA[name];
  if (!m) return undefined;
  const w = [...m.widths].reverse().find((x) => x <= 720) ?? m.widths[0];
  return `${BASE}/${name}-${w}.jpg`;
}

/** Autoplay is a courtesy, not a right: skipped for reduced motion and for
 *  visitors on Save-Data (common on Cameroonian mobile plans). */
function mayAutoplay() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return !conn?.saveData;
}

/**
 * Silent ambient video. Nothing downloads until it is near the viewport
 * (preload="none"); it plays only while at least 35% visible and pauses when
 * scrolled away or the tab is hidden, so a page left open costs no data.
 * A visible play/pause control is always there (WCAG 2.2.2).
 */
export function AmbientVideo({
  video,
  label,
  className,
  fit = "cover",
  lang,
}: {
  lang: Lang;
  video: VideoKey;
  /** Describes what the clip shows; read by screen readers. */
  label: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // null = follow visibility; true/false = the visitor decided.
  const userChoice = useRef<boolean | null>(null);
  const v = VIDEO[video];
  const blur = MEDIA[v.poster]?.blur;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!mayAutoplay()) userChoice.current = userChoice.current ?? false;
    let visible = false;
    const sync = () => {
      const want = (userChoice.current ?? true) && visible && document.visibilityState === "visible";
      if (want && el.paused) el.play().catch(() => {});
      else if (!want && !el.paused) el.pause();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = Boolean(e?.isIntersecting);
      sync();
    }, { threshold: 0.35 });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    const on = () => setPlaying(true);
    const off = () => setPlaying(false);
    el.addEventListener("play", on);
    el.addEventListener("pause", off);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      el.removeEventListener("play", on);
      el.removeEventListener("pause", off);
    };
  }, []);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      userChoice.current = true;
      el.play().catch(() => {});
    } else {
      userChoice.current = false;
      el.pause();
    }
  };

  return (
    <div className={cn("group/video relative overflow-hidden bg-navy-950", className)}>
      <video
        ref={ref}
        src={videoUrl(video)}
        poster={posterUrl(video)}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        width={v.w}
        height={v.h}
        className={cn("h-full w-full", fit === "cover" ? "object-cover" : "object-contain")}
        style={blur ? { backgroundImage: `url(${blur})`, backgroundSize: "cover" } : undefined}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? (lang === "fr" ? "Mettre la vidéo en pause" : "Pause video") : lang === "fr" ? "Lire la vidéo" : "Play video"}
        className="absolute bottom-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-navy-950/70 text-ivory backdrop-blur-sm transition-[background-color,transform] duration-300 hover:bg-navy-950 active:scale-95"
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4 translate-x-px" aria-hidden />}
      </button>
    </div>
  );
}
