import { MapPin, Phone } from "lucide-react";
import { ContactForm } from "~/components/sections/ContactForm";
import { Breadcrumbs, TraceLine } from "~/components/sections/primitives";
import { WhatsAppIcon } from "~/components/ui/icons";
import { DIVISION_LIST, greeting, telLink, waLink } from "~/content/site";
import { UI } from "~/content/ui";
import { useLang } from "~/lib/hooks";
import { breadcrumb, pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "contact" as const, name: { en: "Contact", fr: "Contact" } }];

export const meta = pageMeta({
  key: "contact",
  title: { en: "Contact SAFA & Co, Yaoundé — WhatsApp, Phone, Enquiry", fr: "Contacter SAFA & Co, Yaoundé — WhatsApp, téléphone" },
  description: {
    en: "Reach SAFA Construction, SAFA Apartments or SAFA Designs in Yaoundé by WhatsApp, phone or the enquiry form. Addresses and opening hours for each division.",
    fr: "Joignez SAFA Construction, SAFA Apartments ou SAFA Designs à Yaoundé par WhatsApp, téléphone ou formulaire. Adresses et horaires de chaque division.",
  },
  jsonLd: (lang) => [breadcrumb(lang, TRAIL)],
});

export default function Contact() {
  const lang = useLang();
  return (
    <>
      <section className="pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+3rem)]">
        <div className="container-x">
          <div className="text-muted">
            <Breadcrumbs lang={lang} trail={TRAIL} />
          </div>
          <h1 className="vt-title mt-10 max-w-4xl text-display-lg md:mt-16">
            {lang === "fr" ? "Parlons de votre projet." : "Let's talk about your project."}
          </h1>
          <p className="mt-6 max-w-2xl text-lede text-muted">
            {lang === "fr"
              ? "Le plus rapide : WhatsApp. Vous pouvez aussi nous appeler ou laisser une demande écrite — la bonne division vous répond."
              : "Fastest: WhatsApp. You can also call us or leave a written enquiry — the right division will answer you."}
          </p>
          <TraceLine className="mt-12" scroll={false} />
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container-x">
          <div className="grid gap-px bg-ink/10 md:grid-cols-3">
          {DIVISION_LIST.map((d) => (
            <article key={d.key} className="bg-ivory py-8 md:px-8" style={{ ["--accent" as string]: d.accentVar }}>
              <p className="eyebrow" style={{ color: "var(--accent)" }}>
                {d.name}
              </p>
              <p className="mt-4 font-display text-2xl leading-snug">{d.tagline[lang]}</p>
              <ul className="mt-6 space-y-3 text-[0.9375rem]">
                <li className="flex gap-3">
                  <MapPin className="mt-1 size-4 shrink-0 text-muted" aria-label={UI.address[lang]} />
                  <span>
                    {d.address.line[lang]}
                    <span className="block text-sm text-muted">{d.hours[lang]}</span>
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-1 size-4 shrink-0 text-muted" aria-label={UI.call[lang]} />
                  <span>
                    <a href={telLink(d.phone)} className="underline-offset-4 hover:underline">
                      {d.phone}
                    </a>
                  </span>
                </li>
              </ul>
              <a
                href={waLink(d.whatsapp, greeting(d.key, lang))}
                rel="noopener"
                className="mt-6 inline-flex min-h-12 items-center gap-3 bg-[#1f7a4d] px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#186540]"
              >
                <WhatsAppIcon className="size-5" />
                WhatsApp
              </a>
            </article>
          ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow text-gold-600">{lang === "fr" ? "Demande écrite" : "Written enquiry"}</p>
            <h2 className="mt-5 text-display-md">{lang === "fr" ? "Envoyez-nous les détails." : "Send us the details."}</h2>
            <p className="mt-6 text-muted">
              {lang === "fr"
                ? "Plus votre message est précis (lieu, surface, dates, nombre de personnes, occasion), plus notre réponse le sera."
                : "The more precise your message (location, surface, dates, number of guests, occasion), the more precise our answer."}
            </p>
          </div>
          <ContactForm lang={lang} />
        </div>
      </section>
    </>
  );
}
