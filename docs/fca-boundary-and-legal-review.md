# FCA-boundary wording flags and legal review list

Phase 3, 7 November 2026.

This is a list of wording to look at, not an opinion on whether any of it is a regulated activity.
Whether a product statement amounts to a personal recommendation or to advising on investments depends
on the facts and on the FCA's perimeter guidance, and that is a judgement for a qualified adviser.
Nothing here says Paddock is, or is not, compliant with FCA rules or any other law, and the code passing
its tests proves nothing about that. No wording in the app was changed in Phase 3.

Where the wording sits: the in-app items are in the app repo (`jackfrsh/wealthapp`, branch
`infrastructure/cloud-run`, under `frontend/src`). The website items are in this repo. The iOS app was
not available and is not covered.

## 1. In-app wording flagged for review

| # | Where | Wording today | Why it is flagged | A lower-risk wording to consider (suggestion only) |
| --- | --- | --- | --- | --- |
| 1 | `components/outlook/PlanIsaStrategyCard.jsx` (label), `planIsaGuidance.js` (logic) | A card headed **"Recommended wrapper"** names one product type for the person (Lifetime ISA, Cash ISA or Stocks & Shares ISA), gives reasons such as "usually the highest-value wrapper", and shows a fit label ("Strong fit", "Good fit", "Worth checking") from a hidden score (91 for a Lifetime ISA, 72 for Stocks & Shares). | Personalised, names a specific kind of product, and the score reads as a ranking. The most directive output in the app. | "Wrapper options to compare", showing each wrapper's rules side by side without choosing or scoring one. |
| 2 | `planIsaGuidance.js` (next-action titles) | "**Prioritise up to £4,000 into LISA**", "Set an intentional ISA pace" | An instruction to put money in a named product. | "The Lifetime ISA allowance is £4,000 a year; you have used £X." |
| 3 | `pages/Decisions.jsx` (about line 715) | A block labelled **"Primary recommendation"**, with the heading "Use this tax year deliberately." and body "Directing new money into wrappers first is the cleanest next move." | The label and the body both recommend a course of action. | "What your figures show" with a neutral statement of the unused allowance. |
| 4 | `pages/Decisions.jsx` priority rows | "**Use remaining ISA room first**"; "Tax-free growth is one of the clearest upgrades available before [date]" | A priority order is a recommendation. | "Remaining ISA allowance this tax year: £X." |
| 5 | `PlanIsaStrategyCard.jsx`, `PlanIsaGuidanceCard.jsx`, `Decisions.jsx` tab | Headings "**Wrapper strategy**" and "**ISA strategy**" | "Strategy" suggests tailored advice. | "ISA allowance" or "ISA rules". |
| 6 | `PlanPriorityCard.jsx` (about line 118), `Upgrade.jsx` | "Pro turns your forecast into a **recommended action**, with optimisation…"; "**Contribution optimiser**"; "Required contribution optimiser" | Sold as telling the person what to do. | "Shows the monthly contribution needed to reach your target under your assumptions." |
| 7 | `PlanReviewCard.jsx` (about line 43) | "You have room to **optimise**" | Same. | "Your plan has unused allowance." |
| 8 | `hooks/outlook/useDrawdownPlanner.js` | **Drawdown defaults** pre-filled in the retirement drawdown planner: 7% annual return, 0.75% annual fee, 2.5% inflation, 4% withdrawal rate, plan to age 95. The planner carries "Illustrative only. Based on your assumptions. Not financial advice." | A pre-filled 7% return and a 4% withdrawal rate can read as a suggested plan. Defaults are a design choice that someone should own and be able to justify. | Keep the disclaimer; show the defaults as "example assumptions" next to each field, and consider starting the return field empty or showing a low, central and high case. |
| 9 | Home page, `pages/Home.jsx` | "Based on current balances, monthly contributions and expected return. Not financial advice." | Fine as a disclaimer; check that it is shown wherever a projection is. | None. |

## 2. Website wording flagged for review

| # | Where | Wording today | Why it is flagged |
| --- | --- | --- | --- |
| W1 | `src/guides/CashVsStocksSharesIsa.jsx` | "Which provider, fund or product to choose. That is a regulated activity and depends on your situation." | A statement about the law inside a guide. Probably intended as a boundary, but it is a legal assertion. |
| W2 | `src/pageContent/paddockPro.js`, calculators | "Paddock is a tracking and planning tool, not a regulated financial adviser." | A statement of status. Fine as long as the app's own wording (section 1) does not contradict it. |
| W3 | Guides and calculators that point to "a regulated financial adviser" and MoneyHelper | Signposting wording | Reasonable; confirm the legal reviewer is happy with it. |
| W4 | `src/pages/PaddockPro.jsx`, Phase 2 rewrite | "See when your plan gets you there." replaced "what to do next" | Phase 2 already softened advice-like wording; nothing further flagged. |

## 3. Questions for legal review

These are questions, not conclusions. Put a named reviewer against each only when one has agreed.

1. **Perimeter.** Do the in-app items 1 to 7 above, taken with the Terms ("not personal financial
   advice"), leave Paddock on the right side of the line? Should the labels be changed before launch?
2. **Drawdown defaults.** Are the pre-filled drawdown assumptions acceptable as illustrative, and is the
   disclaimer placed where a person will see it before relying on a result?
3. **Privacy information.** Does the Privacy page give the information the law expects: who is
   responsible for the data, why and on what basis it is used, how long it is kept (including backups and
   the Railway rollback copy), who receives it, transfers outside the UK, people's rights and the right to
   complain to the ICO?
4. **Storage on the visitor's device.** The website counter keeps nothing on the device; the sign-up link
   carries a short page label and a channel label; the app keeps the label in session storage until sign-up.
   Does each fit within the rules on storage and access technologies, or does any need consent? Recent UK
   legislation changed the rules for some statistical uses, so this needs current advice.
5. **Opt-out signals.** Visitors who send Global Privacy Control or Do Not Track are not counted and not
   attributed. Is that the right policy, given it will under-count?
6. **Subscriptions.** Do the trial, renewal, cancellation and refund terms meet UK consumer and
   subscription-contract rules, including how the card requirement for the trial is shown (finding F5 in
   `claims-register.md`)?
7. **Terms.** Acceptance by continued use, the as-is clause and the limit on liability, as they apply to
   consumers.
8. **Account deletion and billing.** The treatment of a paid subscription when an account is deleted
   (finding F1).
9. **Comparison pages.** Statements about named competitors, especially the Moneyhub closure wording.
10. **Finance Bill 2026-27 content.** Pages describing the 24% and 44% savings rates as planned.

## 4. Before 6 April each year

The app keeps its own copies of two ISA numbers, which the website's `npm run check:figures` does not
see: £20,000 (`pages/Decisions.jsx` line 615 and `components/outlook/planIsaGuidance.js`) and £4,000
for the Lifetime ISA (`planIsaGuidance.js`). Both are correct for 2026-27 and 2027-28. Add them to the
yearly review, or better, move them into one shared constant in the app.
