import type { ClipEntry, MediaEntry, Overrides } from "~/content/overrides";

/** Thin fetch wrapper for /api/admin/*. Errors carry the server's code. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}

async function call<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  const res = await fetch(`/api/admin${path}`, {
    credentials: "same-origin",
    ...rest,
    headers: { ...(json !== undefined ? { "content-type": "application/json" } : {}), ...(rest.headers ?? {}) },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  });
  let data: { ok?: boolean; error?: string } & Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {}
  if (!res.ok || data.ok === false) throw new ApiError(res.status, data.error ?? `http_${res.status}`);
  return data as T;
}

export type User = { email: string; name: string };
export type VisitorRow = {
  id: string; visits: number; views: number; first: string; last: string; returning: boolean;
  country: string | null; region: string | null; city: string | null; device: string | null; lang: string | null; referrer: string | null; landing: string | null;
};
export type VisitorsResult = {
  days: number; page: number; pages: number; total: number;
  summary: { visitors: number; returning: number; visits: number; views: number; today: number };
  visitors: VisitorRow[];
};
export type VisitRow = {
  id: string; createdAt: string; updatedAt: string; returning: boolean; landing: string; pages: string[]; views: number;
  lang: string | null; referrer: string | null; device: string | null; country: string | null; region: string | null; city: string | null;
};

export type Status = { storage: boolean; database: boolean; deployHook: boolean; analytics: boolean; email?: boolean };
export type Stat = { label: string; n: number };
export type Stats = {
  days: number;
  totals: { visits: number; views: number; visitors: number; returning: number; bounces: number };
  previous: { visits: number; views: number; visitors: number };
  daily: { day: string; visits: number; views: number }[];
  pages: Stat[];
  countries: Stat[];
  cities: Stat[];
  referrers: Stat[];
  devices: Stat[];
  langs: Stat[];
  leads: Stat[];
};
export type Lead = {
  id: string;
  createdAt: string;
  division: string;
  topic: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  lang: string;
  page: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  emailed: boolean;
};

export const api = {
  me: () => call<{ user: User }>("/me"),
  login: (email: string, password: string) => call<{ user: User }>("/login", { method: "POST", json: { email, password } }),
  logout: () => call("/logout", { method: "POST", json: {} }),
  password: (current: string, next: string) => call("/password", { method: "POST", json: { current, next } }),
  testEmail: () => call<{ to: string }>("/test-email", { method: "POST", json: {} }),
  account: (name: string, email: string, current: string) => call<{ user: User }>("/account", { method: "POST", json: { name, email, current } }),
  status: () => call<Status>("/status"),
  content: () => call<{ content: Overrides; publishedAt: string | null; unpublished: boolean }>("/content"),
  save: (content: Overrides) => call<{ updatedAt: string }>("/content", { method: "PUT", json: { content } }),
  publish: () => call<{ publishedAt: string; deploying: boolean; removed: number }>("/publish", { method: "POST", json: {} }),
  discard: () => call("/discard", { method: "POST", json: {} }),
  visitors: (f: { days: number; kind: string; device: string; lang: string; q: string; page: number }) =>
    call<VisitorsResult>(`/visitors?${new URLSearchParams(Object.entries(f).filter(([, v]) => v !== "" && v != null).map(([k, v]) => [k, String(v)]))}`),
  visitor: (id: string) => call<{ visits: VisitRow[] }>(`/visitors/${encodeURIComponent(id)}`),
  stats: (days: number) => call<Stats>(`/stats?days=${days}`),
  leads: () => call<{ leads: Lead[] }>("/leads?take=200"),
  upload: (file: Blob, name: string) =>
    call<{ name: string; entry: MediaEntry }>(`/upload?name=${encodeURIComponent(name)}`, {
      method: "POST",
      body: file,
      headers: { "content-type": file.type || "image/jpeg" },
    }),
  videoChunk: (id: string, i: number, part: Blob) =>
    call(`/video/chunk?id=${id}&i=${i}`, { method: "POST", body: part, headers: { "content-type": "application/octet-stream" } }),
  videoFinish: (b: { id: string; parts: number; type: string; name: string; w: number; h: number; duration: number; poster: string }) =>
    call<{ name: string; clip: ClipEntry }>("/video/finish", { method: "POST", json: b }),
};

/* ── Videos ── */

/** Largest file stored (after compression). */
export const MAX_VIDEO_MB = 60;
/** Largest file accepted from the phone when it can compress it first. */
export const MAX_SOURCE_MB = 600;
/** Each piece stays under Vercel's 4.5 MB request limit. */
const CHUNK = 3.5 * 1024 * 1024;

/** The stored type: MP4 (incl. .m4v), MOV or WebM; anything else is refused. */
export function videoType(file: File): string | null {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  if (file.type === "video/mp4" || file.type === "video/x-m4v" || ext === "mp4" || ext === "m4v") return "video/mp4";
  if (file.type === "video/quicktime" || ext === "mov") return "video/quicktime";
  if (file.type === "video/webm" || ext === "webm") return "video/webm";
  return null;
}

function waitFor(el: HTMLVideoElement, event: string, ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const done = (ok: boolean) => {
      clearTimeout(t);
      el.removeEventListener(event, onOk);
      el.removeEventListener("error", onErr);
      ok ? resolve() : reject(new ApiError(0, "unplayable_video"));
    };
    const onOk = () => done(true);
    const onErr = () => done(false);
    const t = setTimeout(() => done(false), ms);
    el.addEventListener(event, onOk);
    el.addEventListener("error", onErr);
  });
}

/**
 * Opens the video in this browser before anything is uploaded: proves it
 * plays, reads its size and length, and takes a frame (about 1 s in) as the
 * cover image.
 */
export async function probeVideo(file: File): Promise<{ w: number; h: number; duration: number; cover: Blob }> {
  const url = URL.createObjectURL(file);
  const v = document.createElement("video");
  v.muted = true;
  v.playsInline = true;
  v.preload = "auto";
  v.src = url;
  try {
    await waitFor(v, "loadedmetadata", 20_000);
    const w = v.videoWidth;
    const h = v.videoHeight;
    if (!w || !h) throw new ApiError(0, "unplayable_video");
    // Some phones decode no frame until playback starts.
    await v.play().catch(() => {});
    v.pause();
    const at = Math.min(1, (v.duration || 0) * 0.1);
    if (Math.abs(v.currentTime - at) > 0.05) {
      v.currentTime = at;
      await waitFor(v, "seeked", 15_000);
    }
    const scale = Math.min(1, 1600 / Math.max(w, h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas.getContext("2d")!.drawImage(v, 0, 0, canvas.width, canvas.height);
    const cover = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new ApiError(0, "unplayable_video"))), "image/jpeg", 0.86));
    return { w, h, duration: Number.isFinite(v.duration) ? v.duration : 0, cover };
  } finally {
    v.removeAttribute("src");
    v.load();
    URL.revokeObjectURL(url);
  }
}

/**
 * Re-encodes the video on this device (WebCodecs, hardware-accelerated on
 * phones) before upload: H.264 at Mediabunny's "high" quality, which looked
 * the same as the source in side-by-side tests at about half the size; at
 * most 1080p; no sound (the site plays videos silently); index first for a
 * fast start. Returns null when this browser can't do it or it wouldn't save
 * at least 10% — the original is then uploaded as before.
 */
export async function compressVideo(file: File, w: number, h: number, onProgress: (fraction: number) => void): Promise<{ file: File; w: number; h: number } | null> {
  if (typeof VideoEncoder === "undefined" || typeof VideoDecoder === "undefined") return null;
  let lock: { release: () => Promise<void> } | undefined;
  try {
    // Keep the phone's screen on while it works.
    lock = await (navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock?.request("screen").catch(() => undefined);
    const M = await import("mediabunny");
    const input = new M.Input({ source: new M.BlobSource(file), formats: M.ALL_FORMATS });
    const output = new M.Output({ format: new M.Mp4OutputFormat({ fastStart: "in-memory" }), target: new M.BufferTarget() });
    const even = (n: number) => Math.max(2, Math.round(n / 2) * 2);
    const scale = Math.min(1, 1080 / Math.min(w, h));
    const ow = even(w * scale);
    const oh = even(h * scale);
    const conv = await M.Conversion.init({
      input,
      output,
      audio: { discard: true },
      video: { codec: "avc", quality: new M.Quality("high"), forceTranscode: true, keyFrameInterval: 2, width: ow, height: oh, fit: "fill" },
      showWarnings: false,
    });
    if (!conv.isValid) return null;
    conv.onProgress = (p) => onProgress(p);
    await conv.execute();
    const buf = output.target.buffer;
    if (!buf || buf.byteLength > file.size * 0.9) return null;
    return { file: new File([buf], `${file.name.replace(/\.[^.]+$/, "")}.mp4`, { type: "video/mp4" }), w: ow, h: oh };
  } catch (e) {
    console.warn("[video] compression skipped", e);
    return null;
  } finally {
    await lock?.release().catch(() => {});
  }
}

/** iPhone "High Efficiency" (HEVC) video: plays on iPhones and recent
 *  Android phones, but not everywhere. Looks for the codec tag near the start
 *  and end of the file, where MP4/MOV keep their index. */
export async function isHevc(file: File): Promise<boolean> {
  const span = 2 * 1024 * 1024;
  const parts = [file.slice(0, span), file.slice(Math.max(0, file.size - span))];
  for (const p of parts) {
    const text = new TextDecoder("latin1").decode(await p.arrayBuffer());
    if (text.includes("hvc1") || text.includes("hev1")) return true;
  }
  return false;
}

/** Sends the file in pieces (one retry each), then has the server join them. */
export async function sendVideo(
  file: File,
  meta: { type: string; name: string; w: number; h: number; duration: number; poster: string },
  onProgress: (fraction: number) => void,
) {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, "0")).join("");
  const parts = Math.ceil(file.size / CHUNK);
  for (let i = 0; i < parts; i++) {
    const part = file.slice(i * CHUNK, (i + 1) * CHUNK);
    try {
      await api.videoChunk(id, i, part);
    } catch (e) {
      if (e instanceof ApiError && e.status && e.status < 500) throw e;
      await api.videoChunk(id, i, part);
    }
    onProgress((i + 1) / parts);
  }
  return api.videoFinish({ id, parts, ...meta });
}

/** Shrink a photo in the browser before upload: ≤ 2000 px, JPEG ~0.86.
 *  Keeps uploads small on mobile data and under the 4 MB function limit. */
export async function shrinkImage(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode"))), "image/jpeg", 0.86));
}

export const ERRORS: Record<string, string> = {
  invalid_credentials: "That email and password don't match.",
  too_many_attempts: "Too many attempts. Wait 15 minutes and try again.",
  database_not_configured: "The database isn't connected (DATABASE_URL).",
  storage_not_configured: "File storage isn't connected (R2_* variables).",
  wrong_password: "Your current password is not correct.",
  password_too_short: "Use at least 10 characters.",
  unreadable_image: "That file couldn't be read as a photo. Try a JPEG or PNG.",
  unplayable_video: "This video doesn't play in this browser, so visitors might not be able to play it either. Save or export it as MP4 and try again.",
  unreadable_video: "That file isn't a video we can use. Choose an MP4, MOV or WebM file.",
  video_too_large: "That video is too large (over 60 MB once optimised). Trim it or send a shorter clip: under 20 MB loads best on phones.",
  upload_incomplete: "Part of the video didn't arrive. Check your connection and try again.",
  unauthorized: "Your session has ended. Sign in again.",
  nothing_to_publish: "There are no changes to publish.",
  session_not_configured: "Sign-in isn't set up on the server: SESSION_SECRET is missing in Vercel (Settings → Environment Variables), or is shorter than 32 characters. Add it and redeploy.",
  login_failed: "Sign-in failed on the server. Try again in a moment.",
  server_error: "The server hit an error. Try again in a moment.",
  name_required: "Enter a name.",
  smtp_not_configured: "Email isn't set up: SMTP_HOST, SMTP_USER or SMTP_PASS is missing in Vercel.",
  smtp_auth: "The mailbox refused the password. In Vercel, set SMTP_PASS to the password of sales@safaandcosarl.com exactly (no quotes or spaces), then redeploy. If unsure, set a new mailbox password in Hostinger → Emails first.",
  smtp_connection: "Couldn't reach the mail server (smtp.hostinger.com, port 465). Check SMTP_HOST and SMTP_PORT in Vercel.",
  smtp_address: "The mail server rejected the sender or recipient address. Check MAIL_FROM and LEADS_TO_DEFAULT in Vercel.",
  smtp_failed: "Sending failed for another reason. Try again in a minute.",
  invalid_email: "Enter a valid email address.",
  email_taken: "Another admin account already uses that email.",
};
export const errorText = (e: unknown) => (e instanceof ApiError ? (ERRORS[e.code] ?? `Something went wrong (${e.code}).`) : "Network error. Check your connection.");
