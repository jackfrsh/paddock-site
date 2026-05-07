# Google Indexing and SEO Audit

Date: 2026-05-07

## 1. Canonical Domain Policy

Canonical marketing origin:

`https://getpaddock.com`

Canonical page URL policy:

- Homepage uses `https://getpaddock.com/`.
- All other public marketing pages use HTTPS, apex domain, lowercase paths, and no trailing slash.
- Internal links, sitemap entries, canonical tags, and Open Graph URLs must match the canonical URL exactly.
- Non-canonical variants may redirect only when they are infrastructure variants or retired duplicate page variants, and must redirect in one hop.

Required host/protocol redirects:

- `http://getpaddock.com/*` -> `https://getpaddock.com/:splat`
- `http://www.getpaddock.com/*` -> `https://getpaddock.com/:splat`
- `https://www.getpaddock.com/*` -> `https://getpaddock.com/:splat`

Cloudflare Pages `_redirects` does not handle domain-level host/protocol policy, so these must be enforced in Cloudflare DNS/Bulk Redirects/Page Rules. The repo checks verify live host variants when run with `SEO_BASE_URL=https://getpaddock.com`.

## 2. Redirects Found and Removed

Redirect mechanisms audited:

- `public/_redirects`
- generated `dist/_redirects`
- `scripts/prerender.js`
- `scripts/check-seo-redirects.mjs`
- route handling in `src/App.jsx`
- navigation helpers in `SiteHeader`, `SiteFooter`, `ToolsDropdown`, page CTAs, guide links, and tool links
- canonical metadata in `src/meta.js`, page-level Helmet components, and `GuideLayout`
- sitemap and robots assets
- 404 handling

Harmful redirects removed or prevented:

- Unknown public paths are not redirected to the homepage. They resolve to `404.html` with a `404` status.
- Sitemap URLs are slashless canonical URLs, so sitemap entries do not redirect.
- Public pages are not redirected to app auth routes.
- No JavaScript redirect is used for public SEO pages. JavaScript navigation to `app.getpaddock.com/auth` is limited to explicit sign-in/sign-up CTA actions.

## 3. Redirects Kept and Why

Kept in `_redirects`:

- Trailing-slash retired variants for public pages, for example `/tools/` -> `/tools`.
- One-hop rewrites from canonical page paths to generated prerendered HTML files, for example `/tools/pension-drawdown-calculator` -> `/tools/pension-drawdown-calculator.html` with status `200`.
- Unknown route handling: `/* /404.html 404`.

These are valid because canonical sitemap URLs return direct `200` responses, while duplicate slash variants consolidate to the slashless canonical page.

## 4. Public Indexable URL List

- `https://getpaddock.com/`
- `https://getpaddock.com/tools`
- `https://getpaddock.com/tools/net-worth-calculator`
- `https://getpaddock.com/tools/pension-drawdown-calculator`
- `https://getpaddock.com/tools/retirement-bridge-calculator`
- `https://getpaddock.com/tools/fire-number-calculator`
- `https://getpaddock.com/tools/isa-growth-calculator`
- `https://getpaddock.com/guides`
- `https://getpaddock.com/guides/multi-currency-net-worth-tracker`
- `https://getpaddock.com/guides/long-term-wealth-projection`
- `https://getpaddock.com/guides/inflation-adjusted-net-worth`
- `https://getpaddock.com/net-worth-tracker`
- `https://getpaddock.com/track-isas-pensions-savings`
- `https://getpaddock.com/spreadsheet-alternative-net-worth-tracking`
- `https://getpaddock.com/how-to-track-your-net-worth`
- `https://getpaddock.com/best-net-worth-tracking-apps-uk`
- `https://getpaddock.com/why-i-track-wealth-manually-instead-of-using-open-banking-apps`
- `https://getpaddock.com/privacy`
- `https://getpaddock.com/security`
- `https://getpaddock.com/support`
- `https://getpaddock.com/terms`

## 5. Private / Non-Indexable URL List

Private or app-only prefixes excluded from sitemap and disallowed in robots:

- `/api/`
- `/admin`
- `/dashboard`
- `/settings`
- `/accounts`
- `/auth`

App authentication remains on `https://app.getpaddock.com/auth`, not the public marketing domain.

## 6. Sitemap Rules

The sitemap is generated from `PUBLIC_ROUTES` by `scripts/prerender.js`.

Rules enforced:

- Available at `/sitemap.xml`.
- Includes only final canonical URLs.
- Uses `https://getpaddock.com` consistently.
- Excludes auth, app, API, dashboard, admin, settings, and private routes.
- Excludes trailing-slash duplicates.
- Includes `lastmod` from the route registry.

## 7. Robots.txt Rules

`robots.txt` allows public marketing pages and references:

`Sitemap: https://getpaddock.com/sitemap.xml`

Blocked prefixes are limited to private/app/API/admin-style routes. Public pages such as `/`, `/tools`, `/guides`, `/privacy`, `/terms`, `/security`, and `/support` are not blocked.

## 8. Canonical Tag Policy

Every public route must have:

- self-referencing canonical
- matching Open Graph URL
- matching sitemap URL
- HTTPS apex domain
- no trailing slash except homepage
- no `noindex`

Canonical and sitemap drift is checked by:

- `node scripts/check-google-indexability.mjs`
- `node scripts/check-seo-redirects.mjs`

## 9. Internal Linking Improvements

Changes made:

- Shared footer links now use crawlable `<a href>` links instead of JavaScript-only buttons.
- Prerendered fallback HTML now includes crawlable related links for every public route.
- Route registry stores related links for each page so important pages have multiple internal inbound links.
- Tool pages, guide pages, comparison pages, privacy/manual-entry content, and the homepage are connected through canonical slashless links.

## 10. Page-Level SEO Improvements

Technical/content changes:

- `PUBLIC_ROUTES` now stores target keyword, secondary keywords, search intent, H1, intro copy, priority status, lastmod, and related links.
- `scripts/prerender.js` injects route-specific H1, intro copy, and related internal links into each generated HTML page.
- Sitemap and `_redirects` are generated from the route registry to avoid manual drift.
- Homepage JSON-LD now uses `WebApplication` with finance application context.
- Titles and descriptions were tightened for homepage, tools index, key calculators, net worth tracker, comparison page, and manual/privacy positioning pages.

## 11. First-Page Readiness Table

| URL | Target keyword | Secondary keywords | Search intent | Status | Redirects? | Indexable? | Sitemap? | Canonical? | Title quality | Meta quality | H1 quality | Content depth | Links in | Links out | Schema | CWV risk | Mobile risk | Page-one readiness | Recommended improvement |
|---|---|---|---|---:|---|---|---|---|---|---|---|---|---:|---:|---|---|---|---:|---|
| `/` | net worth tracker UK | manual wealth tracker; privacy-first wealth tracking | Product discovery | 200 | No | Yes | Yes | Yes | Strong | Strong | Good | Strong | 20 | 5+ | WebApplication | Medium | Low | 8 | Validate live host redirects after deploy |
| `/tools` | UK wealth calculators | pension calculator UK; FIRE calculator UK | Tool selection | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Good | 7+ | 5+ | CollectionPage | Low | Low | 8 | Add future calculator pages only when substantive |
| `/tools/pension-drawdown-calculator` | pension drawdown calculator UK | how long will my pension last; SIPP drawdown calculator | Calculate pension longevity | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 8+ | 4+ | WebPage | Low | Low | 9 | Add FAQPage schema if FAQ markup is promoted to shared route metadata |
| `/tools/fire-number-calculator` | FIRE number calculator UK | financial independence calculator UK; retire early UK | Calculate FI target | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 8+ | 4+ | WebPage | Low | Low | 9 | Add Coast/Lean FIRE supporting copy if search demand grows |
| `/tools/net-worth-calculator` | net worth calculator UK | net worth tracker UK; track ISA and SIPP together | Calculate net worth | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 7+ | 4+ | WebPage | Low | Low | 9 | Add examples for property, pensions, and liabilities |
| `/tools/retirement-bridge-calculator` | ISA retirement bridge calculator UK | retire before pension access UK | Bridge pre-pension years | 200 | No | Yes | Yes | Yes | Good | Good | Good | Strong | 4+ | 4+ | FAQPage/WebPage | Low | Low | 8 | Link from more retirement guide content |
| `/tools/isa-growth-calculator` | ISA growth calculator UK | Stocks and Shares ISA calculator | Project ISA growth | 200 | No | Yes | Yes | Yes | Good | Good | Good | Strong | 4+ | 4+ | WebPage | Low | Low | 7 | Add ISA allowance/year-specific caveats when maintained |
| `/guides` | wealth tracking guides UK | net worth planning UK | Learn planning topics | 200 | No | Yes | Yes | Yes | Good | Good | Good | Good | 7+ | 4+ | CollectionPage | Low | Low | 7 | Add more UK pension/FIRE guide depth |
| `/guides/multi-currency-net-worth-tracker` | multi-currency net worth tracker | track investments across currencies | Track currencies | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 5+ | 4+ | Article | Low | Low | 8 | Add worked GBP/USD/EUR example |
| `/guides/long-term-wealth-projection` | long-term wealth projection | compound growth planning | Understand projections | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Strong | 5+ | 4+ | Article | Low | Low | 8 | Add more UK retirement/FIRE examples |
| `/guides/inflation-adjusted-net-worth` | inflation-adjusted net worth | real vs nominal wealth | Understand real terms | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Strong | 5+ | 4+ | Article | Low | Low | 7 | Add calculator-style example table |
| `/net-worth-tracker` | net worth tracker UK | manual wealth tracking app | Product comparison/selection | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 6+ | 4+ | WebPage fallback | Low | Low | 9 | Add richer comparison snippets against spreadsheets/open banking |
| `/track-isas-pensions-savings` | track ISA and SIPP together | track ISAs pensions savings | Track UK wrappers together | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Good | 4+ | 4+ | WebPage fallback | Low | Low | 8 | Add SIPP/ISA lifecycle examples |
| `/spreadsheet-alternative-net-worth-tracking` | spreadsheet alternative net worth tracking | manual wealth tracking app | Replace spreadsheet workflow | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Good | 4+ | 4+ | WebPage fallback | Low | Low | 8 | Add spreadsheet failure modes and migration checklist |
| `/how-to-track-your-net-worth` | how to track your net worth | how to track net worth manually | Learn tracking method | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Good | 4+ | 4+ | WebPage fallback | Low | Low | 8 | Add downloadable/checklist-style section later |
| `/best-net-worth-tracking-apps-uk` | best net worth tracking app UK | Emma alternative UK; Moneyhub alternative | Compare options | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 5+ | 4+ | Article | Low | Low | 8 | Keep competitor claims current and specific |
| `/why-i-track-wealth-manually-instead-of-using-open-banking-apps` | open banking alternative | manual wealth tracking app | Understand privacy/manual positioning | 200 | No | Yes | Yes | Yes | Strong | Strong | Strong | Strong | 5+ | 4+ | Article | Low | Low | 8 | Link from future comparison pages |
| `/privacy` | privacy-first finance app UK | no bank linking finance app | Trust/privacy details | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Good | 5+ | 4+ | WebPage fallback | Low | Low | 7 | Add structured privacy principles section if expanded |
| `/security` | Paddock security | wealth tracker security | Trust/security details | 200 | No | Yes | Yes | Yes | Good | Good | Strong | Good | 4+ | 4+ | WebPage fallback | Low | Low | 6 | Add plain-English controls list as product matures |
| `/support` | Paddock support | Paddock contact | Contact support | 200 | No | Yes | Yes | Yes | Good | Good | Good | Good | 3+ | 4+ | WebPage | Low | Low | 5 | Keep indexable unless support becomes operational noise |
| `/terms` | Paddock terms | terms of use | Legal terms | 200 | No | Yes | Yes | Yes | Good | Good | Good | Adequate | 4+ | 4+ | WebPage fallback | Low | Low | 5 | Legal page is not a ranking target |

## 12. Remaining Risks

- Production host/protocol redirects depend on Cloudflare configuration outside this repo.
- The local checks verify generated Cloudflare Pages-style route handling, but live behavior must be rechecked after deployment.
- Some page components still set page-specific Helmet metadata directly; generated static metadata is aligned, but future edits should keep `PAGE_META`, page Helmet, and `PUBLIC_ROUTES` consistent.
- Competitor/comparison content should be reviewed periodically so claims remain accurate.
- Core Web Vitals should be monitored after deployment because image-heavy sections can affect LCP on slower mobile connections.

## 13. Automated Verification

Run after build:

```sh
npm run build
npm run lint
node scripts/check-google-indexability.mjs
node scripts/check-internal-links.mjs
```

Optional live checks after deployment:

```sh
SEO_BASE_URL=https://getpaddock.com node scripts/check-google-indexability.mjs
SEO_BASE_URL=https://getpaddock.com node scripts/check-internal-links.mjs
```

The new checks fail on:

- canonical public URL returning 3xx/4xx/5xx
- missing or incorrect canonical
- `noindex`
- robots blocking a public page
- missing sitemap entry
- duplicate title
- duplicate meta description
- missing H1
- multiple H1s
- sitemap URL redirecting
- internal links to redirected or broken URLs
- orphaned public pages
- priority pages with fewer than two inbound internal links

## 14. Google Search Console Steps After Deployment

1. Submit `https://getpaddock.com/sitemap.xml`.
2. Inspect `https://getpaddock.com/`.
3. Inspect priority tool pages:
   - `https://getpaddock.com/tools/pension-drawdown-calculator`
   - `https://getpaddock.com/tools/fire-number-calculator`
   - `https://getpaddock.com/tools/net-worth-calculator`
4. Inspect `/tools`, `/guides`, key guide pages, comparison pages, `/privacy`, `/security`, `/support`, and `/terms`.
5. Request indexing for priority pages.
6. Validate fix for Redirect Error.
7. Monitor Page with redirect.
8. Monitor Duplicate canonical reports.
9. Monitor Crawled - currently not indexed.
10. Re-check after 7, 14, and 28 days.
