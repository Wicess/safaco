import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "~/components/sections/ContactForm";
import { Breadcrumbs, TraceLine } from "~/components/sections/primitives";
import { WhatsAppIcon } from "~/components/ui/icons";
import { DIVISION_LIST, SITE, greeting, telLink, waLink } from "~/content/site";
import { UI } from "~/content/ui";
import { useLang } from "~/lib/hooks";
import { breadcrumb, pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "contact" as const, name: { en: "Contact", fr: "Contact" } }];

export const meta = pageMeta({
  key: "contact",
  title: { en: "Contact SAFA & Co, Yaoundé — WhatsApp, Phone, Enquiry", fr: "Contacter SAFA & Co, Yaoundé — WhatsApp, téléphone" },
  description: {
    en: "Reach SAFA Construction, SAFA Apartments or SAFA Designs in Yaoundé by WhatsApp, phone or the enquiry form. Addresses and opening hours for each division.",
    fr: "Contactez SAFA Construction, SAFA Apartments ou SAFA Designs à Yaoundé par WhatsApp, téléphone ou formulaire. Adresses et horaires de chaque activité.",
  },
  jsonLd: (lang) => [breadcrumb(lang, TRAIL)],
});

export default function Contact() {
  const lang = useLang();
  return (
    <>
      <section className="pt-[calc(var(--header-h)+0.25rem)] md:pt-[calc(var(--header-h)+1.25rem)]">
        <div className="container-x">
          <div className="text-muted">
            <Breadcrumbs lang={lang} trail={TRAIL} />
          </div>
          <div className="mx-auto mt-8 max-w-3xl text-center md:mt-10">
            <h1 className="vt-title text-[clamp(2.5rem,1.6rem+3.6vw,5rem)] leading-[0.98] tracking-[-0.015em]">
              {lang === "fr" ? (
                <>
                  Parlons de votre <em className="italic text-gold-600">projet.</em>
                </>
              ) : (
                <>
                  Let's talk about your <em className="italic text-gold-600">project.</em>
                </>
              )}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lede text-muted [text-wrap:balance]">
              {lang === "fr"
                ? "Un appel, un message WhatsApp ou une demande écrite : le bon interlocuteur vous répond."
                : "A call, a WhatsApp message or a written enquiry: the right division answers you."}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-[1.0625rem] font-medium underline decoration-gold/60 underline-offset-[6px] hover:decoration-gold-600"
            >
              <Mail className="size-4 text-gold-600" aria-hidden />
              {SITE.email}
            </a>
            <TraceLine className="mx-auto mt-6 w-24 md:mt-8" scroll={false} />
          </div>
        </div>
      </section>

      <section className="pb-14 pt-10 md:pb-20 md:pt-14">
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
                    {d.address.mapsUrl && (
                      <a href={d.address.mapsUrl} rel="noopener" target="_blank" className="mt-1 block text-sm font-medium underline underline-offset-4">
                        {UI.directions[lang]}
                      </a>
                    )}
                  </span>
                </li>
                {d.phone && (
                  <li className="flex gap-3">
                    <Phone className="mt-1 size-4 shrink-0 text-muted" aria-label={UI.call[lang]} />
                    <span>
                      <a href={telLink(d.phone)} className="-my-3 inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                        {d.phone}
                      </a>
                    </span>
                  </li>
                )}
                {d.email && (
                  <li className="flex gap-3">
                    <Mail className="mt-1 size-4 shrink-0 text-muted" aria-label={lang === "fr" ? "E-mail" : "Email"} />
                    <span className="min-w-0">
                      <a
                        href={`mailto:${d.email}?subject=${encodeURIComponent(d.name)}`}
                        className="-my-3 inline-flex min-h-11 items-center break-all underline-offset-4 hover:underline"
                      >
                        {d.email}
                      </a>
                    </span>
                  </li>
                )}
              </ul>
              {d.whatsapp ? (
              <a
                href={waLink(d.whatsapp, greeting(d.key, lang))}
                rel="noopener"
                className="mt-6 inline-flex min-h-12 items-center gap-3 bg-[#1f7a4d] px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#186540]"
              >
                <WhatsAppIcon className="size-5" />
                WhatsApp
              </a>
              ) : (
                <a
                  href="#enquiry"
                  className="mt-6 inline-flex min-h-12 items-center gap-3 bg-navy-900 px-5 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ivory hover:bg-navy-700"
                >
                  {lang === "fr" ? "Passer par le formulaire" : "Write via the form"}
                </a>
              )}
            </article>
          ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-(--header-h) bg-ivory-2 py-20 md:py-28">
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
