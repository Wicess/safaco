import type { Config } from "@react-router/dev/config";
import { allPaths } from "./app/lib/i18n";

// Fully static: every page in both languages is prerendered to HTML at build
// time and served from Vercel's CDN. No server functions run for page views —
// only the contact form hits /api (see api/index.ts).
export default {
  ssr: false,
  prerender: allPaths(),
} satisfies Config;
