import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { PageHero } from "~/components/sections/PageHero";
import { DIVISIONS } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { href, type PageKey, type T } from "~/lib/i18n";
import { breadcrumb, pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "sitemap" as const, name: { en: "Site map", fr: "Plan du site" } }];

export const meta = pageMeta({
  key: "sitemap",
  title: { en: "Site map — SAFA & Co, Yaoundé", fr: "Plan du site — SAFA & Co, Yaoundé" },
  description: {
    en: "Every page of the SAFA & Co website: plastering machine and mast-lift hire, furnished apartments in Meyo, tailoring and training, gallery and contact.",
    fr: "Toutes les pages du site SAFA & Co : location de machines à crépir et monte-charges, appartements meublés à Meyo, couture et formation, galerie et contact.",
  },
  jsonLd: (lang) => [breadcrumb(lang, TRAIL)],
});

type Entry = { page: PageKey; name: T; note: T };

const GROUPS: { title: T; accent?: string; entries: Entry[] }[] = [
  {
    title: { en: "SAFA & Co", fr: "SAFA & Co" },
    entries: [
      { page: "home", name: { en: "Home", fr: "Accueil" }, note: { en: "The three houses at a glance", fr: "Les trois maisons en un coup d’œil" } },
      { page: "about", name: { en: "About", fr: "À propos" }, note: { en: "Who we are, in Yaoundé", fr: "Qui nous sommes, à Yaoundé" } },
      { page: "gallery", name: { en: "Gallery", fr: "Galerie" }, note: { en: "Our machines, apartments and garments", fr: "Nos machines, appartements et tenues" } },
      { page: "faq", name: { en: "Questions", fr: "Questions" }, note: { en: "Answers before you call", fr: "Les réponses, avant même d’appeler" } },
      { page: "contact", name: { en: "Contact", fr: "Contact" }, note: { en: "Call, WhatsApp, email or the form", fr: "Appel, WhatsApp, e-mail ou formulaire" } },
    ],
  },
  {
    title: { en: "SAFA Construction", fr: "SAFA Construction" },
    accent: DIVISIONS.construction.accentVar,
    entries: [
      { page: "construction", name: { en: "Equipment hire", fr: "Location de matériel" }, note: { en: "The fleet, delivered in Yaoundé", fr: "Notre parc de machines, livré à Yaoundé" } },
      { page: "plastering", name: { en: "Plastering machine hire", fr: "Location de machine à crépir" }, note: { en: "With the surface calculator", fr: "Avec l’estimation de durée du chantier" } },
      { page: "scaffold", name: { en: "Scaffolds & mast lifts", fr: "Échafaudages et monte-charges" }, note: { en: "Access at height", fr: "Accès en hauteur" } },
      { page: "fabrication", name: { en: "Materials fabrication", fr: "Fabrication de matériaux" }, note: { en: "Machine-made materials", fr: "Matériaux fabriqués à la machine" } },
    ],
  },
  {
    title: { en: "SAFA Apartments", fr: "SAFA Apartments" },
    accent: DIVISIONS.apartments.accentVar,
    entries: [
      { page: "apartments", name: { en: "Furnished apartments", fr: "Appartements meublés" }, note: { en: "Meyo, Yaoundé IV", fr: "Meyo, Yaoundé IV" } },
    ],
  },
  {
    title: { en: "SAFA Designs", fr: "SAFA Designs" },
    accent: DIVISIONS.designs.accentVar,
    entries: [
      { page: "designs", name: { en: "Made-to-measure tailoring", fr: "Couture sur mesure" }, note: { en: "Carrefour MEEC, Yaoundé VI", fr: "Carrefour MEEC, Yaoundé VI" } },
      { page: "training", name: { en: "Training centre", fr: "Centre de formation" }, note: { en: "MINEFOP-approved", fr: "Agréé MINEFOP" } },
    ],
  },
  {
    title: { en: "Information", fr: "Informations" },
    entries: [
      { page: "legal", name: { en: "Legal notice", fr: "Mentions légales" }, note: { en: "Company details and photo credits", fr: "Informations légales et crédits photo" } },
    ],
  },
];

export default function SitemapPage() {
  const lang = useLang();
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow={lang === "fr" ? "Plan du site" : "Site map"}
        title={lang === "fr" ? "Toutes nos pages, en un coup d’œil." : "Every page, at a glance."}
        lede={
          lang === "fr"
            ? "Trois maisons, une seule adresse : allez droit à la page qu’il vous faut."
            : "Three houses, one address: go straight to the page you need."
        }
      />

      <section className="pb-20 pt-10 md:pb-28 md:pt-14">
        <div className="container-x grid gap-x-12 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {GROUPS.map((g) => (
            <nav key={g.title.en} aria-label={g.title[lang]} style={g.accent ? { ["--accent" as string]: g.accent } : undefined}>
              <h2 className="flex items-center gap-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em]" style={{ color: g.accent ? "var(--accent)" : "var(--color-gold-600)" }}>
                <span aria-hidden className="h-px w-6 bg-current" />
                {g.title[lang]}
              </h2>
              <ul className="mt-5 border-t border-ink/12">
                {g.entries.map((e) => (
                  <li key={e.page} className="border-b border-ink/12">
                    <Link to={href(e.page, lang)} className="group flex min-h-16 items-center justify-between gap-4 py-3">
                      <span>
                        <span className="block font-display text-[1.375rem] leading-tight transition-colors group-hover:text-gold-600">{e.name[lang]}</span>
                        <span className="mt-0.5 block text-sm text-muted">{e.note[lang]}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-600" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="container-x mt-14 text-sm text-muted">
          {lang === "fr" ? "Pour les moteurs de recherche : " : "For search engines: "}
          <a href="/sitemap.xml" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-ink">
            sitemap.xml
          </a>
        </p>
      </section>
    </>
  );
}
