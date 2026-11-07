# Paddock Pro proposition audit

Date: 7 November 2026. Method: read the app code (web app and API, iOS) and
compared it with what the public site said. Everything the site now says about
plans comes from `src/planFacts.js`, guarded by `src/planFacts.test.js`.

## Plan facts and evidence

| Fact | Value | Evidence |
| --- | --- | --- |
| Free account limit | 5 | `backend/app/routers/accounts.py` (`FREE_ACCOUNT_LIMIT = 5`); `Upgrade.jsx` Free column; iOS `PaddockLimits.swift` |
| Free projection | 1 year | `Upgrade.jsx`; iOS `HomeWealthRunway.swift` (`isPro ? [1, 5, 10, 25] : [1]`) |
| Pro price (web) | £6 a month or £60 a year | `Upgrade.jsx` |
| Annual trial | 30 days, annual only, once per subscriber | `billing.py` (`trial_period_days = 30`, only when no prior subscription id) |
| Monthly trial | None | `Upgrade.jsx` ("Monthly has no trial") |
| Pro features | Unlimited accounts; freedom timeline; 5–40 year projections with milestones; scenario compare and one-off deposit modelling; contribution optimiser; real-terms view; all insights | `Upgrade.jsx` Pro column; scenario compare gated by `isPro` on web and iOS |
| Coming soon | Pension tools and pension bridge | `Upgrade.jsx` ("Coming soon") — **not promoted** on the site |

## What the public site claimed before, and what changed

| Claim on the site | Reality | Action |
| --- | --- | --- |
| "Up to 3 accounts" (homepage, spreadsheet page) | 5 | Corrected to read from plan facts |
| "Includes a 7-day trial" | 30 days, annual plan only | Corrected; monthly stated as no trial |
| "Start free trial" button | The button creates a free account; a trial exists only for annual after upgrading | Now "Create account to try Pro" |
| Free: "Snapshots + milestones", "Multi-currency accounts", "Daily FX checking", "Monthly what-if contribution modelling" | Not in the app's own Free column; what-if modelling is Pro-gated in the web code | Removed from the Free list; owner can reinstate any item once confirmed |
| Pro: "ISA strategy support", "Mortgage overpayment and next-pounds decision support" | Web decision tools are free; iOS gates most of them; wording reads like advice | Removed from the Pro list |
| "See the path, the gap, and what to do next." | "What to do next" implies instruction | Replaced with the app's own "See when your plan gets you there." |
| "Save this retirement plan in Paddock" (calculator CTA) | Paddock does not import calculator plans | Replaced with wording about tracking real balances |
| Two guides: "decide what to do next with ISA, mortgage…" | Advice-like | Softened to "explore … scenarios" |

## Open questions for the owner

1. **Decision tools: free or Pro?** Web: all four free. iOS: appears to gate three
   of four. Pick one policy; then say so on the Pro page.
2. **iOS price.** Confirm the live App Store prices (the repo's `.storekit`
   test file says £5.99 and £59.99).
3. **Trial wording.** Confirm 30 days for annual (the code) is intended, not 7
   (the stale code comment and the old site copy).
4. **Does one Pro subscription work on both web and iOS?** Unknown from code;
   the site does not claim it.
5. **Which free-plan extras are limits?** Multi-currency, FX and snapshots were
   on the old Free list but are not in the app's table.

## Conversion journey after this change

1. A calculator gives a free answer with no account (value first).
2. Under the result, one calm, calculator-specific next step with a free-to-start
   note; the link carries the page it came from.
3. `/paddock-pro` explains what Paddock does, who Pro suits (and who it does not),
   a free-versus-Pro table, how it differs from open-banking apps, pricing and
   honest FAQs, with genuine demo-account screenshots and no testimonials or
   statistics.
4. Upgrade happens inside the app, after the person has seen the product.

Activation ideas that need app changes (not made): a first-run prompt to add a
second account, a reminder to update stale balances after a month, and a one-line
explainer of what Pro adds shown only after the person's first goal is set.
These should be built without urgency or countdowns.
