import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { PageHero } from "~/components/sections/PageHero";
import { SectionHead, TraceLine } from "~/components/sections/primitives";
import { IMG } from "~/content/media-map";
import { DIVISION_LIST } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { href, type T } from "~/lib/i18n";
import { breadcrumb, pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "about" as const, name: { en: "About", fr: "À propos" } }];

export const meta = pageMeta({
  key: "about",
  title: { en: "About SAFA & Co SARL — Three Houses in Yaoundé", fr: "À propos de SAFA & Co SARL — trois maisons, Yaoundé" },
  description: {
    en: "SAFA & Co SARL is a Cameroonian group in Yaoundé — SAFA Construction, SAFA Apartments and SAFA Designs — with one standard of precision.",
    fr: "SAFA & Co SARL, groupe camerounais basé à Yaoundé : SAFA Construction, SAFA Apartments et SAFA Designs, avec une même exigence de précision.",
  },
  jsonLd: (lang) => [breadcrumb(lang, TRAIL)],
});

const VALUES: { t: T; b: T }[] = [
  {
    t: { en: "Precision", fr: "Précision" },
    b: {
      en: "A straight chalk line, a constant render, a well-cut seam. We measure before we act.",
      fr: "Un trait de craie droit, un enduit régulier, une couture bien coupée. Nous mesurons avant d'agir.",
    },
  },
  {
    t: { en: "Our own hands", fr: "Nos propres mains" },
    b: {
      en: "Our teams deliver the machines, welcome the guests and cut the cloth themselves.",
      fr: "Nos équipes livrent les machines, accueillent les hôtes et coupent le tissu elles-mêmes.",
    },
  },
  {
    t: { en: "New methods, here", fr: "De nouvelles méthodes, ici" },
    b: {
      en: "We bring tools that are still rare in Cameroon — like automatic plastering — to Yaoundé's sites.",
      fr: "Nous apportons sur les chantiers de Yaoundé des outils encore rares au Cameroun, comme le crépissage automatique.",
    },
  },
  {
    t: { en: "Passing it on", fr: "Transmettre" },
    b: {
      en: "Through our MINEFOP-approved centre, the craft is taught to the next generation.",
      fr: "Grâce à notre centre agréé MINEFOP, le métier se transmet à la génération suivante.",
    },
  },
];

export default function About() {
  const lang = useLang();
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow="SAFA & Co SARL"
        title={lang === "fr" ? "Trois maisons, un même geste." : "Three houses, one gesture."}
        lede={
          lang === "fr"
            ? "SAFA & Co SARL est un groupe camerounais basé à Yaoundé. Nous équipons les chantiers, accueillons des hôtes et habillons les hommes — avec la même exigence de précision."
            : "SAFA & Co SARL is a Cameroonian group based in Yaoundé. We equip building sites, host guests and dress men — with the same standard of precision."
        }
        image={IMG.city}
        imageAlt={lang === "fr" ? "Vue de Yaoundé" : "A view of Yaoundé"}
      />

      <section className="py-20 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead index="01" eyebrow={lang === "fr" ? "Notre idée" : "Our idea"} title={lang === "fr" ? "Tout commence par un trait." : "Everything starts with a line."} />
          <div className="space-y-6 text-lede text-muted" data-reveal>
            <p>
              {lang === "fr"
                ? "Avant de crépir un mur, le maçon tend un cordeau et claque un trait de craie. Avant de couper un tissu, le tailleur trace sa ligne. Avant d'accueillir un hôte, on dessine un lieu où il se sentira chez lui."
                : "Before rendering a wall, the builder stretches a line and snaps it with chalk. Before cutting cloth, the tailor draws his line. Before welcoming a guest, you design a place where they'll feel at home."}
            </p>
            <p>
              {lang === "fr"
                ? "C'est ce geste que partagent nos trois maisons. SAFA & Co les réunit sous une même signature : faire juste, du premier trait à la finition."
                : "That gesture is what our three houses share. SAFA & Co brings them together under one signature: get it right, from the first line to the finish."}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="02" eyebrow={lang === "fr" ? "Nos valeurs" : "What we hold to"} title={lang === "fr" ? "Ce qui nous guide." : "What guides us."} />
          <ul className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-2">
            {VALUES.map((v) => (
              <li key={v.t.en} className="bg-ivory-2 py-8 sm:p-10" data-reveal>
                <TraceLine className="w-10" scroll={false} />
                <h3 className="mt-6 text-3xl">{v.t[lang]}</h3>
                <p className="mt-3 max-w-md text-muted">{v.b[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="03" eyebrow={lang === "fr" ? "Le groupe" : "The group"} title={lang === "fr" ? "Nos trois divisions." : "Our three divisions."} />
          <ul className="mt-12 divide-y divide-ink/12 border-y border-ink/12">
            {DIVISION_LIST.map((d, i) => (
              <li key={d.key} style={{ ["--accent" as string]: d.accentVar }}>
                <Link to={href(d.page, lang)} className="group grid gap-3 py-8 md:grid-cols-[4rem_1fr_1.4fr_auto] md:items-baseline md:gap-8">
                  <span className="tabular text-xs text-muted">0{i + 1}</span>
                  <span className="font-display text-[2.25rem] leading-none" style={{ color: "var(--accent)" }}>
                    {d.name}
                  </span>
                  <span className="text-muted">{d.tagline[lang]}</span>
                  <ArrowRight className="hidden size-5 transition-transform group-hover:translate-x-1 md:block" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        lang={lang}
        title={{ en: "Work with SAFA & Co.", fr: "Travailler avec SAFA & Co." }}
        body={{ en: "Tell us what you need — we'll put you in touch with the right team.", fr: "Dites-nous ce dont vous avez besoin — nous vous mettons en relation avec la bonne équipe." }}
      />
    </>
  );
}
