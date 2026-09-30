import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, TraceLine } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { IMG } from "~/content/media-map";
import { useLang } from "~/lib/hooks";
import { href, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta, service } from "~/lib/seo";
import { FABRICATION_FAQ } from "~/content/faqs";

const TRAIL = [
  { key: "construction" as const, name: { en: "SAFA Construction", fr: "SAFA Construction" } },
  { key: "fabrication" as const, name: { en: "Materials fabrication", fr: "Fabrication de matériaux" } },
];

/** CLIENT_TODO: confirm the exact product list, formats and whether delivery is offered. */
const PRODUCTS: { name: T; body: T }[] = [
  {
    name: { en: "Concrete blocks", fr: "Parpaings" },
    body: {
      en: "Machine-moulded blocks for walls, with regular dimensions from one batch to the next.",
      fr: "Parpaings moulés à la machine pour vos murs, aux dimensions régulières d'un lot à l'autre.",
    },
  },
  {
    name: { en: "Other formats on request", fr: "Autres formats sur demande" },
    body: {
      en: "Tell us what your project needs — format, quantity and timing — and we'll tell you what we can produce.",
      fr: "Dites-nous ce dont votre projet a besoin — format, quantité et délai — et nous vous dirons ce que nous pouvons produire.",
    },
  },
];


export const meta = pageMeta({
  key: "fabrication",
  title: {
    en: "Machine-Made Construction Materials, Yaoundé | SAFA",
    fr: "Fabrication mécanisée de matériaux, Yaoundé | SAFA",
  },
  description: {
    en: "SAFA Construction produces construction materials by machine in Yaoundé for consistent dimensions. Tell us the product, quantity and site — quote on request.",
    fr: "Matériaux de construction fabriqués à la machine à Yaoundé, aux dimensions régulières. Indiquez produit, quantité et chantier : devis sur demande.",
  },
  image: "/og/fabrication.jpg",
  jsonLd: (lang) => [
    breadcrumb(lang, TRAIL),
    service(lang, {
      key: "fabrication",
      name: { en: "Mechanised fabrication of construction materials", fr: "Fabrication mécanisée de matériaux de construction" },
      description: {
        en: "Construction materials produced by machine in Yaoundé.",
        fr: "Matériaux de construction produits à la machine à Yaoundé.",
      },
      division: "construction",
      fn: "Sell",
    }),
    faqPage(lang, FABRICATION_FAQ),
  ],
});

export default function Fabrication() {
  const lang = useLang();
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow={lang === "fr" ? "Fabrication mécanisée" : "Mechanised fabrication"}
        title={lang === "fr" ? "Des matériaux réguliers, faits à la machine." : "Consistent materials, made by machine."}
        lede={
          lang === "fr"
            ? "Nous produisons des matériaux de construction à la machine : des dimensions régulières d'une pièce à l'autre, pour des murs plus droits et plus rapides à monter."
            : "We produce construction materials by machine: the same dimensions from one piece to the next, for walls that go up straighter and faster."
        }
        image={IMG.blocks}
        imageAlt={lang === "fr" ? "Parpaings empilés sur un chantier" : "Concrete blocks stacked on site"}
      >
        <Button asChild variant="primary">
          <Link to={`${href("contact", lang)}?d=construction`}>
            {lang === "fr" ? "Demander un devis" : "Request a quote"} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <SectionHead index="01" eyebrow={lang === "fr" ? "Production" : "Products"} title={lang === "fr" ? "Ce que nous fabriquons." : "What we make."} />
          <ul className="divide-y divide-ink/12 border-y border-ink/12">
            {PRODUCTS.map((p) => (
              <li key={p.name.en} className="py-8" data-reveal>
                <h3 className="text-[1.875rem]">{p.name[lang]}</h3>
                <p className="mt-3 max-w-lg text-muted">{p.body[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x grid gap-10 md:grid-cols-12 md:items-end">
          <Picture name={IMG.mixer} alt={lang === "fr" ? "Production de matériaux à la machine" : "Materials being produced by machine"} className="grain aspect-[4/3] md:col-span-7" sizes="(min-width: 48rem) 58vw, 100vw" />
          <div className="md:col-span-5" data-reveal>
            <TraceLine className="mb-8 w-16" />
            <p className="font-display text-[1.75rem] leading-snug md:text-[2.25rem]">
              {lang === "fr"
                ? "Un parpaing régulier, c'est un mur plus droit, moins de mortier de rattrapage et un crépi plus facile."
                : "A regular block means a straighter wall, less corrective mortar, and an easier render."}
            </p>
            <Link to={href("plastering", lang)} className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
              {lang === "fr" ? "Puis crépir à la machine" : "Then render by machine"} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="02" eyebrow="FAQ" title={lang === "fr" ? "Commander." : "Ordering."} />
          <FaqList lang={lang} items={FABRICATION_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="construction"
        title={{ en: "Tell us the quantity and the date.", fr: "Indiquez la quantité et la date." }}
        body={{ en: "We reply with availability and a quote.", fr: "Nous répondons avec la disponibilité et un devis." }}
      />
    </>
  );
}
