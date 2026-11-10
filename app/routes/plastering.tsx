import { ArrowRight, Check, Minus } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { FleetGrid } from "~/components/sections/FleetGrid";
import { PageHero } from "~/components/sections/PageHero";
import { PlasterCalculator, PlasterTable } from "~/components/sections/PlasterCalculator";
import { FaqList, SectionHead, Steps } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { AmbientVideo } from "~/components/ui/Video";
import { FLEET, HIRE_STEPS } from "~/content/construction";
import { IMG } from "~/content/media-map";
import { useLang } from "~/lib/hooks";
import { pageHero } from "~/content/defaults";
import { href, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta, service } from "~/lib/seo";
import { PLASTERING_FAQ } from "~/content/faqs";

const NAME: T = { en: "Automatic plastering machine hire", fr: "Location de machine à crépir automatique" };
const TRAIL = [
  { key: "construction" as const, name: { en: "SAFA Construction", fr: "SAFA Construction" } },
  { key: "plastering" as const, name: { en: "Plastering machine hire", fr: "Location de machine à crépir" } },
];


export const meta = pageMeta({
  key: "plastering",
  title: {
    en: "Automatic Plastering Machine Hire in Yaoundé | SAFA",
    fr: "Location machine à crépir automatique, Yaoundé | SAFA",
  },
  description: {
    en: "Hire an automatic plastering machine in Yaoundé: faster rendering, even thickness, smaller crew. Set up by SAFA — among the first in Cameroon.",
    fr: "Machine à crépir automatique à louer à Yaoundé : crépissage rapide, enduit régulier, équipe réduite. Montée par SAFA, parmi les premières au Cameroun.",
  },
  image: "/og/plastering.jpg",
  jsonLd: (lang) => [
    breadcrumb(lang, TRAIL),
    service(lang, {
      key: "plastering",
      name: NAME,
      description: {
        en: "Hire of automatic wall-plastering (rendering) machines, delivered, assembled and collected by SAFA Construction in Yaoundé.",
        fr: "Location de machines à crépir automatiques, livrées, montées et reprises par SAFA Construction à Yaoundé.",
      },
      division: "construction",
      fn: "LeaseOut",
    }),
    faqPage(lang, PLASTERING_FAQ),
  ],
});

const HOW: { title: T; body: T }[] = [
  {
    title: { en: "Mast set on the wall", fr: "Le mât contre le mur" },
    body: { en: "The machine's mast is placed plumb against the wall on level ground.", fr: "Le mât de la machine est posé d’aplomb contre le mur, sur un sol de niveau." },
  },
  {
    title: { en: "Mortar in the hopper", fr: "Le mortier dans la trémie" },
    body: { en: "Your plaster or render mix is loaded into the machine's hopper.", fr: "Votre mortier ou votre enduit est chargé dans la trémie de la machine." },
  },
  {
    title: { en: "One steady pass", fr: "Une passe régulière" },
    body: { en: "The machine travels up the mast, pressing an even coat onto the wall.", fr: "La machine monte le long du mât et presse sur le mur une couche régulière." },
  },
  {
    title: { en: "Move, repeat", fr: "Décaler, recommencer" },
    body: { en: "The unit shifts along the wall, strip by strip, until the face is done.", fr: "La machine se décale le long du mur, bande après bande, jusqu’à couvrir toute la façade." },
  },
];

const COMPARE: { label: T; hand: T; machine: T }[] = [
  { label: { en: "Coat thickness", fr: "Épaisseur" }, hand: { en: "Varies with each mason", fr: "Varie d’un maçon à l’autre" }, machine: { en: "Constant, top to bottom", fr: "Constante, de haut en bas" } },
  { label: { en: "Pace", fr: "Cadence" }, hand: { en: "Limited by hand work", fr: "Limitée par le geste manuel" }, machine: { en: "Several times faster on clear walls", fr: "Plusieurs fois plus rapide sur mur dégagé" } },
  { label: { en: "Crew", fr: "Équipe" }, hand: { en: "Large team for big surfaces", fr: "Beaucoup de bras pour les grandes surfaces" }, machine: { en: "A small crew feeds the machine", fr: "Une petite équipe alimente la machine" } },
  { label: { en: "Fatigue & height", fr: "Pénibilité et hauteur" }, hand: { en: "Hard, repetitive work at height", fr: "Travail pénible et répétitif en hauteur" }, machine: { en: "The machine carries the effort", fr: "La machine fait l’effort" } },
];

export default function Plastering() {
  const lang = useLang();
  const hero = pageHero("plastering", lang);
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow={lang === "fr" ? "Crépissage automatique" : "Automatic plastering"}
        title={hero.title ?? (lang === "fr" ? "Location de machine à crépir automatique à Yaoundé." : "Automatic plastering machine hire in Yaoundé.")}
        lede={hero.lede}
        image={hero.image}
        imageAlt={hero.imageAlt ?? (lang === "fr" ? "Deux machines à crépir automatiques SAFA, verte et bleue, au dépôt" : "Two SAFA automatic plastering machines, green and blue, at the yard")}
      >
        <Button asChild variant="primary">
          <a href="#estimate">
            {lang === "fr" ? "Estimer mon chantier" : "Estimate my job"} <ArrowRight aria-hidden />
          </a>
        </Button>
      </PageHero>

      {/* The trowel pass */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="render-reveal grain order-2 aspect-[4/5] lg:order-1" data-trace data-scroll>
            <Picture name={IMG.wallRaw} alt="" className="render-raw h-full" sizes="(min-width: 64rem) 45vw, 100vw" />
            <Picture
              name={IMG.wallSmooth}
              alt={lang === "fr" ? "Un mur brut en parpaings qui devient un mur crépi et lisse" : "A raw block wall becoming a smooth rendered wall"}
              className="render-smooth h-full"
              sizes="(min-width: 64rem) 45vw, 100vw"
            />
            <span aria-hidden className="render-blade" />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHead
              index="01"
              eyebrow={lang === "fr" ? "Le principe" : "The idea"}
              title={lang === "fr" ? "Du parpaing brut au mur fini, en une passe." : "From raw block to finished wall, in one pass."}
              lede={PLASTERING_FAQ[0]!.a[lang]}
            />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="02" eyebrow={lang === "fr" ? "Comment ça marche" : "How it works"} title={lang === "fr" ? "Quatre gestes, répétés avec précision." : "Four moves, repeated precisely."} />
          <div className="mt-12">
            <Steps lang={lang} items={HOW} />
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-12 md:items-center">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:col-span-7">
              <AmbientVideo lang={lang} video="mastBlue" label={lang === "fr" ? "Le mât de la machine se déploie" : "The machine's mast going up"} className="grain aspect-[9/16]" />
              <AmbientVideo lang={lang} video="mastGreen" label={lang === "fr" ? "La machine pilotée depuis son pupitre" : "The machine operated from its control panel"} className="grain aspect-[9/16]" />
            </div>
            <div className="md:col-span-5" data-reveal>
              <Picture name={IMG.controlPanel} alt={lang === "fr" ? "Le pupitre à écran tactile de la machine" : "The machine's touch-screen control panel"} sizes="(min-width: 48rem) 40vw, 100vw" className="hover-zoom grain aspect-[4/3]" />
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {lang === "fr"
                  ? "Tout se commande depuis le pupitre : montée, descente et mise à niveau. Le jour du montage, notre équipe en explique le maniement à la vôtre."
                  : "Everything runs from the control panel: up, down and levelling. On set-up day, our crew walks yours through it."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Estimate */}
      <section id="estimate" className="on-dark bg-navy-900 py-20 text-ivory md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <SectionHead
              tone="dark"
              index="03"
              eyebrow={lang === "fr" ? "Estimation" : "Estimate"}
              title={lang === "fr" ? "Combien de jours gagnez-vous ?" : "How many days do you save?"}
              lede={
                lang === "fr"
                  ? "Indiquez la surface à crépir pour comparer le travail à la main et à la machine. Pour le tarif, envoyez-nous votre surface : le devis est gratuit."
                  : "Enter the surface to render to compare hand work with the machine. For the rate, send us your surface — quotes are free."
              }
            />
            <div className="mt-10 hidden bg-ivory/5 p-6 text-ivory lg:block [&_td]:text-ivory/80 [&_th]:text-ivory/60 [&_tr]:border-ivory/10">
              <PlasterTable lang={lang} />
            </div>
          </div>
          <PlasterCalculator lang={lang} />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="04" eyebrow={lang === "fr" ? "À la main ou à la machine" : "By hand or by machine"} title={lang === "fr" ? "Ce qui change sur votre chantier." : "What changes on your site."} />
          <div className="mt-12 overflow-hidden border-y border-ink/12">
            <div className="hidden grid-cols-[1fr_1fr_1fr] border-b border-ink/12 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid">
              <span />
              <span>{lang === "fr" ? "À la main" : "By hand"}</span>
              <span className="text-gold-600">{lang === "fr" ? "Machine SAFA" : "SAFA machine"}</span>
            </div>
            {COMPARE.map((c) => (
              <div key={c.label.en} className="grid gap-3 border-b border-ink/10 py-6 last:border-0 md:grid-cols-[1fr_1fr_1fr] md:gap-0" data-reveal>
                <p className="font-display text-2xl">{c.label[lang]}</p>
                <p className="flex items-start gap-3 text-muted">
                  <Minus className="mt-1 size-4 shrink-0 opacity-50" aria-hidden />
                  <span>
                    <span className="sr-only md:hidden">{lang === "fr" ? "À la main : " : "By hand: "}</span>
                    {c.hand[lang]}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-gold-600" aria-hidden />
                  <span>
                    <span className="sr-only md:hidden">{lang === "fr" ? "Machine SAFA : " : "SAFA machine: "}</span>
                    {c.machine[lang]}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="05" eyebrow={lang === "fr" ? "Location" : "Hire"} title={lang === "fr" ? "Nous livrons, montons et reprenons." : "We deliver, set up and collect."} />
          <div className="mt-12">
            <Steps lang={lang} items={HIRE_STEPS} />
          </div>
          <div className="mt-16">
            <FleetGrid lang={lang} units={FLEET.filter((u) => u.page === "plastering")} link={false} />
          </div>
          <p className="mt-10 text-muted">
            {lang === "fr" ? "Besoin aussi d’un accès en hauteur ? " : "Need access at height too? "}
            <Link to={href("scaffold", lang)} className="font-medium text-ink underline underline-offset-4">
              {lang === "fr" ? "Voir les monte-charges et plateformes d’échafaudage" : "See mast lifts and scaffold platforms"}
            </Link>
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="06" eyebrow="FAQ" title={lang === "fr" ? "Vos questions sur la machine." : "Your questions about the machine."} />
          <FaqList lang={lang} items={PLASTERING_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="construction"
        title={{ en: "Send us your surface. We'll send the quote.", fr: "Envoyez la surface, recevez le devis." }}
        body={{
          en: "Site location, m², wall height, interior or exterior, and your dates — photos welcome on WhatsApp.",
          fr: "Lieu du chantier, surface en m², hauteur des murs, intérieur ou extérieur, et vos dates. Les photos sont les bienvenues sur WhatsApp.",
        }}
        waMessage={
          lang === "fr"
            ? "Bonjour SAFA Construction, je souhaite un devis pour la location d’une machine à crépir automatique. Chantier : … Surface : … m²."
            : "Hello SAFA Construction, I'd like a quote to hire an automatic plastering machine. Site: … Surface: … m²."
        }
      />
    </>
  );
}
