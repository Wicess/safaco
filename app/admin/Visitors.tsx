import { ArrowLeft, ChevronLeft, ChevronRight, Monitor, RefreshCw, Search, Smartphone, Tablet } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { PAGES, PAGE_KEYS, type PageKey } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { api, errorText, type VisitRow, type VisitorRow, type VisitorsResult } from "./api";
import { Badge, Btn, PageTitle, Panel, Skeleton } from "./ui";

/*
 * Visitors: one row per phone or computer (a random id kept in the browser;
 * no names, no IP addresses). Modelled on the WHAM / MimosaLSD admin
 * directories. Reads only when opened or when "Refresh" is pressed: nothing
 * here refreshes on its own, so the database can sleep.
 */

const PERIODS = [1, 7, 30, 90] as const;
const PERIOD_LABEL: Record<number, string> = { 1: "24 hours", 7: "7 days", 30: "30 days", 90: "90 days" };

const regionName = (() => {
  let dn: Intl.DisplayNames | null = null;
  try {
    dn = new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    /* very old browser */
  }
  return (code: string | null) => (code ? (dn?.of(code) ?? code) : "Unknown");
})();

/** 🇨🇲 from "CM". */
const flag = (code: string | null) =>
  code && /^[A-Z]{2}$/.test(code) ? String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : "🌐";

const PAGE_NAME: Record<PageKey, string> = {
  home: "Home",
  construction: "Construction",
  plastering: "Plastering machine hire",
  scaffold: "Scaffolds & mast lifts",
  fabrication: "Materials fabrication",
  apartments: "Apartments",
  designs: "Designs",
  training: "Training centre",
  gallery: "Gallery",
  about: "About",
  contact: "Contact",
  thanks: "Enquiry sent",
  faq: "Questions",
  legal: "Legal notice",
  sitemap: "Site map",
};
/** "/fr/appartements" → { name: "Apartments", lang: "FR" } */
function pageLabel(path: string | null): { name: string; lang?: string } {
  if (!path) return { name: "—" };
  const clean = path.replace(/[?#].*$/, "").replace(/\/+$/, "") || "/";
  if (clean === "/") return { name: "Language choice" };
  for (const k of PAGE_KEYS) for (const l of ["en", "fr"] as const) if (PAGES[k].path[l] === clean) return { name: PAGE_NAME[k], lang: l.toUpperCase() };
  return { name: clean };
}

function source(ref: string | null): string {
  if (!ref) return "Direct";
  const r = ref.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  if (/google\./.test(r)) return "Google";
  if (/bing\./.test(r)) return "Bing";
  if (/facebook\.|fb\./.test(r)) return "Facebook";
  if (/instagram\./.test(r)) return "Instagram";
  if (/whatsapp|wa\.me/.test(r)) return "WhatsApp";
  if (/tiktok\./.test(r)) return "TikTok";
  if (/chatgpt|openai/.test(r)) return "ChatGPT";
  return r || "Direct";
}

function ago(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 90) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.round(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
const exact = (iso: string) => new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Douala" });
const place = (v: { city: string | null; region: string | null; country: string | null }) =>
  [v.city, v.city ? null : v.region, regionName(v.country)].filter(Boolean).join(", ");

function DeviceIcon({ device, className }: { device: string | null; className?: string }) {
  const I = device === "mobile" ? Smartphone : device === "tablet" ? Tablet : Monitor;
  return <I className={className} aria-hidden />;
}
const deviceName = (d: string | null) => (d === "mobile" ? "Phone" : d === "tablet" ? "Tablet" : d === "desktop" ? "Computer" : "Unknown");

/** Initials-style avatar from the random id: stable per visitor, no meaning. */
function Avatar({ id, size = "md" }: { id: string; size?: "md" | "lg" }) {
  const hue = parseInt(id.slice(0, 6), 16) % 360;
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-full font-semibold uppercase text-white", size === "lg" ? "size-14 text-lg" : "size-9 text-[0.75rem]")}
      style={{ background: `hsl(${Number.isFinite(hue) ? hue : 210} 32% 38%)` }}
    >
      {id.slice(0, 2)}
    </span>
  );
}

function Kpi({ label, value, hint, active, onClick }: { label: string; value?: number; hint?: string; active?: boolean; onClick?: () => void }) {
  const body = (
    <>
      <span className="block text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      <span className="tabular mt-1.5 block text-2xl font-semibold">{value === undefined ? "–" : value.toLocaleString("en-GB")}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
    </>
  );
  const cls = cn("min-w-[8.5rem] rounded-lg border bg-white p-4 text-left", active ? "border-navy-900 ring-1 ring-navy-900" : "border-ink/10");
  return onClick ? (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn(cls, "transition-colors hover:border-ink/30")}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

type Filters = { days: number; kind: "" | "new" | "returning"; device: string; lang: string; q: string; page: number };

export function Visitors() {
  const [f, setF] = useState<Filters>({ days: 30, kind: "", device: "", lang: "", q: "", page: 1 });
  const [qInput, setQInput] = useState("");
  const [data, setData] = useState<VisitorsResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (ff: Filters) => {
    setLoading(true);
    setErr(null);
    try {
      setData(await api.visitors(ff));
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load(f);
  }, [f, load]);
  const set = (p: Partial<Filters>) => setF((o) => ({ ...o, page: 1, ...p }));
  const s = data?.summary;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Visitors"
        intro="Each visitor is one phone or computer. No names, no IP addresses: just where they are, what they looked at and how they found the site. Nothing here refreshes on its own."
        actions={
          <>
            <div role="group" aria-label="Period" className="inline-flex rounded-md border border-ink/15 bg-white p-0.5">
              {PERIODS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={d === f.days}
                  onClick={() => set({ days: d })}
                  className={cn("min-h-11 rounded px-3 text-[0.8125rem] font-medium pointer-fine:min-h-9", d === f.days ? "bg-navy-900 text-ivory" : "text-ink/70 hover:text-ink")}
                >
                  {PERIOD_LABEL[d]}
                </button>
              ))}
            </div>
            <Btn type="button" onClick={() => load(f)} loading={loading} aria-label="Refresh">
              {!loading && <RefreshCw aria-hidden />} Refresh
            </Btn>
          </>
        }
      />

      {/* KPI strip: tiles double as filters. One scrolling row on phones. */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-3 sm:grid sm:min-w-0 sm:grid-cols-5">
          <Kpi label="Visitors" value={s?.visitors} active={f.kind === ""} onClick={() => set({ kind: "" })} />
          <Kpi label="New" value={s ? s.visitors - s.returning : undefined} hint="first visit" active={f.kind === "new"} onClick={() => set({ kind: "new" })} />
          <Kpi label="Returning" value={s?.returning} hint="came back" active={f.kind === "returning"} onClick={() => set({ kind: "returning" })} />
          <Kpi label="Visits" value={s?.visits} />
          <Kpi label="Pages viewed" value={s?.views} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <form
          className="relative flex-1 sm:min-w-56"
          onSubmit={(e) => {
            e.preventDefault();
            set({ q: qInput.trim() });
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Search a city or page (e.g. Douala, apartments)"
            aria-label="Search visitors by city or page"
            className="min-h-11 w-full rounded-md border border-ink/15 bg-white pl-9 pr-3 text-base text-ink placeholder:text-ink/40 focus:border-navy-700 focus:outline-none pointer-fine:min-h-10 pointer-fine:text-sm"
          />
        </form>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <select
            aria-label="Device"
            value={f.device}
            onChange={(e) => set({ device: e.target.value })}
            className="min-h-11 rounded-md border border-ink/15 bg-white px-3 text-base pointer-fine:min-h-10 pointer-fine:text-sm"
          >
            <option value="">All devices</option>
            <option value="mobile">Phones</option>
            <option value="tablet">Tablets</option>
            <option value="desktop">Computers</option>
          </select>
          <select
            aria-label="Language"
            value={f.lang}
            onChange={(e) => set({ lang: e.target.value })}
            className="min-h-11 rounded-md border border-ink/15 bg-white px-3 text-base pointer-fine:min-h-10 pointer-fine:text-sm"
          >
            <option value="">Both languages</option>
            <option value="fr">French site</option>
            <option value="en">English site</option>
          </select>
        </div>
        {(f.q || f.device || f.lang || f.kind) && (
          <button
            type="button"
            onClick={() => (setQInput(""), set({ q: "", device: "", lang: "", kind: "" }))}
            className="min-h-11 px-2 text-sm font-medium text-gold-600 underline-offset-4 hover:underline pointer-fine:min-h-9"
          >
            Clear filters
          </button>
        )}
      </div>

      {err && <p className="rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</p>}

      {loading && !data ? (
        <Skeleton className="h-72" />
      ) : data && data.visitors.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink/20 bg-white px-6 py-14 text-center text-[0.9375rem] text-muted">
          No visitors match. A visit appears here a few seconds after someone opens the site (your own visits while signed in are not counted).
        </div>
      ) : (
        data && (
          <section className="overflow-hidden rounded-lg border border-ink/10 bg-white" aria-label="Visitor list">
            {/* Desktop table */}
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="border-b border-ink/10 bg-[#faf8f4] text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Visitor</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Device</th>
                  <th className="px-4 py-3 font-semibold">Came from</th>
                  <th className="px-4 py-3 text-right font-semibold">Visits</th>
                  <th className="px-4 py-3 text-right font-semibold">Pages</th>
                  <th className="px-4 py-3 text-right font-semibold">Last seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/8">
                {data.visitors.map((v) => (
                  <tr key={v.id} className="group relative hover:bg-[#faf8f4]">
                    <td className="px-4 py-3">
                      <Link to={`/admin/visitors/${v.id}`} className="flex items-center gap-3 after:absolute after:inset-0" aria-label={`Open visitor ending ${v.id.slice(-6)}`}>
                        <Avatar id={v.id} />
                        <span>
                          <span className="tabular block font-mono text-[0.8125rem]">…{v.id.slice(-6)}</span>
                          <span className="mt-0.5 flex gap-1.5">
                            <Badge tone={v.returning ? "ok" : "neutral"}>{v.returning ? "Returning" : "New"}</Badge>
                            {v.lang && <Badge>{v.lang.toUpperCase()}</Badge>}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="mr-1.5" aria-hidden>
                        {flag(v.country)}
                      </span>
                      {place(v)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-ink/80">
                        <DeviceIcon device={v.device} className="size-4 text-muted" />
                        {deviceName(v.device)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block">{source(v.referrer)}</span>
                      <span className="block text-xs text-muted">landed on {pageLabel(v.landing).name}</span>
                    </td>
                    <td className="tabular px-4 py-3 text-right">{v.visits}</td>
                    <td className="tabular px-4 py-3 text-right">{v.views}</td>
                    <td className="px-4 py-3 text-right text-ink/80" title={exact(v.last)}>
                      {ago(v.last)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phone cards */}
            <ul className="divide-y divide-ink/8 md:hidden">
              {data.visitors.map((v) => (
                <li key={v.id}>
                  <Link to={`/admin/visitors/${v.id}`} className="flex gap-3 px-4 py-3.5 active:bg-[#faf8f4]">
                    <Avatar id={v.id} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-[0.9375rem] font-medium">
                        <span aria-hidden>{flag(v.country)}</span>
                        <span className="truncate">{place(v)}</span>
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                        <DeviceIcon device={v.device} className="size-3.5" /> {deviceName(v.device)} · {source(v.referrer)}
                      </span>
                      <span className="mt-1.5 flex flex-wrap gap-1.5">
                        <Badge tone={v.returning ? "ok" : "neutral"}>{v.returning ? "Returning" : "New"}</Badge>
                        {v.lang && <Badge>{v.lang.toUpperCase()}</Badge>}
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="tabular block text-lg font-semibold leading-tight">{v.views}</span>
                      <span className="block text-[0.6875rem] text-muted">{v.views === 1 ? "page" : "pages"}</span>
                      <span className="mt-1 block text-xs text-ink/70">{ago(v.last)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {data.pages > 1 && (
              <nav aria-label="Pages" className="flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-2 text-sm">
                <Btn type="button" size="sm" variant="ghost" disabled={f.page <= 1} onClick={() => setF((o) => ({ ...o, page: o.page - 1 }))}>
                  <ChevronLeft aria-hidden /> Newer
                </Btn>
                <span className="tabular text-muted">
                  Page {data.page} of {data.pages} · {data.total.toLocaleString("en-GB")} visitors
                </span>
                <Btn type="button" size="sm" variant="ghost" disabled={f.page >= data.pages} onClick={() => setF((o) => ({ ...o, page: o.page + 1 }))}>
                  Older <ChevronRight aria-hidden />
                </Btn>
              </nav>
            )}
          </section>
        )
      )}
    </div>
  );
}

/* ───────────────────────── One visitor ───────────────────────── */

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-1 text-[0.9375rem]">{children}</dd>
    </div>
  );
}

function duration(v: VisitRow) {
  const s = Math.max(0, (new Date(v.updatedAt).getTime() - new Date(v.createdAt).getTime()) / 1000);
  if (s < 60) return v.views > 1 ? "under a minute" : null;
  if (s < 3600) return `${Math.round(s / 60)} min`;
  return `${Math.floor(s / 3600)} h ${Math.round((s % 3600) / 60)} min`;
}

export function VisitorDetail({ id }: { id: string }) {
  const [visits, setVisits] = useState<VisitRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    api.visitor(id).then((r) => setVisits(r.visits), (e) => setErr(errorText(e)));
  }, [id]);

  const latest = visits?.[0];
  const first = visits?.[visits.length - 1];
  const views = visits?.reduce((a, v) => a + v.views, 0) ?? 0;

  return (
    <div className="space-y-6">
      <Link to="/admin/visitors" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All visitors
      </Link>
      {err && <p className="rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</p>}
      {!visits && !err && <Skeleton className="h-64" />}
      {latest && first && visits && (
        <>
          <section className="rounded-lg border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar id={id} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted">Visitor</p>
                <h1 className="tabular font-mono text-lg font-semibold" style={{ fontFamily: "ui-monospace, monospace" }}>
                  …{id.slice(-12)}
                </h1>
                <p className="mt-1 flex flex-wrap gap-1.5">
                  <Badge tone={visits.length > 1 || latest.returning ? "ok" : "neutral"}>{visits.length > 1 || latest.returning ? "Returning visitor" : "New visitor"}</Badge>
                  {latest.lang && <Badge>{latest.lang === "fr" ? "Reads the French site" : "Reads the English site"}</Badge>}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-5 border-t border-ink/8 pt-5 sm:grid-cols-4">
              <Info label="Visits">
                <span className="tabular text-xl font-semibold">{visits.length}</span>
              </Info>
              <Info label="Pages viewed">
                <span className="tabular text-xl font-semibold">{views}</span>
              </Info>
              <Info label="First seen">
                <span title={exact(first.createdAt)}>{exact(first.createdAt)}</span>
              </Info>
              <Info label="Last seen">
                <span title={exact(latest.updatedAt)}>{ago(latest.updatedAt)}</span>
              </Info>
            </dl>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <Panel title="Where they are">
              <p className="text-[0.9375rem]">
                <span className="mr-1.5" aria-hidden>
                  {flag(latest.country)}
                </span>
                {[latest.city, latest.region].filter(Boolean).join(", ") || "City unknown"}
              </p>
              <p className="mt-1 text-sm text-muted">{regionName(latest.country)}</p>
              <p className="mt-3 text-xs text-muted">From the network, about as precise as the city. The IP address is never stored.</p>
            </Panel>
            <Panel title="Device">
              <p className="inline-flex items-center gap-2 text-[0.9375rem]">
                <DeviceIcon device={latest.device} className="size-5 text-muted" /> {deviceName(latest.device)}
              </p>
            </Panel>
            <Panel title="How they found the site">
              <p className="text-[0.9375rem]">{source(first.referrer)}</p>
              <p className="mt-1 text-sm text-muted">
                First page: {pageLabel(first.landing).name}
                {pageLabel(first.landing).lang && ` (${pageLabel(first.landing).lang})`}
              </p>
            </Panel>
          </section>

          <Panel title="Visits" intro="Newest first. Each visit lists the pages in the order they were opened.">
            <ol className="relative space-y-6 before:absolute before:bottom-2 before:left-[0.4375rem] before:top-2 before:w-px before:bg-ink/12">
              {visits.map((v, i) => (
                <li key={v.id} className="relative pl-8">
                  <span aria-hidden className={cn("absolute left-0 top-1 size-[0.9375rem] rounded-full border-2 border-white", i === 0 ? "bg-gold-600" : "bg-ink/25")} />
                  <p className="text-[0.9375rem] font-medium">{exact(v.createdAt)}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {[source(v.referrer), deviceName(v.device), v.city ?? regionName(v.country), duration(v)].filter(Boolean).join(" · ")}
                  </p>
                  <ol className="mt-2.5 space-y-1">
                    {v.pages.map((p, j) => {
                      const l = pageLabel(p);
                      return (
                        <li key={`${p}-${j}`} className="flex items-baseline gap-2.5 text-sm">
                          <span className="tabular w-5 shrink-0 text-right text-xs text-muted">{j + 1}.</span>
                          <a href={p} target="_blank" rel="noopener" className="font-medium underline-offset-4 hover:underline">
                            {l.name}
                          </a>
                          {l.lang && <span className="text-[0.6875rem] font-semibold text-muted">{l.lang}</span>}
                        </li>
                      );
                    })}
                  </ol>
                </li>
              ))}
            </ol>
          </Panel>
        </>
      )}
    </div>
  );
}

export type { VisitorRow };
