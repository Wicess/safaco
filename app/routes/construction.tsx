import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { GalleryStrip } from "~/components/sections/Gallery";
import { AmbientVideo } from "~/components/ui/Video";
import { galleryFor } from "~/content/gallery";
import { FleetGrid } from "~/components/sections/FleetGrid";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, Steps } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { FLEET, HIRE_STEPS } from "~/content/construction";
import { IMG, isStock } from "~/content/media-map";
import { useLang } from "~/lib/hooks";
import { pageHero } from "~/content/defaults";
import { href, type PageKey, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta } from "~/lib/seo";
import { CONSTRUCTION_FAQ } from "~/content/faqs";

const TRAIL = [{ key: "construction" as const, name: { en: "SAFA Construction", fr: "SAFA Construction" } }];


export const meta = pageMeta({
  key: "construction",
  title: {
    en: "Plastering Machine & Mast Lift Hire, Yaoundé | SAFA",
    fr: "Machine à crépir & monte-charge à louer, Yaoundé | SAFA",
  },
  description: {
    en: "Hire automatic wall-plastering machines, mast lifts and scaffold platforms in Yaoundé. Delivered, set up and collected by SAFA's own crew. Quote on request.",
    fr: "Machines à crépir automatiques, monte-charges et échafaudages à louer à Yaoundé. Livrés, montés et repris par l'équipe SAFA. Devis sur demande.",
  },
  image: "/og/construction.jpg",
  jsonLd: (lang) => [breadcrumb(lang, TRAIL), faqPage(lang, CONSTRUCTION_FAQ)],
});

/** Photos first (the videos are already shown above in "At work"). */
const STRIP = galleryFor("construction").filter((g) => !g.video);

const SERVICES: { page: PageKey; title: T; body: T; img: string }[] = [
  {
    page: "plastering",
    title: { en: "Automatic plastering machine hire", fr: "Location de machines à crépir" },
    body: {
      en: "Render walls faster, with an even thickness, using fewer hands.",
      fr: "Crépissez plus vite, avec une épaisseur régulière, et moins de main-d'œuvre.",
    },
    img: IMG.greenMast,
  },
  {
    page: "scaffold",
    title: { en: "Mast lifts & scaffold platforms", fr: "Monte-charges & échafaudages" },
    body: {
      en: "Safe access to the façade for crews and materials, at the height you need.",
      fr: "Un accès sûr à la façade pour les équipes et les matériaux, à la hauteur voulue.",
    },
    img: IMG.mastPlatform,
  },
  {
    page: "fabrication",
    title: { en: "Materials fabrication", fr: "Fabrication de matériaux" },
    body: {
      en: "Construction materials produced by machine, for consistent dimensions.",
      fr: "Des matériaux de construction produits à la machine, pour des dimensions régulières.",
    },
    img: IMG.blocks,
  },
];

export default function Construction() {
  const lang = useLang();
  const hero = pageHero("construction", lang);
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow="SAFA Construction"
        title={hero.title ?? (lang === "fr" ? "Le matériel qui fait avancer le chantier." : "Equipment that moves the site forward.")}
        lede={hero.lede}
        image={hero.image}
        imageAlt={hero.imageAlt}
        media={hero.image ? undefined : (
          <AmbientVideo
            lang={lang}
            video="fleet"
            label={lang === "fr" ? "Les machines à crépir SAFA alignées au dépôt" : "SAFA's plastering machines lined up at the yard"}
            className="grain aspect-[4/3] md:aspect-[21/9]"
          />
        )}
      >
        <Button asChild variant="primary">
          <Link to={`${href("contact", lang)}?d=construction`}>
            {lang === "fr" ? "Demander un devis" : "Request a quote"} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead
            index="01"
            eyebrow={lang === "fr" ? "Nos services" : "What we do"}
            title={lang === "fr" ? "Trois façons de vous équiper." : "Three ways to equip your site."}
          />
          <div className="fade-x -mx-(--gutter) mt-10 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {SERVICES.map((s) => (
              <Link key={s.page} to={href(s.page, lang)} viewTransition className="group block w-[78%] shrink-0 snap-start sm:w-[46%] md:w-auto" data-reveal>
                <div className="relative">
                  <Picture name={s.img} alt="" sizes="(min-width: 48rem) 30vw, 100vw" className="grain aspect-[4/5]" imgClassName="transition-transform duration-[1.4s] ease-(--ease-out-quart) group-hover:scale-[1.04]" />
                  {isStock(s.img) && (
                    <span className="absolute bottom-2 left-2 bg-ivory/85 px-1.5 py-0.5 text-[0.6875rem] text-ink/70">{lang === "fr" ? "Photo d'illustration" : "Illustrative photo"}</span>
                  )}
                </div>
                <h3 className="mt-6 text-[1.75rem] leading-tight">{s.title[lang]}</h3>
                <p className="mt-2 text-muted">{s.body[lang]}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  {lang === "fr" ? "En savoir plus" : "Learn more"}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="on-dark bg-navy-900 py-20 text-ivory md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead
              tone="dark"
              eyebrow={lang === "fr" ? "En action" : "At work"}
              title={lang === "fr" ? "Nos machines, filmées chez nous." : "Our machines, filmed at our yard."}
              lede={
                lang === "fr"
                  ? "Le mât se déploie, la machine monte et applique l'enduit en une passe. Ce sont les unités que nous livrons et montons sur votre chantier."
                  : "The mast goes up, the machine climbs it and lays the render in one pass. These are the units we deliver and set up on your site."
              }
            />
            <Button asChild variant="gold" className="mt-10">
              <Link to={href("plastering", lang)} viewTransition>
                {lang === "fr" ? "Comment ça marche" : "How it works"} <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
            <AmbientVideo lang={lang} video="mastBlue" label={lang === "fr" ? "Un opérateur déploie le mât de la machine bleue" : "An operator raising the mast of the blue unit"} className="grain aspect-[9/16]" />
            <AmbientVideo lang={lang} video="mastGreen" label={lang === "fr" ? "La machine verte pilotée depuis son pupitre" : "The green unit operated from its control panel"} className="grain aspect-[9/16] translate-y-8 md:translate-y-14" />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead
            index="02"
            eyebrow={lang === "fr" ? "Le parc" : "The fleet"}
            title={lang === "fr" ? "Matériel disponible à la location." : "Equipment available for hire."}
            lede={lang === "fr" ? "Chaque machine est contrôlée avant de partir sur chantier." : "Every unit is inspected before it leaves for your site."}
          />
          <div className="mt-12">
            <FleetGrid lang={lang} units={FLEET} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead eyebrow={lang === "fr" ? "Le dépôt" : "The yard"} title={lang === "fr" ? "Le matériel, tel qu'il part sur chantier." : "The equipment, as it leaves for site."} />
          <div className="mt-12">
            <GalleryStrip lang={lang} division="construction" items={STRIP} />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="03" eyebrow={lang === "fr" ? "La location, étape par étape" : "Hire, step by step"} title={lang === "fr" ? "Vous construisez. Nous gérons le matériel." : "You build. We handle the equipment."} />
          <div className="mt-12">
            <Steps lang={lang} items={HIRE_STEPS} />
          </div>
          <ul className="mt-12 grid gap-4 text-[0.9375rem] sm:grid-cols-2">
            {[
              { en: "Delivered and assembled on site by our own team", fr: "Livré et monté sur site par notre propre équipe" },
              { en: "Flexible hire periods matched to your schedule", fr: "Durées de location adaptées à votre calendrier" },
              { en: "Well-maintained equipment, inspected before every job", fr: "Matériel entretenu, contrôlé avant chaque mission" },
              { en: "Serving construction sites across Yaoundé", fr: "Au service des chantiers de tout Yaoundé" },
            ].map((b) => (
              <li key={b.en} className="flex items-start gap-3" data-reveal>
                <Check className="mt-1 size-4 shrink-0 text-gold-600" aria-hidden />
                {b[lang]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="04" eyebrow={lang === "fr" ? "Questions" : "Questions"} title={lang === "fr" ? "Avant de louer." : "Before you hire."} />
          <FaqList lang={lang} items={CONSTRUCTION_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="construction"
        title={{ en: "Planning the finishing phase?", fr: "Vous préparez la phase de finition ?" }}
        body={{
          en: "Send the site location, surface and dates. We'll recommend the right machine and reply with a quote.",
          fr: "Envoyez la localisation, la surface et les dates du chantier. Nous vous conseillons la bonne machine et répondons avec un devis.",
        }}
      />
    </>
  );
}
