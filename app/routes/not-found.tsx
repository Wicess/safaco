import { Link, useLocation } from "react-router";
import { href, langFromPath } from "~/lib/i18n";

export const meta = () => [{ title: "404 — SAFA & Co" }, { name: "robots", content: "noindex" }];

export default function NotFound() {
  const lang = langFromPath(useLocation().pathname);
  return (
    <section className="container-x grid min-h-[70dvh] content-center pb-20 pt-40">
      <p className="eyebrow text-gold-600">404</p>
      <h1 className="mt-5 max-w-3xl text-display-lg">
        {lang === "fr" ? "Cette page n'existe pas — ou plus." : "This page doesn't exist — or no longer does."}
      </h1>
      <p className="mt-8 flex flex-wrap gap-6 text-sm uppercase tracking-[0.14em]">
        <Link to={href("home", "en")} className="underline underline-offset-8">SAFA &amp; Co — English</Link>
        <Link to={href("home", "fr")} className="underline underline-offset-8">SAFA &amp; Co — Français</Link>
      </p>
    </section>
  );
}
