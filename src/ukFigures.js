/* Central, version-controlled UK financial figures and rules.

   Every number the site quotes about UK tax, pensions, ISAs or the State Pension
   should come from here, so each one has a source, an effective date, a status
   and a review date. Pages and calculators import the helpers below rather than
   typing a pound figure into prose. `npm run check:figures` fails when an entry
   is malformed, overdue for review, or when a new tax year has no entry.

   Plain JavaScript with explicit .js import extensions on purpose: src/meta.js
   imports this file, and meta.js is loaded directly by Node during prerender.

   RULES FOR EDITING
   1. Never overwrite a historical value. When a rule changes, close the old row
      with effectiveTo (the day before the change) and add a new row with a new
      effectiveFrom. Calculations for past dates then keep using the old value.
   2. A rule that is announced but not yet law uses status 'announced' (or
      'proposed' / 'legislated'). Pages must not describe it as in force.
   3. A rule that was announced and then dropped keeps its row, with status
      'abandoned' and the date it was dropped, so old provider pages can be
      explained. Point it at the row that replaces it with `supersededBy`.
   4. `verification` says how the number was checked on `lastChecked`:
        'source_page_read'   the source page itself was read on that date
        'secondary_only'     only a secondary source was read (do not publish)
        'unverified'         not checked (do not publish)
      `reviewer` is the NAME of a person who has reviewed the entry, or null.
      Nothing here has a named human reviewer yet; the checker reports that as a
      warning so it stays visible.
   5. Add a test in src/ukFigures.test.js for any figure a calculator depends on,
      using a worked example from the source organisation where one exists.

   Entry fields: key, name, value, unit ('GBP' | 'GBP_per_week' | 'percent' |
   'age_years'), sourceName, sourceUrl, effectiveFrom, effectiveTo (null = open
   ended), status, statusChangedOn (optional), supersededBy (optional),
   lastChecked, nextReview, verification, reviewer, notes. */

export const FIGURE_STATUSES = [
  'in_force',
  'legislated',
  'announced',
  'proposed',
  'abandoned',
  'superseded',
]

export const FIGURE_UNITS = ['GBP', 'GBP_per_week', 'percent', 'age_years']

export const VERIFICATION_STATES = ['source_page_read', 'secondary_only', 'unverified']

const CHECKED = '2026-11-06'
const REVIEW_BEFORE_APRIL = '2027-03-15'
const REVIEW_AFTER_BUDGET = '2027-02-01'

const GOVUK_ISA = 'https://www.gov.uk/individual-savings-accounts'
const GOVUK_LISA = 'https://www.gov.uk/lifetime-isa'
const GOVUK_JISA = 'https://www.gov.uk/junior-individual-savings-accounts'
const HMRC_NEWSLETTER_24 =
  'https://www.gov.uk/government/publications/tax-free-savings-newsletter-24/tax-free-savings-newsletter-24-october-2026'
const NSI_PB = 'https://www.nsandi.com/products/premium-bonds'
const GOVUK_PENSION_RATES =
  'https://www.gov.uk/government/publications/rates-and-allowances-pension-schemes/pension-schemes-rates'
const GOVUK_BUDGET_ANNEX_A =
  'https://www.gov.uk/government/publications/budget-2026-overview-of-tax-legislation-and-rates-ootlar/annex-a-rates-and-allowances'
const GOVUK_LSA = 'https://www.gov.uk/tax-on-your-private-pension/lump-sum-allowance'
const GOVUK_NMPA = 'https://www.gov.uk/government/publications/increasing-normal-minimum-pension-age'
const DWP_RATES_2026_27 =
  'https://www.gov.uk/government/publications/benefit-and-pension-rates-2026-to-2027/proposed-benefit-and-pension-rates-2026-to-2027'
const GOVUK_INCOME_TAX =
  'https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past'

const TY_2026_27 = { effectiveFrom: '2026-04-06', effectiveTo: '2027-04-05' }
const TY_2027_28 = { effectiveFrom: '2027-04-06', effectiveTo: '2028-04-05' }

function entry(fields) {
  return {
    effectiveTo: null,
    lastChecked: CHECKED,
    nextReview: REVIEW_BEFORE_APRIL,
    verification: 'source_page_read',
    reviewer: null,
    notes: '',
    ...fields,
  }
}

export const FIGURES = [
  // ── ISAs ────────────────────────────────────────────────────────────────
  entry({
    key: 'isa.overall_allowance',
    name: 'ISA overall annual allowance',
    value: 20000,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_ISA,
    ...TY_2026_27,
    status: 'in_force',
    notes: 'Total across all adult ISAs (Cash, Stocks and Shares, Innovative Finance, Lifetime). Counts what is paid in, not the value of the accounts.',
  }),
  entry({
    key: 'isa.overall_allowance',
    name: 'ISA overall annual allowance',
    value: 20000,
    unit: 'GBP',
    sourceName: 'HMRC (Tax-free savings newsletter 24)',
    sourceUrl: HMRC_NEWSLETTER_24,
    ...TY_2027_28,
    status: 'announced',
    nextReview: REVIEW_AFTER_BUDGET,
    notes: 'HMRC says the £20,000 cash ISA limit is retained from 6 April 2027 and that the (Amendment) (No.2) Regulations 2026 will be revoked. Move to in_force once the revocation is confirmed on legislation.gov.uk and the year has started.',
  }),
  entry({
    key: 'isa.cash_isa_limit_under_65',
    name: 'Cash ISA limit for under-65s (planned, dropped)',
    value: 12000,
    unit: 'GBP',
    sourceName: 'HMRC (Tax-free savings newsletter 24)',
    sourceUrl: HMRC_NEWSLETTER_24,
    ...TY_2027_28,
    status: 'abandoned',
    statusChangedOn: '2026-10-28',
    supersededBy: 'isa.overall_allowance',
    nextReview: REVIEW_AFTER_BUDGET,
    notes: 'Announced in the Budget on 26 November 2025, written into regulations, then dropped in the Autumn Budget on 28 October 2026. Kept so pages can explain why older provider guides still mention it. Do not present as a current or future rule.',
  }),
  entry({
    key: 'isa.lifetime_isa.annual_limit',
    name: 'Lifetime ISA annual contribution limit',
    value: 4000,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_LISA,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Counts towards the overall ISA allowance. Contributions can be made until age 50.',
  }),
  entry({
    key: 'isa.lifetime_isa.bonus_rate',
    name: 'Lifetime ISA government bonus',
    value: 25,
    unit: 'percent',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_LISA,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Maximum bonus £1,000 a year.',
  }),
  entry({
    key: 'isa.lifetime_isa.first_payment_before_age',
    name: 'Lifetime ISA: first payment must be made before age',
    value: 40,
    unit: 'age_years',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_LISA,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
  }),
  entry({
    key: 'isa.lifetime_isa.withdrawal_age',
    name: 'Lifetime ISA: age from which money can be withdrawn without the charge',
    value: 60,
    unit: 'age_years',
    sourceName: 'GOV.UK',
    sourceUrl: 'https://www.gov.uk/lifetime-isa/withdrawing-money-from-your-lifetime-isa',
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Also free of charge: buying a first home (12 months after the first payment, property up to the cap) and terminal illness.',
  }),
  entry({
    key: 'isa.lifetime_isa.unauthorised_withdrawal_charge',
    name: 'Lifetime ISA charge on unauthorised withdrawals',
    value: 25,
    unit: 'percent',
    sourceName: 'HMRC (Tax-free savings newsletter 24)',
    sourceUrl: HMRC_NEWSLETTER_24,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Applies to withdrawals other than for a first home, from age 60, or other permitted reasons.',
  }),
  entry({
    key: 'isa.lifetime_isa.property_over_cap_charge',
    name: 'Lifetime ISA charge on withdrawals for a property over the price cap',
    value: 20,
    unit: 'percent',
    sourceName: 'HMRC (Tax-free savings newsletter 24)',
    sourceUrl: HMRC_NEWSLETTER_24,
    effectiveFrom: '2026-10-29',
    status: 'in_force',
    notes: 'Falls from 25% to 20% from 29 October 2026. The 25% charge still applies to other unauthorised withdrawals.',
  }),
  entry({
    key: 'isa.lifetime_isa.property_price_cap',
    name: 'Lifetime ISA property price cap',
    value: 450000,
    unit: 'GBP',
    sourceName: 'HMRC (Tax-free savings newsletter 24)',
    sourceUrl: HMRC_NEWSLETTER_24,
    effectiveFrom: '2026-10-29',
    status: 'in_force',
  }),
  entry({
    key: 'isa.junior_isa.annual_limit',
    name: 'Junior ISA annual contribution limit',
    value: 9000,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_JISA,
    ...TY_2026_27,
    status: 'in_force',
  }),

  // ── NS&I ────────────────────────────────────────────────────────────────
  entry({
    key: 'nsi.premium_bonds.min_purchase',
    name: 'Premium Bonds minimum purchase',
    value: 25,
    unit: 'GBP',
    sourceName: 'NS&I',
    sourceUrl: NSI_PB,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Prize fund rates and odds are deliberately not stored: they change without notice. Link to NS&I instead.',
  }),
  entry({
    key: 'nsi.premium_bonds.max_holding',
    name: 'Premium Bonds maximum holding per person',
    value: 50000,
    unit: 'GBP',
    sourceName: 'NS&I',
    sourceUrl: NSI_PB,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
  }),

  // ── Pensions ────────────────────────────────────────────────────────────
  entry({
    key: 'pension.annual_allowance',
    name: 'Pension standard annual allowance',
    value: 60000,
    unit: 'GBP',
    sourceName: 'GOV.UK (Pension schemes rates)',
    sourceUrl: GOVUK_PENSION_RATES,
    ...TY_2026_27,
    status: 'in_force',
  }),
  entry({
    key: 'pension.annual_allowance',
    name: 'Pension standard annual allowance',
    value: 60000,
    unit: 'GBP',
    sourceName: 'HM Treasury (Budget 2026, Annex A)',
    sourceUrl: GOVUK_BUDGET_ANNEX_A,
    ...TY_2027_28,
    status: 'announced',
    nextReview: REVIEW_AFTER_BUDGET,
    notes: 'Shown in Budget 2026 Annex A. Confirm against the GOV.UK pension schemes rates page once it lists 2027 to 2028.',
  }),
  entry({
    key: 'pension.money_purchase_annual_allowance',
    name: 'Money purchase annual allowance (MPAA)',
    value: 10000,
    unit: 'GBP',
    sourceName: 'GOV.UK (Pension schemes rates)',
    sourceUrl: GOVUK_PENSION_RATES,
    ...TY_2026_27,
    status: 'in_force',
    notes: 'Applies once a person has flexibly accessed a defined contribution pension, for example by taking an uncrystallised funds lump sum or drawdown income.',
  }),
  entry({
    key: 'pension.lump_sum_allowance',
    name: 'Pension lump sum allowance (maximum tax-free cash)',
    value: 268275,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_LSA,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Higher for people with a protected allowance. Applies across all of a person\'s pensions.',
  }),
  entry({
    key: 'pension.lump_sum_and_death_benefit_allowance',
    name: 'Pension lump sum and death benefit allowance',
    value: 1073100,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_LSA,
    effectiveFrom: '2026-04-06',
    status: 'in_force',
  }),
  entry({
    key: 'pension.tax_free_lump_sum_share',
    name: 'Share of a pension normally available as a tax-free lump sum',
    value: 25,
    unit: 'percent',
    sourceName: 'GOV.UK',
    sourceUrl: 'https://www.gov.uk/tax-on-pension/tax-free',
    effectiveFrom: '2026-04-06',
    status: 'in_force',
    notes: 'Up to 25%, capped by the lump sum allowance.',
  }),
  entry({
    key: 'pension.normal_minimum_pension_age',
    name: 'Normal minimum pension age',
    value: 55,
    unit: 'age_years',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_NMPA,
    effectiveFrom: '2010-04-06',
    effectiveTo: '2028-04-05',
    status: 'in_force',
    notes: 'Some people have a protected pension age and scheme rules can differ. The effectiveFrom date is approximate (age 55 has applied for many years) and is not used in any calculation.',
  }),
  entry({
    key: 'pension.normal_minimum_pension_age',
    name: 'Normal minimum pension age',
    value: 57,
    unit: 'age_years',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_NMPA,
    effectiveFrom: '2028-04-06',
    status: 'announced',
    nextReview: '2027-11-01',
    verification: 'source_page_read',
    notes: 'GOV.UK gives 6 April 2028 as the date. The legislative vehicle has not been checked against legislation.gov.uk, so the status stays at announced until it is.',
  }),

  // ── State Pension ───────────────────────────────────────────────────────
  entry({
    key: 'state_pension.new_full_rate_weekly',
    name: 'Full new State Pension (weekly)',
    value: 241.3,
    unit: 'GBP_per_week',
    sourceName: 'DWP (Benefit and pension rates 2026 to 2027)',
    sourceUrl: DWP_RATES_2026_27,
    ...TY_2026_27,
    status: 'in_force',
    nextReview: '2027-01-31',
    notes: 'Not everyone gets the full rate: it depends on the National Insurance record. Annual equivalent £12,547.60 (GOV.UK, Help with the cost of living in 2026).',
  }),
  entry({
    key: 'state_pension.new_full_rate_annual',
    name: 'Full new State Pension (annual)',
    value: 12547.6,
    unit: 'GBP',
    sourceName: 'GOV.UK (Help with the cost of living in 2026)',
    sourceUrl: 'https://www.gov.uk/government/news/help-with-the-cost-of-living-in-2026',
    ...TY_2026_27,
    status: 'in_force',
    nextReview: '2027-01-31',
  }),

  // ── Income tax ──────────────────────────────────────────────────────────
  entry({
    key: 'income_tax.personal_allowance',
    name: 'Income Tax Personal Allowance',
    value: 12570,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
    notes: 'Reduced by £1 for every £2 of income above £100,000.',
  }),
  entry({
    key: 'income_tax.personal_allowance',
    name: 'Income Tax Personal Allowance',
    value: 12570,
    unit: 'GBP',
    sourceName: 'HM Treasury (Budget 2026, Annex A)',
    sourceUrl: GOVUK_BUDGET_ANNEX_A,
    ...TY_2027_28,
    status: 'announced',
    nextReview: REVIEW_AFTER_BUDGET,
  }),
  entry({
    key: 'income_tax.basic_rate_limit',
    name: 'Income Tax basic rate limit (England, Wales and Northern Ireland)',
    value: 37700,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
    notes: 'Scottish bands differ and are not stored.',
  }),
  entry({
    key: 'income_tax.basic_rate',
    name: 'Income Tax basic rate (England, Wales and Northern Ireland)',
    value: 20,
    unit: 'percent',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
  }),
  entry({
    key: 'income_tax.higher_rate',
    name: 'Income Tax higher rate (England, Wales and Northern Ireland)',
    value: 40,
    unit: 'percent',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
  }),
  entry({
    key: 'income_tax.additional_rate',
    name: 'Income Tax additional rate (England, Wales and Northern Ireland)',
    value: 45,
    unit: 'percent',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
  }),
  entry({
    key: 'income_tax.dividend_allowance',
    name: 'Dividend allowance',
    value: 500,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
  }),
  entry({
    key: 'income_tax.starting_rate_for_savings_limit',
    name: 'Starting rate for savings limit',
    value: 5000,
    unit: 'GBP',
    sourceName: 'GOV.UK',
    sourceUrl: GOVUK_INCOME_TAX,
    ...TY_2026_27,
    status: 'in_force',
  }),
]

// ── Dates ─────────────────────────────────────────────────────────────────

const LONDON_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/London',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** 'YYYY-MM-DD' in UK time for a Date, or the same string back if one is passed. */
export function toIsoDate(date = new Date()) {
  if (typeof date === 'string') return date.slice(0, 10)
  return LONDON_DATE.format(date)
}

/** '2026-04-06' -> '6 April 2026' */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

/** The UK tax year (6 April to 5 April) that contains a date. */
export function taxYearOf(date = new Date()) {
  const iso = toIsoDate(date)
  const [y, m, d] = iso.split('-').map(Number)
  const startYear = m > 4 || (m === 4 && d >= 6) ? y : y - 1
  const endYear = startYear + 1
  const short = String(endYear).slice(-2)
  return {
    label: `${startYear}/${short}`,
    id: `${startYear}-${short}`,
    start: `${startYear}-04-06`,
    end: `${endYear}-04-05`,
  }
}

// ── Lookups ───────────────────────────────────────────────────────────────

const ACTIVE_RANK = { in_force: 0, legislated: 1, announced: 2, proposed: 3 }

/** Entries stored under a key, oldest first. */
export function figureHistory(key, figures = FIGURES) {
  return figures
    .filter((f) => f.key === key)
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom))
}

/** The figure that applies on a date. Abandoned and superseded rows are skipped
    unless includeInactive is set. Prefers rules in force over rules announced. */
export function figureOn(key, date = new Date(), { includeInactive = false, figures = FIGURES } = {}) {
  const iso = toIsoDate(date)
  const matches = figures.filter((f) => {
    if (f.key !== key) return false
    if (!includeInactive && !(f.status in ACTIVE_RANK)) return false
    if (iso < f.effectiveFrom) return false
    return f.effectiveTo == null || iso <= f.effectiveTo
  })
  matches.sort((a, b) => {
    const rank = (ACTIVE_RANK[a.status] ?? 9) - (ACTIVE_RANK[b.status] ?? 9)
    return rank !== 0 ? rank : b.effectiveFrom.localeCompare(a.effectiveFrom)
  })
  return matches[0] || null
}

/** The value that applies on a date. Throws if there is none, so a missing
    tax-year entry fails the build instead of printing a wrong number. */
export function valueOn(key, date = new Date()) {
  const f = figureOn(key, date)
  if (!f) throw new Error(`No UK figure for "${key}" on ${toIsoDate(date)}. Add one to src/ukFigures.js.`)
  return f.value
}

export function gbp(amount, { pence = false } = {}) {
  const n = pence ? Math.round(amount * 100) / 100 : Math.round(amount)
  const [whole, frac] = (pence ? n.toFixed(2) : String(n)).split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `£${grouped}${frac ? `.${frac}` : ''}`
}

/** Normal minimum pension age now, and the next change if one is announced or
    legislated. Lets pages say "55, rising to 57 on 6 April 2028" now and
    "57" after the change, without anyone editing the copy. */
export function pensionAccessAge(date = new Date(), figures = FIGURES) {
  const iso = toIsoDate(date)
  const now = figureOn('pension.normal_minimum_pension_age', iso, { figures })
  const upcoming = figureHistory('pension.normal_minimum_pension_age', figures).find(
    (f) => f.effectiveFrom > iso && f.status in ACTIVE_RANK && (!now || f.value !== now.value),
  )
  return {
    now: now ? now.value : null,
    next: upcoming ? upcoming.value : null,
    nextFrom: upcoming ? formatDate(upcoming.effectiveFrom) : null,
  }
}

/** Latest lastChecked among entries whose key starts with a prefix, as a UK date. */
export function lastCheckedFor(prefix, figures = FIGURES) {
  const dates = figures.filter((f) => f.key.startsWith(prefix)).map((f) => f.lastChecked)
  return dates.sort().at(-1) || null
}

// ── Validation (used by scripts/check-figures.mjs and the tests) ───────────

const ISO = /^\d{4}-\d{2}-\d{2}$/

function validIso(s) {
  if (typeof s !== 'string' || !ISO.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

function daysBetween(a, b) {
  return Math.round((new Date(`${b}T00:00:00Z`) - new Date(`${a}T00:00:00Z`)) / 86400000)
}

export const MAX_DAYS_SINCE_CHECKED = 120
export const WARN_DAYS_BEFORE_REVIEW = 30

/** Returns { errors, warnings } for a list of figures as of a date. */
export function validateFigures(figures = FIGURES, asOf = new Date()) {
  const today = toIsoDate(asOf)
  const errors = []
  const warnings = []
  const seen = new Set()

  for (const f of figures) {
    const label = `${f.key} (${f.effectiveFrom ?? 'no effectiveFrom'}, ${f.status})`
    const need = (cond, msg) => { if (!cond) errors.push(`${label}: ${msg}`) }

    need(typeof f.key === 'string' && f.key.length > 0, 'missing key')
    need(typeof f.name === 'string' && f.name.length > 0, 'missing name')
    need(typeof f.value === 'number' && Number.isFinite(f.value), 'value must be a finite number')
    need(FIGURE_UNITS.includes(f.unit), `unit must be one of ${FIGURE_UNITS.join(', ')}`)
    need(typeof f.sourceName === 'string' && f.sourceName.length > 0, 'missing source organisation')
    need(typeof f.sourceUrl === 'string' && /^https:\/\//.test(f.sourceUrl), 'missing or non-https source URL')
    need(validIso(f.effectiveFrom), 'missing or invalid effectiveFrom')
    need(f.effectiveTo == null || validIso(f.effectiveTo), 'invalid effectiveTo')
    if (validIso(f.effectiveFrom) && f.effectiveTo != null && validIso(f.effectiveTo)) {
      need(f.effectiveTo >= f.effectiveFrom, 'effectiveTo is before effectiveFrom')
    }
    need(FIGURE_STATUSES.includes(f.status), `status must be one of ${FIGURE_STATUSES.join(', ')}`)
    need(validIso(f.lastChecked), 'missing or invalid lastChecked')
    need(validIso(f.nextReview), 'missing or invalid nextReview')
    need(VERIFICATION_STATES.includes(f.verification), `verification must be one of ${VERIFICATION_STATES.join(', ')}`)

    if (validIso(f.lastChecked)) {
      need(f.lastChecked <= today, 'lastChecked is in the future')
    }
    if (validIso(f.lastChecked) && validIso(f.nextReview)) {
      need(f.nextReview > f.lastChecked, 'nextReview must be after lastChecked')
    }
    if (f.status === 'abandoned' || f.status === 'superseded') {
      need(validIso(f.statusChangedOn), 'abandoned/superseded rows need statusChangedOn')
      need(typeof f.supersededBy === 'string' && figures.some((g) => g.key === f.supersededBy),
        'abandoned/superseded rows need supersededBy pointing at an existing key')
    }

    const id = `${f.key}@${f.effectiveFrom}@${f.status}`
    need(!seen.has(id), 'duplicate key/effectiveFrom/status')
    seen.add(id)

    const live = f.status in ACTIVE_RANK
    if (live && validIso(f.nextReview) && validIso(f.lastChecked)) {
      if (f.nextReview < today) {
        errors.push(`${label}: review overdue since ${f.nextReview}`)
      } else if (daysBetween(today, f.nextReview) <= WARN_DAYS_BEFORE_REVIEW) {
        warnings.push(`${label}: review due ${f.nextReview}`)
      }
      if (daysBetween(f.lastChecked, today) > MAX_DAYS_SINCE_CHECKED) {
        errors.push(`${label}: last checked ${f.lastChecked}, more than ${MAX_DAYS_SINCE_CHECKED} days ago`)
      }
    }
    if (live && f.verification !== 'source_page_read') {
      errors.push(`${label}: verification is "${f.verification}"; do not publish a figure that has not been read from its source`)
    }
    if (live && f.status !== 'in_force' && validIso(f.effectiveFrom) && f.effectiveFrom <= today) {
      errors.push(`${label}: status is "${f.status}" but it took effect on ${f.effectiveFrom}; re-check the source and set the status`)
    }
    if (live && f.reviewer == null) {
      warnings.push(`${label}: no named reviewer`)
    }
  }

  // Tax-year rollover: the keys the site depends on must have a live value today.
  const REQUIRED_TODAY = [
    'isa.overall_allowance',
    'pension.annual_allowance',
    'income_tax.personal_allowance',
    'state_pension.new_full_rate_weekly',
    'pension.normal_minimum_pension_age',
  ]
  for (const key of REQUIRED_TODAY) {
    if (!figureOn(key, today, { figures })) {
      errors.push(`${key}: no live entry covers ${today}. A new tax year probably started; add the new row.`)
    }
  }
  // Warn if the next tax year has no ISA allowance row yet.
  const nextStart = `${Number(taxYearOf(today).end.slice(0, 4))}-04-06`
  if (!figureOn('isa.overall_allowance', nextStart, { figures })) {
    warnings.push(`isa.overall_allowance: no entry yet for the tax year starting ${nextStart}`)
  }

  return { errors, warnings }
}
