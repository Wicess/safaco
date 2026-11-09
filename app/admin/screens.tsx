import { ArrowDown, ArrowUp, Eye, EyeOff, Mail, MapPin, Phone, Play, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { WhatsAppIcon } from "~/components/ui/icons";
import { Picture } from "~/components/ui/Picture";
import { HOME_HERO, HOUSE_IMAGES, PAGE_HEROES } from "~/content/defaults";
import { DEFAULT_GALLERY } from "~/content/gallery";
import { AMENITY_LIST, DEFAULT_AMENITIES } from "~/content/amenities";
import { PLASTER_RATES } from "~/content/construction";
import { IMG_DEFAULT, isStock } from "~/content/media-map";
import { PHOTO_SLOTS } from "~/content/photo-slots";
import type { DivisionKeyO, GalleryItemO, Overrides, PageHeroKey, TT } from "~/content/overrides";
import { DIVISIONS, MINEFOP, SITE, isTodo } from "~/content/site";
import { cn } from "~/lib/utils";
import { api, errorText, type Lead, type Status } from "./api";
import { useContent } from "./store";
import { Badge, BiField, Btn, ImagePicker, PageTitle, Panel, Skeleton, TextInput, UploadButton } from "./ui";

const DIVS: DivisionKeyO[] = ["construction", "apartments", "designs"];
const NAME: Record<DivisionKeyO, string> = { construction: "SAFA Construction", apartments: "SAFA Apartments", designs: "SAFA Designs" };

/** Defaults as the code knows them — before any published override. SITE and
 *  DIVISIONS already include published values, which is what the owner sees. */
const tval = (v: { en: string; fr: string } | Record<string, string>) => ({ en: v.en ?? "", fr: v.fr ?? "" });

/* ───────────────────────── Enquiries ───────────────────────── */

export function Enquiries() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      setLeads((await api.leads()).leads);
    } catch (e) {
      setErr(errorText(e));
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const shown = (leads ?? []).filter((l) => filter === "ALL" || l.division === filter);
  return (
    <div className="space-y-6">
      <PageTitle
        title="Enquiries"
        intro="Messages sent through the website's contact form, newest first. WhatsApp and phone calls go straight to your phones and don't appear here."
        actions={
          <Btn type="button" onClick={load} loading={loading}>
            {!loading && <RefreshCw aria-hidden />} Refresh
          </Btn>
        }
      />
      <div role="group" aria-label="Filter" className="flex flex-wrap gap-2">
        {["ALL", "CONSTRUCTION", "APARTMENTS", "DESIGNS", "GROUP"].map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn("min-h-11 rounded-full border px-4 pointer-fine:min-h-9 pointer-fine:px-3.5 text-[0.8125rem] font-medium", filter === f ? "border-navy-900 bg-navy-900 text-ivory" : "border-ink/15 bg-white text-ink/75 hover:border-ink/35")}
          >
            {f === "ALL" ? "All" : f[0] + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
      {err && <p className="rounded-md border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</p>}
      {loading && !leads ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : !shown.length ? (
        <p className="rounded-lg border border-dashed border-ink/15 bg-white px-5 py-10 text-center text-sm text-muted">
          No enquiries yet. When someone sends the contact form, it appears here and is emailed to you.
        </p>
      ) : (
        <ul className="space-y-3">
          {shown.map((l) => {
            const key = l.division.toLowerCase() as DivisionKeyO;
            const wa = l.phone.replace(/\D/g, "");
            return (
              <li key={l.id} className="rounded-lg border border-ink/10 bg-white p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-semibold text-ink">{l.name}</p>
                  <Badge tone={DIVS.includes(key) ? key : "neutral"}>{l.division[0] + l.division.slice(1).toLowerCase()}</Badge>
                  {l.topic && <Badge>{l.topic}</Badge>}
                  {!l.emailed && <Badge tone="warn">Email not sent</Badge>}
                  <span className="ml-auto text-xs text-muted">
                    {new Date(l.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Douala" })}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-line text-[0.9375rem] leading-relaxed text-ink/85">{l.message}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Btn size="sm" type="button" onClick={() => (location.href = `tel:${l.phone}`)}>
                    <Phone aria-hidden /> {l.phone}
                  </Btn>
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-11 items-center gap-2 rounded-md pointer-fine:min-h-8 bg-[#1f7a4d] px-3 text-[0.8125rem] font-medium text-white hover:bg-[#186540]"
                  >
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </a>
                  {l.email && (
                    <a href={`mailto:${l.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-md pointer-fine:min-h-8 border border-ink/15 px-3 text-[0.8125rem] font-medium hover:border-ink/35">
                      <Mail className="size-4" aria-hidden /> {l.email}
                    </a>
                  )}
                  {(l.city || l.country) && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                      <MapPin className="size-3.5" aria-hidden /> {[l.city, l.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {l.page && <span className="text-xs text-muted">from {l.page}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────── Home page ───────────────────────── */

export function HomeEditor() {
  const { content, update } = useContent();
  const h = content.home ?? {};
  const set = (k: keyof NonNullable<Overrides["home"]>, v: unknown) => update((c) => ({ ...c, home: { ...(c.home ?? {}), [k]: v } }));
  const title = `${h.heroTitle?.en || HOME_HERO.title.en} `;
  const em = h.heroEmphasis?.en || HOME_HERO.emphasis.en;
  return (
    <div className="space-y-6">
      <PageTitle title="Home page" intro="The first screen visitors see, and the photo used for each of the three businesses." />
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Panel title="Hero section" intro="The big headline is written in two parts: the normal words, then the gold italic ending.">
            <BiField label="Small line above the headline" value={h.heroEyebrow} defaults={HOME_HERO.eyebrow} onChange={(v) => set("heroEyebrow", v)} />
            <BiField label="Headline" value={h.heroTitle} defaults={HOME_HERO.title} onChange={(v) => set("heroTitle", v)} />
            <BiField label="Headline ending (gold italic)" value={h.heroEmphasis} defaults={HOME_HERO.emphasis} onChange={(v) => set("heroEmphasis", v)} />
            <BiField label="Introduction" value={h.heroLede} defaults={HOME_HERO.lede} onChange={(v) => set("heroLede", v)} multiline />
          </Panel>
          <Panel title="Photo for each business" intro="Shown in the hero and in each business's section on the home page.">
            <div className="grid gap-6 sm:grid-cols-3">
              {DIVS.map((d) => (
                <ImagePicker
                  key={d}
                  label={NAME[d]}
                  value={h.houseImages?.[d]}
                  fallback={HOUSE_IMAGES[d]}
                  onChange={(n) => set("houseImages", { ...(h.houseImages ?? {}), [d]: n })}
                />
              ))}
            </div>
          </Panel>
        </div>
        <aside className="xl:sticky xl:top-24 xl:self-start">
          <p className="mb-2 text-[0.8125rem] font-medium text-ink">Preview (English)</p>
          <div className="rounded-lg bg-navy-950 p-6 text-ivory">
            <p className="eyebrow text-gold-300">{h.heroEyebrow?.en || HOME_HERO.eyebrow.en}</p>
            <p className="mt-4 font-display text-[2.5rem] leading-[0.95]">
              {title}
              <em className="italic text-gold-300">{em}</em>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70">{h.heroLede?.en || HOME_HERO.lede.en}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───────────────────────── Page heroes ───────────────────────── */

export function PagesEditor() {
  const { content, update } = useContent();
  const keys = Object.keys(PAGE_HEROES) as PageHeroKey[];
  const set = (k: PageHeroKey, field: "title" | "lede" | "image", v: TT | string | undefined) =>
    update((c) => ({ ...c, pages: { ...(c.pages ?? {}), [k]: { ...(c.pages?.[k] ?? {}), [field]: v } } }));
  return (
    <div className="space-y-6">
      <PageTitle title="Page headers" intro="The title, introduction and main photo at the top of each page, plus the apartment amenities and the plastering calculator figures." />
      <nav aria-label="Pages" className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <a key={k} href={`#page-${k}`} className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink/75 hover:border-ink/35">
            {PAGE_HEROES[k].label}
          </a>
        ))}
      </nav>
      {keys.map((k) => {
        const d = PAGE_HEROES[k];
        const o = content.pages?.[k];
        const video = k === "construction" || k === "designs";
        return (
          <Panel key={k} id={`page-${k}`} title={d.label}>
            <BiField label="Title" value={o?.title} defaults={d.title} onChange={(v) => set(k, "title", v)} />
            <BiField label="Introduction" value={o?.lede} defaults={d.lede} onChange={(v) => set(k, "lede", v)} multiline />
            {k !== "gallery" && (
              <ImagePicker
                label="Main photo"
                hint={video ? "This page shows a video by default. Choose a photo to replace it, or reset to bring the video back." : undefined}
                value={o?.image}
                fallback={d.image}
                onChange={(n) => set(k, "image", n)}
              />
            )}
            {k === "apartments" && <AmenitiesField />}
            {k === "plastering" && <RatesField />}
          </Panel>
        );
      })}
    </div>
  );
}

/** Which amenities the Apartments page lists. Only confirmed ones should be ticked. */
function AmenitiesField() {
  const { content, update } = useContent();
  const chosen = new Set<string>(content.apartments?.amenities ?? DEFAULT_AMENITIES);
  const toggle = (key: string) =>
    update((c) => {
      const next = new Set<string>(c.apartments?.amenities ?? DEFAULT_AMENITIES);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...c, apartments: { ...(c.apartments ?? {}), amenities: AMENITY_LIST.map((a) => a.key).filter((k) => next.has(k)) } };
    });
  return (
    <fieldset id="amenities" className="scroll-mt-32">
      <legend className="block text-[0.8125rem] font-medium text-ink">Amenities shown</legend>
      <p className="mt-1 text-xs text-muted">Tick only what every guest really gets. Until you change this, the site lists just what the photos show.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {AMENITY_LIST.map((a) => (
          <label key={a.key} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-ink/12 bg-white px-3 text-[0.9375rem] has-checked:border-apartments/60">
            <input type="checkbox" className="size-4 accent-[var(--color-apartments)]" checked={chosen.has(a.key)} onChange={() => toggle(a.key)} />
            {a.label.en} <span className="text-muted">· {a.label.fr}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** The plastering calculator's output figures: SAFA's own measurements. */
function RatesField() {
  const { content, update } = useContent();
  const c0 = content.construction ?? {};
  const set = (k: "machinePerDay" | "manualPerMasonDay", v: string) => {
    const n = Number(v.replace(",", "."));
    update((c) => ({ ...c, construction: { ...(c.construction ?? {}), [k]: v.trim() && Number.isFinite(n) && n > 0 ? n : undefined } }));
  };
  return (
    <div id="calculator" className="grid scroll-mt-32 gap-5 md:grid-cols-2">
      <TextInput
        label="Calculator: machine output (m² per day)"
        type="number"
        value={c0.machinePerDay?.toString()}
        placeholder={String(PLASTER_RATES.machinePerDay)}
        onChange={(v) => set("machinePerDay", v)}
        hint="What one machine and its crew really render in a day on your sites."
      />
      <TextInput
        label="Calculator: one mason by hand (m² per day)"
        type="number"
        value={c0.manualPerMasonDay?.toString()}
        placeholder={String(PLASTER_RATES.manualPerMasonDay)}
        onChange={(v) => set("manualPerMasonDay", v)}
      />
    </div>
  );
}

/* ───────────────────────── Photos ───────────────────────── */

export function PhotosEditor() {
  const { content, update } = useContent();
  const set = (k: string, v: string | undefined) =>
    update((c) => {
      const images = { ...(c.images ?? {}) };
      if (v) images[k] = v;
      else delete images[k];
      return { ...c, images };
    });
  return (
    <div className="space-y-6">
      <PageTitle
        title="Photos"
        intro="Every other photo on the website, page by page. Upload your own or pick one from the library; “Reset” brings back the original. Photos marked Illustrative are stock images, so replacing them with your own is the best upgrade."
      />
      <nav aria-label="Pages" className="flex flex-wrap gap-2">
        {PHOTO_SLOTS.map((g, i) => (
          <a key={g.group} href={`#photos-${i}`} className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink/75 hover:border-ink/35">
            {g.group}
          </a>
        ))}
      </nav>
      {PHOTO_SLOTS.map((g, i) => (
        <Panel key={g.group} id={`photos-${i}`} title={g.group}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3">
            {g.items.map((it) => {
              const value = content.images?.[it.key] || undefined;
              const shown = value ?? IMG_DEFAULT[it.key];
              return (
                <ImagePicker
                  key={it.key}
                  label={it.label}
                  hint={
                    <>
                      {it.where}
                      {shown && isStock(shown) && (
                        <span className="ml-2 align-middle">
                          <Badge tone="warn">Illustrative</Badge>
                        </span>
                      )}
                    </>
                  }
                  value={value}
                  fallback={IMG_DEFAULT[it.key] || undefined}
                  empty="No photo yet"
                  onChange={(n) => set(it.key, n)}
                />
              );
            })}
          </div>
        </Panel>
      ))}
    </div>
  );
}

/* ───────────────────────── Contact & details ───────────────────────── */

export function ContactEditor() {
  const { content, update } = useContent();
  const co = content.company ?? {};
  const setCo = (k: string, v: unknown) => update((c) => ({ ...c, company: { ...(c.company ?? {}), [k]: v } }));
  const setDiv = (d: DivisionKeyO, k: string, v: unknown) =>
    update((c) => ({ ...c, divisions: { ...(c.divisions ?? {}), [d]: { ...(c.divisions?.[d] ?? {}), [k]: v } } }));
  const ph = (v: string) => (isTodo(v) ? "" : v);
  return (
    <div className="space-y-6">
      <PageTitle
        title="Contact & details"
        intro="Phone numbers, WhatsApp, email, addresses and hours. They appear everywhere on the site: the header buttons, the footer, the contact page and Google's business data."
      />
      <nav aria-label="Sections" className="flex flex-wrap gap-2">
        {[["company", "Company"], ...DIVS.map((d) => [d, NAME[d]])].map(([id, l]) => (
          <a key={id} href={`#c-${id}`} className="rounded-full border border-ink/15 bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink/75 hover:border-ink/35">
            {l}
          </a>
        ))}
      </nav>
      <Panel id="c-company" title="Company">
        <div className="grid gap-5 md:grid-cols-2">
          <TextInput label="Main email" type="email" value={co.email} placeholder={SITE.email} onChange={(v) => setCo("email", v)} hint="Shown on the site. Enquiries are emailed from the server's mailbox." />
          <TextInput label="MINEFOP approval number" value={co.minefop} placeholder={ph(MINEFOP.agrement) || "Not set: hidden"} onChange={(v) => setCo("minefop", v)} />
          <TextInput label="RCCM number" value={co.rccm} placeholder={ph(SITE.rccm) || "Not set: hidden"} onChange={(v) => setCo("rccm", v)} />
          <TextInput label="NIU (tax number)" value={co.niu} placeholder={ph(SITE.niu) || "Not set: hidden"} onChange={(v) => setCo("niu", v)} />
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {(["facebook", "instagram", "tiktok", "linkedin"] as const).map((s) => (
            <TextInput
              key={s}
              label={s[0]!.toUpperCase() + s.slice(1)}
              type="url"
              value={co.social?.[s]}
              placeholder={SITE.social[s] || "https://… (empty = hidden)"}
              onChange={(v) => setCo("social", { ...(co.social ?? {}), [s]: v })}
            />
          ))}
        </div>
      </Panel>
      {DIVS.map((d) => {
        const def = DIVISIONS[d];
        const o = content.divisions?.[d] ?? {};
        return (
          <Panel key={d} id={`c-${d}`} title={NAME[d]}>
            <div className="grid gap-5 md:grid-cols-3">
              <TextInput label="Phone" type="tel" value={o.phone} placeholder={def.phone || "Not set: visitors see the enquiry form"} onChange={(v) => setDiv(d, "phone", v)} hint="As visitors should read it, e.g. +237 6 70 98 66 43" />
              <TextInput label="WhatsApp number" type="tel" value={o.whatsapp} placeholder={def.whatsapp || "Not set: no WhatsApp button"} onChange={(v) => setDiv(d, "whatsapp", v)} hint="With country code, e.g. 237670986643" />
              <TextInput label="Email" type="email" value={o.email} placeholder={def.email} onChange={(v) => setDiv(d, "email", v)} />
            </div>
            <BiField label="Address" value={o.addressLine} defaults={tval(def.address.line)} onChange={(v) => setDiv(d, "addressLine", v)} />
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput label="District" value={o.district} placeholder={def.address.district} onChange={(v) => setDiv(d, "district", v)} />
              <TextInput
                label="Google Maps link"
                type="url"
                value={o.mapsUrl}
                placeholder={def.address.mapsUrl ?? "https://maps.app.goo.gl/…"}
                onChange={(v) => setDiv(d, "mapsUrl", v)}
                hint="In Google Maps: Share → Copy link. Adds a “Directions” link."
              />
            </div>
            <BiField label="Opening hours" value={o.hours} defaults={tval(def.hours)} onChange={(v) => setDiv(d, "hours", v)} />
            <BiField label="One-line description" value={o.tagline} defaults={tval(def.tagline)} onChange={(v) => setDiv(d, "tagline", v)} multiline />
          </Panel>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Gallery ───────────────────────── */

export function GalleryEditor() {
  const { content, update } = useContent();
  const items: GalleryItemO[] = content.gallery ?? (DEFAULT_GALLERY as GalleryItemO[]);
  const [division, setDivision] = useState<DivisionKeyO>("apartments");
  const [show, setShow] = useState<"all" | DivisionKeyO>("all");
  const setItems = (fn: (list: GalleryItemO[]) => GalleryItemO[]) => update((c) => ({ ...c, gallery: fn(structuredClone(c.gallery ?? (DEFAULT_GALLERY as GalleryItemO[]))) }));
  const patch = (id: string, p: Partial<GalleryItemO>) => setItems((l) => l.map((g) => (g.id === id ? { ...g, ...p } : g)));
  const move = (id: string, dir: -1 | 1) =>
    setItems((l) => {
      const i = l.findIndex((g) => g.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= l.length) return l;
      [l[i], l[j]] = [l[j]!, l[i]!];
      return l;
    });
  const shown = items.filter((g) => show === "all" || g.division === show);
  return (
    <div className="space-y-6">
      <PageTitle
        title="Gallery"
        intro="Every photo and video on the Gallery page and in each business's photo strip. Write a short caption in both languages for every photo: it is what blind visitors and Google read."
      />
      <Panel title="Add photos" intro="Photos are resized and optimised automatically. Choose which business they belong to first.">
        <div className="flex flex-wrap items-end gap-3">
          <label className="text-[0.8125rem] font-medium text-ink">
            Business
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value as DivisionKeyO)}
              className="mt-1.5 block min-h-11 rounded-md border border-ink/15 bg-white px-3 text-base pointer-fine:min-h-10 pointer-fine:text-sm"
            >
              {DIVS.map((d) => (
                <option key={d} value={d}>
                  {NAME[d]}
                </option>
              ))}
            </select>
          </label>
          <UploadButton
            onUploaded={(names) =>
              setItems((l) => [...names.map((n) => ({ id: n, division, image: n, alt: { en: "", fr: "" } }) satisfies GalleryItemO), ...l])
            }
          />
        </div>
      </Panel>

      <div role="group" aria-label="Show" className="flex flex-wrap items-center gap-2">
        {(["all", ...DIVS] as const).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={show === f}
            onClick={() => setShow(f)}
            className={cn("min-h-11 rounded-full border px-4 pointer-fine:min-h-9 pointer-fine:px-3.5 text-[0.8125rem] font-medium", show === f ? "border-navy-900 bg-navy-900 text-ivory" : "border-ink/15 bg-white text-ink/75 hover:border-ink/35")}
          >
            {f === "all" ? `All (${items.length})` : `${NAME[f].replace("SAFA ", "")} (${items.filter((g) => g.division === f).length})`}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {shown.map((g) => {
          const idx = items.indexOf(g);
          const missing = !g.alt.en.trim() || !g.alt.fr.trim();
          return (
            <li
              key={g.id}
              className={cn(
                "grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-3 rounded-lg border bg-white p-3 sm:grid-cols-[7rem_1fr] sm:gap-x-4 sm:p-4",
                g.hidden ? "border-dashed border-ink/20 opacity-70" : "border-ink/10",
              )}
            >
              <div className="relative self-start overflow-hidden rounded-md bg-stone sm:row-span-2">
                <Picture name={g.image} alt="" sizes="112px" ratio="3/4" />
                {g.video && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-navy-950/80 px-2 py-0.5 text-[0.6875rem] font-semibold text-ivory">
                    <Play className="size-2.5 fill-current" aria-hidden /> Video
                  </span>
                )}
              </div>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Business"
                    value={g.division}
                    onChange={(e) => patch(g.id, { division: e.target.value as DivisionKeyO })}
                    className="min-h-11 rounded-md border border-ink/15 bg-white px-2 text-base pointer-fine:min-h-8 pointer-fine:text-[0.8125rem]"
                  >
                    {DIVS.map((d) => (
                      <option key={d} value={d}>
                        {NAME[d].replace("SAFA ", "")}
                      </option>
                    ))}
                  </select>
                  {g.hidden && <Badge>Hidden</Badge>}
                  {missing && <Badge tone="warn">Caption needed</Badge>}
                </div>
                <div className="flex flex-wrap gap-1">
                  <Btn size="sm" variant="ghost" type="button" aria-label="Move earlier" disabled={idx === 0} onClick={() => move(g.id, -1)}>
                    <ArrowUp aria-hidden />
                  </Btn>
                  <Btn size="sm" variant="ghost" type="button" aria-label="Move later" disabled={idx === items.length - 1} onClick={() => move(g.id, 1)}>
                    <ArrowDown aria-hidden />
                  </Btn>
                  <Btn size="sm" variant="ghost" type="button" onClick={() => patch(g.id, { hidden: !g.hidden })}>
                    {g.hidden ? <Eye aria-hidden /> : <EyeOff aria-hidden />} {g.hidden ? "Show" : "Hide"}
                  </Btn>
                  <Btn
                    size="sm"
                    variant="ghost"
                    type="button"
                    className="text-red-800 hover:bg-red-50 hover:text-red-900"
                    onClick={() => {
                      if (confirm("Remove this from the gallery? If it was uploaded here, the file is deleted when you next publish.")) setItems((l) => l.filter((x) => x.id !== g.id));
                    }}
                  >
                    <Trash2 aria-hidden /> Delete
                  </Btn>
                </div>
              </div>
              <div className="col-span-2 space-y-2 sm:col-span-1 sm:col-start-2">
                {(["en", "fr"] as const).map((l) => (
                  <label key={l} className="relative block">
                    <span className="pointer-events-none absolute right-2 top-1.5 rounded bg-ink/6 px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink/55">{l}</span>
                    <span className="sr-only">Caption ({l})</span>
                    <textarea
                      lang={l}
                      rows={2}
                      value={g.alt[l]}
                      placeholder={l === "en" ? "Caption in English" : "Légende en français"}
                      onChange={(e) => patch(g.id, { alt: { ...g.alt, [l]: e.target.value } })}
                      className="min-h-[5.25rem] w-full resize-y rounded-md border border-ink/15 py-1.5 pl-2.5 pr-10 text-base pointer-fine:min-h-0 leading-snug placeholder:text-ink/40 focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/15 pointer-fine:sm:text-[0.8125rem]"
                    />
                  </label>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────────────────────── Account ───────────────────────── */

export function Account({ user, onLogout }: { user: { email: string; name: string }; onLogout: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    api.status().then(setStatus, () => {});
  }, []);
  return (
    <div className="space-y-6">
      <PageTitle title="Account" intro={`Signed in as ${user.name} (${user.email}).`} actions={<Btn type="button" onClick={onLogout}>Sign out</Btn>} />
      <Panel title="Change password">
        <form
          className="grid max-w-md gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMsg(null);
            try {
              await api.password(current, next);
              setMsg({ ok: true, text: "Password changed." });
              setCurrent("");
              setNext("");
            } catch (err) {
              setMsg({ ok: false, text: errorText(err) });
            } finally {
              setBusy(false);
            }
          }}
        >
          <TextInput label="Current password" type="password" autoComplete="current-password" value={current} onChange={setCurrent} />
          <TextInput label="New password" type="password" autoComplete="new-password" value={next} onChange={setNext} hint="At least 10 characters." />
          {msg && <p className={cn("text-sm", msg.ok ? "text-emerald-800" : "text-red-800")}>{msg.text}</p>}
          <div>
            <Btn variant="primary" type="submit" loading={busy} disabled={!current || next.length < 10}>
              Change password
            </Btn>
          </div>
        </form>
      </Panel>
      <Panel title="System" intro="What the admin panel is connected to.">
        {!status ? (
          <Skeleton className="h-24" />
        ) : (
          <ul className="space-y-2 text-sm">
            {[
              [status.storage, "Photo & content storage (Cloudflare R2)"],
              [status.database, "Database (Neon): enquiries and visit statistics"],
              [status.deployHook, "Automatic publishing (Vercel deploy hook)"],
              [status.analytics, "Visit statistics recording"],
            ].map(([ok, label]) => (
              <li key={String(label)} className="flex items-center gap-2">
                <Badge tone={ok ? "ok" : "warn"}>{ok ? "Connected" : "Not set"}</Badge> {label}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
