import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { UI } from "~/content/ui";
import { href, otherLang, pageFromPath, type Lang } from "~/lib/i18n";

function hasLangCookie() {
  return /(?:^|;\s*)lang=(en|fr)/.test(document.cookie);
}
function setLangCookie(lang: Lang) {
  document.cookie = `lang=${lang}; path=/; max-age=31536000; samesite=lax`;
}

/**
 * Deep pages are never auto-redirected (crawlers and shared links must land on
 * the URL they asked for). Instead, when the device language differs from the
 * page language and the visitor hasn't chosen yet, offer the switch once.
 * JS-only, so crawlers never see it.
 */
export function LangBanner({ lang }: { lang: Lang }) {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const target = otherLang(lang);

  useEffect(() => {
    try {
      if (hasLangCookie()) return;
      const device = (navigator.languages?.[0] ?? navigator.language ?? "en").toLowerCase();
      const deviceLang: Lang = device.startsWith("fr") ? "fr" : "en";
      setShow(deviceLang !== lang);
    } catch {
      /* cookies blocked — just don't show */
    }
  }, [lang]);

  if (!show) return null;
  const page = pageFromPath(pathname) ?? "home";

  return (
    <div
      role="region"
      aria-label={UI.langBanner[lang]}
      lang={target}
      className="fixed inset-x-3 bottom-[calc(var(--bar-h)+env(safe-area-inset-bottom)+0.75rem)] z-30 flex items-center gap-3 bg-ivory p-3 pl-4 text-ink shadow-[0_12px_40px_-12px_rgb(12_21_28/0.45)] ring-1 ring-ink/10 lg:bottom-6 lg:left-auto lg:right-6 lg:max-w-md"
    >
      <p className="flex-1 font-display text-lg leading-tight">{UI.langBanner[lang]}</p>
      <Link
        to={href(page, target)}
        onClick={() => setLangCookie(target)}
        className="inline-flex min-h-11 items-center bg-navy-900 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ivory"
      >
        {UI.langBannerYes[lang]}
      </Link>
      <button
        type="button"
        onClick={() => {
          setLangCookie(lang);
          setShow(false);
        }}
        className="grid size-11 place-items-center text-muted hover:text-ink"
        aria-label={UI.langBannerNo[lang]}
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
