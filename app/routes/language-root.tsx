import { SITE } from "~/content/site";
import { LANGS, PAGES } from "~/lib/i18n";

/**
 * "/" — the x-default. On Vercel, vercel.json redirects visitors before this
 * page is ever served (cookie → device language → English, 307, zero cost).
 * This prerendered page is the fallback: a tiny script does the same choice
 * in the browser, and without JS it's a plain two-link language picker.
 */
export const meta = () => [
  { title: "SAFA & Co — Yaoundé, Cameroun" },
  {
    name: "description",
    content:
      "SAFA & Co SARL, Yaoundé: construction equipment hire, furnished apartments and made-to-measure menswear. · Location de matériel de construction, appartements meublés et couture homme sur mesure.",
  },
  { tagName: "link", rel: "canonical", href: `${SITE.url}/` },
  ...LANGS.map((l) => ({ tagName: "link", rel: "alternate", hrefLang: l, href: `${SITE.url}${PAGES.home.path[l]}` })),
  { tagName: "link", rel: "alternate", hrefLang: "x-default", href: `${SITE.url}/` },
];

const PICK = `(function(){try{var m=document.cookie.match(/(?:^|;\\s*)lang=(en|fr)/);var l=m?m[1]:((navigator.languages&&navigator.languages[0])||navigator.language||'en').toLowerCase().indexOf('fr')===0?'fr':'en';location.replace('/'+l)}catch(e){}})()`;

export default function LanguageRoot() {
  return (
    <main className="on-dark grid min-h-dvh place-items-center bg-navy-950 px-6 text-ivory">
      <script dangerouslySetInnerHTML={{ __html: PICK }} />
      <div className="text-center">
        <img src="/brand/safa-monogram-light-sm.png" alt="SAFA & Co" width={62} height={96} className="mx-auto h-24 w-auto" />
        <p className="mt-8 font-display text-3xl tracking-[0.2em]">SAFA &amp; Co</p>
        <nav className="mt-10 flex justify-center gap-4" aria-label="Language / Langue">
          <a href="/en" hrefLang="en" lang="en" className="min-h-12 border border-ivory/30 px-6 py-3 text-sm uppercase tracking-[0.16em]">
            English
          </a>
          <a href="/fr" hrefLang="fr" lang="fr" className="min-h-12 border border-ivory/30 px-6 py-3 text-sm uppercase tracking-[0.16em]">
            Français
          </a>
        </nav>
      </div>
    </main>
  );
}
