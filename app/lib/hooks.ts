import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { type Lang, langFromPath } from "./i18n";

export function useLang(): Lang {
  return langFromPath(useLocation().pathname);
}

/**
 * One IntersectionObserver for the whole page: every element with
 * [data-reveal] or [data-trace] gets `.is-in` once it enters the viewport.
 * Without JS the CSS never hides anything, so content is always readable.
 * Re-scans on route change.
 */
export function useRevealAll() {
  const { pathname } = useLocation();
  const seen = useRef(new WeakSet<Element>());
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal],[data-trace]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    for (const el of els) {
      if (seen.current.has(el) && el.classList.contains("is-in")) continue;
      seen.current.add(el);
      io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);
}
