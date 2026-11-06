import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { GalleryTile, Lightbox, useLightbox } from "~/components/sections/Gallery";
import { CtaBand } from "~/components/sections/CtaBand";
import { Eyebrow, FaqList, SectionHead, TraceLine } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { AmbientVideo } from "~/components/ui/Video";
import { GALLERY } from "~/content/gallery";
import { HOME_HERO, houseImage } from "~/content/defaults";
import { O, pick } from "~/content/overrides";
import { IMG } from "~/content/media-map";
import { DIVISION_LIST, DIVISIONS } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { href, type Lang, type PageKey, type T } from "~/lib/i18n";
import { faqPage, pageMeta } from "~/lib/seo";
import type { RouteHandle } from "~/root";
import { GROUP_FAQ } from "~/content/faqs";

export const handle: RouteHandle = { headerTone: "dark" };


export const meta = pageMeta({
  key: "home",
  title: {
    en: "SAFA & Co, Yaoundé — Equipment Hire, Apartments, Tailoring",
    fr: "SAFA & Co, Yaoundé — Location de matériel, meublés, couture",
  },
  description: {
    en: "Yaoundé group: automatic plastering machine and mast-lift hire, furnished apartments in Meyo, made-to-measure menswear and a MINEFOP-approved sewing school.",
    fr: "Groupe à Yaoundé : location de machines à crépir et de monte-charges, appartements meublés à Meyo, couture homme sur mesure, formation agréée MINEFOP.",
  },
  image: "/og/home.jpg",
  jsonLd: (lang) => [faqPage(lang, GROUP_FAQ)],
});

type HouseKey = "construction" | "apartments" | "designs";

/** Real SAFA photos for each house: a lead image and a detail inset. */
const HOUSES: { key: HouseKey; img: string; alt: T; inset: string; insetAlt: T; offers: { label: T; page?: PageKey }[] }[] = [
  {
    key: "construction",
    img: houseImage("construction"),
    alt: { en: "A SAFA automatic plastering machine with its mast raised against a wall", fr: "Une machine à crépir automatique SAFA, mât déployé contre un mur" },
    inset: IMG.controlPanel,
    insetAlt: { en: "The machine's touch-screen control panel", fr: "Le pupitre à écran tactile de la machine" },
    offers: [
      { label: { en: "Automatic plastering machines", fr: "Machines à crépir automatiques" }, page: "plastering" },
      { label: { en: "Mast lifts & scaffold platforms", fr: "Monte-charges & plateformes" }, page: "scaffold" },
      { label: { en: "Materials fabrication", fr: "Fabrication de matériaux" }, page: "fabrication" },
    ],
  },
  {
    key: "apartments",
    img: houseImage("apartments"),
    alt: { en: "The SAFA Apartments building in Meyo, with arched balconies on three floors", fr: "L'immeuble SAFA Apartments à Meyo, balcons à arcades sur trois niveaux" },
    inset: IMG.bedroomTeal,
    insetAlt: { en: "A bedroom with fresh linen", fr: "Une chambre au linge frais" },
    offers: [
      { label: { en: "Furnished guest apartments", fr: "Appartements meublés" } },
      { label: { en: "Short & extended stays", fr: "Courts & longs séjours" } },
      { label: { en: "Meyo, Yaoundé IV", fr: "Meyo, Yaoundé IV" } },
    ],
  },
  {
    key: "designs",
    img: houseImage("designs"),
    alt: { en: "A maroon four-pocket jacket made at the SAFA Designs atelier", fr: "Une veste bordeaux à quatre poches réalisée à l'atelier SAFA Designs" },
    inset: IMG.printShirt,
    insetAlt: { en: "A print-panel shirt in the showroom", fr: "Une chemise à empiècement imprimé au showroom" },
    offers: [
      { label: { en: "Made-to-measure menswear", fr: "Tenues homme sur mesure" } },
      { label: { en: "Specialised machines", fr: "Machines spécialisées" } },
      { label: { en: "MINEFOP-approved training", fr: "Formation agréée MINEFOP" }, page: "training" },
    ],
  },
];

export default function Home() {
  const lang = useLang();
  return (
    <>
      <Hero lang={lang} />
      <Statement lang={lang} />
      <Houses lang={lang} />
      <PlasteringSpotlight lang={lang} />
      <Principles lang={lang} />
      <SeenOnSite lang={lang} />
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead
            index="05"
            eyebrow={lang === "fr" ? "Questions fréquentes" : "Common questions"}
            title={lang === "fr" ? "L'essentiel, en bref." : "The essentials, briefly."}
          />
          <div>
            <FaqList lang={lang} items={GROUP_FAQ} />
            <Link to={href("faq", lang)} className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
              {lang === "fr" ? "Toutes les questions" : "All questions"} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
      <CtaBand
        lang={lang}
        title={{ en: "Tell us what you're planning.", fr: "Parlez-nous de votre projet." }}
        body={{
          en: "A site to render, a stay in Yaoundé, a suit for an occasion — one message and the right team answers.",
          fr: "Un chantier à crépir, un séjour à Yaoundé, une tenue pour une cérémonie : un message, et la bonne équipe vous répond.",
        }}
      />
    </>
  );
}

function Hero({ lang }: { lang: Lang }) {
  // Which house the visitor is pointing at (desktop): swaps the photo panel.
  const [active, setActive] = useState(0);
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 text-ivory">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_15%_0%,var(--color-navy-800),var(--color-navy-950)_70%)]" />

      <div className="container-x grid min-h-[calc(100svh-var(--bar-h))] gap-12 pb-10 pt-[calc(var(--header-h)+2.5rem)] md:pb-16 md:pt-[calc(var(--header-h)+4rem)] lg:min-h-[100svh] lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col lg:col-span-7">
          <p className="eyebrow hero-in text-gold-300" style={{ ["--d" as string]: "0.05s" }}>
            {pick(O.home?.heroEyebrow, lang, HOME_HERO.eyebrow[lang])}
          </p>
          <h1 className="hero-in mt-6 max-w-[13ch] text-display-xl text-ivory" style={{ ["--d" as string]: "0.1s" }}>
            {pick(O.home?.heroTitle, lang, HOME_HERO.title[lang])}{" "}
            <em className="font-display italic text-gold-300">{pick(O.home?.heroEmphasis, lang, HOME_HERO.emphasis[lang]).replace(/ (?=\S+$)/, "\u00a0")}</em>
          </h1>
          <p className="hero-in mt-6 max-w-md text-lede text-ivory/70" style={{ ["--d" as string]: "0.2s" }}>
            {pick(O.home?.heroLede, lang, HOME_HERO.lede[lang])}
          </p>

          {/* The line that splits into three */}
          <nav aria-label={lang === "fr" ? "Nos trois maisons" : "Our three houses"} className="branch mt-auto pt-12">
            <span aria-hidden className="branch-stem" />
            <ul className="space-y-1">
              {HOUSES.map((h, i) => {
                const d = DIVISIONS[h.key];
                return (
                  <li key={d.key} className="branch-row" style={{ ["--i" as string]: i }}>
                    <Link
                      to={href(d.page, lang)}
                      viewTransition
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group flex min-h-[4.75rem] items-center justify-between gap-4 border-b border-ivory/10 md:min-h-24"
                    >
                      <span className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                        <span className="tabular text-[0.6875rem] text-ivory/60">0{i + 1}</span>
                        <span className={`font-display text-[clamp(1.75rem,8.4vw,2.125rem)] leading-none transition-colors duration-500 md:text-[3.25rem] ${active === i ? "lg:text-ivory" : "lg:text-ivory/55"}`}>
                          {d.name.replace("SAFA ", "")}
                        </span>
                        <span className="hidden font-display text-xl italic text-gold-300/80 sm:inline">{d.short[lang]}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3 sm:gap-4">
                        {/* Phones: the photo travels with the line */}
                        <Picture name={h.img} alt="" sizes="56px" className="size-12 shrink-0 sm:size-14 lg:hidden" ratio="1/1" />
                        <ArrowUpRight className="size-5 shrink-0 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Desktop: one photo per house, cross-faded by the line above */}
        <div aria-hidden className="hero-in relative hidden lg:col-span-5 lg:block" style={{ ["--d" as string]: "0.3s" }}>
          <div className="relative h-full min-h-[34rem] overflow-hidden">
            {HOUSES.map((h, i) => (
              <Picture
                key={h.key}
                name={h.img}
                alt=""
                priority={i === 0}
                sizes="40vw"
                className={`grain absolute inset-0 h-full transition-[opacity,transform] duration-[1.1s] ease-(--ease-out-quart) ${active === i ? "opacity-100" : "scale-[1.03] opacity-0"}`}
              />
            ))}
            <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 flex items-center gap-3 text-xs text-ivory/80">
              <span className="h-px w-6 bg-gold-300" />
              {DIVISIONS[HOUSES[active]!.key].address.district}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Statement({ lang }: { lang: Lang }) {
  return (
    <section className="pb-14 pt-16 md:pb-24 md:pt-28">
      <div className="container-x">
        <Eyebrow index="01">{lang === "fr" ? "Le groupe" : "The group"}</Eyebrow>
        <p data-reveal className="mt-8 max-w-5xl font-display text-[1.875rem] leading-[1.18] md:text-[3.25rem]">
          {lang === "fr" ? (
            <>
              SAFA &amp; Co réunit trois métiers qui ont le même geste de départ : <span className="text-gold-600 italic">mesurer juste</span>. Nous
              équipons les chantiers, nous accueillons nos hôtes, nous habillons les hommes — à Yaoundé, avec nos propres équipes.
            </>
          ) : (
            <>
              SAFA &amp; Co brings together three crafts that share the same first move: <span className="text-gold-600 italic">measure true</span>. We
              equip building sites, we host guests, we dress men — in Yaoundé, with our own teams.
            </>
          )}
        </p>
      </div>
    </section>
  );
}

function Houses({ lang }: { lang: Lang }) {
  return (
    <section aria-labelledby="houses-title" className="pb-20 md:pb-32">
      <h2 id="houses-title" className="sr-only">
        {lang === "fr" ? "Nos trois maisons" : "Our three houses"}
      </h2>
      <div className="container-x space-y-16 md:space-y-28">
        {HOUSES.map((h, i) => {
          const d = DIVISIONS[h.key];
          const flip = i % 2 === 1;
          return (
            <article key={h.key} className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12" style={{ ["--accent" as string]: d.accentVar }}>
              <Link
                to={href(d.page, lang)}
                tabIndex={-1}
                aria-hidden
                className={`group relative block md:col-span-6 ${flip ? "md:order-2 md:col-start-7" : "md:col-start-1"} ${flip ? "md:pl-10" : "md:pr-10"}`}
              >
                <Picture name={h.img} alt={h.alt[lang]} sizes="(min-width: 48rem) 45vw, 100vw" className="grain aspect-[4/5]" imgClassName="transition-transform duration-[1.6s] ease-(--ease-out-quart) group-hover:scale-[1.03]" />
                <Picture
                  name={h.inset}
                  alt={h.insetAlt[lang]}
                  sizes="(min-width: 48rem) 16vw, 36vw"
                  className={`absolute -bottom-6 aspect-[3/4] w-[36%] border-[6px] border-ivory shadow-[0_8px_8px_-4px_rgb(12_21_28/0.25)] md:-bottom-10 md:w-[38%] ${flip ? "-left-1 md:left-0" : "-right-1 md:right-0"}`}
                />
              </Link>
              <div className={`mt-6 md:col-span-5 md:mt-0 ${flip ? "md:order-1 md:col-start-1 md:row-start-1" : "md:col-start-8"}`} data-reveal>
                <p className="eyebrow flex items-center gap-3" style={{ color: "var(--accent)" }}>
                  <span aria-hidden className="h-px w-6 bg-current" />
                  {d.name}
                </p>
                <h3 className="mt-5 text-display-md">{d.tagline[lang]}</h3>
                <TraceLine className="mt-8" />
                <ul className="mt-6 space-y-1">
                  {h.offers.map((o) => (
                    <li key={o.label.en}>
                      {o.page ? (
                        <Link to={href(o.page, lang)} className="group flex min-h-11 items-center justify-between gap-4 text-[0.9375rem]">
                          {o.label[lang]}
                          <ArrowRight className="size-4 opacity-40 transition-transform group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
                        </Link>
                      ) : (
                        <span className="flex min-h-11 items-center text-[0.9375rem] text-muted">{o.label[lang]}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-8">
                  <Link to={href(d.page, lang)} viewTransition>
                    {lang === "fr" ? `Découvrir ${d.name}` : `Discover ${d.name}`} <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PlasteringSpotlight({ lang }: { lang: Lang }) {
  return (
    <section className="on-dark overflow-hidden bg-navy-900 text-ivory" style={{ ["--accent" as string]: "var(--color-gold)" }}>
      <div className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <AmbientVideo
            lang={lang}
            video="mastBlue"
            label={lang === "fr" ? "Un opérateur SAFA déploie le mât d'une machine à crépir automatique" : "A SAFA operator raising the mast of an automatic plastering machine"}
            className="grain aspect-[4/5]"
          />
          <p className="mt-3 flex items-center gap-3 text-xs text-ivory/60">
            <span aria-hidden className="h-px w-6 bg-gold-300" />
            {lang === "fr" ? "Notre machine, filmée au dépôt" : "Our own machine, filmed at the yard"}
          </p>
        </div>
        <div>
          <SectionHead
            tone="dark"
            index="04"
            eyebrow={lang === "fr" ? "Crépissage automatique" : "Automatic plastering"}
            title={
              lang === "fr" ? "Parmi les premiers au Cameroun à louer des machines à crépir automatiques." : "Among the first in Cameroon to hire out automatic plastering machines."
            }
            lede={
              lang === "fr"
                ? "La machine monte et descend le long de son mât et applique l'enduit en une passe régulière : une épaisseur constante, un chantier qui avance plus vite, une équipe réduite. Nous la livrons, l'installons et la reprenons."
                : "The machine climbs its mast and lays the render in one steady pass: constant thickness, faster progress, a smaller crew. We deliver it, set it up and collect it."
            }
          />
          <Button asChild variant="gold" size="lg" className="mt-10">
            <Link to={href("plastering", lang)} viewTransition>
              {lang === "fr" ? "Comment ça marche" : "How it works"} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Principles({ lang }: { lang: Lang }) {
  const items: { t: T; b: T }[] = [
    {
      t: { en: "Our own teams", fr: "Nos propres équipes" },
      b: {
        en: "Machines are delivered and assembled on site by SAFA's crew — not a subcontractor.",
        fr: "Les machines sont livrées et montées sur site par l'équipe SAFA, pas par un sous-traitant.",
      },
    },
    {
      t: { en: "Inspected before every job", fr: "Contrôlé avant chaque mission" },
      b: {
        en: "Equipment is maintained and checked before it leaves for your site.",
        fr: "Le matériel est entretenu et vérifié avant chaque départ sur chantier.",
      },
    },
    {
      t: { en: "Flexible terms", fr: "Des durées flexibles" },
      b: {
        en: "Hire periods and stays are arranged around your schedule, not ours.",
        fr: "Durées de location et de séjour organisées selon votre calendrier, pas le nôtre.",
      },
    },
    {
      t: { en: "One conversation", fr: "Un seul interlocuteur" },
      b: {
        en: "Message us on WhatsApp and the right division answers you directly.",
        fr: "Écrivez-nous sur WhatsApp : la bonne division vous répond directement.",
      },
    },
  ];
  return (
    <section className="py-20 md:py-32">
      <div className="container-x">
        <SectionHead index="—" eyebrow={lang === "fr" ? "Notre façon de travailler" : "How we work"} title={lang === "fr" ? "Sérieux, simple, sur place." : "Serious, simple, on site."} />
        <ul className="mt-10 grid gap-px bg-ink/10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <li key={it.t.en} className="bg-ivory py-6 pr-4 sm:p-8" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
              <span aria-hidden className="block h-px w-10 bg-gold" />
              <h3 className="mt-6 text-[1.625rem]">{it.t[lang]}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{it.b[lang]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** A mixed mosaic of SAFA's own media, opening the shared lightbox. */
const SEEN = ["building", "mast-blue", "maroon-jacket", "lounge-light", "fleet-yard", "print-shirt", "bedroom-teal", "spray-pumps", "navy-tunic", "kitchen-bar"];

function SeenOnSite({ lang }: { lang: Lang }) {
  // Preferred picks first, then anything else in the (admin-edited) gallery.
  const picked = SEEN.map((id) => GALLERY.find((g) => g.id === id)).filter((g): g is (typeof GALLERY)[number] => Boolean(g));
  const items = [...picked, ...GALLERY.filter((g) => !picked.includes(g))].slice(0, 10);
  const lb = useLightbox(items);
  return (
    <section aria-labelledby="seen-title" className="bg-ivory-2 py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            eyebrow={lang === "fr" ? "Galerie" : "Gallery"}
            title={
              <span id="seen-title">
                {lang === "fr" ? "Nos machines, nos murs, nos coutures." : "Our machines, our walls, our seams."}
              </span>
            }
            lede={lang === "fr" ? "Aucune image de banque ici : tout a été photographié chez SAFA." : "No stock imagery here: all of it photographed at SAFA."}
          />
          <Button asChild variant="outline">
            <Link to={href("gallery", lang)} viewTransition>
              {lang === "fr" ? "Toute la galerie" : "The full gallery"} <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <ul className="mt-12 grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {items.map((it, i) => (
            <li key={it.id} className={i === 0 || i === 5 ? "row-span-2" : undefined} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
              <GalleryTile
                item={it}
                lang={lang}
                onOpen={() => lb.open(i)}
                className="h-full"
                pictureClass={i === 0 || i === 5 ? "aspect-[3/4] h-full" : "aspect-square"}
                sizes="(min-width: 48rem) 24vw, 48vw"
              />
            </li>
          ))}
        </ul>
      </div>
      <Lightbox lang={lang} items={items} index={lb.index} setIndex={lb.setIndex} close={lb.close} />
    </section>
  );
}
