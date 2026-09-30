# SAFA & Co SARL: website master plan (v2, research-backed)

This is an informational, **mobile-first** website in French and English for **SAFA & Co
SARL** and its three divisions. Visitors cannot book on the site. Every page leads to a
**contact**: WhatsApp, a phone call, or an enquiry form.
Evidence and sources for every decision are in [RESEARCH.md](RESEARCH.md).

| Division | Location | Offer |
|---|---|---|
| **SAFA Construction** | Yaoundé (yard address needed) | Hire of automatic wall-plastering machines · mast lifts and scaffold platforms · mechanised fabrication of construction materials |
| **SAFA Apartments** | **Meyo, Yaoundé IV** (confirmed) | Furnished short-stay apartments (appartements meublés) |
| **SAFA Designs** | **Carrefour MEEC, Yaoundé VI** (confirmed) | Men's wear made to measure · specialised sewing machines · **MINEFOP-approved** training and apprenticeship |

### Decisions confirmed by the owner (2026-09-29)
1. **Component library:** shadcn/ui. There is no CMS; content lives in typed files in the
   repo.
2. **Locations:** Meyo (Yaoundé IV) and Carrefour MEEC (Yaoundé VI).
3. **Training:** SAFA Designs **holds a MINEFOP agrément**. Its number is shown on the
   training page, in the footer, and in the schema, so the site can speak of a recognised
   training centre. Whether it prepares students for the DQP/CQP exams is still to confirm.
4. **Prices are not published.** Everything is "sur devis / on request". Nothing on the site
   states an SAFA price in FCFA.
5. **"First in Cameroon" has no proof**, so the wording is always **"parmi les premiers au
   Cameroun" / "among the first in Cameroon"**. It is never "le premier" or "the first".
6. **English is the default language, with automatic language detection:**
   - The root `/` sends visitors to the language their device is set to: French (`fr`)
     goes to `/fr`, everything else goes to `/en`.
   - A language choice made with the FR|EN toggle is remembered and wins over the device
     setting.
   - English is the `x-default`.
   - Both languages are complete and equal, and French keywords still drive local SEO.

---

## 0. What the research changed (summary)

1. **SAFA has no presence online yet.** This site plus three Google Business Profiles will
   be the brand's first footprint. A large company, SAFACAM, already ranks for "SAFA
   Cameroun", so we always use the full division names.
2. **Nobody in Cameroon rents automatic plastering machines online.** One excellent page
   can own the search term. The pitch is built around local numbers: manual rendering costs
   about 1,760–2,057 FCFA/m² today.
3. **Networks are slow and unreliable.** The median is about 4 Mbps with about 250 ms
   latency, and data is expensive. The phones are mostly Android (Tecno, Samsung, Infinix),
   and the most common screen width is 360px. **Speed is part of what makes the site feel
   premium.** The budget is ≤500 KB per page and ≤150 KB of JavaScript.
4. **Some visitors use Opera Mini's Extreme mode, which breaks JavaScript**, and AI crawlers
   (ChatGPT, Claude, Perplexity) do not run JavaScript at all. So every page is
   **prerendered to full HTML**. Navigation, forms, WhatsApp links and phone links must work
   with **no JavaScript at all**.
5. **Local French wording wins.** Cameroonians search "crépir / crépissage" (not "enduit
   projeté") and "meublé" (not "serviced apartment").
6. **Sewing training is regulated.** Loi 2018/010 requires a MINEFOP agrément. Either the
   site shows SAFA's agrément number, or it describes the offer as an informal "apprentissage
   en atelier" and promises no diploma.
7. **Google dropped FAQ rich results in May 2026, and self-serving review stars are
   ineligible.** We still write question-and-answer content, because AI answers quote it,
   but we mark up nothing that could draw a penalty.
8. **Vercel Hobby is for non-commercial use only.** A client business site needs **Vercel
   Pro, $20/month**. Everything else can run on free tiers.

---

## 1. Architecture (verified 2026-09-29)

```
safa-co/                      pnpm workspace, TypeScript strict, Node 22
├─ apps/web                   React 19.3 + Vite 8 + React Router 8 (framework mode,
│                             ssr:false + prerender every /fr/* and /en/* route)
│                             Tailwind 4.3 (@theme tokens) + shadcn/ui
├─ apps/web/api/index.ts      Express 5 app → one Vercel Function at /api/*
├─ packages/content           Typed FR/EN content: divisions, machines, units, FAQs, NAP
├─ packages/shared            zod 4 schemas shared by the form and the API
└─ packages/db                Prisma 7.10 + @prisma/adapter-neon (prisma.config.ts)
```

- **Pages:** prerendered static HTML on Vercel's CDN, with **no function calls for page
  views**. React hydrates the page only to add motion; JavaScript is never required.
- **API:** `/api/contact` and `/api/health` only. Requests run through these checks in
  order:
  1. honeypot field
  2. minimum fill time
  3. zod validation
  4. Cloudflare **Turnstile** verification
  5. **Vercel WAF** rate limit, which stops abuse before a function runs
  6. store the lead: Neon via Prisma, using the pooled URL
  7. send email through **Brevo**, a notification to the division plus an auto-reply in the
     visitor's language
- **Neon:** stores `Lead` records (division, language, message, and location from the
  `x-vercel-ip-*` headers). Neon is only woken by a form submission. Scale-to-zero stays on
  and autoscaling is capped at 0.25–0.5 CU. Migrations run with `prisma migrate deploy` on
  the direct URL.
- **Cloudflare:**
  - **DNS only (grey cloud)**, as Vercel recommends
  - **R2** with a `media.` subdomain for video and galleries: no egress fees, immutable
    caching
  - **Turnstile**
  - **Web Analytics** (free, cookieless), used instead of `@vercel/analytics`
- **Region:** Vercel function in `cdg1`, Neon in the EU (Frankfurt/Paris). These are the
  closest Vercel and Neon regions to Cameroon.
- **Optional `/admin` lead inbox:** it never polls. It has a manual refresh button, or
  idle-pausing refresh per the cost playbook.

---

## 2. Design direction: "Le Tracé" (the chalk line)

**The idea.** Every piece of SAFA's work begins with a chalk line:
- the builder snaps a chalk line on the wall before plastering;
- the tailor chalks the cloth before cutting;
- an apartment starts as a line on a plan.

The line is the brand's single graphic idea. On each page it turns into that division's
material, so the three divisions read as **one system, not three websites**.

| Where | What the line does | How it's built |
|---|---|---|
| **Home hero** | One ruled line sits under "SAFA & Co". As you scroll it **splits into three**, one per division. | SVG + CSS `animation-timeline: view()` |
| **Construction** | The line sweeps down the section and **reveals a raw block wall turning into a smooth render**, the way the machine passes over a wall. | clip-path wipe plus a grain mask, run by scroll |
| **Designs** | A dashed chalk mark **becomes a solid stitched seam** along a lapel or heading. | SVG stroke-dashoffset |
| **Apartments** | The line becomes a **window-frame edge**. A soft diagonal band of light slides across the room photo. | a gradient mask moved on transform |
| **Page to page** | The division's line and title morph into the header of the next page. | View Transitions, as progressive enhancement |

- **One reusable `<Trace>` component** of under 5 KB. The fallback is an
  IntersectionObserver where scroll-driven CSS isn't supported. Under
  `prefers-reduced-motion` the lines are simply drawn, static. There is no WebGL and no
  scroll-jacking. Lenis is skipped on touch devices.
- **Palette:** a shared neutral base with one accent colour per division, taken from its
  material. The rule is *one accent per screen*.
  - Base: warm lime-plaster off-white `#F3F0EA`, concrete `#D8D2C8`, graphite `#161615`.
  - **Group accent:** a refined burnt orange that honours the client's current brand (about
    `#C8501E`, to be checked for contrast).
  - **Construction:** laterite / ochre.
  - **Apartments:** linen / olive.
  - **Designs:** ndop indigo, used as a colour only, never as a pattern.
- **Type:**
  - **Archivo**, one variable font with width and weight axes, for both condensed display
    and body text;
  - **Instrument Serif italic** as the only accent face, for "fait main" moments and
    quotes;
  - self-hosted WOFF2, subset to Latin plus Latin-Ext so French accents render, 2 files in
    total.
- **Layout language:**
  - type as the hero;
  - 1px rules and a visible 4-column mobile grid (12 columns on desktop);
  - real photography with film grain;
  - "by appointment" restraint, in the manner of Saman Amel and Drake Hotel;
  - a swipeable fleet strip, in the manner of OH Architecture.
- **Explicitly avoided:** glassmorphism, gradients, icon bento grids, cursor followers,
  preloaders, fade-up on everything, filler marquees, and kente/ndop borders as decoration.
- **Mobile layout (360px first):**
  - a thumb-zone **sticky action bar**: WhatsApp · Appeler · Devis;
  - the **division switcher** as a 3-segment control in the menu;
  - tap targets of at least 48px;
  - one clear column.
- **Footer:** the standing signature, "Developed by **W!CE**" (mailto link, metallic sheen,
  sheen turned off under reduced motion). It copies the WHAM `footer.tsx` pattern.

---

## 3. The 20 steps

### Phase 1: Discovery and foundations

**Step 1: Client discovery and sign-off.** Gather these from the client:
- **Locations:** exact addresses for Meyo(u), MEEC and the yard, written by landmark
  ("face à…"), with Google Maps pins and Plus Codes.
- **Contacts:** WhatsApp, phone and email for each division. The Facebook, TikTok and
  Instagram pages, if any.
- **Legal:** RCCM, NIU, and the **MINEFOP agrément number, its date, and which exams it
  prepares for (DQP/CQP?)**.
- **Logo and brand assets.**
- **Construction:** the machine list with *SAFA's own* output figures (m²/day, maximum
  height, crew size), hire terms, delivery area, and the fabricated products. No prices;
  everything is on request.
- **Apartments:** the units, amenities (generator, forage, wifi speed, air-conditioning,
  hot water, parking, guard/CCTV, Canal+), and house rules. Rates are given on request.
- **Designs:** the tailoring services, the training programme (length, intake dates, fees
  policy), and the machines for sale.
- **Proof:** testimonials and past projects. The "first" claim is settled: always "parmi
  les premiers / among the first".
- **Signage** at each location. Google Business Profile video verification requires it.

Output: `docs/BRIEF.md` and a signed sitemap.

**Step 2: Keyword and question research.** Keyword Planner shows no data at Cameroon's search
volumes, so the research uses:
- Google autocomplete and "People also ask" set to Cameroon;
- Bing's related searches;
- the words the client's customers actually use on WhatsApp.

Build clusters per division, for example:
- "location machine à crépir Yaoundé"
- "prix crépissage m2 Cameroun"
- "location échafaudage / monte-charge Yaoundé"
- "parpaings vibrés prix"
- "appartement / studio meublé Yaoundé [quartier]"
- "tailleur homme Yaoundé"
- "costume sur mesure"
- "formation couture Yaoundé"

Each keyword is mapped to **one** page. Output: `docs/SEO-KEYWORDS.md`.

**Step 3: Information architecture.** URLs are translated per language:

| English (default) | French |
|---|---|
| `/en` | `/fr` |
| `/en/construction`, `/en/construction/plastering-machine-hire` | `/fr/construction`, `/fr/construction/location-machine-a-crepir` |
| `/en/construction/scaffold-mast-lift-hire` | `/fr/construction/echafaudage-monte-charge` |
| `/en/construction/fabrication` | `/fr/construction/fabrication` |
| `/en/apartments`, `/en/apartments/[unit]` | `/fr/appartements`, `/fr/appartements/[unite]` |
| `/en/designs`, `/en/designs/training` | `/fr/designs`, `/fr/designs/formation` |

Also, in both languages: `/about` · `/a-propos`, `/contact`, `/faq` · `/questions`,
`/legal` · `/mentions-legales`.

Rules for language detection:
- **Only the root `/` detects language, and it costs nothing.** It uses `vercel.json`
  redirects with `has` conditions, which run on Vercel's edge with no function call and no
  database. They are checked in this order:
  1. A `lang=fr` or `lang=en` cookie, set by the FR|EN toggle, wins.
  2. Otherwise, if the `Accept-Language` header starts with `fr`, go to `/fr`.
  3. Otherwise, go to `/en`.
- These redirects are **temporary (307)**, never permanent, so they can change per visitor.
  `/` is marked as the hreflang `x-default`.
- **Deep pages (`/en/...`, `/fr/...`) are never auto-redirected.** Googlebot crawls without
  a French language setting, and a redirect would hide the French pages from Google. Shared
  links must also open in the language they were shared in. Instead, a small, dismissible
  banner ("Voir cette page en français ?") appears when the device language differs from
  the page language. It is added by JavaScript and has no effect on crawlers.
- Step 7 must check the regex matching and the cookie precedence in a real deploy
  preview.
- **No cloned neighbourhood or city pages**, per the Bing abuse rule.
- **No cloned neighbourhood or city pages**, per the Bing abuse rule.

**Step 4: Design system.** Run `ui-ux-pro-max --design-system`, then the `design-system`
skill. It produces:
- three token layers in Tailwind 4 `@theme`: primitive → semantic → division accent;
- a fluid type scale for Archivo;
- motion tokens (easing and durations);
- the `<Trace>` spec and component specs.

Output: `DESIGN.md` and `tokens.css`.

**Step 5: Visual concepts at 360px first.** Use `imagegen-frontend-mobile` and
`imagegen-frontend-web` to produce one comp per section, then tablet and desktop versions.
Share them with the client for **one consolidated feedback round** before any code is
written. Also give the client a **shot list** for their own photo and video shoot (see
RESEARCH §5) so it happens in parallel with the build.

### Phase 2: Setup and infrastructure

**Step 6: Repository and tooling.** Set up the GitHub repo (you provide it; SSH already works
as `Wicess`):
- a pnpm workspace;
- ESLint, Prettier, Husky and lint-staged;
- `.env.example` with every variable documented.

GitHub Actions runs typecheck, lint, build, **Lighthouse CI budgets**, and a
**link and hreflang checker**.

**Step 7: Frontend scaffold.**
- React Router 8 with `ssr:false` and a `prerender()` function that returns every route in
  both languages. The `@vercel/react-router` preset is not used.
- Tailwind 4 with the tokens, and shadcn/ui set up for Vite.
- Language routing with per-route `meta`: title, description, canonical, hreflang and OG.
- Self-hosted subset fonts.
- A `<Picture>` component that outputs AVIF, WebP and JPEG sources with a `srcset` of
  360/540/720/1080 and fixed dimensions.

**Step 8: API scaffold.**
- An Express 5 app at `api/index.ts` (Vercel detects it with zero config).
- A zod schema shared with the form.
- Turnstile verification, honeypot and minimum fill time.
- Explicit error handling.
- The `vercel.json` security headers: a CSP using hashes (static pages can't use nonces),
  HSTS, Referrer-Policy and Permissions-Policy.

**Step 9: Database.**
- A Prisma 7.10 schema with `Lead` (and optionally `AdminUser`).
- `prisma.config.ts`: the pooled URL at runtime, the direct URL (with `connect_timeout=15`)
  for migrations.
- Migrations committed to git.
- On the Neon console: one branch, scale-to-zero on, maximum 0.5 CU.

**Step 10: Email and domain.**
- Brevo domain authentication on Cloudflare DNS: the Brevo-code TXT record, 2 DKIM CNAMEs,
  and DMARC.
- Four transactional templates: a lead notification in FR and EN, and a visitor auto-reply
  in FR and EN.
- The free tier (300 emails a day) is plenty.

### Phase 3: Build

**Step 11: Global shell.**
- The header: logo, division switcher, and FR|EN toggle.
- The **sticky WhatsApp · Appeler · Devis bar**. It uses `wa.me` links with a message
  prefilled for the division and page.
- The footer:
  - the three addresses written by landmark;
  - the hours;
  - RCCM and NIU;
  - the social links;
  - the W!CE signature.
- View Transitions between pages.
- A reduced-motion mode.
- A no-JavaScript check: the menu uses `<details>`, and the forms post normally.

**Step 12: Group home page.** The sections, in order:
1. **Hero:** the line splits into three. A 6–10 s loop plays only on a fast connection,
   otherwise the poster image shows.
2. **Proof strip:** real numbers from the client.
3. **Three division panels:** full-bleed and stacked on mobile.
4. **"Automatic plastering" teaser:** the machine against manual work, in m² per day and
   days saved. No prices are shown.
5. **Selected projects:** a swipeable strip.
6. **Testimonials:** plain text only, with no review markup.
7. **Short FAQ.**
8. **Contact CTA.**

**Step 13: SAFA Construction pages.** The machine hire page is the showcase page for search:
- an answer-first introduction: what the machine is, what it does per day, and where SAFA
  operates;
- the **Tracé reveal** of the wall going from raw block to smooth render;
- how it works, in 4 steps;
- an interactive **manual-vs-machine calculator**: enter m² and get **days and crew
  saved**. It uses SAFA's own output figures and **shows no prices**. It ends with "Get a
  quote on WhatsApp", with the m² prefilled in the message. Without JavaScript it shows a
  static table.
- the positioning line **"among the first in Cameroon"**. It never claims "the first".
- the fleet cards;
- how hire works: enquiry → site visit → delivery and set-up by SAFA's crew → pickup;
- the areas served;
- an FAQ with question-shaped H2s;
- a CTA.

It also has sub-pages for **scaffold and mast lifts** and for **fabrication** (products,
specifications and delivery). Prices are given on request.

**Step 14: SAFA Apartments pages.**
- A calm editorial showcase, in the manner of Locke and Drake.
- One page per unit: a gallery with a lightbox, amenity icons with real details, the
  neighbourhood (a **static** map image plus a directions link), and house rules. Rates are
  given on request over WhatsApp.
- A **"Vérifier la disponibilité sur WhatsApp"** button whose message includes the unit and
  dates. There is no booking engine.

**Step 15: SAFA Designs pages.**
- A made-to-measure lookbook with stitch-line motion.
- The process: measure → fabric → fitting → finish.
- The specialised machines.
- The **training** page for a **MINEFOP-approved centre**: the agrément number shown
  visibly, the programme, length, intake dates, and how to apply. Fees are given on
  request. It mentions DQP/CQP exams only if the client confirms them.
- The framing is "by appointment" throughout.

**Step 16: Contact system.**
- A contact page with three division cards: address, map link, hours, WhatsApp, phone.
- A shared enquiry form with the division preselected from the page the visitor came from.
- A success page in the visitor's language.
- If the API fails, the form offers WhatsApp instead.
- The form works with no JavaScript (a normal POST, then a redirect).

**Step 17: Media pipeline.**
- A script (sharp) that produces AVIF, WebP and JPEG at 4 widths each, blurred
  placeholders, and hashed filenames, then uploads them to **R2**.
- Size caps: hero ≤100 KB, cards ≤40 KB.
- **Video:** H.264 plus AV1/WebM, 480p on mobile, ≤1.5 MB, `preload="none"` with a poster
  image. It autoplays only when the connection is 4G and neither Save-Data nor reduced
  motion is set.
- Stock images from Unsplash, Pexels and Nappy fill in until the client's shoot is done,
  with every licence logged in `docs/MEDIA-CREDITS.md`.
- **Stock is never presented as SAFA's staff, units or machines.** Manufacturer and
  AliExpress photos are never used.

### Phase 4: Search, AI visibility and quality

**Step 18: SEO, AEO, AIO and GEO.** Skills used: `seo`, `schema`, `seo-audit`, `ai-seo`,
following `~/.claude/seo-guidelines.md` (Bing wins where Bing and Google disagree).

- **Structured data (JSON-LD):**
  - `Organization` with `subOrganization` ↔ `parentOrganization`;
  - `HomeAndConstructionBusiness` + `Service`/`Offer` (LeaseOut for hire, Sell for
    materials);
  - `LodgingBusiness` + `Apartment` + `amenityFeature`;
  - `ClothingStore` or `ProfessionalService`;
  - `EducationalOrganization` + `Course`;
  - `BreadcrumbList`, `WebSite`, and `geo` coordinates to 5 decimals.
  - Everything marked up must also be visible on the page.
- **Content style:** question-shaped H2s with the answer in the first two sentences, and
  concrete numbers (m²/day, FCFA, capacities). Entity names are written identically
  everywhere.
- **Crawling and indexing:**
  - a sitemap with hreflang alternates;
  - `robots.txt` allowing Googlebot, Bingbot, OAI-SearchBot, PerplexityBot and
    Claude-SearchBot;
  - an **IndexNow** ping on every deploy;
  - a small `llms.txt` (optional, low value).
- **OG images:** 1200×630 per page and language.
- **Local presence:**
  - **3 Google Business Profiles**, verified by video after the signs are up;
  - Bing Places, imported from GBP;
  - citations on goafricaonline, pagesjaunes.online, businesslist.co.cm, africannuaire
    and lefisk;
  - a Facebook page per division;
  - a WhatsApp Business profile;
  - **the address, phone and name identical everywhere.**
- **Later:** press coverage (Cameroon Tribune, Investir au Cameroun), then a Wikidata entry.

**Step 19: Quality gates.** Skills used: `web-quality-audit`, `performance`,
`accessibility`, `core-web-vitals`, `impeccable`, `emil-design-eng`, `review-animations`.

The site must meet these targets:

| Check | Target |
|---|---|
| Page weight, first load | ≤500 KB |
| JavaScript | ≤150 KB gzipped, aiming for under 100 KB |
| LCP | <2.5 s on Slow-4G throttling with a Moto G-class CPU |
| CLS | <0.1 |
| INP | <200 ms |
| Lighthouse (mobile) | ≥95 in every category |
| Accessibility | WCAG 2.2 AA |

It must also be tested:
- on a **real Tecno or Infinix phone over MTN and Orange data**;
- on iPhone Safari and in Opera Mini (no-JavaScript paths).

A final design polish pass follows.

### Phase 5: Launch

**Step 20: Deploy, hand over, and cost guardrails.**
- **Vercel:**
  - a Pro project with the function in `cdg1`;
  - an Ignored Build Step, so commits that only touch docs don't rebuild;
  - a WAF rate-limit rule on `/api/contact`;
  - no `@vercel/analytics`.
- Domain on Cloudflare DNS (grey cloud) pointing to Vercel.
- **Search engines:** Google Search Console and Bing Webmaster Tools verified, sitemaps
  submitted, Bing AI Performance report on.
- Cloudflare Web Analytics switched on.
- A short client guide (FR) covering:
  - how leads arrive;
  - how to send new photos;
  - how to update prices and intake dates, since stale claims are a risk;
  - how to answer Google reviews.
- A final run of the Neon and Vercel prompts from `~/.claude/cost-reduction-playbook.md`.

---

## 4. Running costs (estimate)

| Service | Plan | Monthly |
|---|---|---|
| Vercel | Pro (commercial use requires it) | $20 |
| Neon | Free (100 CU-h; only woken by form submits) | $0 |
| Cloudflare DNS, R2 (≤10 GB), Turnstile, Web Analytics | Free | $0 |
| Brevo | Free (300 emails/day) | $0 |
| Domain (.cm or .com) | Registrar | ~$1–3 |

## 5. What I need from you, and when

| Step | Item |
|---|---|
| 1 | Client answers (Step 1 list), logo, signage status, photos/video |
| 6 | GitHub repository URL |
| 9 | Neon project: pooled and direct `DATABASE_URL`s |
| 10 | Brevo API key + sender address/domain |
| 16–17 | Cloudflare account: Turnstile site/secret keys, R2 bucket + API token |
| 20 | Domain + Vercel Pro team access |

## 6. Open questions

All six planning questions are answered; see "Decisions confirmed" at the top. The rest is
covered by the client's Step 1 list: the agrément number, the yard address, contact numbers,
and photos.

---

## 7. Build log

### 2026-09-29: build started (steps 4–19 scaffolded)

- **Brand from the client's logo.** The palette is navy `#14202A` and antique gold `#B08A50` on
  ivory `#F5F1E8`; this replaces the burnt orange. Contrast is checked: plain gold is used only
  for lines, and gold text on light backgrounds uses `#8A6631`.
- **Type:**
  - Cormorant (display), matching the logo's serif.
  - Archivo (body and labels).
  - Both are self-hosted, Latin subset (covers French), about 112 KB for 3 files.
- **Logo:** the monogram is extracted from the client's PNG, which is low-resolution and cut off
  at the bottom. The wordmark is live text. **Need the vector logo (SVG/AI/PDF) from the
  client.**
- **Architecture:** a single package instead of a pnpm workspace, which is simpler on Vercel.
  - `app/`: React Router 8 pages.
  - `api/index.ts` + `server/`: the Express contact API.
  - `prisma/`: the database schema.
  - Node 22 is installed at `~/.local/node22` (the system Node is 20).
- **Images:** 28 placeholder photos from Wikimedia Commons (CC0 / CC BY / CC BY-SA) and the
  WordPress Photo Directory (CC0). Unsplash and Pexels block scripted access. The CC BY and
  CC BY-SA photos are credited on `/legal`, and heroes show an "Illustrative photo" note until
  the client's shoot.
- **Placeholders:** every one is marked `CLIENT_TODO`. `pnpm build` lists them, and
  `STRICT_CONTENT=1` fails the build while any remain.

### 2026-09-30 — infrastructure
- **Neon** connected (project in AWS us-east-2); `Lead` table migrated (`prisma/migrations/20260930000000_init`). End-to-end test: JSON + no-JS form posts stored with geo; test rows deleted.
- **Vercel function region → `cle1`** (Cleveland = AWS us-east-2, same as Neon).
- **R2** bucket `sako`: 420 optimized images uploaded (`pnpm media:upload`), served via `VITE_MEDIA_BASE` (r2.dev for now → custom domain before launch). Build drops its own copy of the images so Vercel serves no image bytes.
- **Email: Brevo dropped (owner decision)** → plain SMTP with nodemailer through the domain mailbox.
