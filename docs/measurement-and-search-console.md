# Measurement and Search Console

Measurement is built into the code but **not collecting yet**: it needs the
owner steps below and in `docs/acquisition-reporting.md`, which is the full
specification (event catalogue, privacy design, weekly workflow, troubleshooting).

The privacy page describes this measurement in its "This website" section. Keep
it in step with the code.

## What is true in the code

- Calculators run in the browser. Inputs are never put in URLs, stored, or sent.
- The site sends four anonymous, allowlisted events (calculator started and
  completed, call to action displayed and clicked) to its own Cloudflare Pages
  Function, which writes aggregate data points. No cookies, no browser storage, no
  identifiers, no values. It honours Global Privacy Control and Do Not Track.
- Sign-up links carry `src=<page key>`, a coarse label for the page. The app
  ignores it today (see `docs/app-instrumentation-plan.md`).

## Owner steps (cannot be done from the repo)

### Google Search Console

1. Add a **Domain property** for `getpaddock.com` and verify it with the DNS TXT
   record Google gives you in the Cloudflare DNS dashboard. This needs no code
   change and verifies every subdomain and protocol at once.
2. Open Sitemaps and submit `https://getpaddock.com/sitemap.xml`.
3. Open URL inspection for the new pages and request indexing for:
   `/tools/retirement-age-calculator`,
   `/guides/how-much-do-i-need-to-retire-uk`,
   `/guides/pension-drawdown-explained`.
4. Check Pages (indexing) a week later for "Crawled, currently not indexed" and
   "Discovered, currently not indexed", and Enhancements for breadcrumb errors.

The site is ready for this: `robots.txt` allows the public pages and names the
sitemap, every public page has a self-referencing canonical, and
`npm run check:indexability` confirms this against the built site. Nothing here
has been submitted or verified yet.

### Bing Webmaster Tools (optional)

Import the verified Search Console site, which needs no extra code.

### Cloudflare Web Analytics and the event counter

Follow section 6 of `docs/acquisition-reporting.md`: enable Web Analytics on the
Pages project, create the `PADDOCK_EVENTS` Analytics Engine binding, and create a
read-only API token for the weekly report. The privacy page already describes
both, so enable them promptly after the deploy.

## Metrics

| Layer | Metric | Where it comes from |
| --- | --- | --- |
| Visibility | Impressions, clicks, average position, by page and query | Search Console |
| Indexing | Indexed vs submitted pages, excluded reasons | Search Console |
| Engagement | Visits per page, calculator page share of visits | Cloudflare Web Analytics, if enabled |
| Calculator use | Started and completed per calculator | First-party event counter (`scripts/acquisition-report.mjs`) |
| Conversion | Result call-to-action displays and clicks, sign-up link clicks by page | Same counter; then the app's own sign-up count by `src` once recorded |
| Activation | Sign-ups that add a first balance | The app (separate repo), outside this site |

Report calculator and conversion numbers as counts and rates only. Never log what
someone typed.

## Baseline (site state on 6 November 2026, after this change)

- 26 indexable public routes in the sitemap (was 23 before this work).
- Home, tools hub and guides hub; 7 calculators; 5 guides (2 of them new and
  evidence-based); 7 product, comparison and editorial pages; 4 legal and
  support pages.
- Search traffic, rankings and sign-up numbers: **not available from the
  repository.** Take the first Search Console export in the week after
  verification and record it here.

## Weekly report template

```
Week ending: DD Month YYYY

Search Console
- Clicks / impressions / average position (vs last week)
- Top 5 pages by clicks; top 5 queries by impressions
- Indexed pages: N of 26. New exclusions: ...

Pages
- Published or changed this week: ...
- Figures reviewed this week: ...

Conversion
- Calculator completions (if measured): ...
- Result call-to-action clicks (if measured): ...

Risks and next week
- ...
```

## Success measures for the first 90 days

- All 26 URLs indexed.
- Impressions growing week on week for the calculators and the two guides.
- Result call-to-action click rate known (needs the event counted first).
- No figure past its review date.
