import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, Steps } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { IMG } from "~/content/media-map";
import { useLang } from "~/lib/hooks";
import { href, type T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta } from "~/lib/seo";
import { DESIGNS_FAQ } from "~/content/faqs";

const TRAIL = [{ key: "designs" as const, name: { en: "SAFA Designs", fr: "SAFA Designs" } }];

/** CLIENT_TODO: confirm the garment list with the atelier. */
const GARMENTS: { name: T; body: T; img: string }[] = [
  {
    name: { en: "Suits & ceremony wear", fr: "Costumes & tenues de cérémonie" },
    body: { en: "Cut to your measurements for weddings, work and official occasions.", fr: "Coupés à vos mesures pour les mariages, le travail et les cérémonies officielles." },
    img: IMG.menswear,
  },
  {
    name: { en: "Traditional & modern African wear", fr: "Tenues africaines, traditionnelles & modernes" },
    body: { en: "Boubous, agbadas, tunics and shirts in the fabric you choose.", fr: "Boubous, agbadas, tuniques et chemises dans le tissu de votre choix." },
    img: IMG.fabric,
  },
  {
    name: { en: "Shirts & everyday pieces", fr: "Chemises & pièces du quotidien" },
    body: { en: "Well-fitting shirts and trousers that last, made to measure.", fr: "Des chemises et pantalons bien ajustés, faits pour durer, sur mesure." },
    img: IMG.tape,
  },
];

const PROCESS: { title: T; body: T }[] = [
  { title: { en: "Measure", fr: "Mesurer" }, body: { en: "We take your measurements at the atelier, by appointment.", fr: "Nous prenons vos mesures à l'atelier, sur rendez-vous." } },
  { title: { en: "Choose", fr: "Choisir" }, body: { en: "Cut, fabric, details — bring your fabric or choose with us.", fr: "Coupe, tissu, finitions — apportez votre tissu ou choisissez avec nous." } },
  { title: { en: "Fit", fr: "Essayer" }, body: { en: "A fitting to adjust the garment on you before finishing.", fr: "Un essayage pour ajuster la pièce sur vous avant la finition." } },
  { title: { en: "Finish", fr: "Finir" }, body: { en: "Clean seams and pressing on our specialised machines.", fr: "Coutures nettes et repassage sur nos machines spécialisées." } },
];


export const meta = pageMeta({
  key: "designs",
  title: {
    en: "Made-to-measure menswear in Yaoundé | SAFA Designs, Carrefour MEEC",
    fr: "Couture homme sur mesure à Yaoundé | SAFA Designs, Carrefour MEEC",
  },
  description: {
    en: "Suits, ceremony and African menswear made to measure at Carrefour MEEC, Yaoundé. Specialised machines and a MINEFOP-approved sewing school. By appointment.",
    fr: "Costumes, tenues de cérémonie et tenues africaines pour homme, sur mesure au Carrefour MEEC, Yaoundé. Machines spécialisées et centre de formation agréé MINEFOP. Sur rendez-vous.",
  },
  image: "/og/designs.jpg",
  jsonLd: (lang) => [breadcrumb(lang, TRAIL), faqPage(lang, DESIGNS_FAQ)],
});

export default function Designs() {
  const lang = useLang();
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow="SAFA Designs · Carrefour MEEC"
        title={
          lang === "fr" ? (
            <>
              Coupé pour vous. <em className="italic text-designs">Cousu</em> pour durer.
            </>
          ) : (
            <>
              Cut for you. <em className="italic text-designs">Sewn</em> to last.
            </>
          )
        }
        lede={
          lang === "fr"
            ? "Tenues homme sur mesure — costumes, tenues de cérémonie et tenues africaines — réalisées sur nos machines spécialisées, au Carrefour MEEC. Sur rendez-vous."
            : "Made-to-measure menswear — suits, ceremony wear and African garments — finished on our specialised machines at Carrefour MEEC. By appointment."
        }
        image={IMG.designs}
        imageAlt={lang === "fr" ? "Un tailleur au travail dans un atelier" : "A tailor at work in an atelier"}
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
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {GARMENTS.map((g, i) => (
              <article key={g.name.en} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                <Picture name={g.img} alt="" sizes="(min-width: 48rem) 30vw, 100vw" className="grain aspect-[3/4]" />
                <h3 className="mt-6 text-[1.75rem] leading-tight">{g.name[lang]}</h3>
                <p className="mt-2 text-muted">{g.body[lang]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="on-dark bg-navy-900 py-20 text-ivory md:py-28" style={{ ["--accent" as string]: "var(--color-gold-300)" }}>
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <Picture name={IMG.sewing} alt={lang === "fr" ? "Machine à coudre industrielle en gros plan" : "Close-up of an industrial sewing machine"} sizes="(min-width: 64rem) 45vw, 100vw" className="grain aspect-[4/3]" />
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
          <Picture name={IMG.classroom} alt="" sizes="(min-width: 48rem) 50vw, 100vw" className="grain aspect-[4/3] md:col-span-6" />
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
