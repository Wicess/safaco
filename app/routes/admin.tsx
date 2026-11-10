import { BarChart3, ExternalLink, Home, Image as ImageIcon, Images, Inbox, Users, LayoutTemplate, Loader2, Menu, Phone, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { ApiError, api, errorText, type User } from "~/admin/api";
import { Dashboard } from "~/admin/Dashboard";
import { VisitorDetail, Visitors } from "~/admin/Visitors";
import { Account, ContactEditor, Enquiries, GalleryEditor, HomeEditor, PagesEditor, PhotosEditor } from "~/admin/screens";
import { ContentProvider, useContent } from "~/admin/store";
import { Btn } from "~/admin/ui";
import { ADMIN_FLAG } from "~/lib/beacon";
import { cn } from "~/lib/utils";

export const meta = () => [{ title: "Admin · SAFA & Co" }, { name: "robots", content: "noindex, nofollow" }];

const NAV = [
  { path: "", label: "Dashboard", icon: BarChart3, group: "Overview" },
  { path: "visitors", label: "Visitors", icon: Users, group: "Overview" },
  { path: "enquiries", label: "Enquiries", icon: Inbox, group: "Overview" },
  { path: "home", label: "Home page", icon: Home, group: "Website" },
  { path: "pages", label: "Page headers", icon: LayoutTemplate, group: "Website" },
  { path: "contact", label: "Contact & details", icon: Phone, group: "Website" },
  { path: "gallery", label: "Gallery", icon: ImageIcon, group: "Website" },
  { path: "photos", label: "Photos", icon: Images, group: "Website" },
  { path: "account", label: "Account", icon: UserRound, group: "Settings" },
] as const;
const EDITS = new Set(["home", "pages", "contact", "gallery", "photos"]);

function flagAdmin(on: boolean) {
  try {
    if (on) localStorage.setItem(ADMIN_FLAG, "1");
  } catch {}
}

export default function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  // Only a real "not signed in" (401) shows the sign-in form. A dropped
  // connection or a server hiccup keeps the session and offers a retry, so a
  // phone on a weak network is never pushed back to the login screen.
  const [offline, setOffline] = useState(false);
  const check = () => {
    setOffline(false);
    api.me().then(
      (r) => {
        flagAdmin(true);
        setUser(r.user);
      },
      (e) => (e instanceof ApiError && e.status === 401 ? setUser(null) : setOffline(true)),
    );
  };
  useEffect(check, []);
  if (offline && user === undefined)
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory p-6 text-center">
        <div>
          <p className="text-[0.9375rem]">Couldn't reach the server. Check your connection.</p>
          <button type="button" onClick={check} className="mt-4 inline-flex min-h-11 items-center rounded-md bg-navy-900 px-5 text-sm font-medium text-ivory">
            Try again
          </button>
        </div>
      </div>
    );
  if (user === undefined)
    return (
      <div className="grid min-h-dvh place-items-center bg-ivory">
        <Loader2 className="size-6 animate-spin text-muted" aria-label="Loading" />
      </div>
    );
  if (!user) return <Login onIn={(u) => (flagAdmin(true), setUser(u))} />;
  return (
    <ContentProvider>
      <Shell user={user} onUser={setUser} onLogout={async () => (await api.logout().catch(() => {}), setUser(null))} />
    </ContentProvider>
  );
}

function Login({ onIn }: { onIn: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      onIn((await api.login(email, password)).user);
    } catch (x) {
      setErr(errorText(x));
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="on-dark grid min-h-dvh place-items-center bg-navy-950 px-5 py-12 text-ivory">
      <div className="w-full max-w-sm">
        <img src="/brand/safa-monogram-light-sm.png" alt="" width={42} height={64} className="mx-auto h-16 w-auto" />
        <h1 className="mt-6 text-center font-display text-3xl">SAFA &amp; Co admin</h1>
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-lg bg-ivory p-6 text-ink">
          <label className="block text-[0.8125rem] font-medium">
            Email
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 block w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-base focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15" />
          </label>
          <label className="block text-[0.8125rem] font-medium">
            Password
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 block w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-base focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15" />
          </label>
          {err && (
            <p role="alert" className="text-sm text-red-800">
              {err}
            </p>
          )}
          <Btn variant="primary" type="submit" loading={busy} className="w-full">
            Sign in
          </Btn>
        </form>
        <p className="mt-6 text-center text-xs text-ivory/50">
          <a href="/en" className="underline-offset-4 hover:underline">
            ← Back to the website
          </a>
        </p>
      </div>
    </main>
  );
}

function Shell({ user, onUser, onLogout }: { user: User; onUser: (u: User) => void; onLogout: () => void }) {
  const { pathname, hash } = useLocation();
  const [section = "", sub] = pathname.replace(/^\/admin\/?/, "").split("/");
  const [drawer, setDrawer] = useState(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    setDrawer(false);
    main.current?.focus({ preventScroll: true });
    if (!hash) window.scrollTo(0, 0);
  }, [section, sub, hash]);
  // Deep links (e.g. from the dashboard checklist): the editor loads its
  // content first, so wait a moment for the target panel to exist.
  useEffect(() => {
    if (!hash) return;
    let tries = 0;
    let raf = 0;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ block: "start" });
      else if (tries++ < 120) raf = requestAnimationFrame(find);
    };
    find();
    return () => cancelAnimationFrame(raf);
  }, [section, hash]);

  const screen: Record<string, ReactNode> = {
    "": <Dashboard />,
    visitors: sub ? <VisitorDetail id={sub} /> : <Visitors />,
    enquiries: <Enquiries />,
    home: <HomeEditor />,
    pages: <PagesEditor />,
    contact: <ContactEditor />,
    gallery: <GalleryEditor />,
    photos: <PhotosEditor />,
    account: <Account user={user} onUser={onUser} onLogout={onLogout} />,
  };

  return (
    <div className="min-h-dvh bg-[#f7f5f0] text-ink" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Desktop sidebar */}
      <aside className="on-dark fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-navy-950 text-ivory lg:flex">
        <Sidebar user={user} section={section} />
      </aside>
      {/* Mobile top bar + drawer */}
      <header className="on-dark sticky top-0 z-30 flex h-14 items-center justify-between bg-navy-950 px-4 text-ivory lg:hidden">
        <span className="font-display text-lg">SAFA &amp; Co · Admin</span>
        <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="grid size-11 place-items-center rounded-md hover:bg-ivory/10">
          <Menu className="size-5" aria-hidden />
        </button>
      </header>
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="admin-scrim absolute inset-0 bg-navy-950/60" onClick={() => setDrawer(false)} />
          <aside className="admin-drawer on-dark absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-navy-950 text-ivory">
            <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-3 grid size-11 place-items-center rounded-md hover:bg-ivory/10">
              <X className="size-5" aria-hidden />
            </button>
            <Sidebar user={user} section={section} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        {EDITS.has(section) && <PublishBar />}
        <main ref={main} tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 outline-none md:px-8 md:py-10">
          {EDITS.has(section) ? <Editing>{screen[section]}</Editing> : (screen[section] ?? <NotFound />)}
        </main>
      </div>
      <Toast />
    </div>
  );
}

function Sidebar({ user, section }: { user: User; section: string }) {
  let last = "";
  return (
    <>
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <img src="/brand/safa-monogram-light-sm.png" alt="" width={21} height={32} className="h-8 w-auto" />
        <div>
          <p className="font-display text-lg leading-none">SAFA &amp; Co</p>
          <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.16em] text-ivory/55">Admin</p>
        </div>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3">
        {NAV.map((n) => {
          const head = n.group !== last ? n.group : null;
          last = n.group;
          const active = section === n.path;
          const Icon = n.icon;
          return (
            <div key={n.path}>
              {head && <p className="px-3 pb-1.5 pt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ivory/45">{head}</p>}
              <Link
                to={`/admin${n.path ? `/${n.path}` : ""}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm pointer-fine:min-h-10 transition-colors duration-150",
                  active ? "bg-ivory/12 font-medium text-ivory" : "text-ivory/70 hover:bg-ivory/6 hover:text-ivory",
                )}
              >
                <Icon className={cn("size-4", active ? "text-gold-300" : "text-ivory/50")} aria-hidden />
                {n.label}
              </Link>
            </div>
          );
        })}
      </nav>
      <div className="border-t border-ivory/10 p-4">
        <a href="/en" target="_blank" rel="noopener" className="flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-ivory/70 pointer-fine:min-h-10 hover:bg-ivory/6 hover:text-ivory">
          <ExternalLink className="size-4" aria-hidden /> View the website
        </a>
        <p className="mt-2 truncate px-2 text-xs text-ivory/45">{user.email}</p>
      </div>
    </>
  );
}

/** Content screens wait for the draft to load. */
function Editing({ children }: { children: ReactNode }) {
  const { phase, error, reload } = useContent();
  if (phase === "loading")
    return (
      <div className="space-y-4" aria-busy>
        <div className="h-10 w-64 animate-pulse rounded-md bg-ink/8" />
        <div className="h-64 animate-pulse rounded-lg bg-ink/6" />
        <div className="h-48 animate-pulse rounded-lg bg-ink/6" />
      </div>
    );
  if (phase === "error")
    return (
      <div className="rounded-lg border border-red-700/20 bg-red-50 p-6 text-sm text-red-900">
        <p>{error}</p>
        <Btn className="mt-4" type="button" onClick={reload}>
          Try again
        </Btn>
      </div>
    );
  return <>{children}</>;
}

function PublishBar() {
  const { dirty, unpublished, publishedAt, busy, save, publish, discard, phase } = useContent();
  const nav = useNavigate();
  if (phase !== "ready") return null;
  const state = dirty ? "Unsaved changes" : unpublished ? "Saved, not yet live" : "Everything is live";
  return (
    <div className="sticky top-14 z-20 border-b border-ink/10 bg-white/95 backdrop-blur lg:top-0">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 md:px-8">
        <span className={cn("size-2 rounded-full", dirty ? "bg-amber-500" : unpublished ? "bg-gold" : "bg-emerald-600")} aria-hidden />
        <p className="text-sm font-medium text-ink">{state}</p>
        {publishedAt && !dirty && !unpublished && (
          <p className="hidden text-xs text-muted sm:block">
            Last published {new Date(publishedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Douala" })}
          </p>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          {(unpublished || dirty) && (
            <Btn
              size="sm"
              variant="ghost"
              type="button"
              loading={busy === "discard"}
              onClick={() => confirm("Throw away every change that isn't live yet?") && discard().then(() => nav(0))}
            >
              Discard
            </Btn>
          )}
          <Btn size="sm" type="button" disabled={!dirty} loading={busy === "save"} onClick={save}>
            Save draft
          </Btn>
          <Btn size="sm" variant="gold" type="button" disabled={!dirty && !unpublished} loading={busy === "publish"} onClick={publish}>
            Publish
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Toast() {
  const { notice } = useContent();
  if (!notice) return null;
  return (
    <div
      role={notice.kind === "error" ? "alert" : "status"}
      className={cn(
        "fixed bottom-4 left-1/2 z-50 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg px-4 py-3 text-sm shadow-[0_4px_8px_rgb(12_21_28/0.2)]",
        notice.kind === "error" ? "bg-red-900 text-white" : "bg-navy-950 text-ivory",
      )}
    >
      {notice.text}
    </div>
  );
}

function NotFound() {
  return <p className="text-muted">This page doesn't exist. Choose a section from the menu.</p>;
}
