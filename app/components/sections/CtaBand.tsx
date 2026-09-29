import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router";
import { DIVISIONS, GROUP_CONTACT, greeting, telLink, waLink, type DivisionKey } from "~/content/site";
import { UI } from "~/content/ui";
import { href, type Lang, type T } from "~/lib/i18n";
import { Button } from "../ui/button";
import { WhatsAppIcon } from "../ui/icons";
import { TraceLine } from "./primitives";

/** Closing call-to-action. Always three routes: WhatsApp (primary in Cameroon), call, form. */
export function CtaBand({
  lang,
  division,
  title,
  body,
  waMessage,
}: {
  lang: Lang;
  division?: DivisionKey;
  title: T;
  body: T;
  waMessage?: string;
}) {
  const d = division ? DIVISIONS[division] : undefined;
  const wa = d?.whatsapp ?? GROUP_CONTACT.whatsapp;
  const phone = d?.phone ?? GROUP_CONTACT.phone;
  return (
    <section className="on-dark relative overflow-hidden bg-navy-900 text-ivory">
      <div className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div data-reveal>
          <TraceLine className="mb-10 w-24" style={{ ["--accent" as string]: "var(--color-gold)" }} />
          <h2 className="text-display-lg text-ivory">{title[lang]}</h2>
          <p className="mt-6 max-w-xl text-lede text-ivory/70">{body[lang]}</p>
        </div>
        <div className="flex flex-col gap-3" data-reveal>
          <Button asChild variant="gold" size="lg" className="w-full justify-between">
            <a href={waLink(wa, waMessage ?? greeting(division ?? "group", lang))} rel="noopener">
              <span className="flex items-center gap-3">
                <WhatsAppIcon className="size-5!" />
                {UI.writeWhatsapp[lang]}
              </span>
              <ArrowRight aria-hidden />
            </a>
          </Button>
          <Button asChild variant="outline-light" size="lg" className="w-full justify-between">
            <a href={telLink(phone)}>
              <span className="flex items-center gap-3">
                <Phone aria-hidden />
                {phone}
              </span>
              <ArrowRight aria-hidden />
            </a>
          </Button>
          <Link
            to={`${href("contact", lang)}${division ? `?d=${division}` : ""}`}
            className="mt-2 inline-flex min-h-11 items-center gap-2 self-start text-sm text-ivory/70 underline-offset-4 hover:text-ivory hover:underline"
          >
            {lang === "fr" ? "Ou envoyez une demande écrite" : "Or send a written enquiry"} <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
