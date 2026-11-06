# SAFA & Co — website

Bilingual (EN default / FR) informational site for **SAFA & Co SARL**, Yaoundé, and its three
divisions: SAFA Construction, SAFA Apartments and SAFA Designs.
The plan and research behind it are in [`docs/PLAN.md`](docs/PLAN.md) and
[`docs/RESEARCH.md`](docs/RESEARCH.md).

## Stack

| Layer | Choice |
|---|---|
| Pages | React 19 · React Router 8 (framework mode, `ssr:false` + **prerender**): every page in both languages is static HTML |
| Styling | Tailwind CSS 4 (`@theme` tokens in `app/styles/app.css`) · shadcn/ui primitives |
| API | Express 5 → one Vercel Function (`api/index.ts`), used **only** by the contact form |
| Data | Prisma 7 + Neon Postgres (`Lead` table), via the pooled URL and `@prisma/adapter-neon` |
| Email | Plain SMTP via the domain mailbox, nodemailer (`server/lib/mail.ts`) |
| Edge | Vercel (hosting; function in `cle1`, next to Neon us-east-2) · Cloudflare DNS (grey cloud), Turnstile, Web Analytics |

**Cost model:** page views never run a function or touch the database. Only a form submission
wakes the API, Neon and the SMTP send, so Neon can scale to zero between enquiries. Nothing polls on a timer.

## Develop

Requires **Node ≥ 22.22** and pnpm.

```bash
pnpm install
cp .env.example .env      # fill what you have; everything is optional locally
pnpm dev                  # site on http://localhost:5173
pnpm dev:api              # contact API on :3001 (Vite proxies /api)
```

| Command | Purpose |
|---|---|
| `pnpm build` | Generates the Prisma client, prerenders every page, writes sitemap/robots/llms.txt/404, lists `CLIENT_TODO`s |
| `pnpm preview` | Serves the build like Vercel (language redirect on `/`, 404, `/api`) on :4173 |
| `pnpm typecheck` | Route typegen + `tsc` |
| `pnpm media` | Converts `media-src/*.jpg` into AVIF/WebP/JPEG at 360–1600 w in `public/media`, plus the manifest and photo credits |
| `pnpm media:upload` | Syncs `public/media` to the R2 bucket (serve with `VITE_MEDIA_BASE`) |
| `pnpm indexnow` | After a production deploy: notifies Bing/IndexNow of every sitemap URL |
| `pnpm db:migrate` | `prisma migrate deploy` against `DATABASE_URL_UNPOOLED` |

### Troubleshooting

If `pnpm build` fails locally with `ENOSPC: System limit for number of file watchers reached`, other
dev servers are holding the inotify limit. Build with polling instead:
`CHOKIDAR_USEPOLLING=1 pnpm build`. Vercel and CI are not affected.

## Where things live

- **Every public URL, in both languages:** `app/lib/i18n.ts` (`PAGES`). `app/routes.ts` mounts each page once per language.
- **Company facts** (phones, WhatsApp, addresses, RCCM/NIU, MINEFOP): `app/content/site.ts`.
- **FAQs:** `app/content/faqs.ts`. They are shown on each page and on `/faq`, and emitted as FAQPage JSON-LD.
- **Images:** `media-src/` holds the originals and `CREDITS.md`. `app/content/media-map.ts` maps each slot to a file.
  Files named `safa-*` are SAFA's own photos. Everything else is stock and gets an "Illustrative photo" note (`isStock()`).
- **Videos:** `public/media/*.mp4` (silent H.264, 540–960 px, faststart), registered in `VIDEO` in `media-map.ts`;
  their poster stills are `media-src/safa-video-*.jpg`. `<AmbientVideo>` loads nothing until on screen, and pauses off screen or in a hidden tab.
- **Gallery:** `app/content/gallery.ts` (own media only) feeds `/en/gallery`, the division strips and the home mosaic.
- **After adding media:** run `pnpm media`, then `pnpm media:upload`. Production serves `/media` from R2 (`VITE_MEDIA_BASE`),
  so new files must be uploaded **before** deploying, or they 404.
- **SEO:** `app/lib/seo.ts` handles canonical, hreflang, Open Graph and the Organization graph (three sub-organizations).

### House rules (owner-confirmed)

- **No prices** anywhere. Everything is "on request".
- Never "the first in Cameroon". Always "**among** the first".
- Stock photos are placeholders. Their people must never be presented as SAFA staff, tenants or students.

## Admin panel (`/admin`)

The owner edits the site without code: dashboard (visits, pages, countries/cities, sources, devices),
enquiries, home-page hero, page headers, contact details (phones, WhatsApp, emails, addresses, hours,
map links, RCCM/NIU/MINEFOP, socials), and the gallery (upload, caption, reorder, hide, delete).

How it stays cheap: pages remain **static**. Edits are a JSON draft on R2 (`site/draft.json`).
**Publish** copies it to `site/content.json` and calls the Vercel deploy hook; the build pulls it
(`scripts/content-pull.ts` → `app/content/overrides.generated.json`) and prerenders. Live in ~2 min.
Uploaded photos are resized in the browser, converted to AVIF/WebP/JPEG by the API and stored on R2.
Visits: one beacon per visit (`app/lib/beacon.ts` → `/api/hit`), one DB write per visit, with
`x-vercel-ip-*` location. The dashboard loads on open/Refresh only, with no timers.

Setup: `pnpm db:migrate`, then `pnpm admin:user you@example.com "Your Name"` (prints a temporary
password). On Vercel set `SESSION_SECRET`, `R2_PUBLIC_URL`, `VERCEL_DEPLOY_HOOK_URL` (create the hook in
Settings → Git → Deploy Hooks). `scripts/should-build.sh` lets hook builds through the Ignored Build Step.

## Before launch: the `CLIENT_TODO` list

`pnpm build` prints every placeholder still waiting for the client's data: domain, phones,
WhatsApp numbers, exact addresses and GPS pins, RCCM/NIU, MINEFOP agrément number, the
machines' real output figures, amenities, product list and photos.

Build with `STRICT_CONTENT=1` to make the build **fail** while any remain. Use that for the
production launch.

## Deploy (Vercel)

1. Import the GitHub repo in Vercel. The framework preset is "Other"; `vercel.json` sets the rest.
2. Add the environment variables from `.env.example`. Commercial sites need the **Pro** plan.
3. Run `pnpm db:migrate` once against Neon.
4. On Cloudflare DNS, point the domain at Vercel as **DNS only** (grey cloud), as Vercel recommends.
5. In the Vercel Firewall, add a rate-limit rule on `/api/contact`, for example 5 requests per minute per IP.
6. Submit `https://<domain>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

### Database cost (Neon)

Neon bills for the time the database is **awake**; it suspends after 5 minutes with zero
queries. This site is built so it is asleep almost always:

- **Page views never query it.** Every page is static HTML; there is no admin dashboard, no
  polling, no cron, no analytics writes, and `/api/health` does not touch Postgres.
- **Only a real enquiry wakes it, with exactly one query** (a single `INSERT`; the email is
  sent first so no follow-up `UPDATE` is needed).
- **Spam never reaches it.** Validation, the honeypot, the minimum fill time, Turnstile, a
  per-IP limit (5 per 10 min), duplicate detection and a link-spam check all run before the
  database is opened.
- `LEAD_STORE=fallback` writes only when the email fails, so the database stays asleep in
  normal operation. `LEAD_STORE=off` never writes.

Cost per enquiry in the default mode: one wake of about 5 minutes at 0.25 CU is roughly
0.02 CU-hours, a fraction of a US cent.

**Neon console (only the account owner can do these):**

1. Branches → primary → compute → **Edit**: autoscaling **min 0.25 / max 0.25 CU**, and
   **Scale to zero after 5 minutes** ON.
2. Keep one branch; delete any others.
3. Billing → set a spend alert.
