# AssetStack Marketing Site

Standalone static marketing site for **assetstackai.com** — extracted from the
Base44 `assetstack_master` project (marketing pages only; the platform stays in
its own project and is reached via "Sign in" →
https://bunburycouncil.assetstack.site/).

Built with [Astro](https://astro.build) + React islands + Tailwind. Every page
is prerendered to static HTML; React hydrates the interactive sections
client-side. **Zero Base44 references** — all media is self-hosted in
`public/media/`, and the runtime Base44 SDK calls (auth redirect, LandingLayout
fetch, Webinar fetch) were replaced with static config.

## Commands

```bash
npm install
npm run dev       # dev server on :4321
npm run build     # static build → dist/
npm run preview   # serve dist/ locally
```

## Where things live

| What | Where |
|---|---|
| Page shells (title/meta/canonical per route) | `src/pages/*.astro` |
| Shared head / SEO layout | `src/layouts/Base.astro` |
| Page components (ported) | `src/components/pages_*.jsx` |
| Landing sections | `src/components/landing/` |
| **Site config: platform URL, section order, webinars** | `src/config/site.js` |
| Self-hosted media (was media.base44.com) | `public/media/` |
| robots.txt / sitemap.xml | `public/` |

## Config notes

- **Landing section order** is the exact production layout captured from the
  live site's `LandingLayout` record on 2026-07-22 (hidden sections omitted:
  `sisterHero`, `sisterEcosystem`, `pricing`). Edit `SECTION_ORDER` in
  `src/config/site.js` to change it.
- **react-router-dom** is aliased to `src/lib/router-shim.jsx` (plain `<a>`
  tags) in `astro.config.mjs` — do not add real client routing.
- `/Landing` redirects to `/` (old Base44 route kept for inbound links).

## Known issues / next steps

1. **Contact form needs a backend URL.** The form POSTs JSON to
   `FORM_ENDPOINT` in `src/config/site.js`. Create a form at
   https://formspree.io (or any endpoint that accepts JSON POSTs) and paste
   its URL there. Until then it falls back to opening the visitor's mail
   client with all fields included — functional but not trackable, and it
   never shows a false success state.
2. **Analytics are consent-gated** (`src/components/Consent.astro`). GTM
   (GTM-MSPX2MKL), GA4 (G-Z014QD4K1B) and Apollo (appId 6a331854…) load only
   after the visitor clicks Accept; the choice persists in localStorage.
3. **Video hosting.** Images are WebP (max 1920px, q82). The remaining weight
   is `13454d771_DigitalTwin.mp4` (40 MB) — consider Cloudflare Stream / Mux.
4. **Deploy**: any static host (Cloudflare Pages / Vercel / Netlify),
   build command `npm run build`, output `dist/`. Before DNS cutover, confirm
   no one reaches the platform via assetstackai.com app routes (they will 404
   on the static site).
