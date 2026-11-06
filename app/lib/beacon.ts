import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Visit statistics for the admin dashboard, built to keep the bills flat:
 * page views collect in sessionStorage and go out in ONE beacon when the
 * visitor hides or leaves the tab (sendBeacon survives page unload). That is
 * one function call and one database write per visit, never one per page.
 * No cookie: a random id in localStorage tells new and returning visitors apart.
 * Skipped for the site owner's own browser (set at admin login) and for
 * automated browsers.
 */
const SESSION = "safa:visit";
const VISITOR = "safa:vid";
export const ADMIN_FLAG = "safa:admin";

type State = { sid: string; pages: string[]; sent: number; ret: boolean; ref: string };

const rid = () => (crypto.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 24);

function store<T>(s: Storage, key: string, v?: T): T | null {
  try {
    if (v !== undefined) s.setItem(key, JSON.stringify(v));
    const raw = s.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function disabled(): boolean {
  try {
    return navigator.webdriver || localStorage.getItem(ADMIN_FLAG) === "1";
  } catch {
    return true;
  }
}

function visitorId(): { vid: string; ret: boolean } {
  const existing = store<string>(localStorage, VISITOR);
  if (existing) return { vid: existing, ret: true };
  return { vid: store(localStorage, VISITOR, rid()) ?? rid(), ret: false };
}

function state(): State {
  const s = store<State>(sessionStorage, SESSION);
  if (s) return s;
  let ref = "";
  try {
    const r = document.referrer ? new URL(document.referrer) : null;
    if (r && r.host !== location.host) ref = r.host.replace(/^www\./, "");
  } catch {}
  return { sid: rid(), pages: [], sent: 0, ret: visitorId().ret, ref };
}

function device(): string {
  const w = Math.min(screen.width, window.innerWidth || screen.width);
  return w < 768 ? "mobile" : w < 1100 && matchMedia("(pointer: coarse)").matches ? "tablet" : "desktop";
}

function flush() {
  if (disabled()) return;
  const s = state();
  const fresh = s.pages.slice(s.sent);
  if (!fresh.length || !navigator.sendBeacon) return;
  const body = JSON.stringify({
    sid: s.sid,
    vid: visitorId().vid,
    ret: s.ret,
    pages: fresh,
    ref: s.sent === 0 ? s.ref : undefined,
    lang: (fresh[0] ?? "").startsWith("/fr") ? "fr" : "en",
    dev: device(),
  });
  if (navigator.sendBeacon("/api/hit", body)) store(sessionStorage, SESSION, { ...s, sent: s.pages.length });
}

export function useVisitBeacon() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (disabled() || pathname.startsWith("/admin")) return;
    const s = state();
    if (s.pages.at(-1) !== pathname) s.pages.push(pathname);
    if (s.pages.length > 200) s.pages = s.pages.slice(-200);
    store(sessionStorage, SESSION, s);
  }, [pathname]);

  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, []);
}
