import type { ReactNode } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useLocation, useMatches } from "react-router";
import type { Route } from "./+types/root";
import { ActionBar } from "./components/layout/ActionBar";
import { divisionOf } from "./components/layout/division-context";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { LangBanner } from "./components/layout/LangBanner";
import { DIVISIONS } from "./content/site";
import { UI } from "./content/ui";
import { langFromPath, pageFromPath } from "./lib/i18n";
import { useRevealAll } from "./lib/hooks";
import "./styles/app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preload", href: "/fonts/cormorant.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
  { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
  { rel: "icon", href: "/icon-512.png", type: "image/png", sizes: "512x512" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "manifest", href: "/site.webmanifest" },
];

export type RouteHandle = { headerTone?: "light" | "dark" };

const CF_BEACON = import.meta.env.VITE_CF_BEACON_TOKEN as string | undefined;

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return (
    <html lang={pathname === "/" ? "en" : lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#14202a" />
        <meta name="format-detection" content="telephone=no" />
        {/* Motion is opt-in: only when JS runs do we hide elements awaiting reveal. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {CF_BEACON && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON })}
          />
        )}
      </body>
    </html>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const matches = useMatches();
  useRevealAll();

  if (pathname === "/") return <Outlet />;

  const lang = langFromPath(pathname);
  const page = pageFromPath(pathname);
  const division = divisionOf(page);
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;

  return (
    <div style={{ ["--accent" as string]: division ? DIVISIONS[division].accentVar : "var(--color-gold)" }}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory"
      >
        {UI.skip[lang]}
      </a>
      <Header lang={lang} tone={handle?.headerTone ?? "light"} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer lang={lang} />
      <ActionBar lang={lang} division={division} />
      <LangBanner lang={lang} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="container-x grid min-h-dvh place-content-center py-24 text-center">
      <p className="eyebrow text-gold-600">{is404 ? "404" : "Erreur · Error"}</p>
      <h1 className="mt-4 text-display-md">{is404 ? "Page introuvable · Page not found" : "Something went wrong"}</h1>
      <p className="mt-6">
        <a className="underline underline-offset-4" href="/">
          safa &amp; co →
        </a>
      </p>
    </main>
  );
}

export function HydrateFallback() {
  return null;
}
