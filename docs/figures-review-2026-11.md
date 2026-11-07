# Figures review, November 2026

Phase 3, **7 November 2026**. Scope: the October 2026 Cash ISA and Lifetime ISA changes, the April
2027 wording, and whether the site keeps working on 6 April 2027. Every figure the site quotes lives in
`src/ukFigures.js`; how that file is maintained is in `docs/figures.md`.

Nothing here is tax or legal advice. Where a source was not read, this document says so. No figure
was inferred from a news report or from another figure.

## 1. Primary pages read on 7 November 2026

| Page | Used for |
| --- | --- |
| GOV.UK, [Income Tax: changes to tax rates for property and savings income](https://www.gov.uk/government/publications/income-tax-changes-to-tax-rates-for-property-and-savings-income/income-tax-changes-to-tax-rates-for-property-and-savings-income) (Budget 2026) | Savings rates for 2027-28 |
| GOV.UK, [Budget 2026 overview of tax legislation and rates, Annex A: rates and allowances](https://www.gov.uk/government/publications/budget-2026-overview-of-tax-legislation-and-rates-ootlar/annex-a-rates-and-allowances) | 2026-27 and 2027-28 rates and allowances |
| HMRC, [Tax-free savings newsletter 24](https://www.gov.uk/government/publications/tax-free-savings-newsletter-24/tax-free-savings-newsletter-24-october-2026) (October 2026) | Cash ISA limit, Lifetime ISA charge, First Time Buyer ISA |
| GOV.UK, [Pension Tax Allowance Explainer](https://www.gov.uk/government/publications/pension-tax-allowance-explainer/pension-tax-allowance-explainer) (published 28 October 2026) | Full new State Pension for 2027-28 |

## 2. What changed on the site in Phase 3

| Change | Before | After | Why |
| --- | --- | --- | --- |
| Savings income tax rate, basic, from April 2027 | 22% | **24%** | Budget 2026 adds two points to the Budget 2025 figure. Not yet law; pages say "planned". |
| Savings income tax rate, higher, from April 2027 | 42% | **44%** | Same. The additional rate (49%) is not quoted. |
| Sources on the Cash ISA vs Stocks and Shares ISA guide | Budget 2025 note | Budget 2026 note and Annex A | The old note is superseded. |
| New 2027-28 rows | none | 11 rows (below) | The site would fail to render several pages on 6 April 2027 without them (section 4). |

The Phase 2 rows for these two rates were stamped "checked 2026-11-06 / 2026-11-07" from the Budget 2025
note and so were wrong by the time of Budget 2026. This is the failure the review rule exists to catch:
read the page for the date you are quoting, not the page you read last time.

## 3. Review of the October 2026 changes

| Topic | What the site says | Primary source says | Result |
| --- | --- | --- | --- |
| Cash ISA limit from April 2027 | The overall £20,000 allowance stands; the £12,000 under-65 cap is dropped | HMRC newsletter 24 (published 29 October 2026): the £20,000 Cash ISA limit is kept from 6 April 2027. Secondary legislation was still to be laid in November 2026. | Agrees. Status `announced` for 2027-28, the cap row `abandoned`. |
| Lifetime ISA withdrawal charge | 25%; 20% for a first-home purchase above £450,000 on or after 29 October 2026 | Same newsletter and GOV.UK | Agrees. |
| First Time Buyer ISA | The Lifetime ISA guide says it is announced for April 2029 and that its details are not final, and covers only the rules in force | HMRC newsletter 24 describes it from April 2029 (£4,000 a year, 25% bonus), replacing the Lifetime ISA for new savers | Agrees. The site quotes no rates for it and does not model it. |
| Savings income tax rates | Now 24% and 44% from April 2027, "planned" | GOV.UK Budget 2026 note | Agrees after correction. Legislation is the Finance Bill 2026-27; the Finance Act 2026 currently says 22% and 42%. |

## 4. The 6 April 2027 problem, and the fix

**Finding.** Eleven figure keys had a 2026-27 row and no 2027-28 row. Pages read several of them at the top
of the page file with today's date. `valueOn` throws when no row covers the date, by design, "so a missing
tax-year entry fails the build". But a page that is already built also runs that code in the visitor's
browser, so on 6 April 2027 about ten guide and calculator pages (the ones that quote the State Pension,
Personal Savings Allowance, dividend allowance, MPAA or Junior ISA limit) would have broken for visitors even
with no new release. The pages are separate lazy-loaded files, so the rest of the site would have kept working.

**Proof.** The site was built with the clock set to 1 May 2027. The version committed before this change
failed with `No UK figure for "state_pension.new_full_rate_annual" on 2027-05-01`. The version in this
change builds all 33 routes.

**Fix.**
1. Added 2027-28 rows, status `announced`, for the keys Annex A lists. It gives the same value in both years
   for the basic rate band (£37,700), the 20%, 40% and 45% rates, the dividend allowance (£500), the Personal
   Savings Allowance (£1,000 and £500), the starting rate limit (£5,000), the MPAA (£10,000) and the
   Junior ISA limit (£9,000).
2. Added the full new State Pension for 2027-28 as **£13,036.40 a year**, from the GOV.UK Pension Tax
   Allowance Explainer.
3. **No weekly State Pension row was added.** GOV.UK gives only the annual value, for tax purposes. A weekly
   rate of £250.70 is quoted by other sites, but it is arithmetic from the annual figure, not a published rate.
   The two pages that print a weekly rate now print the annual figure alone until a weekly row exists.
4. `src/ukFigures.test.js` now fails if any key lacks a row for 6 April 2027. The weekly State Pension is
   the one documented exception, and that exception ends on **1 March 2027** so the gap is closed before April.

**Still open, owner or maintainer action by 1 March 2027:** add `state_pension.new_full_rate_weekly` for
2027-28 when DWP publishes the 2027-28 benefit and pension rates, set its source, and re-read the annual
row against the same publication.

## 5. Cross-check of 2027-28 rows against Annex A

| Figure | Site | Annex A, 2027-28 | Agrees |
| --- | --- | --- | --- |
| Personal Allowance | £12,570 | £12,570 | Yes |
| Pension annual allowance | £60,000 | £60,000 | Yes |
| ISA overall allowance | £20,000 | £20,000 | Yes |
| Junior ISA limit | £9,000 | £9,000 | Yes |
| MPAA | £10,000 | £10,000 | Yes |
| Dividend allowance | £500 | £500 | Yes |
| Personal Savings Allowance | £1,000 / £500 | £1,000 / £500 | Yes |
| Starting rate for savings limit | £5,000 | £5,000 | Yes |
| Basic rate band | £37,700 | £37,700 | Yes |
| Basic, higher, additional rates | 20% / 40% / 45% | 20% / 40% / 45% | Yes |
| Lump sum allowance, lump sum and death benefit allowance | £268,275 / £1,073,100 (no end date) | Same in both years | Yes |
| Full new State Pension (weekly) | none for 2027-28 | Not stated | n/a, see section 4 |

The Annex A page was read; the rows it agrees with were **not** re-stamped as checked against their own
cited pages. A row's `lastChecked` date moves only when its cited page is read.

## 6. Things the site does not model or has not confirmed

- **Pension Tax Allowance** from 6 April 2027 (2027-28 to 2029-30): a tax reduction worth 20% of the amount
  by which the full new State Pension exceeds the Personal Allowance, withdrawn at £1 for every £3 above
  the full State Pension. Described by GOV.UK; not modelled in the retirement calculators or guides.
  Because the full new State Pension (£13,036.40) will exceed the Personal Allowance (£12,570), a pensioner
  with only that income would otherwise owe a small amount of tax. Any page implying State Pension is tax-free
  below the Personal Allowance should mention it before April 2027.
- **State Pension 2027-28 weekly rate**: see section 4.
- **Premium Bonds** limits and **FSCS** £120,000: not re-read in Phase 3.
- **National Insurance** rates for 2027-28: not on the site.
- **Scottish income tax**: not stored; pages say so.

## 7. Outstanding review list

`npm run check:figures` warns for every row with no named reviewer: **46 rows today**. No reviewer has
been assigned, and none has been invented. A row counts as reviewed only when a named person has read
its cited page and their name is entered in the row's `reviewer` field.

| Figure | Value | Applies from | Status | Last checked | Next review | Source |
| --- | --- | --- | --- | --- | --- | --- |
| `isa.overall_allowance` | £20,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.overall_allowance` | £20,000 | 2027-04-06 | announced | 2026-11-06 | 2027-02-01 | www.gov.uk |
| `isa.lifetime_isa.annual_limit` | £4,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.lifetime_isa.bonus_rate` | 25% | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.lifetime_isa.first_payment_before_age` | 40 years | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.lifetime_isa.withdrawal_age` | 60 years | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.lifetime_isa.unauthorised_withdrawal_charge` | 25% | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.lifetime_isa.property_over_cap_charge` | 20% | 2026-10-29 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.lifetime_isa.property_price_cap` | £450,000 | 2026-10-29 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `isa.junior_isa.annual_limit` | £9,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `nsi.premium_bonds.min_purchase` | £25 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.nsandi.com |
| `nsi.premium_bonds.max_holding` | £50,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.nsandi.com |
| `pension.annual_allowance` | £60,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `pension.annual_allowance` | £60,000 | 2027-04-06 | announced | 2026-11-06 | 2027-02-01 | www.gov.uk |
| `pension.money_purchase_annual_allowance` | £10,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `pension.lump_sum_allowance` | £268,275 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `pension.lump_sum_and_death_benefit_allowance` | £1,073,100 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `pension.tax_free_lump_sum_share` | 25% | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `pension.normal_minimum_pension_age` | 55 years | 2010-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `pension.normal_minimum_pension_age` | 57 years | 2028-04-06 | announced | 2026-11-06 | 2027-11-01 | www.gov.uk |
| `state_pension.new_full_rate_weekly` | £241.3 a week | 2026-04-06 | in_force | 2026-11-06 | 2027-01-31 | www.gov.uk |
| `state_pension.new_full_rate_annual` | £12,547.6 | 2026-04-06 | in_force | 2026-11-06 | 2027-01-31 | www.gov.uk |
| `income_tax.personal_allowance` | £12,570 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.personal_allowance` | £12,570 | 2027-04-06 | announced | 2026-11-06 | 2027-02-01 | www.gov.uk |
| `income_tax.basic_rate_limit` | £37,700 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.basic_rate` | 20% | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.higher_rate` | 40% | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.additional_rate` | 45% | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.dividend_allowance` | £500 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.starting_rate_for_savings_limit` | £5,000 | 2026-04-06 | in_force | 2026-11-06 | 2027-03-15 | www.gov.uk |
| `income_tax.personal_savings_allowance_basic` | £1,000 | 2026-04-06 | in_force | 2026-11-07 | 2027-03-15 | www.gov.uk |
| `income_tax.personal_savings_allowance_higher` | £500 | 2026-04-06 | in_force | 2026-11-07 | 2027-03-15 | www.gov.uk |
| `income_tax.savings_rate_basic` | 24% | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.savings_rate_higher` | 44% | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `fscs.deposit_protection_limit` | £120,000 | 2025-12-01 | in_force | 2026-11-07 | 2027-03-15 | www.bankofengland.co.uk |
| `isa.junior_isa.annual_limit` | £9,000 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `pension.money_purchase_annual_allowance` | £10,000 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.basic_rate_limit` | £37,700 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.basic_rate` | 20% | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.higher_rate` | 40% | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.additional_rate` | 45% | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.dividend_allowance` | £500 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.starting_rate_for_savings_limit` | £5,000 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.personal_savings_allowance_basic` | £1,000 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `income_tax.personal_savings_allowance_higher` | £500 | 2027-04-06 | announced | 2026-11-07 | 2027-02-01 | www.gov.uk |
| `state_pension.new_full_rate_annual` | £13,036.4 | 2027-04-06 | announced | 2026-11-07 | 2027-01-31 | www.gov.uk |

## 8. Before 6 April 2027

1. Add the 2027-28 weekly State Pension row when DWP publishes it (deadline 1 March 2027 in the test).
2. Move each `announced` 2027-28 row to `legislated` or `in_force` and re-read its page. The checker
   flags any row whose start date has passed with the wrong status.
3. Re-read the Finance Bill 2026-27 for the savings rates. If Parliament changes them, change the rows.
4. Check the app's own copies of two ISA numbers, which this checker cannot see: £20,000
   (`pages/Decisions.jsx`, `components/outlook/planIsaGuidance.js`) and the £4,000 Lifetime ISA limit
   (`planIsaGuidance.js`).
5. Decide whether to describe the Pension Tax Allowance on the retirement pages.
6. Run `npm run check`, then rebuild with the clock set to a date after 6 April to prove nothing throws:

   ```
   NODE_OPTIONS="--import ./fakedate.mjs" npm run build
   ```

   where `fakedate.mjs` replaces `Date` with a class that returns 2027-05-01 when called with no arguments.
