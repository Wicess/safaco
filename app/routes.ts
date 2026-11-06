import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { LANGS, PAGES, PAGE_KEYS } from "./lib/i18n";

// Each page file is mounted twice — once per language — with a unique id.
// The page reads its language from the URL (see useLang).
export default [
  index("routes/language-root.tsx"),
  ...PAGE_KEYS.flatMap((key) =>
    LANGS.map((lang) => route(PAGES[key].path[lang], PAGES[key].file, { id: `${key}.${lang}` })),
  ),
  // Admin panel: client-only (not prerendered), served from the SPA shell.
  route("admin/*", "routes/admin.tsx", { id: "admin" }),
  route("404", "routes/not-found.tsx", { id: "not-found" }),
  route("*", "routes/not-found.tsx", { id: "catch-all" }),
] satisfies RouteConfig;
