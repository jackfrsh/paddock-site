# Measurement and Search Console

Nothing in the site sends analytics anywhere today. That is deliberate, and the
privacy page says "no tracking pixels". This file sets out what to measure, how
to do it without breaking that promise, and the owner steps that cannot be done
from the repository.

## What is already true in the code

- Calculators run in the browser. Inputs are never put in URLs, stored, or sent.
- Calculators and the result call-to-action dispatch a DOM event
  (`paddock:calc`) that carries only an event name and a source name, such as
  `result_cta_click` and `retirement_age`. Nothing listens to it yet.
- Sign-up links carry no query data from calculators.

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

### Cloudflare Web Analytics (optional, needs a wording decision)

It is cookieless and can be switched on for the Pages project without adding
cookies. It would still be a script on the site, so decide first whether the
privacy page needs a line saying so. Do not enable it without updating the page.

## Metrics

| Layer | Metric | Where it comes from |
| --- | --- | --- |
| Visibility | Impressions, clicks, average position, by page and query | Search Console |
| Indexing | Indexed vs submitted pages, excluded reasons | Search Console |
| Engagement | Visits per page, calculator page share of visits | Cloudflare Web Analytics, if enabled |
| Calculator use | Completed calculations per calculator | Not measured yet. Needs the `paddock:calc` event to be counted without inputs |
| Conversion | Result call-to-action clicks, sign-up page visits | Same event, then the app's own sign-up count |
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
