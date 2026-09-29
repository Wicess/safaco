import { useId, useState } from "react";
import { PLASTER_RATES } from "~/content/construction";
import { DIVISIONS, waLink } from "~/content/site";
import type { Lang } from "~/lib/i18n";
import { WhatsAppIcon } from "../ui/icons";

const fmt = (n: number, lang: Lang) => new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { maximumFractionDigits: 1 }).format(n);

function estimate(m2: number) {
  const r = PLASTER_RATES;
  const machineDays = m2 / r.machinePerDay;
  const manualDays = m2 / (r.manualPerMasonDay * r.manualCrew);
  return { machineDays, manualDays, saved: Math.max(0, manualDays - machineDays) };
}

/**
 * Manual vs machine — time and crew only. Owner rule: no prices on the site.
 * Without JS the <noscript>-free fallback table (rendered in HTML) remains.
 */
export function PlasterCalculator({ lang }: { lang: Lang }) {
  const id = useId();
  const [m2, setM2] = useState(600);
  const e = estimate(m2 || 0);
  const r = PLASTER_RATES;
  const max = Math.max(e.manualDays, e.machineDays, 1);
  const msg =
    lang === "fr"
      ? `Bonjour SAFA Construction, j'ai environ ${m2} m² à crépir. Pouvez-vous m'envoyer un devis pour la machine à crépir automatique ?`
      : `Hello SAFA Construction, I have about ${m2} m² to render. Could you send me a quote for the automatic plastering machine?`;

  return (
    <div className="bg-ivory p-6 text-ink md:p-10">
      <label htmlFor={id} className="eyebrow text-gold-600">
        {lang === "fr" ? "Surface à crépir" : "Surface to render"}
      </label>
      <div className="mt-4 flex items-baseline gap-3">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={20}
          max={20000}
          step={10}
          value={m2}
          onChange={(ev) => setM2(Math.max(0, Math.min(20000, Number(ev.target.value))))}
          className="tabular w-40 border-b border-ink/30 bg-transparent font-display text-6xl leading-none outline-none focus:border-gold-600"
        />
        <span className="font-display text-3xl text-muted">m²</span>
      </div>
      <input
        type="range"
        aria-label={lang === "fr" ? "Surface en m²" : "Surface in m²"}
        min={50}
        max={5000}
        step={50}
        value={Math.min(5000, m2)}
        onChange={(ev) => setM2(Number(ev.target.value))}
        className="mt-6 w-full accent-[var(--color-gold-600)]"
      />

      <div className="mt-10 space-y-6" aria-live="polite">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm text-muted">
              {lang === "fr" ? `À la main · ${r.manualCrew} maçons` : `By hand · ${r.manualCrew} masons`}
            </p>
            <p className="tabular font-display text-3xl">
              {fmt(e.manualDays, lang)} <span className="text-base text-muted">{lang === "fr" ? "jours" : "days"}</span>
            </p>
          </div>
          <div aria-hidden className="mt-2 h-1.5 bg-ink/10">
            <div className="h-full bg-ink/40 transition-[width] duration-500" style={{ width: `${(e.manualDays / max) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm text-muted">
              {lang === "fr" ? `Machine SAFA · équipe de ${r.machineCrew}` : `SAFA machine · crew of ${r.machineCrew}`}
            </p>
            <p className="tabular font-display text-3xl text-gold-600">
              {fmt(e.machineDays, lang)} <span className="text-base text-muted">{lang === "fr" ? "jours" : "days"}</span>
            </p>
          </div>
          <div aria-hidden className="mt-2 h-1.5 bg-ink/10">
            <div className="h-full bg-gold transition-[width] duration-500" style={{ width: `${(e.machineDays / max) * 100}%` }} />
          </div>
        </div>
      </div>

      <p className="mt-8 border-t border-ink/10 pt-6 font-display text-2xl leading-snug">
        {lang === "fr" ? (
          <>
            Environ <strong className="font-semibold text-gold-600">{fmt(e.saved, lang)} jours</strong> de chantier gagnés.
          </>
        ) : (
          <>
            About <strong className="font-semibold text-gold-600">{fmt(e.saved, lang)} days</strong> saved on site.
          </>
        )}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {lang === "fr"
          ? `Estimation indicative : ${r.manualPerMasonDay} m²/jour par maçon, ${r.machinePerDay} m²/jour pour la machine. Le rendement réel dépend du support, de l'enduit et de l'accès ; nous l'évaluons lors de la visite.`
          : `Indicative estimate: ${r.manualPerMasonDay} m²/day per mason, ${r.machinePerDay} m²/day for the machine. Real output depends on the wall, the render and site access; we assess it during the site visit.`}
      </p>
      <a
        href={waLink(DIVISIONS.construction.whatsapp, msg)}
        rel="noopener"
        className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#1f7a4d] px-6 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#186540]"
      >
        <WhatsAppIcon className="size-5" />
        {lang === "fr" ? `Devis pour ${m2} m²` : `Quote for ${m2} m²`}
      </a>
    </div>
  );
}

/** Static version (in the HTML for crawlers and JS-off browsers). */
export function PlasterTable({ lang }: { lang: Lang }) {
  const rows = [200, 500, 1000, 2000];
  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">{lang === "fr" ? "Durée indicative : main vs machine" : "Indicative duration: by hand vs machine"}</caption>
      <thead>
        <tr className="border-b border-ink/15 text-muted">
          <th scope="col" className="py-3 font-medium">m²</th>
          <th scope="col" className="py-3 font-medium">{lang === "fr" ? `À la main (${PLASTER_RATES.manualCrew} maçons)` : `By hand (${PLASTER_RATES.manualCrew} masons)`}</th>
          <th scope="col" className="py-3 font-medium">{lang === "fr" ? "Machine SAFA" : "SAFA machine"}</th>
        </tr>
      </thead>
      <tbody className="tabular">
        {rows.map((m) => {
          const e = estimate(m);
          return (
            <tr key={m} className="border-b border-ink/10">
              <th scope="row" className="py-3 font-medium">{fmt(m, lang)}</th>
              <td className="py-3">
                {fmt(e.manualDays, lang)} {lang === "fr" ? "j" : "d"}
              </td>
              <td className="py-3 text-gold-600">
                {fmt(e.machineDays, lang)} {lang === "fr" ? "j" : "d"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
