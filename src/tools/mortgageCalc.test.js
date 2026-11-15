import assert from 'node:assert/strict'
import { ERRORS, validateInputs, monthlyPayment, simulate, calculateOverpayment } from './mortgageCalc.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}
const within = (actual, expected, pct) =>
  assert.ok(Math.abs(actual - expected) <= expected * pct, `${actual} is not within ${pct * 100}% of ${expected}`)
const base = (o = {}) => ({ balance: '250000', rate: '5', years: '25', monthlyOverpayment: '', lumpSum: '', allowancePct: '', ...o })

console.log('▶ src/tools/mortgageCalc.test.js')

/* MoneyHelper's published examples (read 15 November 2026):
   - £175,000 at 5% over 25 years costs £1,023 a month, £307,022 in all.
   - £250,000 at 5% with 25 years left: a £5,000 lump sum cuts the interest by
     £11,970 and clears the mortgage 11 months earlier.
   MoneyHelper rounds and may count interest slightly differently, so the
   money figures are matched to within 1% and the months exactly. */
test('the monthly payment matches MoneyHelper for £175,000 at 5% over 25 years', () => {
  within(monthlyPayment(175000, 5, 25), 1023, 0.001)
})

test('total repaid and interest are close to MoneyHelper for the same loan', () => {
  const run = simulate({ balance: 175000, annualRatePct: 5, years: 25 })
  within(run.paid, 307022, 0.01)
  within(run.interest, 132022, 0.01)
})

test('a £5,000 lump sum saves about £11,970 and 11 months, as MoneyHelper says', () => {
  const r = calculateOverpayment(base({ lumpSum: '5000' }))
  assert.equal(r.ok, true)
  assert.equal(r.monthsSaved, 11)
  within(r.interestSaved, 11970, 0.01)
})

test('with no overpayment nothing is saved and the term is unchanged', () => {
  const r = calculateOverpayment(base())
  assert.equal(r.monthsSaved, 0)
  assert.equal(r.interestSaved, 0)
  assert.equal(r.hasOverpayment, false)
  assert.equal(r.baseline.months, 300)
})

test('a zero-rate mortgage divides the balance evenly and saves no interest', () => {
  const r = calculateOverpayment(base({ balance: '120000', rate: '0', years: '10', monthlyOverpayment: '500' }))
  assert.equal(monthlyPayment(120000, 0, 10), 1000)
  assert.equal(r.baseline.interest, 0)
  assert.equal(r.interestSaved, 0)
  assert.equal(r.withOverpayment.months, 80)
})

test('the baseline run pays the balance off exactly at the end of the term', () => {
  const run = simulate({ balance: 200000, annualRatePct: 4.5, years: 20 })
  assert.equal(run.months, 240)
})

test('the final payment never overshoots: total paid equals balance plus interest', () => {
  const r = calculateOverpayment(base({ monthlyOverpayment: '700', lumpSum: '10000' }))
  const principalAndInterest = 250000 + r.withOverpayment.interest
  assert.ok(Math.abs(r.withOverpayment.paid - principalAndInterest) < 0.01)
})

test('more monthly overpayment always saves more, with diminishing term', () => {
  const r = calculateOverpayment(base())
  const saved = r.comparison.map((c) => c.interestSaved)
  assert.ok(saved[0] < saved[1] && saved[1] < saved[2])
  assert.ok(r.comparison[0].months > r.comparison[2].months)
})

test('the overpayment allowance flag uses the first year and the chosen percentage', () => {
  const inside = calculateOverpayment(base({ monthlyOverpayment: '1000' })) // £12,000 vs £25,000
  assert.equal(inside.overAllowance, false)
  const outside = calculateOverpayment(base({ monthlyOverpayment: '1000', lumpSum: '20000' })) // £32,000
  assert.equal(outside.overAllowance, true)
  assert.equal(outside.allowanceAmount, 25000)
  const custom = calculateOverpayment(base({ monthlyOverpayment: '1000', allowancePct: '2' })) // £5,000 limit
  assert.equal(custom.overAllowance, true)
})

test('required fields and ranges are validated', () => {
  assert.deepEqual(validateInputs(base({ balance: '' })), [ERRORS.BALANCE_REQUIRED])
  assert.deepEqual(validateInputs(base({ rate: '16' })), [ERRORS.RATE_OUT_OF_RANGE])
  assert.deepEqual(validateInputs(base({ years: '0' })), [ERRORS.YEARS_OUT_OF_RANGE])
  assert.deepEqual(validateInputs(base({ years: '41' })), [ERRORS.YEARS_OUT_OF_RANGE])
  assert.deepEqual(validateInputs(base({ monthlyOverpayment: '-5' })), [ERRORS.MONTHLY_NEGATIVE])
  assert.deepEqual(validateInputs(base({ lumpSum: '250000' })), [ERRORS.LUMP_TOO_LARGE])
  assert.deepEqual(validateInputs(base({ allowancePct: '101' })), [ERRORS.ALLOWANCE_OUT_OF_RANGE])
  assert.deepEqual(validateInputs(base({ balance: 'abc' })), [ERRORS.BALANCE_INVALID])
})

test('commas in numbers are accepted and invalid input returns errors, not a result', () => {
  assert.equal(calculateOverpayment(base({ balance: '250,000' })).ok, true)
  const bad = calculateOverpayment(base({ balance: '', rate: 'x' }))
  assert.equal(bad.ok, false)
  assert.equal(bad.errors.length, 2)
})

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
