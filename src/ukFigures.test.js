import assert from 'node:assert/strict'
import {
  FIGURES,
  figureHistory,
  figureOn,
  formatDate,
  gbp,
  pensionAccessAge,
  taxYearOf,
  validateFigures,
  valueOn,
} from './ukFigures.js'
import { ISA_RULES } from './isaRules.js'

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message}`)
    failed++
  }
}

const clone = (rows) => rows.map((r) => ({ ...r }))
const AS_OF = '2026-11-07'

// ─── Golden cases from the source organisations' own worked examples ────────

test('GOV.UK Lifetime ISA example 1: £800 + 25% bonus = £1,000; 25% charge = £250; leaves £750', () => {
  const bonusRate = valueOn('isa.lifetime_isa.bonus_rate', AS_OF) / 100
  const chargeRate = valueOn('isa.lifetime_isa.unauthorised_withdrawal_charge', AS_OF) / 100
  const saved = 800
  const bonus = saved * bonusRate
  const pot = saved + bonus
  assert.equal(bonus, 200)
  assert.equal(pot, 1000)
  assert.equal(pot * chargeRate, 250)
  assert.equal(pot - pot * chargeRate, 750)
})

test('GOV.UK Lifetime ISA example 2: to receive £120 you withdraw £160 and pay £40', () => {
  const chargeRate = valueOn('isa.lifetime_isa.unauthorised_withdrawal_charge', AS_OF) / 100
  assert.equal(160 * chargeRate, 40)
  assert.equal(160 - 160 * chargeRate, 120)
  // Grossing up: needed / (1 - charge) is the withdrawal required.
  assert.equal(120 / (1 - chargeRate), 160)
})

test('Lifetime ISA: full £4,000 a year earns the £1,000 maximum bonus', () => {
  const limit = valueOn('isa.lifetime_isa.annual_limit', AS_OF)
  const rate = valueOn('isa.lifetime_isa.bonus_rate', AS_OF) / 100
  assert.equal(limit, 4000)
  assert.equal(limit * rate, 1000)
})

test('Lifetime ISA ages: open under 40, withdraw from 60', () => {
  assert.equal(valueOn('isa.lifetime_isa.first_payment_before_age', AS_OF), 40)
  assert.equal(valueOn('isa.lifetime_isa.withdrawal_age', AS_OF), 60)
})

test('State Pension: £241.30 a week x 52 = £12,547.60 a year', () => {
  const weekly = valueOn('state_pension.new_full_rate_weekly', AS_OF)
  const annual = valueOn('state_pension.new_full_rate_annual', AS_OF)
  assert.equal(weekly, 241.3)
  assert.equal(Math.round(weekly * 52 * 100) / 100, annual)
  assert.equal(gbp(annual, { pence: true }), '£12,547.60')
})

test('Pension: up to 25% tax-free of a £60,000 example is £15,000', () => {
  assert.equal(valueOn('pension.tax_free_lump_sum_share', AS_OF) / 100 * 60000, 15000)
})

test('Pension lump sum allowance is 25% of the lump sum and death benefit allowance', () => {
  const lsa = valueOn('pension.lump_sum_allowance', AS_OF)
  const lsdba = valueOn('pension.lump_sum_and_death_benefit_allowance', AS_OF)
  assert.equal(lsa, 268275)
  assert.equal(lsdba, 1073100)
  assert.equal(lsdba * 0.25, lsa)
})

test('Income tax: basic rate band ends at the Personal Allowance plus £37,700', () => {
  assert.equal(valueOn('income_tax.personal_allowance', AS_OF), 12570)
  assert.equal(valueOn('income_tax.basic_rate_limit', AS_OF), 37700)
  assert.equal(12570 + valueOn('income_tax.basic_rate_limit', AS_OF), 50270)
})

// ─── Dates and history ──────────────────────────────────────────────────────

test('taxYearOf handles the 5 and 6 April boundary', () => {
  assert.equal(taxYearOf('2027-04-05').label, '2026/27')
  assert.equal(taxYearOf('2027-04-06').label, '2027/28')
  assert.equal(taxYearOf('2026-11-06').id, '2026-27')
  assert.equal(taxYearOf('2026-01-01').label, '2025/26')
})

test('formatDate prints UK long dates', () => {
  assert.equal(formatDate('2028-04-06'), '6 April 2028')
})

test('gbp groups thousands and rounds', () => {
  assert.equal(gbp(20000), '£20,000')
  assert.equal(gbp(1073100), '£1,073,100')
  assert.equal(gbp(12547.6), '£12,548')
})

test('Normal minimum pension age is 55 now and 57 from 6 April 2028', () => {
  assert.equal(valueOn('pension.normal_minimum_pension_age', '2028-04-05'), 55)
  assert.equal(valueOn('pension.normal_minimum_pension_age', '2028-04-06'), 57)
  const a = pensionAccessAge(AS_OF)
  assert.deepEqual(a, { now: 55, next: 57, nextFrom: '6 April 2028' })
  const after = pensionAccessAge('2028-05-01')
  assert.deepEqual(after, { now: 57, next: null, nextFrom: null })
})

test('ISA allowance: £20,000 for 2026/27 and, as announced, 2027/28', () => {
  assert.equal(valueOn('isa.overall_allowance', '2027-04-05'), 20000)
  assert.equal(valueOn('isa.overall_allowance', '2027-04-06'), 20000)
  assert.equal(figureOn('isa.overall_allowance', '2027-04-06').status, 'announced')
  assert.equal(figureOn('isa.overall_allowance', '2026-11-06').status, 'in_force')
})

test('The abandoned £12,000 Cash ISA cap is kept in history but never returned as live', () => {
  const rows = figureHistory('isa.cash_isa_limit_under_65')
  assert.equal(rows.length, 1)
  assert.equal(rows[0].status, 'abandoned')
  assert.equal(rows[0].value, 12000)
  assert.equal(figureOn('isa.cash_isa_limit_under_65', '2027-06-01'), null)
  assert.equal(figureOn('isa.cash_isa_limit_under_65', '2027-06-01', { includeInactive: true }).value, 12000)
})

test('Historical rows are not rewritten: a closed row keeps answering for its own dates', () => {
  const rows = [
    ...clone(FIGURES),
    // Pretend the allowance changed on 6 April 2028.
    {
      ...FIGURES.find((f) => f.key === 'isa.overall_allowance' && f.status === 'announced'),
      effectiveFrom: '2028-04-06',
      effectiveTo: null,
      value: 25000,
    },
  ]
  assert.equal(figureOn('isa.overall_allowance', '2026-11-06', { figures: rows }).value, 20000)
  assert.equal(figureOn('isa.overall_allowance', '2028-06-01', { figures: rows }).value, 25000)
})

test('valueOn throws when no figure covers the date', () => {
  assert.throws(() => valueOn('isa.overall_allowance', '2010-01-01'), /No UK figure/)
  assert.throws(() => valueOn('not.a.key', AS_OF), /No UK figure/)
})

test('ISA_RULES reflects the central file', () => {
  assert.equal(ISA_RULES.overallAllowance, valueOn('isa.overall_allowance'))
  assert.equal(ISA_RULES.cancelledCashIsaLimit, 12000)
  assert.match(ISA_RULES.cashIsaCapWouldHaveStarted, /April 2027$/)
})

// ─── Validator ──────────────────────────────────────────────────────────────

test('The shipped figures pass validation as of the date they were checked', () => {
  const { errors } = validateFigures(FIGURES, AS_OF)
  assert.deepEqual(errors, [])
})

test('Every figure has a source, a review date and a verification state', () => {
  for (const f of FIGURES) {
    assert.match(f.sourceUrl, /^https:\/\//, f.key)
    assert.ok(f.sourceName, f.key)
    assert.match(f.nextReview, /^\d{4}-\d{2}-\d{2}$/, f.key)
    assert.equal(f.verification, 'source_page_read', f.key)
  }
})

test('Validator flags a missing source URL', () => {
  const rows = clone(FIGURES)
  rows[0].sourceUrl = ''
  assert.ok(validateFigures(rows, AS_OF).errors.some((e) => /source URL/.test(e)))
})

test('Validator flags a missing effective date', () => {
  const rows = clone(FIGURES)
  rows[0].effectiveFrom = undefined
  assert.ok(validateFigures(rows, AS_OF).errors.some((e) => /effectiveFrom/.test(e)))
})

test('Validator flags a review that is overdue', () => {
  const errors = validateFigures(FIGURES, '2027-03-16').errors
  assert.ok(errors.some((e) => /review overdue/.test(e)))
})

test('Validator flags a figure last checked more than 120 days ago', () => {
  const errors = validateFigures(FIGURES, '2027-03-10').errors
  assert.ok(errors.some((e) => /more than 120 days ago/.test(e)))
})

test('Validator flags an unverified figure that is live', () => {
  const rows = clone(FIGURES)
  rows[0].verification = 'secondary_only'
  assert.ok(validateFigures(rows, AS_OF).errors.some((e) => /not been read from its source/.test(e)))
})

test('Validator flags an abandoned row with no date or replacement', () => {
  const rows = clone(FIGURES)
  const i = rows.findIndex((f) => f.status === 'abandoned')
  delete rows[i].statusChangedOn
  delete rows[i].supersededBy
  const errors = validateFigures(rows, AS_OF).errors
  assert.ok(errors.some((e) => /statusChangedOn/.test(e)))
  assert.ok(errors.some((e) => /supersededBy/.test(e)))
})

test('Validator flags an announced rule whose start date has passed', () => {
  const errors = validateFigures(FIGURES, '2027-04-07').errors
  assert.ok(errors.some((e) => /took effect/.test(e)))
})

test('Validator flags duplicates', () => {
  const rows = [...clone(FIGURES), { ...FIGURES[0] }]
  assert.ok(validateFigures(rows, AS_OF).errors.some((e) => /duplicate/.test(e)))
})

test('Validator flags a missing entry for a required key on rollover', () => {
  const rows = clone(FIGURES).filter((f) => f.key !== 'pension.annual_allowance')
  assert.ok(validateFigures(rows, AS_OF).errors.some((e) => /pension\.annual_allowance: no live entry/.test(e)))
})

test('Validator warns, not errors, about a missing named reviewer', () => {
  const { errors, warnings } = validateFigures(FIGURES, AS_OF)
  assert.deepEqual(errors, [])
  assert.ok(warnings.some((w) => /no named reviewer/.test(w)))
})

test('every figure has a row for 6 April 2027, except documented gaps that expire', () => {
  const first = '2027-04-06'
  const gaps = {
    // Abandoned rule: no successor, and no page reads it.
    'isa.cash_isa_limit_under_65': null,
    // GOV.UK states £13,036.40 a year for 2027-28 but no weekly rate. Pages show the annual figure only
    // until DWP publishes a weekly rate. The exception stops on 2027-03-01 so the gap is closed before April.
    'state_pension.new_full_rate_weekly': '2027-03-01',
  }
  const today = new Date().toISOString().slice(0, 10)
  const missing = []
  for (const key of new Set(FIGURES.map((f) => f.key))) {
    if (figureOn(key, first)) continue
    if (key in gaps && (gaps[key] === null || today < gaps[key])) continue
    missing.push(key)
  }
  assert.deepEqual(missing, [], `no row covers ${first}: ${missing.join(', ')}. Pages that read these would fail on 6 April 2027.`)
})

test('the 2027-28 State Pension annual figure is the GOV.UK value and no weekly figure is invented', () => {
  assert.equal(valueOn('state_pension.new_full_rate_annual', '2027-05-01'), 13036.4)
  assert.equal(figureOn('state_pension.new_full_rate_weekly', '2027-05-01'), null)
  assert.equal(valueOn('income_tax.dividend_allowance', '2027-05-01'), 500)
  assert.equal(valueOn('income_tax.starting_rate_for_savings_limit', '2027-05-01'), 5000)
})

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
