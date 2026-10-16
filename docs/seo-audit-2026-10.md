# Technical SEO & Indexing Audit — October 2026

Date: 2026-10-16. Scope: this repo (`paddock-site`, Vite + React prerendered SPA), its Cloudflare Pages deployment, and the live `getpaddock.com` domain. Google Search Console was **not** available to this audit; nothing below is based on Search Console data.

## Executive summary

**The "Alternative page with proper canonical tag" warning is real, and it is a production deployment problem. It is not caused by this codebase.**

Since **4 September 2026** (the `last-modified` date on every response), `getpaddock.com` has been serving the **private web app's build** (the same build as `app.getpaddock.com`) from Firebase Hosting, not this marketing site:

- DNS: `getpaddock.com` A → `199.36.158.100` (Firebase Hosting), `www` CNAME → `get-paddock.web.app`, TXT `hosting-site=get-paddock`. Nameservers are still Cloudflare.
- `https://getpaddock.com/` and `https://app.getpaddock.com/` return byte-identical HTML with the same ETag.
- **Every** URL on `getpaddock.com` returns 200 with that same shell: `/tools`, `/guides/...`, `/does-not-exist`, `/dashboard`, `/TOOLS`, `/tools/`, `/tools.html`. Every one of them has `<link rel="canonical" href="https://app.getpaddock.com/">` and the same title.
- The live `sitemap.xml` (17 URLs, published by the app build) lists `getpaddock.com/...` marketing URLs. Each of them tells Google its canonical is `app.getpaddock.com/`, so Google drops them as "alternative page with proper canonical tag". **In effect, the whole marketing site has been removed from Google's index.**

The marketing site from this repo is still deployed and healthy on Cloudflare Pages at `https://paddock-site.pages.dev`: self-referencing canonicals, 301s for trailing-slash and `.html` variants, real 404s with noindex. Only the custom domain was re-pointed.

I also found and fixed smaller issues in the code: duplicate canonical and description tags, and titles that differed between the server HTML and what the browser renders. These are not what triggered the warning.

**Verdict: Not ready.** The material indexing problem is a DNS/hosting setting that I am not authorised to change. The code fixes are done and verified locally.

## Affected URL classification

The URLs come from the live sitemap and the repo's route registry. Search Console's own list of affected URLs was not available.

| URL(s) | Google is directed to | Classification |
|---|---|---|
| All 23 `PUBLIC_ROUTES` on `https://getpaddock.com` (`/`, `/tools`, `/tools/*`, `/guides`, `/guides/*`, landing pages, `/privacy`, `/security`, `/support`, `/terms`) | `https://app.getpaddock.com/` | **3 — should be independently indexed.** Cause: the domain serves the app build. Fix: point the domain back at the marketing site. |
| `https://getpaddock.com/guides/how-long-will-my-pension-last` (only in the live app sitemap, never a page here) | `https://app.getpaddock.com/` | **3 → now a 301** to `/tools/pension-drawdown-calculator` (same topic; that route lists "how long will my pension last" as a target keyword). |
| `getpaddock.com/dashboard`, `/auth`, `/settings`, unknown paths | `https://app.getpaddock.com/` | **Should not exist on this host.** Under the Pages deployment they return 404 + noindex. |
| `paddock-site.pages.dev/*` | `https://getpaddock.com/...` | **1 — correctly excluded.** Now also sent `X-Robots-Tag: noindex`. |
| `?utm_*` / `?ref=` variants, `/tools/`, `/tools.html` (on Pages) | self canonical / 301 | **1 — correctly excluded / redirected.** |

## Findings

| # | Severity | Affected | Root cause | Evidence | Fix | Verification | Outstanding |
|---|---|---|---|---|---|---|---|
| 1 | **Critical** | Every URL on `getpaddock.com` | Apex and `www` DNS point at the Firebase Hosting site `get-paddock`, which serves the app build. | `dig`, identical ETag on apex and app subdomain, canonical `https://app.getpaddock.com/` on every path, `npm run check:seo-redirects` → 33 failures | **Not fixable in this repo.** Requires DNS/hosting change (see action plan). | Live checker output recorded below | **Owner action** |
| 2 | High | Live `robots.txt` / `sitemap.xml` | Both come from the app build. robots is `Allow: /` with no private-path disallows. The sitemap is missing 7 live pages and lists 1 URL that doesn't exist. | `curl` of both files | Repo versions are already correct and are restored by fix #1 | Local check PASS | Restore domain |
| 3 | High | Private app routes on `getpaddock.com` (`/dashboard`, `/auth`, …) | App shell answers 200 and is indexable on the marketing host. HTML contains no user data (client-rendered, auth-gated). | `curl` 200 + `Allow: /` | Restored by fix #1 (Pages returns 404 + noindex; repo robots disallows them) | Pages probe | Restore domain. Also review `app.getpaddock.com` robots/noindex in the app repo. |
| 4 | Medium | 14 routes (tool pages, tools hub, guides, privacy/security/support/terms, founder note) | Page-level `<Helmet>` blocks duplicated the head tags that `App.jsx` sets from `meta.js`. Rendered DOM had **2 canonicals and 2 meta descriptions**, and on 8 routes the rendered `<title>` differed from the prerendered one. | Browser comparison of server HTML vs rendered DOM on `paddock-site.pages.dev` | Removed duplicate title/description/canonical/OG/Twitter tags from Helmet in 7 page components and `GuideShell`; kept FAQ JSON-LD. `meta.js` is now the single source for server and client. | Browser recheck of all 23 routes: 1 canonical, title and description identical to server HTML | — |
| 5 | Low | Client-side 404 (`NotFound`) | Meta effect fell back to `PAGE_META.landing`, giving a noindex 404 a homepage canonical and homepage JSON-LD | `App.jsx` meta effect | Unknown routes now remove canonical + JSON-LD. Canonical is re-created on navigation. | Browser: unknown path → 0 canonicals, `noindex` | — |
| 6 | Low | `*.pages.dev` mirror | Full indexable copy of the site on a second host (canonicals were already correct) | `curl` of `paddock-site.pages.dev` | `public/_headers`: `X-Robots-Tag: noindex` scoped to the pages.dev hostnames only | Built `dist/_headers` | Takes effect on next Pages deploy |
| 7 | Low | `/guides/how-long-will-my-pension-last` | Google learned it from the app's sitemap. It would 404 after restore. | Live sitemap diff | `LEGACY_REDIRECTS` in `seoRoutes.js` → generated `_redirects` 301 (with and without slash) | Local check: one hop → 200 | Requires deploy |
| 8 | Low | `http://www.getpaddock.com/` | Two hops (http→https www→apex) | Live checker | Not fixable in repo | — | Add a single-hop rule in the hosting/redirect layer when restoring |

Checked with no issues found (on the Pages deployment and in the build): canonical host/protocol/path policy (HTTPS, apex, no trailing slash), sitemap validity, lastmod taken from the route registry (static, not per-request), robots rules, one H1 per page, no accidental noindex, unique titles and descriptions, internal links (121 unique, no orphans, priority pages ≥2 inbound), JSON-LD parses on every page.

## Route inventory

All 23 entries in `src/seoRoutes.js` `PUBLIC_ROUTES` are public marketing pages. Each should be indexed, return 200, have a self-referencing `https://getpaddock.com{path}` canonical, appear in the sitemap and be linked internally. None needs authentication. Private and app routes (`/api/`, `/admin`, `/dashboard`, `/settings`, `/accounts`, `/auth`) are not served by this site: they return 404 + noindex and are disallowed in `robots.txt`. Authentication lives on `app.getpaddock.com`.

## Code changes

- `src/App.jsx`: no homepage fallback for unknown routes. Canonical tag is created if missing.
- `src/components/GuideLayout.jsx`, `src/guides/*.jsx`, `src/pages/{Privacy,Security,Support,Terms,ManualTracking,ToolsHub}.jsx`, `src/tools/*Calculator.jsx`: removed duplicate Helmet head tags. The FAQ JSON-LD on the phased-drawdown and retirement-bridge calculators is kept.
- `src/seoRoutes.js`: `LEGACY_REDIRECTS`.
- `scripts/prerender.js`: writes the legacy redirects into `_redirects`.
- `scripts/seo-check-lib.mjs`: the local test server honours the legacy redirects.
- `scripts/check-google-indexability.mjs`: new assertions:
  - exactly one canonical per prerendered page
  - each legacy redirect resolves in one hop to a public route
  - no component outside `App.jsx` renders a canonical or a Helmet `<title>` (verified against the pre-fix code, where the guard fires)
- `public/_headers`: noindex for `paddock-site.pages.dev` and preview hosts.

**Visible effect:** for the 8 routes listed in finding #4, the browser-rendered `<title>` is now the shorter `meta.js` title that was already in the prerendered HTML. Google had not been seeing either title since September, so this is the moment to settle on one.

**Tests run (local):**
- `npm run build`: OK, 23 routes prerendered
- `npm run lint` (`eslint .`): clean
- `npm run check:indexability`: PASS
- `npm run check:internal-links`: PASS
- all 6 calculator unit tests: PASS
- Browser check of server vs rendered head tags on all 23 routes plus an unknown path, against the local build: PASS

**Live (production, unchanged):** `npm run check:seo-redirects` → **FAIL, 33 issues**, all caused by finding #1.

## Search Console action plan

**Resolved in code:** findings 4, 5, 6, 7.

**Requires deployment:** push to the branch Cloudflare Pages builds from, then confirm `paddock-site.pages.dev` shows the new `_headers` and the legacy redirect.

**Requires owner action (DNS/hosting, not done by this audit):**

1. In Cloudflare DNS, point `getpaddock.com` and `www` back to the Cloudflare Pages project `paddock-site`. Add both as custom domains on that Pages project, then remove the apex/`www` A/CNAME records that point at Firebase. Remove `getpaddock.com` and `www.getpaddock.com` as custom domains on the Firebase Hosting site `get-paddock`, keeping only `app.getpaddock.com`.
2. Add a single-hop redirect `http://www.getpaddock.com/*` and `https://www.getpaddock.com/*` → `https://getpaddock.com/$1` (Cloudflare Bulk Redirect or redirect rule).
3. In the app repo: decide whether `app.getpaddock.com` should be indexed at all. At minimum, stop it publishing a `getpaddock.com` sitemap and `Allow: /` robots. If the app build can be served on other hosts again, make its canonical/robots host-aware.
4. Then run `SEO_BASE_URL=https://getpaddock.com npm run check:seo-redirects` and `npm run check:seo-redirects`. Both should pass.

**Requires Search Console access:**

- Indexing → Pages → "Alternative page with proper canonical tag": export the URL list. Confirm every URL is on `getpaddock.com` and that the user-declared canonical is `https://app.getpaddock.com/`.
- URL Inspection on `/`, `/tools/pension-drawdown-calculator` and `/moneyhub-alternative`. Before the fix, expect user-declared canonical = `app.getpaddock.com/`. After the fix, use "Test live URL" to confirm the declared canonical is self-referencing.
- Sitemaps: resubmit `https://getpaddock.com/sitemap.xml` and check it reports 23 URLs.
- Click "Validate fix" on the canonical issue, and request indexing for the homepage and a few priority pages.
- Check whether an `app.getpaddock.com` property exists and what it has indexed.

**Requires Google to recrawl:** expect days to weeks before pages return to the index. Validation can take up to about a month. Nothing here guarantees indexing.

**Intentionally excluded:** `*.pages.dev` hosts, trailing-slash and `.html` variants (301), query-string variants (canonicalised), unknown paths (404), private app paths.

## Final verdict

**Not ready.** Code fixes are implemented and verified locally. The critical indexing problem (production domain serving the app build with an `app.getpaddock.com` canonical) remains live until the DNS/hosting change is made, the site is redeployed and Google recrawls it.
