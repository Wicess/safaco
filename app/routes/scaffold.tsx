import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { FleetGrid } from "~/components/sections/FleetGrid";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, Steps } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { FLEET, HIRE_STEPS } from "~/content/construction";
import { IMG } from "~/content/media-map";
import { useLang } from "~/lib/hooks";
import { href, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta, service } from "~/lib/seo";
import { SCAFFOLD_FAQ } from "~/content/faqs";

const TRAIL = [
  { key: "construction" as const, name: { en: "SAFA Construction", fr: "SAFA Construction" } },
  { key: "scaffold" as const, name: { en: "Scaffolds & mast lifts", fr: "Échafaudages & monte-charges" } },
];


export const meta = pageMeta({
  key: "scaffold",
  title: {
    en: "Mast Lift & Scaffold Platform Hire, Yaoundé | SAFA",
    fr: "Location monte-charge & échafaudage, Yaoundé | SAFA",
  },
  description: {
    en: "Hire dual-mast site lifts, scaffold platforms and mast sections in Yaoundé. Assembled on site to the height you need and collected at the end of the job.",
    fr: "Monte-charges bi-mâts, plateformes d'échafaudage et éléments de mât à louer à Yaoundé. Montés à la bonne hauteur, repris en fin de chantier.",
  },
  image: "/og/scaffold.jpg",
  jsonLd: (lang) => [
    breadcrumb(lang, TRAIL),
    service(lang, {
      key: "scaffold",
      name: { en: "Mast lift and scaffold platform hire", fr: "Location de monte-charges et plateformes d'échafaudage" },
      description: {
        en: "Hire of dual-mast site lifts, scaffold platforms, mast sections and mobile lift bases, assembled and collected by SAFA Construction.",
        fr: "Location de monte-charges bi-mâts, plateformes d'échafaudage, éléments de mât et bases mobiles, montés et repris par SAFA Construction.",
      },
      division: "construction",
      fn: "LeaseOut",
    }),
    faqPage(lang, SCAFFOLD_FAQ),
  ],
});

export default function Scaffold() {
  const lang = useLang();
  const units = FLEET.filter((u) => u.page === "scaffold");
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow={lang === "fr" ? "Accès en hauteur" : "Access at height"}
        title={lang === "fr" ? "Monte-charges & plateformes d'échafaudage." : "Mast lifts & scaffold platforms."}
        lede={
          lang === "fr"
            ? "Des plateformes sur mâts et des planchers de travail pour monter équipes et matériaux le long de la façade, en toute stabilité. Livrés, montés et repris par notre équipe."
            : "Mast platforms and working decks that carry crews and materials up the façade, steadily. Delivered, assembled and collected by our crew."
        }
        image={IMG.scaffold}
        imageAlt={lang === "fr" ? "Échafaudage installé sur la façade d'un immeuble" : "Scaffolding set up on a building façade"}
      >
        <Button asChild variant="primary">
          <Link to={`${href("contact", lang)}?d=construction`}>
            {lang === "fr" ? "Demander un devis" : "Request a quote"} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead index="01" eyebrow={lang === "fr" ? "Le principe" : "The idea"} title={lang === "fr" ? "La bonne hauteur, sans improviser." : "The right height, without improvising."} lede={SCAFFOLD_FAQ[0]!.a[lang]} />
            <ul className="mt-10 space-y-4">
              {[
                { en: "Carries crew and materials together", fr: "Monte équipe et matériaux ensemble" },
                { en: "Railed, stable working deck", fr: "Plancher stable, avec garde-corps" },
                { en: "Moves along the façade as work progresses", fr: "Se déplace le long de la façade au fil des travaux" },
                { en: "Pairs with our automatic plastering machines", fr: "Se combine avec nos machines à crépir automatiques" },
              ].map((b) => (
                <li key={b.en} className="flex items-start gap-3" data-reveal>
                  <Check className="mt-1 size-4 shrink-0 text-gold-600" aria-hidden />
                  {b[lang]}
                </li>
              ))}
            </ul>
          </div>
          <div className="light-sweep grain aspect-[4/5]" data-trace>
            <Picture name={IMG.golden} alt={lang === "fr" ? "Bâtiment en construction au coucher du soleil" : "A building under construction at golden hour"} sizes="(min-width: 64rem) 45vw, 100vw" className="h-full" />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="02" eyebrow={lang === "fr" ? "Le matériel" : "The equipment"} title={lang === "fr" ? "Disponible à la location." : "Available for hire."} />
          <div className="mt-12">
            <FleetGrid lang={lang} units={units} link={false} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="03" eyebrow={lang === "fr" ? "Location" : "Hire"} title={lang === "fr" ? "De la visite à la reprise." : "From site visit to pickup."} />
          <div className="mt-12">
            <Steps lang={lang} items={HIRE_STEPS} />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="04" eyebrow="FAQ" title={lang === "fr" ? "Bon à savoir." : "Good to know."} />
          <FaqList lang={lang} items={SCAFFOLD_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="construction"
        title={{ en: "How high, how long, where?", fr: "Quelle hauteur, combien de temps, où ?" }}
        body={{
          en: "Send us the building height, the site location and your dates — we'll recommend the setup and quote it.",
          fr: "Envoyez-nous la hauteur du bâtiment, la localisation et vos dates : nous vous conseillons l'installation et vous envoyons un devis.",
        }}
      />
    </>
  );
}
