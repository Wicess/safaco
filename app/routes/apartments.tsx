import { ArrowRight, Car, Droplets, Flame, KeyRound, ShieldCheck, Snowflake, Tv, UtensilsCrossed, Wifi, Zap } from "lucide-react";
import type { ComponentType } from "react";
import { CtaBand } from "~/components/sections/CtaBand";
import { GalleryStrip } from "~/components/sections/Gallery";
import { galleryFor } from "~/content/gallery";
import { PageHero } from "~/components/sections/PageHero";
import { FaqList, SectionHead, Steps, TraceLine } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { WhatsAppIcon } from "~/components/ui/icons";
import { Picture } from "~/components/ui/Picture";
import { IMG } from "~/content/media-map";
import { DIVISIONS, waLink } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { pageHero } from "~/content/defaults";
import type { Lang, T } from "~/lib/i18n";
import { breadcrumb, faqPage, pageMeta } from "~/lib/seo";
import { APARTMENTS_FAQ } from "~/content/faqs";

const TRAIL = [{ key: "apartments" as const, name: { en: "SAFA Apartments", fr: "SAFA Apartments" } }];

/**
 * CLIENT_TODO: confirm every amenity below against the real apartments before
 * launch — remove any that don't apply. (These are what Yaoundé guests expect
 * to see listed; research, 2026-09.)
 */
const AMENITIES: { icon: ComponentType<{ className?: string }>; label: T }[] = [
  { icon: Zap, label: { en: "Backup generator", fr: "Groupe électrogène" } },
  { icon: Droplets, label: { en: "Borehole water", fr: "Eau de forage" } },
  { icon: Wifi, label: { en: "Wi-Fi", fr: "Wi-Fi" } },
  { icon: Snowflake, label: { en: "Air conditioning", fr: "Climatisation" } },
  { icon: Flame, label: { en: "Hot water", fr: "Eau chaude" } },
  { icon: UtensilsCrossed, label: { en: "Equipped kitchen", fr: "Cuisine équipée" } },
  { icon: Tv, label: { en: "TV", fr: "Télévision" } },
  { icon: Car, label: { en: "Secure parking", fr: "Parking sécurisé" } },
  { icon: ShieldCheck, label: { en: "Security", fr: "Gardiennage" } },
  { icon: KeyRound, label: { en: "Flexible check-in", fr: "Arrivée flexible" } },
];


export const meta = pageMeta({
  key: "apartments",
  title: {
    en: "Furnished apartments in Yaoundé (Meyo) | SAFA Apartments",
    fr: "Appartements meublés à Yaoundé (Meyo) | SAFA Apartments",
  },
  description: {
    en: "Furnished apartments in Meyo, Yaoundé IV, for short and long stays, for visitors from Douala or abroad. Check availability on WhatsApp.",
    fr: "Appartements meublés à Meyo, Yaoundé IV, pour courts et longs séjours, pour vos visites depuis Douala ou l'étranger. Disponibilités sur WhatsApp.",
  },
  image: "/og/apartments.jpg",
  jsonLd: (lang) => [breadcrumb(lang, TRAIL), faqPage(lang, APARTMENTS_FAQ)],
});

/** The strip leads with the photos not already shown in "The spaces". */
const SHOWN = new Set<string>([IMG.building, IMG.livingDining, IMG.bedroomRose]);
const STRIP = [...galleryFor("apartments")].sort((a, b) => Number(SHOWN.has(a.image)) - Number(SHOWN.has(b.image)));

const STEPS: { title: T; body: T }[] = [
  { title: { en: "Send your dates", fr: "Envoyez vos dates" }, body: { en: "Arrival, departure and number of guests, on WhatsApp or by phone.", fr: "Arrivée, départ et nombre de personnes, sur WhatsApp ou par téléphone." } },
  { title: { en: "We confirm", fr: "Nous confirmons" }, body: { en: "Availability, the rate for your stay and how to pay.", fr: "La disponibilité, le tarif du séjour et le mode de paiement." } },
  { title: { en: "Directions", fr: "L'itinéraire" }, body: { en: "We send the exact location and arrange your arrival time.", fr: "Nous envoyons la localisation exacte et convenons de l'heure d'arrivée." } },
  { title: { en: "Welcome", fr: "Bienvenue" }, body: { en: "Keys, a walk-through of the apartment, and a number to reach us.", fr: "Les clés, une visite de l'appartement et un numéro pour nous joindre." } },
];

export default function Apartments() {
  const lang = useLang();
  const hero = pageHero("apartments", lang);
  return (
    <>
      <PageHero
        lang={lang}
        trail={TRAIL}
        eyebrow="SAFA Apartments · Meyo"
        title={hero.title ?? (lang === "fr" ? "Un chez-soi à Yaoundé, prêt à vivre." : "A home in Yaoundé, ready to live in.")}
        lede={hero.lede}
        layout="split"
        image={hero.image}
        imageAlt={hero.imageAlt ?? (lang === "fr" ? "La résidence SAFA Apartments à Meyo, balcons à arcades sur trois niveaux" : "The SAFA Apartments residence in Meyo, with arched balconies on three floors")}
      >
        <AvailabilityButton lang={lang} />
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-x grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-2 mb-4 md:col-span-4 md:mb-0 md:self-center" data-reveal>
            <p className="eyebrow text-apartments">{lang === "fr" ? "Les espaces" : "The spaces"}</p>
            <p className="mt-6 font-display text-[1.875rem] leading-snug md:text-[2.5rem]">
              {lang === "fr"
                ? "Des pièces calmes, du linge frais, une cuisine où l'on cuisine vraiment."
                : "Quiet rooms, fresh linen, a kitchen you'll actually cook in."}
            </p>
            <TraceLine className="mt-10 w-20" />
          </div>
          <div className="light-sweep md:col-span-5" data-trace>
            <Picture name={IMG.livingDining} alt={lang === "fr" ? "Comptoir repas et salon sous un lustre à anneaux" : "Dining counter and lounge under a ring chandelier"} sizes="(min-width: 48rem) 40vw, 100vw" className="grain aspect-[3/4]" />
          </div>
          <div className="light-sweep mt-10 md:col-span-3 md:mt-40" data-trace>
            <Picture name={IMG.bedroomRose} alt={lang === "fr" ? "Chambre au mur rose et linge frais" : "Bedroom with a rose wall and fresh linen"} sizes="(min-width: 48rem) 24vw, 100vw" className="grain aspect-[3/4]" />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="01" eyebrow={lang === "fr" ? "Équipements" : "Amenities"} title={lang === "fr" ? "Ce qui vous attend." : "What's waiting for you."} />
          <ul className="mt-12 grid grid-cols-2 gap-px bg-ink/10 sm:grid-cols-3 lg:grid-cols-5">
            {AMENITIES.map(({ icon: Icon, label }) => (
              <li key={label.en} className="flex min-h-24 flex-col justify-between gap-4 bg-ivory-2 p-4 sm:min-h-32 sm:p-5" data-reveal>
                <Icon className="size-5 text-apartments" aria-hidden />
                <span className="text-[0.9375rem]">{label[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHead
            eyebrow={lang === "fr" ? "En images" : "In pictures"}
            title={lang === "fr" ? "Visitez avant d'arriver." : "Look around before you arrive."}
          />
          <div className="mt-12">
            <GalleryStrip lang={lang} division="apartments" items={STRIP} />
          </div>
        </div>
      </section>

      <section className="bg-ivory-2 py-20 md:py-28">
        <div className="container-x">
          <SectionHead index="02" eyebrow={lang === "fr" ? "Réserver" : "Booking"} title={lang === "fr" ? "Quatre messages, et vous êtes chez vous." : "Four messages and you're home."} />
          <div className="mt-12">
            <Steps lang={lang} items={STEPS} />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead index="03" eyebrow="FAQ" title={lang === "fr" ? "Avant votre séjour." : "Before your stay."} />
          <FaqList lang={lang} items={APARTMENTS_FAQ} />
        </div>
      </section>

      <CtaBand
        lang={lang}
        division="apartments"
        title={{ en: "When are you coming to Yaoundé?", fr: "Quand venez-vous à Yaoundé ?" }}
        body={{
          en: "Send your dates and the number of guests — we reply with availability and the rate for your stay.",
          fr: "Envoyez vos dates et le nombre de personnes — nous répondons avec la disponibilité et le tarif du séjour.",
        }}
        waMessage={
          lang === "fr"
            ? "Bonjour SAFA Apartments, je souhaite vérifier une disponibilité. Arrivée : … Départ : … Personnes : …"
            : "Hello SAFA Apartments, I'd like to check availability. Arrival: … Departure: … Guests: …"
        }
      />
    </>
  );
}

function AvailabilityButton({ lang }: { lang: Lang }) {
  const msg =
    lang === "fr"
      ? "Bonjour SAFA Apartments, je souhaite vérifier une disponibilité. Arrivée : … Départ : … Personnes : …"
      : "Hello SAFA Apartments, I'd like to check availability. Arrival: … Departure: … Guests: …";
  return (
    <Button asChild variant="whatsapp">
      <a href={waLink(DIVISIONS.apartments.whatsapp, msg)} rel="noopener">
        <WhatsAppIcon className="size-5!" />
        {lang === "fr" ? "Vérifier la disponibilité" : "Check availability"}
        <ArrowRight aria-hidden />
      </a>
    </Button>
  );
}
