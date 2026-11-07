# Content map (Growth Phase 2)

Written 7 November 2026. It records which search need each public page answers, which pages are new
in Phase 2, what was deliberately not built, and how the pages avoid competing with each other.
The editorial rules are in `docs/editorial-system.md`; the figures are in `src/ukFigures.js`.

## How a page earns a place

A new page is added only if it answers a search need that no existing page answers, can be written from
primary sources (GOV.UK, HMRC, ONS, Bank of England, the vendor's own page for product facts), and has a
worked example that the code computes. Everything else gets a link from an existing page instead.

## Coverage of the Phase 2 brief

### Priority A: retirement and wealth

| Brief topic | Page | Status |
|---|---|---|
| Retire at 55 / 60 / 65, monthly investment to retire early | `/guides/monthly-investment-to-retire-early-uk` | **New**. Tables computed by `src/retireEarlyMaths.js` (tested against a month-by-month simulation). |
| How much to retire on | `/guides/how-much-do-i-need-to-retire-uk` | Phase 1. Now links onwards to the new pages. |
| Total net worth; net worth vs investable wealth | `/guides/net-worth-vs-investable-wealth` | **New**. Uses ONS's four-part definition of wealth. |
| Track multiple pensions and investments | `/track-isas-pensions-savings`, `/how-to-track-your-net-worth` | Existing. Not duplicated. |
| Track wealth without a bank connection | `/net-worth-tracker`, `/why-i-track-wealth-manually-instead-of-using-open-banking-apps` | Existing. Not duplicated. |
| Progress to financial independence | `/tools/fire-number-calculator`, `/tools/retirement-age-calculator` | Existing calculators, now linked from the new guides. |
| Pension pot at 40 / 45 / 50 / 55 | none | **Not built.** See below. |

### Priority B: ISAs and the tax year

| Brief topic | Page | Status |
|---|---|---|
| ISA allowance; using the allowance; multiple ISAs | `/guides/isa-allowance-uk` | **New**. |
| Cash ISA vs Stocks and Shares ISA | `/guides/cash-isa-vs-stocks-and-shares-isa` | **New**. Neutral, no product recommendation. |
| Lifetime ISA rules and changes | `/guides/lifetime-isa-rules-uk` | **New**. Covers the 29 October 2026 change to the property-over-cap charge. |
| End of tax year | `/guides/end-of-tax-year-checklist-uk` | **New**. |
| Pension and ISA together | `/track-isas-pensions-savings`, plus links from the new ISA and retirement guides | Existing. |

### Priority C: product intent

| Brief topic | Page | Status |
|---|---|---|
| Best net worth apps UK; manual vs automatic; spreadsheet vs app | `/best-net-worth-tracking-apps-uk`, `/spreadsheet-alternative-net-worth-tracking`, `/why-i-track-wealth-manually-instead-of-using-open-banking-apps` | Existing. Corrected and re-sourced in Phase 2 (`docs/comparison-verification.md`). |
| Moneyhub alternatives | `/moneyhub-alternative` | Existing. Rewritten around the announced app closure and sourced. |
| Emma alternatives | none | **Not built.** Emma is already a column and a section on `/best-net-worth-tracking-apps-uk` and `/moneyhub-alternative`. A third page for the same comparison would compete with those two. Revisit after Search Console shows real "Emma alternative" queries. |
| One place for accounts; ISAs, SIPPs and pensions together | `/track-isas-pensions-savings`, `/net-worth-tracker` | Existing. |

## Pages not built, and why

- **Pension pot by age (40 / 45 / 50 / 55).** The only credible source is the ONS Wealth and Assets Survey
  pension-wealth tables by age band. The ONS changed its method for defined benefit pensions in the
  2020 to 2022 round, so the figures are not comparable with earlier rounds, and I could not read the age-band
  tables themselves in this session (only search snippets of the bulletins). Publishing figures from
  commentary sites would breach the primary-source rule. **Owner or later session:** open the ONS "Household
  total wealth in Great Britain" pension wealth dataset, copy the median by age band with the table reference, add
  a `src/` data file with the table citation, then write the page. Until then `/guides/how-much-do-i-need-to-retire-uk` answers the underlying need ("how much do I need").
- **Emma alternative page.** See Priority C above.
- **A page per competitor.** Not wanted: the brief asks for fewer, better pages.

## Cannibalisation log

| Overlap | Resolution |
|---|---|
| `/` and `/net-worth-tracker` both targeted "net worth tracker UK" (found by the new keyword test) | Home page now targets "private UK wealth tracker", matching its title. `/net-worth-tracker` keeps "net worth tracker UK". |
| `/guides/isa-allowance-uk` vs `/track-isas-pensions-savings` | The guide answers "how much can I pay in". The tracking page answers "how do I keep a view of all my accounts". They link to each other. |
| `/guides/net-worth-vs-investable-wealth` vs `/how-to-track-your-net-worth` | Definition and when to use which number vs a routine for recording it. Cross-linked. |
| `/guides/monthly-investment-to-retire-early-uk` vs `/guides/how-much-do-i-need-to-retire-uk` | Pot size vs monthly saving to reach it. The earlier guide links to the new one as the next step. |

`src/evidenceGuides.test.js` fails if two public pages share a target keyword.

## Primary sources used by the new pages

| Claim | Source | Read how |
|---|---|---|
| ISA allowance, Lifetime ISA limits, bonus, age rules, withdrawals | GOV.UK ISA and Lifetime ISA pages; HMRC Tax-free savings newsletter 24 | Held in `src/ukFigures.js` (read 6 November 2026 and earlier) |
| Cash ISA cut dropped | HMRC newsletter 24; Autumn Budget 28 October 2026 | As above. Described as "HMRC says", not as law, because the revoking regulations had not been seen in force. |
| Multiple ISAs of the same type since 6 April 2024; Lifetime ISA minimum and maximum ages | GOV.UK ISA and Lifetime ISA pages | **Via search extracts of the GOV.UK pages**, not the pages themselves (the fetch tool could not reach them). Owner action: open both pages once and confirm. |
| Flexible ISA behaviour | Provider and adviser pages found by search; GOV.UK ISA guidance not fetched in this session | **Secondary.** The page states the general rule and tells the reader to check their provider. |
| ISA transfer wording | As above | **Secondary.** General statement only. |
| Personal Savings Allowance £1,000 / £500, dividend allowance £500, savings rates up 2 percentage points from April 2027, ISA income tax-free | GOV.UK policy paper "Changes to tax rates for property, savings and dividend income" | Page read 7 November 2026 |
| FSCS deposit limit £120,000 from 1 December 2025, covers cash ISAs | Bank of England FSCS explainer | Page read 7 November 2026 |
| FSCS investment protection limit | not quoted | Only secondary sources were read, so the pages point to fscs.org.uk instead of quoting a number. |
| ONS four components of wealth | ONS "Household total wealth in Great Britain: April 2020 to March 2022" and "Measuring wealth on an individual level" | Read via search extracts 7 November 2026 |
| State Pension, pension access age, pension annual allowance and MPAA | GOV.UK / DWP | Held in `src/ukFigures.js` |

## Dates and rollover

- All six pages: published and last reviewed 7 November 2026. Each page shows the dates, a "Paddock team" byline
  and a primary-source list with the date the figures were last checked.
- The ISA pages read their figures at build time, so on 6 April 2027 they will switch to the 2027/28 allowance
  by themselves. `npm run check:figures` fails if a required row has no entry for the new year, and now also requires the
  Personal Savings Allowance and the FSCS limit.
- **Must be reread by a person after the 2027 Finance Act and the ISA regulations:** the "Is the Cash ISA limit
  changing in April 2027?" section of `isa-allowance-uk`, the "What changes on 6 April" list in
  `end-of-tax-year-checklist-uk`, and the savings tax rate sentence in `cash-isa-vs-stocks-and-shares-isa`. All three describe announced plans.
- The Lifetime ISA page states that the First Time Buyer ISA announced for April 2029 is not covered because its details are not final.

## Assumptions in the retirement guide

Level monthly payments paid at month end; growth rates are after inflation; the pot funds the whole income (the State Pension
is ignored on purpose, which is cautious); no tax, charges or tax relief; the 4% withdrawal rate is a rule of thumb. The
page says all of this, shows the pot arithmetic, and the maths is covered by `src/retireEarlyMaths.test.js`.
