import { ArrowRight, BadgeCheck, Check } from "lucide-react";
import { Link } from "react-router";
import { CtaBand } from "~/components/sections/CtaBand";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, Steps } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { Picture } from "~/components/ui/Picture";
import { IMG } from "~/content/media-map";
import { MINEFOP, isTodo } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { href, type T } from "~/lib/i18n";
import { abs, breadcrumb, faqPage, pageMeta } from "~/lib/seo";
import { TRAINING_FAQ } from "~/content/faqs";

const TRAIL = [
  { key: "designs" as const, name: { en: "SAFA Designs", fr: "SAFA Designs" } },
  { key: "training" as const, name: { en: "Training centre", fr: "Centre de formation" } },
];

/** CLIENT_TODO: confirm modules, duration, intake dates and admission requirements. */
const LEARN: T[] = [
  { en: "Taking measurements and reading a body", fr: "La prise de mesures et la lecture de la morphologie" },
  { en: "Pattern drafting and cutting", fr: "Le patronage et la coupe" },
  { en: "Operating and maintaining specialised machines", fr: "L’utilisation et l’entretien des machines spécialisées" },
  { en: "Assembly, seams and finishing", fr: "L’assemblage, les coutures et les finitions" },
  { en: "Men's garments: shirts, trousers, suits, African wear", fr: "Le vêtement homme : chemises, pantalons, costumes, tenues africaines" },
  { en: "Working with clients in a real atelier", fr: "La relation avec la clientèle, dans un véritable atelier" },
];

const STEPS: { title: T; body: T }[] = [
  { title: { en: "Get in touch", fr: "Prendre contact" }, body: { en: "Message us or send the form with your name and background.", fr: "Écrivez-nous, ou envoyez le formulaire avec votre nom et votre parcours." } },
  { title: { en: "Visit the atelier", fr: "Visiter l’atelier" }, body: { en: "Meet the trainers, see the machines, ask your questions.", fr: "Rencontrez les formateurs, découvrez les machines, posez vos questions." } },
  { title: { en: "Enrol", fr: "S’inscrire" }, body: { en: "We confirm the programme, the start date and the fees.", fr: "Nous vous confirmons le programme, la date de rentrée et les frais de formation." } },
  { title: { en: "Learn by doing", fr: "Apprendre par la pratique" }, body: { en: "Train on real garments, at the machine, from the first weeks.", fr: "Vous travaillez sur de vraies tenues, à la machine, dès les premières semaines." } },
];


export const meta = pageMeta({
  key: "training",
  title: {
    en: "Tailoring Training in Yaoundé, MINEFOP-Approved | SAFA",
    fr: "Formation couture à Yaoundé, centre agréé MINEFOP | SAFA",
  },
  description: {
    en: "Learn men's tailoring at SAFA Designs, a MINEFOP-approved training centre at Carrefour MEEC, Yaoundé. Hands-on training on specialised machines.",
    fr: "Formation en couture homme chez SAFA Designs, centre agréé par le MINEFOP au Carrefour MEEC, Yaoundé. Pratique sur machines spécialisées, à l’atelier.",
  },
  image: "/og/training.jpg",
  jsonLd: (lang) => [
    breadcrumb(lang, TRAIL),
    {
      "@type": "Course",
      name: lang === "fr" ? "Formation en couture homme" : "Men's tailoring training",
      description:
        lang === "fr"
          ? "Formation et apprentissage en couture homme sur machines spécialisées, dans un centre agréé par le MINEFOP à Yaoundé."
          : "Men's tailoring training and apprenticeship on specialised machines, in a MINEFOP-approved centre in Yaoundé.",
      inLanguage: "fr",
      url: abs(href("training", lang)),
      provider: { "@id": `${abs("")}/#designs` },
    },
    faqPage(lang, TRAINING_FAQ),
  ],
});

export default function Training() {
  const lang = useLang();
  const hasNumber = !isTodo(MINEFOP.agrement);
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow={lang === "fr" ? "Centre de formation agréé par le MINEFOP" : "MINEFOP-approved training centre"}
        title={lang === "fr" ? "La couture s’apprend à la machine, et à la main." : "Learn tailoring, by machine and by hand."}
        lede={
          lang === "fr"
            ? "Formation et apprentissage en couture homme au sein de l’atelier SAFA Designs, au Carrefour MEEC. Un centre agréé par le Ministère de l’Emploi et de la Formation professionnelle (MINEFOP)."
            : "Men's tailoring training and apprenticeship inside the SAFA Designs atelier at Carrefour MEEC — a centre approved by Cameroon's Ministry of Employment and Vocational Training."
        }
        image={IMG.atelierTunic}
        imageAlt={lang === "fr" ? "Une tunique en lin achevée à l’atelier SAFA Designs" : "A finished linen tunic in the SAFA Designs atelier"}
        layout="split"
      >
        <Button asChild variant="primary">
          <Link to={`${href("contact", lang)}?d=designs&t=training`}>
            {lang === "fr" ? "Demander les modalités d’inscription" : "Ask about enrolment"} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead index="01" eyebrow={lang === "fr" ? "Le programme" : "The programme"} title={lang === "fr" ? "Ce que vous apprendrez." : "What you'll learn."} />
            <div className="mt-10 flex items-start gap-4 border border-designs/25 bg-designs/5 p-6" data-reveal>
              <BadgeCheck className="mt-0.5 size-6 shrink-0 text-designs" aria-hidden />
              <div>
                <p className="font-display text-2xl leading-tight">{lang === "fr" ? "Centre agréé par le MINEFOP" : "MINEFOP-approved centre"}</p>
                <p className="mt-2 text-sm text-muted">
                  {hasNumber
                    ? `${lang === "fr" ? "Agrément n°" : "Approval no."} ${MINEFOP.agrement}`
                    : lang === "fr"
                      ? "Ministère de l’Emploi et de la Formation professionnelle"
                      : "Ministry of Employment and Vocational Training"}
                </p>
              </div>
            </div>
          </div>
          <ul className="divide-y divide-ink/12 border-y border-ink/12">
            {LEARN.map((l, i) => (
              <li key={l.en} className="flex items-baseline gap-5 py-5" data-reveal>
                <span className="tabular w-6 text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[1.0625rem]">{l[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x grid gap-10 md:grid-cols-12 md:items-center">
          <Picture name={IMG.cutting} alt={lang === "fr" ? "Table de coupe, patron et craie de tailleur" : "Cutting table with pattern and chalk"} sizes="(min-width: 48rem) 50vw, 100vw" className="hover-zoom grain aspect-[4/3] md:col-span-6" />
          <div className="md:col-span-6" data-reveal>
            <SectionHead
              index="02"
              eyebrow={lang === "fr" ? "La méthode" : "The method"}
              title={lang === "fr" ? "On apprend à l’atelier, sur de vraies tenues." : "You learn in the atelier, on real garments."}
              lede={
                lang === "fr"
                  ? "Nos apprentis travaillent aux côtés de tailleurs expérimentés, sur les machines de l’atelier. Chaque trait de craie compte, chaque couture aussi."
                  : "Our apprentices work alongside experienced tailors, on the atelier's machines. Every chalk line and every seam counts."
              }
            />
            {/* CLIENT_TODO: confirm group size, client-work practice and teaching language. */}
            <ul className="mt-8 space-y-3">
              {[
                { en: "Small groups at the machine", fr: "Petits groupes à la machine" },
                { en: "Real client work as you progress", fr: "De vraies commandes de clients, à mesure que vous progressez" },
                { en: "Training in French — ask us about English", fr: "Formation en français ; renseignez-vous pour l’anglais" },
              ].map((b) => (
                <li key={b.en} className="flex items-start gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-designs" aria-hidden />
                  {b[lang]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="03" eyebrow={lang === "fr" ? "Inscription" : "Enrolment"} title={lang === "fr" ? "Comment rejoindre l’atelier." : "How to join the atelier."} />
          <div className="mt-12">
            <Steps lang={lang} items={STEPS} />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="04" eyebrow="FAQ" title={lang === "fr" ? "Vos questions sur la formation." : "About the training."} />
          <FaqList lang={lang} items={TRAINING_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="designs"
        title={{ en: "Ready to learn the craft?", fr: "Envie d’apprendre le métier ?" }}
        body={{ en: "Ask us about the next intake, the programme and the fees.", fr: "Renseignez-vous sur la prochaine rentrée, le programme et les frais de formation." }}
        waMessage={
          lang === "fr"
            ? "Bonjour SAFA Designs, je souhaiterais des informations sur la formation en couture (prochaine rentrée, durée, frais)."
            : "Hello SAFA Designs, I'd like information about the tailoring training (next intake, duration, fees)."
        }
      />
    </>
  );
}
