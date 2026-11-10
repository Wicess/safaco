import { Breadcrumbs } from "~/components/sections/primitives";
import credits from "~/content/credits.generated.json";
import { MINEFOP, SITE, isTodo } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "legal" as const, name: { en: "Legal notice", fr: "Mentions légales" } }];

export const meta = pageMeta({
  key: "legal",
  title: { en: "Legal notice & privacy — SAFA & Co SARL", fr: "Mentions légales et confidentialité — SAFA & Co SARL" },
  description: {
    en: "Company details, hosting, image credits and how SAFA & Co SARL handles the information you send through the contact form.",
    fr: "Informations sur la société, hébergement, crédits photo et traitement des données que vous envoyez à SAFA & Co SARL par le formulaire de contact.",
  },
});

/** Licence names in French (CC names are international; "Public domain" is not). */
function frLicence(l: string) {
  return l.replace(/^Public domain(?: \(PD-self\))?$/i, "Domaine public").replace(/^CC0 1\.0$/, "CC0 1.0 (domaine public)");
}

export default function Legal() {
  const lang = useLang();
  const fr = lang === "fr";
  const h2 = "mt-14 font-display text-3xl first:mt-0";
  return (
    <section className="container-x pb-24 pt-[calc(var(--header-h)+0.5rem)] md:pt-[calc(var(--header-h)+2.25rem)]">
      <div className="text-muted">
        <Breadcrumbs lang={lang} trail={TRAIL} />
      </div>
      <h1 className="mt-10 text-display-lg md:mt-16">{fr ? "Mentions légales" : "Legal notice"}</h1>
      <div className="mt-14 max-w-2xl leading-relaxed text-ink/85 [&_p]:mt-4">
        <h2 className={h2}>{fr ? "Éditeur du site" : "Publisher"}</h2>
        <p>
          {SITE.legalName} — {fr ? "société à responsabilité limitée" : "limited liability company (SARL)"}, Yaoundé, {fr ? "Cameroun" : "Cameroon"}.
        </p>
        {/* CLIENT_TODO: registered address, RCCM, NIU, legal representative */}
        {/* Registration numbers appear once set in admin → Contact & details;
            a placeholder is never printed. */}
        {(!isTodo(SITE.rccm) || !isTodo(SITE.niu)) && (
          <p>
            {[!isTodo(SITE.rccm) && `RCCM${fr ? "\u00a0" : ""}: ${SITE.rccm}`, !isTodo(SITE.niu) && `NIU${fr ? "\u00a0" : ""}: ${SITE.niu}`].filter(Boolean).join(" · ")}
          </p>
        )}
        {!isTodo(MINEFOP.agrement) && (
          <p>
            {fr ? "Centre de formation SAFA Designs — agrément MINEFOP n°\u00a0" : "SAFA Designs training centre — MINEFOP approval no. "}
            {MINEFOP.agrement}
          </p>
        )}
        <p>
          {fr ? "Contact : " : "Contact: "}
          <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </p>

        <h2 className={h2}>{fr ? "Hébergement" : "Hosting"}</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, {fr ? "États-Unis" : "USA"} — vercel.com.</p>

        <h2 className={h2}>{fr ? "Vos données" : "Your data"}</h2>
        <p>
          {fr
            ? "Lorsque vous envoyez le formulaire de contact, nous recevons votre nom, votre numéro de téléphone, votre adresse e-mail si vous l’indiquez et votre message, ainsi que le pays et la ville approximatifs de votre connexion. Ces informations servent uniquement à répondre à votre demande ; elles ne sont ni vendues ni cédées. Pour les consulter, les corriger ou les faire supprimer, écrivez-nous."
            : "When you send the contact form we receive your name, phone number, email if given, and your message, plus the approximate country and city of your connection. We use this only to answer your enquiry; it is never sold or passed on. To see, correct or delete it, write to us."}
        </p>
        <p>
          {fr
            ? "Ce site n’utilise aucun cookie publicitaire. Un seul cookie technique mémorise la langue que vous avez choisie. Pour compter les visites, votre navigateur conserve un identifiant aléatoire (sans nom ni coordonnées) ; nous enregistrons les pages vues, la ville et le pays approximatifs et le type d’appareil, uniquement pour nos propres statistiques. Ces données ne sont jamais vendues ni partagées."
            : "This site uses no advertising cookies. A single technical cookie remembers the language you chose. To count visits, your browser keeps a random ID (no name or contact details); we record the pages viewed, approximate city and country, and device type, for our own statistics only, never sold or shared."}
        </p>

        <h2 className={h2}>{fr ? "Photographies" : "Photography"}</h2>
        <p>
          {fr
            ? "Les photos et vidéos des machines, des appartements et des tenues (dont toute la galerie) appartiennent à SAFA & Co. Les autres photos, signalées « Photo d’illustration », proviennent de banques d’images libres (Wikimedia Commons, WordPress Photo Directory) ; les personnes qui y figurent ne sont ni des employés ni des clients de SAFA & Co."
            : "The photos and videos of the machines, apartments and garments (including the whole gallery) belong to SAFA & Co. Other photos, marked “Illustrative photo”, come from free image libraries (Wikimedia Commons, WordPress Photo Directory); the people shown are not SAFA & Co staff or clients."}
        </p>
        {credits.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {credits.map((c) => (
              <li key={c.file}>
                <a className="inline-block py-1 underline underline-offset-4" href={c.source} rel="noopener nofollow">
                  {c.author}
                </a>{" "}
                —{" "}
                {c.licenceUrl ? (
                  <a className="inline-block py-1 underline underline-offset-4" href={c.licenceUrl} rel="noopener nofollow license">
                    {fr ? frLicence(c.licence) : c.licence}
                  </a>
                ) : fr ? (
                  frLicence(c.licence)
                ) : (
                  c.licence
                )}
              </li>
            ))}
          </ul>
        )}

        <h2 className={h2}>{fr ? "Conception et développement" : "Design & development"}</h2>
        <p>
          {fr ? "Site conçu et développé par " : "Designed and developed by "}
          <a className="underline underline-offset-4" href="mailto:kenj52974@gmail.com">
            W!CE
          </a>
          .
        </p>
      </div>
    </section>
  );
}
