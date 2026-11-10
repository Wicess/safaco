import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VIDEO, videoInfo, type VideoKey } from "~/content/media-map";
import { mediaEntry } from "./Picture";
import type { Lang } from "~/lib/i18n";
import { cn } from "~/lib/utils";

const BASE = ((import.meta.env.VITE_MEDIA_BASE as string | undefined) || "/media").replace(/\/$/, "");
/** A built-in video key or an uploaded clip name → its file URL (uploads
 *  carry their own absolute R2 URL). */
export function videoUrl(ref: string) {
  return videoSrc(videoInfo(ref)?.src ?? "");
}

/** A stored video path (built-in file name or absolute R2 URL) → URL. */
export function videoSrc(src: string) {
  return /^https?:\/\//.test(src) ? src : `${BASE}/${src}`;
}

/** URL of the widest JPEG ≤ 720 px of a photo (built-in or uploaded). */
export function jpegUrl(name: string | undefined) {
  const m = name ? mediaEntry(name) : undefined;
  if (!m || !name) return undefined;
  const w = [...m.widths].reverse().find((x) => x <= 720) ?? m.widths[0];
  return `${(m.base ?? BASE).replace(/\/$/, "")}/${name}-${w}.jpg`;
}

/** Cover image URL of a video. */
export function posterUrl(ref: string) {
  return jpegUrl(videoInfo(ref)?.poster);
}

/** Autoplay is a courtesy, not a right: skipped for reduced motion and for
 *  visitors on Save-Data (common on Cameroonian mobile plans). */
function mayAutoplay() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  // Phones and tablets: a 2–3 MB clip should be the visitor's choice, not a
  // cost they pay for scrolling past (mobile data is paid by the megabyte in
  // Cameroon). They get the poster and a play button; nothing downloads.
  if (!window.matchMedia("(min-width: 64rem)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  return !conn?.effectiveType || conn.effectiveType === "4g";
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
  const [started, setStarted] = useState(false);
  // null = follow visibility; true/false = the visitor decided.
  const userChoice = useRef<boolean | null>(null);
  const v = VIDEO[video];
  const blur = mediaEntry(v.poster)?.blur;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (mayAutoplay()) setStarted(true);
    else userChoice.current = userChoice.current ?? false;
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
    const on = () => {
      setPlaying(true);
      setStarted(true);
    };
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
      {!started && (
        // Not autoplaying (phone, data saver, reduced motion): a clear,
        // thumb-sized invitation over the poster. Tapping loads the clip.
        <button
          type="button"
          onClick={toggle}
          aria-label={lang === "fr" ? "Lire la vidéo" : "Play video"}
          className="absolute inset-0 z-10 grid place-items-center bg-navy-950/15 transition-colors hover:bg-navy-950/25"
        >
          <span className="grid size-16 place-items-center rounded-full bg-ivory/90 text-navy-950 shadow-[0_4px_8px_rgb(12_21_28/0.3)] transition-transform duration-300 group-hover/video:scale-105">
            <Play className="size-6 translate-x-0.5 fill-current" aria-hidden />
          </span>
        </button>
      )}
      {started && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? (lang === "fr" ? "Mettre la vidéo en pause" : "Pause video") : lang === "fr" ? "Lire la vidéo" : "Play video"}
          className="absolute bottom-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-navy-950/70 text-ivory backdrop-blur-sm transition-[background-color,transform] duration-300 hover:bg-navy-950 active:scale-95"
        >
          {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4 translate-x-px" aria-hidden />}
        </button>
      )}
    </div>
  );
}
