import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { O } from "~/content/overrides";
import { DIVISION_LIST, MINEFOP, SITE, isTodo } from "~/content/site";
import { cn } from "~/lib/utils";
import { api, errorText, type Stat, type Stats } from "./api";
import { Btn, PageTitle, Skeleton } from "./ui";

const PERIODS = [7, 30, 90, 365] as const;
const COUNTRY: Record<string, string> = { CM: "Cameroon", FR: "France", US: "United States", GB: "United Kingdom", NG: "Nigeria", GA: "Gabon", TD: "Chad", CG: "Congo", CF: "Central African Rep.", GQ: "Equatorial Guinea", BE: "Belgium", DE: "Germany", CA: "Canada", CH: "Switzerland", CI: "Côte d'Ivoire", SN: "Senegal", "??": "Unknown" };
const fmt = (n: number) => n.toLocaleString("en-GB");

/**
 * Loaded once when opened (and on "Refresh"). No timer: an admin tab left
 * open all day must never keep the database awake.
 */
export function Dashboard() {
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (d: number) => {
    setLoading(true);
    setErr(null);
    try {
      setData(await api.stats(d));
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(days);
  }, [days, load]);

  const t = data?.totals;
  const p = data?.previous;
  const enquiries = data?.leads.reduce((a, b) => a + b.n, 0) ?? 0;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Dashboard"
        intro="Who visited the website, what they looked at and where they came from. One record per visit, sent when the visitor leaves."
        actions={
          <>
            <div role="group" aria-label="Period" className="inline-flex rounded-md border border-ink/15 bg-white p-0.5">
              {PERIODS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={d === days}
                  onClick={() => setDays(d)}
                  className={cn("min-h-9 rounded px-3 text-[0.8125rem] font-medium transition-colors", d === days ? "bg-navy-900 text-ivory" : "text-ink/70 hover:text-ink")}
                >
                  {d === 365 ? "1 year" : `${d} days`}
                </button>
              ))}
            </div>
            <Btn type="button" onClick={() => load(days)} loading={loading} aria-label="Refresh">
              {!loading && <RefreshCw aria-hidden />} Refresh
            </Btn>
          </>
        }
      />

      <LaunchChecklist />

      {err && <p className="rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Kpi label="Visits" value={t?.visits} prev={p?.visits} loading={loading} />
        <Kpi label="Page views" value={t?.views} prev={p?.views} loading={loading} />
        <Kpi label="Unique visitors" value={t?.visitors} prev={p?.visitors} loading={loading} />
        <Kpi label="Pages per visit" value={t && t.visits ? Math.round((t.views / t.visits) * 10) / 10 : t ? 0 : undefined} loading={loading} />
        <Kpi label="Enquiries" value={data ? enquiries : undefined} loading={loading} />
      </div>

      <section className="rounded-lg border border-ink/10 bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[0.9375rem] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>
            Visits per day
          </h2>
          {t && t.visits > 0 && (
            <p className="text-xs text-muted">
              {fmt(t.returning)} returning · {Math.round((t.bounces / t.visits) * 100)}% saw one page
            </p>
          )}
        </div>
        {loading && !data ? <Skeleton className="mt-5 h-48" /> : data && <DailyChart data={data} />}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <List title="Most viewed pages" rows={data?.pages} loading={loading} empty="No page views in this period yet." />
        <List title="Countries" rows={data?.countries.map((r) => ({ ...r, label: COUNTRY[r.label] ?? r.label }))} loading={loading} empty="No visits yet." />
        <List title="Cities" rows={data?.cities} loading={loading} empty="City appears once the site runs on Vercel." />
        <List title="Where visitors came from" rows={data?.referrers} loading={loading} empty="No visits yet." />
        <List title="Devices" rows={data?.devices.map((r) => ({ ...r, label: r.label[0]!.toUpperCase() + r.label.slice(1) }))} loading={loading} empty="No visits yet." />
        <List title="Language" rows={data?.langs.map((r) => ({ ...r, label: r.label === "fr" ? "French" : "English" }))} loading={loading} empty="No visits yet." />
        <List
          title="Enquiries by division"
          rows={data?.leads.map((r) => ({ ...r, label: r.label[0] + r.label.slice(1).toLowerCase() }))}
          loading={loading}
          empty="No enquiries in this period."
        />
      </div>
    </div>
  );
}

function Kpi({ label, value, prev, loading }: { label: string; value?: number; prev?: number; loading: boolean }) {
  const change = value !== undefined && prev !== undefined && prev > 0 ? Math.round(((value - prev) / prev) * 100) : null;
  return (
    <div className="rounded-lg border border-ink/10 bg-white px-4 py-4">
      <p className="text-[0.8125rem] text-muted">{label}</p>
      {loading && value === undefined ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <p className="tabular mt-1 text-[1.75rem] font-semibold leading-tight text-ink">{value !== undefined ? fmt(value) : "–"}</p>
      )}
      {change !== null && (
        <p className={cn("mt-1 inline-flex items-center gap-0.5 text-xs font-medium", change >= 0 ? "text-emerald-700" : "text-red-700")}>
          {change >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
          {Math.abs(change)}% vs previous period
        </p>
      )}
    </div>
  );
}

/** One series, one hue: thin bars with rounded tops, 2px gaps, a recessive
 *  axis, and a tooltip on every bar (with a hit area taller than the bar). */
function DailyChart({ data }: { data: Stats }) {
  const [hover, setHover] = useState<number | null>(null);
  // Fill missing days so gaps show as zero.
  const byDay = new Map(data.daily.map((d) => [d.day, d]));
  const series: { day: string; visits: number; views: number }[] = [];
  const end = new Date();
  const span = Math.min(data.days, 90);
  for (let i = span - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86_400_000);
    const key = d.toLocaleDateString("en-CA", { timeZone: "Africa/Douala" });
    series.push(byDay.get(key) ?? { day: key, visits: 0, views: 0 });
  }
  const max = Math.max(1, ...series.map((s) => s.visits));
  const nice = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
  const total = series.reduce((a, s) => a + s.visits, 0);
  const label = (day: string) => new Date(`${day}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  if (total === 0)
    return (
      <div className="mt-5 grid h-48 place-items-center rounded-md border border-dashed border-ink/15 text-center text-sm text-muted">
        <p>
          No visits recorded in this period yet.
          <br />
          Visits appear here a few seconds after someone leaves the site.
        </p>
      </div>
    );

  return (
    <figure className="mt-5">
      <div className="relative flex h-48 gap-3">
        <div className="tabular flex flex-col justify-between pb-5 text-right text-[0.6875rem] text-muted" aria-hidden>
          <span>{nice}</span>
          <span>{nice / 2}</span>
          <span>0</span>
        </div>
        <div className="relative flex-1">
          <div aria-hidden className="absolute inset-x-0 top-0 border-t border-ink/8" />
          <div aria-hidden className="absolute inset-x-0 top-[calc((100%-1.25rem)/2)] border-t border-ink/8" />
          <ol className="absolute inset-x-0 bottom-5 top-0 flex items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
            {series.map((s, i) => (
              <li
                key={s.day}
                className="relative flex h-full flex-1 items-end"
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                tabIndex={0}
                aria-label={`${label(s.day)}: ${s.visits} visits, ${s.views} page views`}
              >
                <span
                  className={cn("block w-full rounded-t-[4px] transition-colors duration-150", hover === i ? "bg-gold-600" : "bg-navy-700")}
                  style={{ height: s.visits ? `${Math.max(2, (s.visits / nice) * 100)}%` : 0 }}
                />
                {hover === i && (
                  <span
                    role="tooltip"
                    className={cn(
                      "pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-md bg-navy-950 px-2.5 py-1.5 text-xs text-ivory shadow-[0_2px_6px_rgb(12_21_28/0.25)]",
                      i > series.length * 0.7 ? "right-0" : i < series.length * 0.3 ? "left-0" : "left-1/2 -translate-x-1/2",
                    )}
                  >
                    <span className="block font-semibold">{label(s.day)}</span>
                    <span className="tabular">
                      {s.visits} visit{s.visits === 1 ? "" : "s"} · {s.views} view{s.views === 1 ? "" : "s"}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ol>
          <div className="tabular absolute inset-x-0 bottom-0 flex justify-between border-t border-ink/15 pt-1 text-[0.6875rem] text-muted" aria-hidden>
            <span>{label(series[0]!.day)}</span>
            <span>{label(series[series.length - 1]!.day)}</span>
          </div>
        </div>
      </div>
      {data.days > 90 && <figcaption className="mt-2 text-xs text-muted">Showing the last 90 days; the totals above cover the whole year.</figcaption>}
    </figure>
  );
}

function List({ title, rows, loading, empty }: { title: string; rows?: Stat[]; loading: boolean; empty: string }) {
  const max = Math.max(1, ...(rows ?? []).map((r) => r.n));
  return (
    <section className="rounded-lg border border-ink/10 bg-white">
      <h2 className="border-b border-ink/8 px-5 py-3.5 text-[0.9375rem] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>
        {title}
      </h2>
      {loading && !rows ? (
        <div className="space-y-2 p-5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6" />
          ))}
        </div>
      ) : !rows?.length ? (
        <p className="px-5 py-6 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-1 px-5 py-4">
          {rows.map((r) => (
            <li key={r.label} className="relative flex min-h-8 items-center justify-between gap-4 rounded px-2 text-sm">
              <span aria-hidden className="absolute inset-y-1 left-0 rounded-r-[4px] bg-navy-700/10" style={{ width: `${(r.n / max) * 100}%` }} />
              <span className="relative truncate text-ink">{r.label}</span>
              <span className="tabular relative shrink-0 text-ink/70">{fmt(r.n)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * What the published site is still missing. Read from the published content
 * (this page is rebuilt on every publish), so it empties as the owner fills
 * things in. Hidden entirely once nothing is left.
 */
function LaunchChecklist() {
  const items: { text: string; to: string }[] = [];
  for (const d of DIVISION_LIST) {
    if (!d.phone) items.push({ text: `${d.name}: phone number (Call buttons are hidden until set)`, to: `contact#c-${d.key}` });
    if (!d.whatsapp) items.push({ text: `${d.name}: WhatsApp number (WhatsApp buttons are hidden until set)`, to: `contact#c-${d.key}` });
    if (!d.address.mapsUrl) items.push({ text: `${d.name}: Google Maps link (adds “Directions”)`, to: `contact#c-${d.key}` });
  }
  if (isTodo(MINEFOP.agrement)) items.push({ text: "MINEFOP approval number (backs up “approved” on the Training page)", to: "contact#c-company" });
  if (isTodo(SITE.rccm) || isTodo(SITE.niu)) items.push({ text: "RCCM and NIU numbers (Legal page)", to: "contact#c-company" });
  if (!Object.values(SITE.social).some(Boolean)) items.push({ text: "At least one social media link", to: "contact#c-company" });
  if (!O.apartments?.amenities) items.push({ text: "Confirm the apartment amenities (only what the photos show is listed now)", to: "pages#amenities" });
  if (!O.construction?.machinePerDay) items.push({ text: "Your own plastering-machine output for the calculator", to: "pages#calculator" });
  if (!items.length) return null;
  const SHOWN = 4;
  const row = (i: { text: string; to: string }) => (
    <li key={i.text}>
      <Link to={`/admin/${i.to}`} className="flex min-h-11 items-center justify-between gap-3 py-2 text-sm hover:text-gold-600">
        {i.text} <span aria-hidden className="text-muted">→</span>
      </Link>
    </li>
  );
  return (
    <section className="rounded-lg border border-gold-600/30 bg-gold/8 p-5">
      <h2 className="text-[0.9375rem] font-semibold" style={{ fontFamily: "var(--font-sans)" }}>
        Still to fill in <span className="font-normal text-muted">· {items.length}</span>
      </h2>
      <p className="mt-1 text-xs text-muted">The site works without these, but each one makes it more complete or more trustworthy.</p>
      <ul className="mt-3 divide-y divide-ink/8">{items.slice(0, SHOWN).map(row)}</ul>
      {items.length > SHOWN && (
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center border-t border-ink/8 text-sm font-medium text-gold-600 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show {items.length - SHOWN} more</span>
            <span className="hidden group-open:inline">Show fewer</span>
          </summary>
          <ul className="divide-y divide-ink/8 border-t border-ink/8">{items.slice(SHOWN).map(row)}</ul>
        </details>
      )}
    </section>
  );
}
