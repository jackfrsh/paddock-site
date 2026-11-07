/* The one place the public site states what Free and Paddock Pro include and
   what Pro costs. Every page that mentions plans must read from here, so the
   site cannot drift away from the product again.

   Source of truth is the app, not the marketing copy. Each value below was
   checked against the app code on the date in VERIFIED_ON:
     - wealthapp frontend/src/pages/Upgrade.jsx   Free vs Pro table, £6 / £60, trial wording
     - wealthapp backend/app/routers/accounts.py   FREE_ACCOUNT_LIMIT = 5
     - wealthapp backend/app/routers/billing.py    30-day trial, annual plan only, once per subscriber
   When the app changes, change this file and the golden test with it.

   Deliberately not stated here, because it is not confirmed from the app code:
     - the iOS App Store price (the app's local StoreKit file lists £5.99 / £59.99;
       the live App Store price must be confirmed in App Store Connect)
     - decision tools: all four are free on the web, but the iOS code appears to
       gate most of them behind Pro. Public copy stays silent until the owner decides.
     - insight counts, and which free-plan extras (multi-currency, FX, snapshots)
       are limits or not
     - whether one Pro subscription unlocks both web and iOS
     - the pension tools the app lists as "coming soon" */

export const PLAN_FACTS_VERIFIED_ON = '2026-11-07'

export const PRO_PRICE = Object.freeze({
  currency: 'GBP',
  monthly: 6,
  annual: 60,
})

export const FREE_LIMITS = Object.freeze({
  accounts: 5,
  projectionYears: 1,
  goals: 1,
})

export const TRIAL = Object.freeze({
  annualDays: 30,
  monthlyDays: 0,
  newSubscribersOnly: true,
})

/* What the free plan includes, in the app's own words. */
export const FREE_FEATURES = Object.freeze([
  'Core net worth dashboard',
  `Up to ${FREE_LIMITS.accounts} accounts`,
  `${FREE_LIMITS.projectionYears}-year projection`,
  'One goal',
])

/* What Pro adds, in the app's own words. */
export const PRO_FEATURES = Object.freeze([
  'Unlimited accounts',
  'Freedom timeline: see when your plan gets you there',
  '5–40 year projections with milestones',
  'Scenario compare and one-off deposit modelling',
  'Required contribution optimiser',
  'Real-terms (inflation-adjusted) view',
])

/* Two months free is arithmetic, not marketing: 12 x £6 = £72 against £60. */
export const ANNUAL_SAVING = PRO_PRICE.monthly * 12 - PRO_PRICE.annual
export const ANNUAL_MONTHS_FREE = ANNUAL_SAVING / PRO_PRICE.monthly

export const priceLine = () =>
  `£${PRO_PRICE.monthly} a month or £${PRO_PRICE.annual} a year`

export const trialLine = () =>
  `The annual plan starts with a ${TRIAL.annualDays}-day trial for new subscribers; monthly has no trial.`

/* Plain-English one-liner reused by FAQs and comparison pages. */
export const planSummary = () =>
  `Paddock has a free plan for up to ${FREE_LIMITS.accounts} accounts and Paddock Pro at ${priceLine()}.`
