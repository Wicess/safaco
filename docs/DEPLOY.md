# Deploying SAFA & Co on Vercel

Everything in the repository is ready. These are the steps only the account
owner can do, in order. Allow about 30 minutes, most of it waiting for DNS.

**What runs where**

| Part | Where | Cost driver |
|---|---|---|
| Every page (EN + FR) | Vercel CDN, prebuilt static HTML | bandwidth only |
| Built-in photos & videos | Vercel CDN (`/media`, in the repo) | bandwidth only |
| Contact form, admin, visit counter | one Vercel Function (`/api`, region `cle1`, next to the database) | invocations |
| Enquiries, admin users, visits | Neon Postgres (us-east-2) | time awake: one write per visit, no polling |
| Admin content + uploaded photos | Cloudflare R2 | free tier |
| Email | Hostinger (unchanged) | — |

---

## 1. Create the Vercel project (5 min)

1. vercel.com → **Add New → Project** → import the GitHub repo **Wicess/safaco**.
2. Framework preset: leave **Other**. Build settings come from `vercel.json`
   (`pnpm build`, output `build/client`). Do not override them.
3. **Before the first deploy**, open **Environment Variables** and use
   **Import .env**: choose the file **`.env.vercel`** at the root of the
   project folder on this computer (it is generated from your `.env`, contains
   your secrets, and is excluded from git, so it exists only on this machine).
   Apply to **Production** (Preview isn't needed: preview builds are skipped).
4. Deploy. The first build takes 3–5 minutes.

> **Plan:** Vercel's Hobby (free) plan is for non-commercial use only. A
> business site needs **Pro**.

## 2. Turn on the admin's Publish button (2 min)

1. Project → **Settings → Git → Deploy Hooks** → name `admin-publish`,
   branch `main` → **Create** → copy the URL.
2. **Settings → Environment Variables** → add `VERCEL_DEPLOY_HOOK_URL` =
   that URL (Production).
3. **Deployments** → latest → **⋯ → Redeploy**, so the function sees it.

Publishing in the admin now saves the content and rebuilds the site (1–3 min).

## 3. Connect safaandcosarl.com (10 min + DNS wait)

1. Project → **Settings → Domains** → add `safaandcosarl.com` and
   `www.safaandcosarl.com` (set `www` to redirect to the bare domain).
2. Vercel shows the exact DNS records to create. In **Hostinger → Domains →
   DNS / Nameservers → DNS records**, add them:
   - `A` record, name `@`, to the IP Vercel shows (e.g. `76.76.21.21`); delete
     any older `A` record for `@` that points elsewhere.
   - `CNAME` record, name `www`, to the target Vercel shows (e.g.
     `cname.vercel-dns.com`).
3. **Do not change the nameservers** and **do not touch the MX, SPF or DKIM
   records**: they keep `sales@safaandcosarl.com` working at Hostinger.
4. Wait until Vercel shows both domains as **Valid** (minutes to a few hours).
   HTTPS is issued automatically.

## 4. Cost guards (from the cost playbook — do them once)

**Vercel**
- Settings → Git → **Ignored Build Step**: leave as set by `vercel.json`
  (`sh scripts/should-build.sh`). It skips preview builds and commits that only
  touch docs, and always builds when the admin presses Publish.
- Leave **Speed Insights**, **Web Analytics** and paid **Observability** off
  (the admin dashboard already counts visits).
- Account → Settings → Billing → **Spend Management**: set a monthly limit.
- Project → **Firewall → Rules** → add two rate limits (the in-app limits only
  cover one warm function): `/api/contact` → 5 requests / minute per IP;
  `/api/admin/login` → 10 requests / 15 minutes per IP. Action: deny.

**Neon** (console.neon.tech → the SAFA project)
- Branches → primary → compute → **Edit**: autoscaling **min 0.25 / max 1 CU**,
  **scale to zero after 5 min: ON**.
- Delete any unused branches; set a spending alert.

## 5. Check the live site (10 min)

- [ ] `https://safaandcosarl.com` opens in English, and in French on a phone set to French.
- [ ] Photos and the hero reel load; a video plays when tapped.
- [ ] `/admin` → sign in with `sales@safaandcosarl.com` (the password given at
      setup) → **Account → change password**.
- [ ] Send a test enquiry from **Contact** → it appears in **admin → Enquiries**.
- [ ] Change one word in **admin → Home page** → **Publish** → visible on the
      site within ~3 minutes. Then change it back.
- [ ] Visit the site from a phone → **admin → Dashboard** shows the visit and
      its city (city appears only on Vercel).

## 6. Before or soon after launch

- **Phone numbers** for Construction and Apartments: admin → Contact & details
  (until then their Call/WhatsApp buttons lead to the enquiry form).
- **Email notifications** for enquiries: add `SMTP_PASS` (the Hostinger mailbox
  password of sales@safaandcosarl.com) in Vercel → redeploy. Enquiries are
  stored in the admin either way.
- **Spam protection**: Cloudflare dashboard → Turnstile → add site
  `safaandcosarl.com` → put the keys in `VITE_TURNSTILE_SITE_KEY` and
  `TURNSTILE_SECRET_KEY` → redeploy.
- **Search engines**: Google Search Console and Bing Webmaster Tools → add the
  domain → submit `https://safaandcosarl.com/sitemap.xml`. Create Google
  Business Profiles for the three addresses.
- **Faster photos for admin uploads (optional)**: uploaded photos are served
  from Cloudflare's `r2.dev` address, which Cloudflare rate-limits. If uploads
  become frequent, connect a custom domain to the R2 bucket (needs the domain's
  DNS on Cloudflare) and set `R2_PUBLIC_URL` to it.

## Updating the site later

- Content (text, numbers, photos): **admin → Publish**. No code involved.
- Code: commit and push to `main`; Vercel builds production automatically.
- New built-in photos: put them in `media-src/`, run `pnpm media`, commit
  `public/media` and `app/content/media.generated.json`.
