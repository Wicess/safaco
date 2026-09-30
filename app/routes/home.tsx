import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { Eyebrow, FaqList, SectionHead, TraceLine } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { IMG, PLACEHOLDER_MEDIA } from "~/content/media-map";
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

const HOUSES: { key: "construction" | "apartments" | "designs"; img: string; alt: T; offers: { label: T; page?: PageKey }[] }[] = [
  {
    key: "construction",
    img: IMG.construction,
    alt: { en: "Mast platform against a building façade", fr: "Plateforme sur mât contre une façade" },
    offers: [
      { label: { en: "Automatic plastering machines", fr: "Machines à crépir automatiques" }, page: "plastering" },
      { label: { en: "Mast lifts & scaffold platforms", fr: "Monte-charges & plateformes" }, page: "scaffold" },
      { label: { en: "Materials fabrication", fr: "Fabrication de matériaux" }, page: "fabrication" },
    ],
  },
  {
    key: "apartments",
    img: IMG.apartments,
    alt: { en: "A bright, furnished living room", fr: "Un salon meublé et lumineux" },
    offers: [
      { label: { en: "Furnished apartments", fr: "Appartements meublés" } },
      { label: { en: "Short & extended stays", fr: "Courts & longs séjours" } },
      { label: { en: "Meyo, Yaoundé IV", fr: "Meyo, Yaoundé IV" } },
    ],
  },
  {
    key: "designs",
    img: IMG.designs,
    alt: { en: "A tailor's hands at work on cloth", fr: "Les mains d'un tailleur au travail sur un tissu" },
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
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-950 text-ivory">
      <Picture
        name={IMG.heroTexture}
        alt=""
        priority
        sizes="50vw"
        className="absolute inset-0 -z-10 opacity-[0.22] mix-blend-luminosity"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_80%_0%,transparent,var(--color-navy-950)_70%)]" />

      <div className="container-x flex min-h-[calc(100svh-var(--bar-h))] flex-col pb-10 lg:min-h-[100svh] pt-[calc(var(--header-h)+2.5rem)] md:pb-16 md:pt-[calc(var(--header-h)+4rem)]">
        <p className="eyebrow hero-in text-gold-300" style={{ ["--d" as string]: "0.05s" }}>
          SAFA &amp; Co SARL · Yaoundé, {lang === "fr" ? "Cameroun" : "Cameroon"}
        </p>
        <h1 className="hero-in mt-6 max-w-[14ch] text-display-xl text-ivory" style={{ ["--d" as string]: "0.1s" }}>
          {lang === "fr" ? (
            <>
              Tout commence par <em className="font-display italic text-gold-300">un&nbsp;trait.</em>
            </>
          ) : (
            <>
              Everything starts with <em className="font-display italic text-gold-300">a&nbsp;line.</em>
            </>
          )}
        </h1>
        <p className="hero-in mt-6 max-w-md text-lede text-ivory/70" style={{ ["--d" as string]: "0.2s" }}>
          {lang === "fr"
            ? "Le maçon trace sa ligne avant de crépir, le tailleur avant de couper. Trois maisons, une même exigence de précision."
            : "The builder snaps a chalk line before plastering; the tailor, before cutting. Three houses, one standard of precision."}
        </p>

        {/* The line that splits into three */}
        <nav aria-label={lang === "fr" ? "Nos trois maisons" : "Our three houses"} className="branch mt-auto pt-12">
          <span aria-hidden className="branch-stem" />
          <ul className="space-y-1">
            {DIVISION_LIST.map((d, i) => (
              <li key={d.key} className="branch-row" style={{ ["--i" as string]: i }}>
                <Link to={href(d.page, lang)} viewTransition className="group flex min-h-[4.25rem] items-center justify-between gap-4 border-b border-ivory/10 md:min-h-24">
                  <span className="flex items-baseline gap-4">
                    <span className="tabular text-[0.6875rem] text-ivory/60">0{i + 1}</span>
                    <span className="font-display text-[2.125rem] leading-none md:text-[3.25rem]">
                      {d.name.replace("SAFA ", "")}
                    </span>
                    <span className="hidden font-display text-xl italic text-gold-300/80 sm:inline">{d.short[lang]}</span>
                  </span>
                  <ArrowUpRight className="size-5 text-gold-300 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
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
            <article key={h.key} className="grid gap-8 md:grid-cols-12 md:items-end md:gap-12" style={{ ["--accent" as string]: d.accentVar }}>
              <Link
                to={href(d.page, lang)}
                tabIndex={-1}
                aria-hidden
                className={`md:col-span-7 ${flip ? "md:order-2 md:col-start-6" : ""}`}
              >
                <Picture name={h.img} alt={h.alt[lang]} sizes="(min-width: 48rem) 58vw, 100vw" className="grain aspect-[4/5] md:aspect-[5/4]" imgClassName="transition-transform duration-[1.6s] ease-(--ease-out-quart) hover:scale-[1.03]" />
                {PLACEHOLDER_MEDIA && <span className="mt-2 block text-[0.6875rem] text-muted">{lang === "fr" ? "Photo d'illustration" : "Illustrative photo"}</span>}
              </Link>
              <div className={`md:col-span-5 ${flip ? "md:order-1 md:col-start-1 md:row-start-1" : ""}`} data-reveal>
                <p className="eyebrow flex items-center gap-3" style={{ color: "var(--accent)" }}>
                  <span className="tabular text-ink/55">0{i + 2}</span>
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
        <div
          className="render-reveal grain aspect-[4/5] md:aspect-[4/3]"
          data-trace
          data-scroll
        >
          <Picture name={IMG.wallRaw} alt="" className="render-raw h-full" sizes="(min-width: 64rem) 45vw, 100vw" />
          <Picture
            name={IMG.wallSmooth}
            alt={lang === "fr" ? "Un mur fraîchement crépi, lisse et régulier" : "A freshly rendered wall, smooth and even"}
            className="render-smooth h-full"
            sizes="(min-width: 64rem) 45vw, 100vw"
          />
          <span aria-hidden className="render-blade" />
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
        <ul className="mt-14 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <li key={it.t.en} className="bg-ivory py-8 pr-6 sm:p-8" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
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
