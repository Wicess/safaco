import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { GalleryTile, Lightbox, useLightbox } from "~/components/sections/Gallery";
import { AmbientVideo } from "~/components/ui/Video";
import { galleryFor } from "~/content/gallery";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, Steps } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { IMG } from "~/content/media-map";
import { useLang } from "~/lib/hooks";
import { pageHero } from "~/content/defaults";
import { href, type Lang, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta } from "~/lib/seo";
import { DESIGNS_FAQ } from "~/content/faqs";

const TRAIL = [{ key: "designs" as const, name: { en: "SAFA Designs", fr: "SAFA Designs" } }];

/** CLIENT_TODO: confirm the garment categories with the atelier. */
const GARMENTS: { name: T; body: T }[] = [
  {
    name: { en: "Suits & ceremony wear", fr: "Costumes & tenues de cérémonie" },
    body: { en: "Cut to your measurements for weddings, work and official occasions.", fr: "Coupés à vos mesures pour les mariages, le travail et les cérémonies officielles." },
  },
  {
    name: { en: "Traditional & modern African wear", fr: "Tenues africaines, traditionnelles & modernes" },
    body: { en: "Tunics, boubous and shirts in the fabric you choose.", fr: "Tuniques, boubous et chemises dans le tissu de votre choix." },
  },
  {
    name: { en: "Shirts & everyday pieces", fr: "Chemises & pièces du quotidien" },
    body: { en: "Well-fitting shirts and trousers that last, made to measure.", fr: "Des chemises et pantalons bien ajustés, faits pour durer, sur mesure." },
  },
];

/** Short lookbook names, keyed by gallery id (photos: the atelier's own work). */
const LOOK_NAME: Record<string, T> = {
  "maroon-jacket": { en: "Four-pocket jacket", fr: "Veste quatre poches" },
  "print-shirt": { en: "Print-panel shirt", fr: "Chemise à empiècement" },
  "navy-tunic": { en: "Navy tunic, gold stitch", fr: "Tunique marine, surpiqûre or" },
  "chambray-tunic": { en: "Chambray tunic", fr: "Tunique chambray" },
  "white-tunic": { en: "White tunic", fr: "Tunique blanche" },
  "striped-shirt": { en: "Striped-sleeve shirt", fr: "Chemise manches rayées" },
};
const LOOKS = galleryFor("designs").filter((g) => !g.video);

const PROCESS: { title: T; body: T }[] = [
  { title: { en: "Measure", fr: "Mesurer" }, body: { en: "We take your measurements at the atelier, by appointment.", fr: "Nous prenons vos mesures à l'atelier, sur rendez-vous." } },
  { title: { en: "Choose", fr: "Choisir" }, body: { en: "Cut, fabric, details — bring your fabric or choose with us.", fr: "Coupe, tissu, finitions — apportez votre tissu ou choisissez avec nous." } },
  { title: { en: "Fit", fr: "Essayer" }, body: { en: "A fitting to adjust the garment on you before finishing.", fr: "Un essayage pour ajuster la pièce sur vous avant la finition." } },
  { title: { en: "Finish", fr: "Finir" }, body: { en: "Clean seams and pressing on our specialised machines.", fr: "Coutures nettes et repassage sur nos machines spécialisées." } },
];


export const meta = pageMeta({
  key: "designs",
  title: {
    en: "Made-to-Measure Menswear in Yaoundé | SAFA Designs",
    fr: "Couture homme sur mesure à Yaoundé | SAFA Designs",
  },
  description: {
    en: "Made-to-measure suits, ceremony and African menswear at Carrefour MEEC, Yaoundé. Delivered to Douala, across Cameroon and abroad. By appointment.",
    fr: "Costumes, tenues de cérémonie et tenues africaines sur mesure au Carrefour MEEC, Yaoundé. Livraison à Douala, au Cameroun et à l'étranger.",
  },
  image: "/og/designs.jpg",
  jsonLd: (lang) => [breadcrumb(lang, TRAIL), faqPage(lang, DESIGNS_FAQ)],
});

export default function Designs() {
  const lang = useLang();
  const hero = pageHero("designs", lang);
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow="SAFA Designs · Carrefour MEEC"
        title={hero.title ?? (lang === "fr" ? (
            <>
              Coupé pour vous. <em className="italic text-designs">Cousu</em> pour durer.
            </>
          ) : (
            <>
              Cut for you. <em className="italic text-designs">Sewn</em> to last.
            </>
          ))}
        lede={hero.lede}
        layout="split"
        image={hero.image}
        imageAlt={hero.imageAlt}
        media={hero.image ? undefined : (
          <AmbientVideo
            lang={lang}
            video="atelier"
            label={lang === "fr" ? "Visite du showroom SAFA Designs : chemises, tuniques et pantalons sur les portants" : "A walk through the SAFA Designs showroom: shirts, tunics and trousers on the rails"}
            className="grain aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5]"
          />
        )}
      >
        <Button asChild variant="primary">
          <Link to={`${href("contact", lang)}?d=designs`}>
            {lang === "fr" ? "Prendre rendez-vous" : "Book a fitting"} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </PageHero>

      {/* The stitch: a chalk dash that closes into a seam */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <div data-trace className="relative">
            <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-8 w-full" aria-hidden>
              <path className="trace-stitch" d="M0 20 C 200 4, 400 36, 600 20 S 1000 4, 1200 20" pathLength={220} />
            </svg>
          </div>
          <SectionHead
            className="mt-10"
            index="01"
            eyebrow={lang === "fr" ? "L'atelier" : "The atelier"}
            title={lang === "fr" ? "Ce que nous confectionnons." : "What we make."}
          />
          <ul className="mt-12 grid gap-px border-y border-ink/12 bg-ink/12 md:grid-cols-3">
            {GARMENTS.map((g, i) => (
              <li key={g.name.en} className="bg-ivory py-7 md:px-8 md:first:pl-0" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="text-[1.625rem] leading-tight">{g.name[lang]}</h3>
                <p className="mt-2 text-[0.9375rem] text-muted">{g.body[lang]}</p>
              </li>
            ))}
          </ul>
          <Lookbook lang={lang} />
        </div>
      </section>

      <section className="on-dark bg-navy-900 py-20 text-ivory md:py-28" style={{ ["--accent" as string]: "var(--color-gold-300)" }}>
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Picture name={IMG.sewing} alt={lang === "fr" ? "Machine à coudre industrielle en gros plan" : "Close-up of an industrial sewing machine"} sizes="(min-width: 64rem) 45vw, 100vw" className="hover-zoom grain aspect-[4/3]" />
          <SectionHead
            tone="dark"
            index="02"
            eyebrow={lang === "fr" ? "Machines spécialisées" : "Specialised machines"}
            title={lang === "fr" ? "La précision de la main, la régularité de la machine." : "The precision of the hand, the consistency of the machine."}
            lede={
              lang === "fr"
                ? "Notre atelier travaille sur des machines spécialisées pour des coutures nettes, des boutonnières précises et des finitions soignées — les mêmes sur lesquelles se forment nos apprentis."
                : "Our atelier works on specialised machines for clean seams, precise buttonholes and careful finishing — the same machines our apprentices train on."
            }
          />
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="03" eyebrow={lang === "fr" ? "Le sur-mesure" : "Made to measure"} title={lang === "fr" ? "De la mesure à la dernière couture." : "From the first measure to the last stitch."} />
          <div className="mt-12">
            <Steps lang={lang} items={PROCESS} />
          </div>
        </div>
      </section>

      {/* Training teaser */}
      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6" data-reveal>
            <p className="eyebrow text-designs">{lang === "fr" ? "Centre de formation agréé MINEFOP" : "MINEFOP-approved training centre"}</p>
            <h2 className="mt-5 text-display-md">{lang === "fr" ? "Apprendre la couture à l'atelier." : "Learn tailoring in the atelier."}</h2>
            <p className="mt-6 text-lede text-muted">
              {lang === "fr"
                ? "Formation et apprentissage en couture, dans un centre agréé par le Ministère de l'Emploi et de la Formation Professionnelle."
                : "Tailoring training and apprenticeship in a centre approved by Cameroon's Ministry of Employment and Vocational Training."}
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link to={href("training", lang)} viewTransition>
                {lang === "fr" ? "Découvrir la formation" : "About the training"} <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
          <div className="md:col-span-6">
            <Picture
              name={IMG.atelierArch}
              alt={lang === "fr" ? "Une veste en lin sur mannequin, dans l'atelier SAFA Designs" : "A linen jacket on a mannequin in the SAFA Designs atelier"}
              sizes="(min-width: 48rem) 28rem, 100vw"
              className="hover-zoom grain mx-auto aspect-[4/5] max-w-md md:mr-0"
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="04" eyebrow="FAQ" title={lang === "fr" ? "Avant votre rendez-vous." : "Before your appointment."} />
          <FaqList lang={lang} items={DESIGNS_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="designs"
        title={{ en: "Have an occasion coming up?", fr: "Un événement approche ?" }}
        body={{ en: "Book a measuring appointment at the atelier — tell us the date you need it by.", fr: "Réservez une prise de mesures à l'atelier — indiquez-nous la date souhaitée." }}
      />
    </>
  );
}

function Lookbook({ lang }: { lang: Lang }) {
  const lb = useLightbox(LOOKS);
  return (
    <div className="mt-16 md:mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="text-display-sm">{lang === "fr" ? "Sorti de l'atelier" : "Out of the atelier"}</h3>
        <Link to={`${href("gallery", lang)}?c=designs`} className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
          {lang === "fr" ? "Voir la galerie" : "View the gallery"}
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      <ul className="fade-x -mx-(--gutter) mt-8 flex snap-x snap-mandatory scroll-px-(--gutter) gap-4 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-6 lg:gap-4">
        {LOOKS.map((it, i) => (
          <li key={it.id} className="w-[58%] shrink-0 snap-start sm:w-[38%] md:w-auto" data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
            <GalleryTile item={it} lang={lang} onOpen={() => lb.open(i)} pictureClass="aspect-[3/4]" sizes="(min-width: 64rem) 15vw, (min-width: 48rem) 30vw, 58vw" />
            <p className="mt-3 text-[0.9375rem] leading-snug">{LOOK_NAME[it.id]?.[lang]}</p>
          </li>
        ))}
      </ul>
      <Lightbox lang={lang} items={LOOKS} index={lb.index} setIndex={lb.setIndex} close={lb.close} />
    </div>
  );
}
