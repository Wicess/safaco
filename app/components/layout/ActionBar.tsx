import { MessageSquareText, Phone } from "lucide-react";
import { Link } from "react-router";
import { DIVISIONS, GROUP_CONTACT, greeting, telLink, waLink, type DivisionKey } from "~/content/site";
import { UI } from "~/content/ui";
import { href, type Lang } from "~/lib/i18n";
import { WhatsAppIcon } from "../ui/icons";

/**
 * Thumb-zone action bar on phones: WhatsApp · Call · Enquire.
 * Plain links — works with JavaScript off. Targets follow the current division.
 */
export function ActionBar({ lang, division }: { lang: Lang; division?: DivisionKey }) {
  const d = division ? DIVISIONS[division] : undefined;
  const wa = d?.whatsapp ?? GROUP_CONTACT.whatsapp;
  const phone = d?.phone ?? GROUP_CONTACT.phone;
  const cell = "flex min-h-(--bar-h) flex-1 flex-col items-center justify-center gap-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]";
  return (
    <nav
      aria-label={UI.contact[lang]}
      className="on-dark fixed inset-x-0 bottom-0 z-30 flex border-t border-ivory/10 bg-navy-950 pb-[env(safe-area-inset-bottom)] text-ivory lg:hidden"
    >
      <a href={waLink(wa, greeting(division ?? "group", lang))} className={`${cell} bg-[#1f7a4d]`} rel="noopener">
        <WhatsAppIcon className="size-5" />
        {UI.whatsapp[lang]}
      </a>
      <a href={telLink(phone)} className={cell}>
        <Phone className="size-[1.125rem] text-gold-300" aria-hidden />
        {UI.call[lang]}
      </a>
      <Link
        to={`${href("contact", lang)}${division ? `?d=${division}` : ""}`}
        className={`${cell} border-l border-ivory/10`}
      >
        <MessageSquareText className="size-[1.125rem] text-gold-300" aria-hidden />
        {UI.quote[lang]}
      </Link>
    </nav>
  );
}
