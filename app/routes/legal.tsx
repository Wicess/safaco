import { Breadcrumbs } from "~/components/sections/primitives";
import credits from "~/content/credits.generated.json";
import { MINEFOP, SITE } from "~/content/site";
import { useLang } from "~/lib/hooks";
import { pageMeta } from "~/lib/seo";

const TRAIL = [{ key: "legal" as const, name: { en: "Legal notice", fr: "Mentions légales" } }];

export const meta = pageMeta({
  key: "legal",
  title: { en: "Legal notice & privacy — SAFA & Co SARL", fr: "Mentions légales & confidentialité — SAFA & Co SARL" },
  description: {
    en: "Company details, hosting, image credits and how SAFA & Co SARL handles the information you send through the contact form.",
    fr: "Informations sur la société, l'hébergement, les crédits photo et le traitement des informations envoyées via le formulaire de contact.",
  },
});

export default function Legal() {
  const lang = useLang();
  const fr = lang === "fr";
  const h2 = "mt-14 font-display text-3xl first:mt-0";
  return (
    <section className="container-x pb-24 pt-[calc(var(--header-h)+1.5rem)] md:pt-[calc(var(--header-h)+3rem)]">
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
        <p>
          RCCM : {SITE.rccm} · NIU : {SITE.niu}
        </p>
        <p>
          {fr ? "Centre de formation SAFA Designs — agrément MINEFOP n°" : "SAFA Designs training centre — MINEFOP approval no."} {MINEFOP.agrement}
        </p>
        <p>
          {fr ? "Contact : " : "Contact: "}
          <a className="underline underline-offset-4" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </p>

        <h2 className={h2}>{fr ? "Hébergement" : "Hosting"}</h2>
        <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — vercel.com.</p>

        <h2 className={h2}>{fr ? "Vos données" : "Your data"}</h2>
        <p>
          {fr
            ? "Lorsque vous envoyez le formulaire de contact, nous recevons votre nom, votre numéro de téléphone, votre e-mail s'il est indiqué et votre message, ainsi que le pays et la ville approximatifs associés à votre connexion. Ces informations servent uniquement à répondre à votre demande ; elles ne sont ni vendues ni cédées. Pour les consulter, les corriger ou les faire supprimer, écrivez-nous."
            : "When you send the contact form we receive your name, phone number, email if given, and your message, plus the approximate country and city of your connection. We use this only to answer your enquiry; it is never sold or passed on. To see, correct or delete it, write to us."}
        </p>
        <p>
          {fr
            ? "Ce site n'utilise pas de cookies publicitaires. Un seul cookie technique mémorise la langue que vous avez choisie. La mesure d'audience (Cloudflare Web Analytics) ne dépose aucun cookie."
            : "This site uses no advertising cookies. A single technical cookie remembers the language you chose. Audience measurement (Cloudflare Web Analytics) sets no cookies."}
        </p>

        <h2 className={h2}>{fr ? "Photographies" : "Photography"}</h2>
        <p>
          {fr
            ? "Certaines photos sont des images d'illustration issues de banques d'images libres de droits (Unsplash, Pexels, Wikimedia Commons) ; les personnes qui y figurent ne sont ni des employés ni des clients de SAFA & Co."
            : "Some photos are illustrative images from royalty-free libraries (Unsplash, Pexels, Wikimedia Commons); the people shown are not SAFA & Co staff or clients."}
        </p>
        {credits.length > 0 && (
          <ul className="mt-6 space-y-2 text-sm text-muted">
            {credits.map((c) => (
              <li key={c.file}>
                <a className="underline underline-offset-4" href={c.source} rel="noopener nofollow">
                  {c.author}
                </a>{" "}
                —{" "}
                {c.licenceUrl ? (
                  <a className="underline underline-offset-4" href={c.licenceUrl} rel="noopener nofollow license">
                    {c.licence}
                  </a>
                ) : (
                  c.licence
                )}
              </li>
            ))}
          </ul>
        )}

        <h2 className={h2}>{fr ? "Conception" : "Design & development"}</h2>
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
