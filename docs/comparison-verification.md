# Comparison page verification (Phase 2)

Checked on **7 November 2026** by Claude, for the owner. Pages covered:
`/best-net-worth-tracking-apps-uk` and `/moneyhub-alternative`.

Paddock publishes both pages and is one of the products compared, so every claim about
another product needs a source we can show readers. The sources live in
`src/comparisonFacts.js` and are printed under each comparison table by
`src/components/ComparisonSources.jsx`. `src/comparisonFacts.test.js` fails if a vendor loses
its sources or if any of the retired claims below return.

## How we checked

- Search results and fetched pages from the vendor's own site, App Store listing or privacy
  policy where reachable. Third-party pages are labelled as such on the page.
- The sandbox cannot fetch some vendor domains directly (`emma-app.com/plans`,
  `wealthr.co.uk`). For those, the vendor's own text was read as it appears in search
  results, which quote the page. **Owner action: open each source once in a browser and
  confirm the figures before the next quarterly review.**
- Where something could not be found, the page now says "not found" or "not checked", never
  "No".

## Moneyhub

| Claim on the page | Verdict | Evidence |
| --- | --- | --- |
| Consumer app closed in August 2026 (stated as fact, in title, H1, FAQ, schema) | **Not confirmed. Reworded.** | Moneyhub's own end-of-service page says "our target decommission date is August 14th 2026" and states no completion. Smart Money People lists the app as "discontinued". We found no Moneyhub statement after 14 August. The page now says the app "was due to close", gives both sources and tells readers to ask Moneyhub directly. |
| Stopped taking new consumer users; concentrating on business channels | Confirmed | Moneyhub announcement. |
| Data could be downloaded as CSV; personal data deleted once the app closes | Confirmed | Moneyhub announcement and FAQ. |
| "Apps that depend on bank connections are costly to run... whatever the mix of reasons" | **Removed** | Speculation. Replaced with Moneyhub's own stated reason. |
| Moneyhub made no arrangements with other providers | Added | Announcement: "no commercial or migration arrangements". |

## Emma

| Claim on the page | Verdict | Evidence |
| --- | --- | --- |
| Open banking required | **Wrong. Reworded.** | Third-party reviews (Money to the Masses, Cool Curation) say paid plans allow manual ("offline") accounts. Now "Open banking; manual accounts on paid plans". |
| Net worth not offered / "Not designed for wealth tracking" | **Misleading. Reworded.** | Emma's App Store listing advertises net worth tracking; reviews place it on Pro and above. Added a "Net worth tracking" row. |
| Long-term projections: No | **Unverifiable. Reworded.** | Nothing found in its descriptions. Now "Not found in its plan descriptions". |
| Multi-currency: "UK-focused" | **Removed** | Not verified. |
| Prices | Added | UK App Store listing: Plus £4.99/month (£41.99/year), Pro £9.99/month (£83.99/year), Ultimate £14.99/month. Other sites quote different figures; the listing is used. |
| Data used to improve the product | Confirmed | Emma privacy policy: personal data used to "improve and customise" services; credit features share data with TransUnion and iovation (US). |
| "Version 3 rollout received significant complaints" | **Removed** | No source. |
| "Large, active team with regular updates" | **Removed** | No source. |
| Free tier limited to two bank logins | Attributed | Third-party reviews only. Page says "reviews report". |

## WealthR (wealthr.co.uk)

| Claim on the page | Verdict | Evidence |
| --- | --- | --- |
| "Completely free" | **Wrong. Reworded.** | Site: free tier plus Pro. Pro price differs across WealthR's own pages (£4.99 or £5.99 a month; £39.99 or £49.99 a year). The page says so and sends readers to its pricing page. |
| "Self-hosted option" | **Removed** | Nothing on its site, press kit or comparison pages mentions self-hosting. |
| Web PWA, no native app | Confirmed | Site schema: web, iOS (PWA), Android (PWA). |
| No bank linking | Confirmed | Home page. |
| ISA, SIPP, DB pension tracking; FIRE, Monte Carlo, stress test; UK tax calculators | Confirmed | Home page and press kit. |
| "No multi-currency support built in" | **Removed** | Not verified either way. |
| Name confusion | Added | `getwealthr.com` is a different product with a near-identical name; the page says so. |

## WealthView

| Claim on the page | Verdict | Evidence |
| --- | --- | --- |
| "iOS only, no Android" | **Not safe. Reworded.** | A Google Play listing titled WealthView exists. Availability not checked. |
| "iCloud sync only" | **Removed** | Listings say data is stored on the device; no sync method is stated. |
| "No meaningful projections or retirement planning tools" | **Wrong. Reworded.** | App Store listing: retirement modeller, stress test, State Pension, DB pensions (Premium), ISA and pension allowance tracking (free). |
| "Limited UK wrapper depth", "Partial" | **Wrong. Reworded.** | Same listing. |
| "Well-rated on the App Store" | **Removed** | Only the vendor's own site quotes a rating. |
| One-time price | Confirmed, with figure | £7.99 Premium unlock. |
| Data stays on device, no account | Confirmed | App Store listing. |

## Paddock's own statements on these pages

| Claim | Verdict | Fix |
| --- | --- | --- |
| "Long-term projections 5–40 years" (presented as general) | Pro only | Now "1 year free; 5–40 years with Pro", from `planFacts.js`. |
| "Well-reviewed for its design quality" (iOS app) | **Removed** | No source. |
| "Closest thing to a Moneyhub replacement" | **Removed** | Superlative without a basis. |
| "Nothing is shared... the data stays in the app" (FAQ, also in page schema) | **Wrong. Reworded.** | Paddock stores balances in its own account on hosted infrastructure. The FAQ now says so. |
| "Open banking tools require you to share credentials" | **Wrong. Reworded.** | Open banking approvals happen at the user's bank; the app still receives account data. |
| "No bank credentials shared; no aggregator" | Accurate | Kept, with "Paddock holds only the balances and assumptions you choose to enter, in your Paddock account". |
| Daily FX rates | Accurate | `wealthapp/backend/app/routers/fx.py` caches rates daily (with approximate fallback if providers fail). |

## Still open

1. Confirm Moneyhub's closure with a Moneyhub statement or an App Store removal date, then
   change "was due to close" to "closed on" in `MoneyHubAlternative.jsx`, `moneyhubFaqs.js`,
   `meta.js` and `seoRoutes.js`.
2. Re-read Emma's plans page, WealthR's pricing page and WealthView's listing in a browser
   and update `comparisonFacts.js` if prices have moved.
3. Decide whether the "Emma alternative" intent deserves its own page. At the moment the
   best-apps page covers it; a separate page would risk cannibalising it.
4. Quarterly recheck; put the date in the calendar. `COMPARISON_CHECKED_ON` should change only
   after the sources have actually been reread.
