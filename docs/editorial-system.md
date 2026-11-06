# Editorial system: standards, calendar and outreach

## Page types and what each must have

| Type | Must have |
| --- | --- |
| Calculator | Runs without registration; inputs stay in the browser; stated method and assumptions; UK figures from `ukFigures.js` with a source and checked date; "illustrative, not advice" line; result call-to-action (`ResultCta`); tests for the maths |
| Evidence-based guide | Quick answer first; worked example using real figures; primary-source links; published and last-reviewed dates; call-to-action; no invented author credentials (byline is "the Paddock team") |
| Comparison page | Says Paddock publishes it and is one of the products compared; only claims that can be checked from the other product's own site; date checked; a "where Paddock is weaker" section |

Use the guide components in `src/components/GuideLayout.jsx`: `ArticleDates`,
`QuickAnswerBox`, `SourceList`, `GuideCTA`. Article structured data is built in
`src/meta.js`; add the page's key to `FIRST_PUBLISHED` there and `lastmod` in
`src/seoRoutes.js`.

## Quality checklist before publishing

1. Every number comes from `ukFigures.js` or is a clearly labelled example.
2. Every rule stated has a primary source (GOV.UK, HMRC, MoneyHelper, the
   regulator, the provider) that was read, not a news report.
3. No advice: no "you should", no product recommendation, no buy/sell/hold, no
   defined benefit transfer guidance, no affiliate links.
4. The page says what it leaves out.
5. `npm run check`, `npm run build`, `npm run check:indexability` and
   `npm run check:internal-links` pass.
6. At least two internal links point to the new page, and it links to its related
   calculator and guide.

## Internal linking conventions

- Every guide links to the calculator that does the sum, and every calculator
  links to the guide that explains it.
- Links in page copy use the real path as `href` with a client-side click handler
  (see the `link()` helper in the guide pages), so they work without JavaScript.
- A route's `links` array in `src/seoRoutes.js` must match links on that page;
  `check:indexability` and `check:internal-links` enforce it.

## Calendar (anchored to real UK dates)

Dates marked "confirm" were not verified and must be checked before planning.

| When | Event | Content to refresh or publish |
| --- | --- | --- |
| By 31 Jan 2027 | Self Assessment online deadline | Guide on tracking tax-relevant balances (no tax advice) |
| Feb to Mar 2027 | Spring fiscal event (confirm date) | Re-read all rates; refresh figures; update affected guides |
| 15 Mar 2027 | Figures review date in `ukFigures.js` | Run the April checklist in `docs/figures.md` |
| Late Mar 2027 | Tax year end (5 April) | "Use your ISA allowance before 5 April" explainer; ISA calculator refresh |
| 6 Apr 2027 | New tax year | Flip statuses; State Pension and allowance changes; update "this tax year" copy |
| Summer 2027 | Mid-year figures check | Re-verify every row older than 120 days |
| Oct to Nov 2027 | Autumn Budget (confirm date) | Post-Budget figures review within a week; refresh guides |
| 6 Apr 2028 | Normal minimum pension age rises to 57 | Update drawdown guide and calculators (copy already reads from the figures file) |

## Distribution: outreach list (draft, nothing has been sent)

Do not contact anyone without approval. Offer something useful (a calculator, a
sourced figure, a correction) and never ask for or pay for links.

| Target | Type | Possible angle | Notes |
| --- | --- | --- | --- |
| Monevator | UK investing blog | Retirement age and drawdown calculators for readers | Verify submission or contact route |
| Meaningful Money | UK personal finance podcast | Privacy-first manual tracking | Verify contact route |
| Pension Craft | UK pensions podcast | Drawdown guide with primary sources | Verify contact route |
| r/UKPersonalFinance | Community | Answer questions; share a calculator only where rules allow | Read the subreddit rules first; no promotion |
| r/FIREUK | Community | FIRE number and retirement age calculators | Read the rules first |
| MoneyHelper / Pension Wise | Public guidance | Not for promotion: link only to their pages as sources | |

Resource-page opportunities should be found by searching for pages that list UK
retirement or FIRE calculators and checking that Paddock's calculator adds
something they do not have.
