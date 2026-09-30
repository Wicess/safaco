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
| `pnpm db:migrate` | `prisma migrate deploy` against `DATABASE_URL_UNPOOLED` |

## Where things live

- **Every public URL, in both languages:** `app/lib/i18n.ts` (`PAGES`). `app/routes.ts` mounts each page once per language.
- **Company facts** (phones, WhatsApp, addresses, RCCM/NIU, MINEFOP): `app/content/site.ts`.
- **FAQs:** `app/content/faqs.ts`. They are shown on each page and on `/faq`, and emitted as FAQPage JSON-LD.
- **Images:** `media-src/` holds the originals and `CREDITS.md`. `app/content/media-map.ts` maps each slot to a file.
- **SEO:** `app/lib/seo.ts` handles canonical, hreflang, Open Graph and the Organization graph (three sub-organizations).

### House rules (owner-confirmed)

- **No prices** anywhere. Everything is "on request".
- Never "the first in Cameroon". Always "**among** the first".
- Stock photos are placeholders. Their people must never be presented as SAFA staff, tenants or students.

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

### Neon settings

- Keep one branch.
- Leave scale-to-zero on.
- Cap autoscaling at **0.25–0.5 CU**.
