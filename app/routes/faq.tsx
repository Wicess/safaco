import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList } from "~/components/sections/primitives";
import {
  APARTMENTS_FAQ,
  CONSTRUCTION_FAQ,
  DESIGNS_FAQ,
  FABRICATION_FAQ,
  GROUP_FAQ,
  PLASTERING_FAQ,
  SCAFFOLD_FAQ,
  TRAINING_FAQ,
  type Faq,
} from "~/content/faqs";
import { useLang } from "~/lib/hooks";
import { href, type PageKey, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "faq" as const, name: { en: "Questions", fr: "Questions" } }];

// De-duplicated by question text so each answer appears once on this page.
function uniq(list: Faq[]): Faq[] {
  const seen = new Set<string>();
  return list.filter((f) => (seen.has(f.q.en) ? false : (seen.add(f.q.en), true)));
}

const GROUPS: { id: string; title: T; page: PageKey; items: Faq[] }[] = [
  { id: "group", title: { en: "SAFA & Co", fr: "SAFA & Co" }, page: "about", items: GROUP_FAQ },
  {
    id: "construction",
    title: { en: "SAFA Construction", fr: "SAFA Construction" },
    page: "construction",
    items: uniq([...PLASTERING_FAQ, ...CONSTRUCTION_FAQ, ...SCAFFOLD_FAQ, ...FABRICATION_FAQ]),
  },
  { id: "apartments", title: { en: "SAFA Apartments", fr: "SAFA Apartments" }, page: "apartments", items: APARTMENTS_FAQ },
  { id: "designs", title: { en: "SAFA Designs", fr: "SAFA Designs" }, page: "designs", items: uniq([...DESIGNS_FAQ, ...TRAINING_FAQ]) },
];

export const meta = pageMeta({
  key: "faq",
  title: { en: "Questions & answers — SAFA & Co, Yaoundé", fr: "Questions & réponses — SAFA & Co, Yaoundé" },
  description: {
    en: "Answers about hiring automatic plastering machines and mast lifts, booking furnished apartments in Meyo, and made-to-measure tailoring and training at SAFA Designs.",
    fr: "Réponses sur la location de machines à crépir et de monte-charges, la réservation d'appartements meublés à Meyo, la couture sur mesure et la formation chez SAFA Designs.",
  },
  jsonLd: (lang) => [breadcrumb(lang, TRAIL), faqPage(lang, GROUPS.flatMap((g) => g.items))],
});

export default function FaqPage() {
  const lang = useLang();
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow={lang === "fr" ? "Questions fréquentes" : "Common questions"}
        title={lang === "fr" ? "Des réponses claires, avant même d'appeler." : "Clear answers, before you even call."}
        lede={
          lang === "fr"
            ? "Location de matériel, séjours, couture et formation : l'essentiel de ce que l'on nous demande."
            : "Equipment hire, stays, tailoring and training: the essentials of what people ask us."
        }
      >
        <nav aria-label={lang === "fr" ? "Rubriques" : "Sections"} className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="inline-flex min-h-10 items-center border border-ink/20 px-4 text-xs font-medium uppercase tracking-[0.12em] hover:border-ink">
              {g.title[lang]}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="py-12 md:py-20">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <h2 className="text-display-sm">{g.title[lang]}</h2>
              <Link to={href(g.page, lang)} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-ink">
                {lang === "fr" ? "Voir la page" : "See the page"} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <FaqList lang={lang} items={g.items} />
          </section>
        ))}
      </div>

      <CtaBand
        lang={lang}
        title={{ en: "Didn't find your answer?", fr: "Vous n'avez pas trouvé votre réponse ?" }}
        body={{ en: "Ask us directly — we reply on WhatsApp.", fr: "Posez-nous la question directement — nous répondons sur WhatsApp." }}
      />
    </>
  );
}
