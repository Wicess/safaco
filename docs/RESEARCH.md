# SAFA & Co: research findings (2026-09-29)

These findings come from five parallel research passes: market, design, tech stack, SEO/AEO/GEO,
and imagery/performance. Each item carries its source. **Unverified** marks items that still need
the client's confirmation.

---

## 1. Market (Cameroon)

### SAFA's presence and name
- SAFA has no existing online presence under "SAFA & Co / Construction / Apartments /
  Designs". The new site will be the brand's first real footprint online.
- **Name collision:** SAFACAM, a large agro-industrial company, ranks for "SAFA Cameroun".
  Always use the full division names, e.g. "SAFA Construction Yaoundé".

### Locations (unverified; the client must confirm)
- **"Carrefour Meg"** is most likely **Carrefour MEEC**, Mvog-Betsi, Yaoundé VI (~85%
  confidence). It is a busy commercial crossroads, which suits the atelier.
  https://mapcarta.com/N2285764948
- **"Meyou"** is most likely **Meyo**, Yaoundé IV, on the Kondengui/Ekounou/Odza side (~60%
  confidence). https://fr.wikipedia.org/wiki/Yaound%C3%A9_IV

### Construction
- **Plastering-machine hire:** no competitor was found online. Search results show only
  manual "machines à crépir" for sale (Loozap, Club Achat).
- **The "first" claim:** plausible but unverifiable. Default wording: "parmi les premiers".
- **Manual rendering benchmark:** about 1,760 FCFA/m² interior and 2,057 FCFA/m² exterior.
  This anchors the calculator.
  http://www.cameroun.prix-construction.info
- **Scaffold and lift competitors:**
  - BATIVEL (Douala, bativel.com), the best competitor site, quote-only pricing
  - NICAM (Yaoundé)
  - Jeloutoo.cm marketplace
- **Published competitor rates:**

  | Equipment | Rate |
  |---|---|
  | Scissor nacelle | ~60,000 FCFA/day |
  | Suspended platform | ~70,000 FCFA/day |

  Pricing is quote-based across the market, so an "à partir de" guide would set SAFA apart.
- **Blocks:** 15×20×40 vibrated blocks sell for 335–375 FCFA each in Yaoundé. Buyers expect
  delivery to "tous les quartiers".

### Apartments
- **Nightly rates in Yaoundé:**

  | Unit | FCFA per night |
  |---|---|
  | Studio, outer quartiers | 15–25k |
  | 2-bedroom, outer quartiers | 28–55k |
  | Studio, Bastos | 25–40k |
  | 2-bedroom, Bastos | 45–80k |

  A Meyo location probably sits at 20–45k. Stays of two weeks or more usually get 10–20%
  off.
- **What guests expect listed:** generator, borehole water (forage), wifi (with speed),
  air-conditioning, hot water, secure parking, 24h guard and CCTV, Canal+/Netflix, and an
  equipped kitchen.
- **Where listings circulate:** Booking, Airbnb, KasaStay, Afribobo, CoinAfrique, and above
  all Facebook, TikTok and WhatsApp.
- **Booking customs:** a deposit followed by the balance, plus a security deposit (caution).

### Designs and training
- There is almost no men's tailoring website in Yaoundé, so the niche is wide open.
- **Training is regulated.** Loi n°2018/010 requires a **MINEFOP agrément** for private
  training centres and its number on their documents. Without it, the site must describe the
  offer as an informal "apprentissage en atelier", with no diploma promised.
- **Fee benchmark:** FKENG MODE charges about 500,000 FCFA for 12 months, plus fees.
  https://www.fkengmode.com/

### Local search terms (FR)
- **Construction:** "crépir/crépissage" (not "enduit projeté"), "location échafaudage
  Yaoundé", "location monte-charge / nacelle", "prix crépissage m2 Cameroun", "parpaings
  vibrés Yaoundé prix".
- **Apartments:** "appartement meublé Yaoundé", "studio meublé [quartier]", "meublé Yaoundé
  prix".
- **Designs:** "couturier / tailleur homme Yaoundé", "costume sur mesure Yaoundé", "formation
  couture Yaoundé", "centre agréé MINEFOP".

### Trust and conversion norms
- **WhatsApp first**, with a prefilled message. Phone format: +237 6XX XX XX XX.
- MTN MoMo and Orange Money are the dominant payment methods.
- **Prices** are written "25 000 FCFA", with "/nuit", "/jour", "à partir de" or "sur devis".
- **Trust signals:**
  - RCCM and NIU numbers
  - addresses given by landmark ("face à…") with a map pin
  - real photos and video
  - testimonials

---

## 2. Design references

### Reference sites
| Site | What to take from it |
|---|---|
| Composites.archi (Awwwards SOTD Apr 2025) | material-as-hero story |
| Enerblock (SOTD May 2026) | strict 2-colour discipline |
| The New Industrials | industrial copy set as editorial type |
| OH Architecture (SOTD 2025) | swipeable project strip |
| The Drake Hotel (SOTD 2025, Locomotive) | one group presenting several properties |
| Richard George Tailoring (HM 2024) | short hand-work loops |
| Atelier Saman Amel | restraint, "by appointment" framing |
| Locke aparthotels | serviced apartments with a design-led voice |
| Imane Ayissi, Kéré Architecture, atelier masōmī | African specificity without clichés |

### Trends
- **Do:**
  - type as the hero
  - "crafted over clean": grain, real hand-work
  - 1px rules and a visible grid
  - one accent colour
- **Avoid:**
  - glassmorphism and purple gradients
  - icon bento grids
  - cursor followers
  - scroll-jacking
  - preloaders
  - fade-up on everything
  - filler marquees
  - kente/ndop borders as decoration

### Motion
- **CSS scroll-driven animations** (`animation-timeline: view()`) run off the main thread.
  They are supported in Chrome and Safari 26+; Firefox is arriving. Use them for the
  signature effects, with an IntersectionObserver fallback.
- **GSAP** has been 100% free since April 2025, plugins included. Use it only if a
  choreographed sequence truly needs it.
- **Lenis:** skip it on touch devices; it is optional on desktop.
- **View Transitions:** same-document transitions are Baseline. Use them between divisions
  as progressive enhancement.

### Fonts (free, full French diacritics)
- **Archivo** (variable width and weight) is the single family for display and body, which
  keeps font requests low.
- **Instrument Serif italic** is the one accent face.
- Alternatives: Big Shoulders, Bricolage Grotesque.

### Concept upgrade: "Le Tracé" (the chalk line)
Builders snap a chalk line before plastering, and tailors chalk cloth before cutting. That
single line becomes each division's material. Details are in PLAN.md.

---

## 3. Verified tech stack (versions from npm, 2026-09-29)

### Versions
- react 19.3, vite 8.3
- **react-router 8.4** (framework mode, `ssr:false` + `prerender`)
- tailwindcss 4.3 (`@theme` tokens), shadcn 4.21 (works with Vite + Tailwind 4 + React 19)
- express 5.2
- prisma / @prisma/adapter-neon 7.10 (Prisma 8 is still RC: avoid)
- zod 4.6, @getbrevo/brevo 6.0
- gsap 3.15, motion 13.4

### React Router
- Prerendered pages need no function at all.
- Skip the `@vercel/react-router` preset: it still pins `@react-router/dev@7`, and a static
  build doesn't need it.
- Docs: https://reactrouter.com/how-to/pre-rendering

### Express on Vercel
- Vercel detects it with zero config (`export default app`).
- It runs as one Function on Fluid compute. `express.static` is ignored.
- Docs: https://vercel.com/docs/frameworks/backend/express

### Vercel plan
- **Hobby is for non-commercial use only**, so a business site requires **Pro ($20/month)**.
  https://vercel.com/docs/plans/hobby

### Prisma 7 with Neon
- Prisma 7 has no Rust engine and requires a driver adapter.
- The URL lives in `prisma.config.ts`.
- Runtime uses the **pooled** URL. Migrations use the **direct** URL via
  `prisma migrate deploy`.
- Add `connect_timeout=15` to the connection string.

### Neon
- Free tier: 100 CU-hours, 0.5 GB, and scale-to-zero after 5 minutes.
- Cap autoscaling at 0.25–0.5 CU.

### Cloudflare
- **DNS only (grey cloud).** Vercel advises against proxying through Cloudflare.
  https://vercel.com/kb/guide/cloudflare-with-vercel
- **R2:** 10 GB free, with no egress fees.
- **Turnstile:** verify server-side through `siteverify`; tokens are single-use and valid
  for 300s.
- **Web Analytics:** add the snippet manually, since the site isn't proxied.

### Brevo
- **Sending:** use SDK v6 (`BrevoClient`) with `transactionalEmails.sendTransacEmail`.
- **Domain records:** a Brevo-code TXT, 2 DKIM CNAMEs, and DMARC with `rua@dmarc.brevo.com`.
- **Free tier:** 300 emails a day.

### Contact endpoint security
- **Check order:** honeypot → minimum fill time → zod → Turnstile → rate limit → send.
- **Rate limit:** use the Vercel WAF rule, which is available on Hobby and Pro. It stops
  abuse before a function is invoked.
- **Headers:** set a CSP (with hashes, since there are no nonces on static HTML) plus the
  security headers in `vercel.json`.

---

## 4. SEO / AEO / AIO / GEO

### Local presence
- **Google Business Profile**
  - Expect **video verification**: one continuous clip of 30 seconds or more showing
    signage, the street and the equipment.
  - **Permanent signs are required first.**
  - One profile per physical location.
  - Scaffold hire can be a service-area business with its address hidden.
- **Bing Places** supports Cameroon; import from GBP. It feeds Copilot.
- **Apple Business** is low priority (iOS is about 14–18% of phones).
- **Citations:**
  - goafricaonline.com/cm, pagesjaunes.online, businesslist.co.cm, africannuaire.com,
    lefisk.cm
  - a Facebook page per division
  - a WhatsApp Business profile
- **NAP:** use one canonical landmark address string everywhere, plus GPS coordinates to 5
  decimals and a Plus Code.

### Bilingual setup
- Use `/fr` and `/en` subfolders with **translated slugs**.
- hreflang `fr`, `en` and `x-default`, with return links on both sides.
- Each page's canonical points to itself.
- Never ship half-translated pages.

### Structured data
- **Group:** `Organization` with `subOrganization`; each child points back via
  `parentOrganization`.
- **Construction:** `HomeAndConstructionBusiness` + `Service`/`Offer`, using the
  `businessFunction` LeaseOut value for hire and Sell for materials.
- **Apartments:** `LodgingBusiness` + `Apartment` + `amenityFeature`.
  - Google's VacationRental rich result is not available to us.
- **Tailoring:** `ClothingStore` or `ProfessionalService`.
- **School:** `EducationalOrganization` + `Course`.
- **Rich-result status:**
  - FAQ rich results ended in May 2026, but visible FAQ content still feeds AI answers.
  - Self-serving review stars are **not eligible**.

### AI answers
- **Google AI Overviews and AI Mode** need normal indexing only.
- **Copilot** answers come from the Bing index.
- **Content style:** question-shaped H2s with the answer in the first 1–2 sentences, plus
  statistics and sources (the GEO paper found up to ~40% more visibility).
- **robots.txt:** allow OAI-SearchBot, PerplexityBot, Claude-SearchBot and Bingbot.
- **IndexNow** reaches Bing and Yandex. **llms.txt** is optional and of low value.
- **Wikidata** only after press coverage.
- **Crawlers:** GPTBot, ClaudeBot and PerplexityBot **do not run JavaScript**, so
  prerendering is mandatory.

### Keyword research
Keyword Planner shows no data at Cameroon's volumes. Research through:
- Google autocomplete and "People also ask", set to Cameroon
- the words customers use on WhatsApp and Facebook
- Search Console after launch

### Content rules
- No cloned neighbourhood pages.
- "Premier au Cameroun" only with visible proof.

---

## 5. Imagery and performance

### Stock sources and licences
| Source | Licence |
|---|---|
| Unsplash | free, no attribution |
| Pexels | free, no attribution |
| Nappy | free commercial use |
| StockSnap | CC0 |
| Wikimedia Commons (mast climbers) | per file, usually CC BY-SA, credit required |

Pexels licence notes:
- Stock images may never imply endorsement by the people or brands shown.
- They must never be passed off as SAFA's staff, units or graduates.

Never use manufacturer or AliExpress photos: they are copyrighted and misrepresent the
fleet.

### Networks
- **Speed:** median ~4 Mbps down with **~250 ms latency** (SpeedOf.Me 2026). Operator
  medians: MTN ~15 Mbps, Orange ~13 Mbps.
- **Consistency:** Opensignal rates it very low, with heavy 3G use.
- **Data cost:** ~2,000 FCFA for 1.2 GB. Design for slow 4G or 3G.

### Devices and browsers
- **Operating systems:** Android ~83%.
- **Phone makers:**

  | Vendor | Share |
  |---|---|
  | Samsung | 20% |
  | Tecno | 20% |
  | Apple | 19% |
  | Infinix | 7% |

- **Screen widths:** the most common are 360×800 and 360×806, so **design at 360px**.
- **Browsers:** Chrome 77%, Safari 15%, Opera 4%.
- **Opera Mini Extreme** mode runs pages through a server and breaks JavaScript behaviour,
  so build with **progressive enhancement**.

### Performance budgets
- **Page weight:** ≤500 KB on first load.
- **Code and fonts:** JS ≤150 KB gzipped (target <100), CSS ~20 KB, ≤2 font files.
- **Images:** hero ≤100 KB, cards ≤40 KB. Serve AVIF, then WebP, at widths
  360/540/720/1080.
- **Hero video:** 6–10 s, 480p on mobile, ≤1–1.5 MB. Poster image first. Autoplay only on
  4G when neither Save-Data nor reduced motion is set.
