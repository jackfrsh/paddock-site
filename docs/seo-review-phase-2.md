# Technical SEO review, Growth Phase 2

Reviewed 7 November 2026 against the build produced from this branch, before deployment.
Reproduce with `npm run build`, `npm run check:indexability`, `npm run check:internal-links`
(both local mode) and the audit described at the end of this file. Live-site checks are in the deployment
section of the final report and must be repeated after each deploy.

## Result

| Area | Finding | Status |
|---|---|---|
| Crawlable HTML | All 33 public pages are prerendered to static HTML with 195 to 2,606 words of visible text each; nothing depends on client rendering for its main content. The build fails if a page has other than one `h1` or fewer than 100 words. | Pass |
| Sitemap | 33 URLs, every one a canonical, each with `lastmod`; matches `PUBLIC_ROUTES` (checked by `check:indexability`). | Pass |
| robots.txt | Allows the marketing pages, disallows `/api/`, app paths and `/auth`, and lists the sitemap. The new event endpoint `/api/e` is disallowed. | Pass |
| Canonicals | Every page canonicalises to its own slashless `https://getpaddock.com` URL. Trailing-slash variants 301 in one hop (`_redirects`, generated). | Pass |
| Titles and descriptions | No duplicates across the 33 pages. Descriptions are 100 to 168 characters. Titles are 41 to 66 characters except the four short legal and support titles, which are left as they are on purpose. | Pass |
| Headings | One `h1` per page. `/guides` has no `h2` (it is a list of links). | Pass |
| Structured data | `Article` + `BreadcrumbList` on all guides and comparison articles (with `datePublished` and `dateModified`), `WebApplication` on calculators, `CollectionPage` on the hubs, `FAQPage` on pages with FAQs. All JSON-LD parses. Google now shows FAQ rich results for few sites, so the FAQ markup is harmless but should not be counted on for visibility. | Pass |
| Breadcrumbs | Visible trail and `BreadcrumbList` on every page except the home page. | Pass |
| Internal links | 559 unique internal links; no orphans; every priority page has at least two inbound links; no link points at a redirect. | Pass |
| Redirects | Generated from `PUBLIC_ROUTES`; `check:seo-redirects` needs the live site and could not run in the sandbox (see the owner list). | Not run |
| Images | No image without `alt` text on any page. Large PNG originals sit in `dist/assets` beside WebP versions; the pages reference the WebP. | Pass |
| Speed and Core Web Vitals | Route code is split per page (each new guide is 6 to 9 kB uncompressed on top of the shared React and app bundles, about 210 kB and 150 kB uncompressed). Lab numbers from a sandbox are not Core Web Vitals. Use Search Console's Core Web Vitals report or PageSpeed Insights on the live URLs. | Owner check |
| Mobile | Checked at 390 px wide: no page-level horizontal overflow on any guide or the guide index. Wide tables scroll inside their own wrapper. | Pass |
| Duplicate content | `src/evidenceGuides.test.js` fails if two pages share a target keyword. It found that the home page and `/net-worth-tracker` both claimed "net worth tracker UK"; the home page now targets "private UK wealth tracker". | Fixed |

## Changed in this review

- `/privacy` meta description said "no tracking". The page now describes a first-party aggregate counter and Cloudflare Web Analytics, so the description says "no advertising trackers" and points to what the website counts.
- `/best-net-worth-tracking-apps-uk` description shortened from 182 to under 175 characters.
- `/terms` description lengthened from 56 characters to match the headings on the page.
- `/` target keyword changed (above).

## Known and accepted

- Four legal and support pages have short titles ("Privacy | Paddock", and so on). They are not search targets.
- The home page and the apps and tools pages carry `FAQPage` markup. Left in place.
- `Article.author` is the organisation, not a named person. A named reviewer for the figures is an owner decision (see `docs/figures.md`).

## Not verified here

- Core Web Vitals field data, the Google index state of each URL, and which queries the pages rank for. All three need Search Console, which only the owner can open.
- `www` and `http` redirects, which Cloudflare handles outside this repository (`check:indexability` skips them in local mode).

## Audit script

The table above came from a throwaway Node script that reads `dist/*.html` and `dist/sitemap.xml` and checks, per route, the canonical, title and description length, `h1` count, JSON-LD parsing, `alt` attributes, breadcrumbs and duplicate titles or descriptions. The same checks are covered for the build by `scripts/check-google-indexability.mjs` and `src/evidenceGuides.test.js`; the script was not added to the repository.
