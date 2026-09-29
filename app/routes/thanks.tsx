import { Link } from "react-router";
import { TraceLine } from "~/components/sections/primitives";
import { Button } from "~/components/ui/button";
import { useLang } from "~/lib/hooks";
import { href } from "~/lib/i18n";
import { pageMeta } from "~/lib/seo";

export const meta = pageMeta({
  key: "thanks",
  title: { en: "Thank you — SAFA & Co", fr: "Merci — SAFA & Co" },
  description: { en: "Your enquiry has been sent.", fr: "Votre demande a bien été envoyée." },
});

export default function Thanks() {
  const lang = useLang();
  return (
    <section className="container-x grid min-h-[80dvh] content-center pb-24 pt-[calc(var(--header-h)+4rem)]">
      <p className="eyebrow text-gold-600">{lang === "fr" ? "Message reçu" : "Message received"}</p>
      <h1 className="vt-title mt-6 max-w-3xl text-display-lg">{lang === "fr" ? "Merci. Nous revenons vers vous rapidement." : "Thank you. We'll be in touch shortly."}</h1>
      <TraceLine className="mt-10 w-32" scroll={false} />
      <p className="mt-8 max-w-xl text-lede text-muted">
        {lang === "fr"
          ? "Votre demande a été transmise à la bonne équipe. Si c'est urgent, écrivez-nous aussi sur WhatsApp."
          : "Your enquiry has gone to the right team. If it's urgent, message us on WhatsApp as well."}
      </p>
      <div className="mt-10">
        <Button asChild variant="outline">
          <Link to={href("home", lang)}>{lang === "fr" ? "Retour à l'accueil" : "Back to home"}</Link>
        </Button>
      </div>
    </section>
  );
}
