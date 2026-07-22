# AssetStack marketing site — working notes for Claude

Static marketing site for **assetstackai.com**, extracted July 2026 from the
Base44 `assetstack_master` project. The signed-in product is a SEPARATE
project (lives at bunburycouncil.assetstack.site); never add app features,
auth, or backend calls here. This site must stay: static, fast, zero Base44.

## The editing workflow (Tier 2 — Claude is the editor)

Every content/design change follows the same loop. Do not skip steps:

1. Edit the file(s)
2. `npm run build` — must pass
3. Verify visually in the browser pane (`npm run preview`, port 4321) —
   screenshot the affected section; below-fold sections animate in on
   scroll, so scroll to them before judging a blank screenshot as broken
4. Commit with a clear message; push (auto-deploys when CI is connected)

Node is NOT installed system-wide on this machine. If `node` is missing,
download the official darwin-arm64 tarball from nodejs.org/dist into the
session scratchpad and export its bin/ onto PATH (ask the user first).

## Where things live (content map)

| To change… | Edit |
|---|---|
| Hero headline ("AI Infrastructure Intelligence Platform.") | `src/components/landing/LandingHero.jsx` (~line 65) |
| Landing page section order / hide a section | `SECTION_ORDER` in `src/config/site.js` |
| Sign-in destination, contact emails, form endpoint, webinars | `src/config/site.js` |
| Page titles / meta descriptions / canonicals | `src/pages/*.astro` (never client-side) |
| Landing sections (FAQ, pricing copy, personas, ROI calc…) | `src/components/landing/<Section>.jsx` |
| Per-page content (Product, About, Customers…) | `src/components/pages_<Name>.jsx` |
| Images / video | `public/media/` — WebP only (max 1920px, q82); convert with `sharp` before adding |
| Cookie/consent banner + analytics IDs | `src/components/Consent.astro` |
| robots / sitemap | `public/robots.txt`, `public/sitemap.xml` — add new pages to the sitemap |

## Hard constraints — do not undo these

- **Zero `base44` references.** Check `grep -ri base44 src/ dist/` stays empty
  after changes. Media is self-hosted; the SDK is gone.
- **`react-router-dom` is a shim** (`src/lib/router-shim.jsx`, aliased in
  `astro.config.mjs`). It only exports `Link` (renders `<a>`). Don't install
  the real router; don't use other router APIs in components.
- **Section order is frozen production config**, captured from the live
  Base44 LandingLayout record 2026-07-22. `sisterHero`, `sisterEcosystem`,
  `pricing` exist in the registry but are deliberately not rendered.
- **No trackers outside the consent gate.** Anything analytics goes inside
  `Consent.astro`'s post-accept loader.
- **SEO lives in served HTML.** Titles/meta/canonical belong in the .astro
  page shells; never `document.title` in components.
- **Domain is `assetstackai.com`.** `assetstack.ai` is ANOTHER COMPANY's
  domain — it must never appear in canonicals, links, or contact emails.
  (It still appears as decorative text in some hero/brochure mockup
  components — cleaning those up is fine and encouraged.)
- New pages: create `src/pages/<Name>.astro` wrapping a
  `src/components/pages_<Name>.jsx`, add to `public/sitemap.xml` and (if
  Allow-listed) `public/robots.txt` on the platform side stays untouched.

## Known state / open items

- `FORM_ENDPOINT` in site.js is '' → contact form falls back to a mailto
  with all fields (honest, no fake success). User must create a
  Formspree-style endpoint and paste its URL.
- `public/media/13454d771_DigitalTwin.mp4` is 40 MB — candidate for
  Cloudflare Stream/Mux, don't let it grow siblings.
- GitHub remote + Cloudflare Pages not yet connected (user account steps).
- `logoCloud` section self-hides (no logos configured) — same as live.
