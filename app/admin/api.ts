import type { MediaEntry, Overrides } from "~/content/overrides";

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
  stats: (days: number) => call<Stats>(`/stats?days=${days}`),
  leads: () => call<{ leads: Lead[] }>("/leads?take=200"),
  upload: (file: Blob, name: string) =>
    call<{ name: string; entry: MediaEntry }>(`/upload?name=${encodeURIComponent(name)}`, {
      method: "POST",
      body: file,
      headers: { "content-type": file.type || "image/jpeg" },
    }),
};

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
