import assert from 'node:assert/strict'
import {
  ERRORS, MAX_AGE, calculateRetirementAge, neededAt, potAfter, realReturn, validateInputs,
} from './retirementAgeCalc.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try { fn(); console.log(`  ✓ ${name}`); passed++ }
  catch (err) { console.error(`  ✗ ${name}`); console.error(`    ${err.message}`); failed++ }
}

const base = {
  currentAge: 40,
  currentSavings: 100000,
  annualContributions: 10000,
  annualReturn: 0.03,
  inflation: 0.03, // real return 0, so the sums can be checked by hand
  incomeWanted: 20000,
  statePension: 10000,
  statePensionAge: 67,
  withdrawalRate: 0.04,
}

test('real return is nominal over inflation, not the difference', () => {
  assert.ok(Math.abs(realReturn(0.05, 0.025) - (1.05 / 1.025 - 1)) < 1e-12)
  assert.equal(realReturn(0.03, 0.03), 0)
})

test('pot with zero real return is savings plus contributions', () => {
  assert.equal(potAfter(15, 100000, 10000, 0), 250000)
  assert.equal(potAfter(0, 100000, 10000, 0.05), 100000)
})

test('pot with growth matches the closed form', () => {
  // £1,000 at 10% for 2 years, £100 paid at each year end: 1000*1.21 + 100*(1.1+1)
  assert.ok(Math.abs(potAfter(2, 1000, 100, 0.1) - 1420) < 1e-9)
})

test('needed at State Pension age is the sustainable pot only', () => {
  assert.equal(neededAt(67, base), 250000) // (20,000 - 10,000) / 4%
  assert.equal(neededAt(70, base), 250000)
})

test('needed before State Pension age adds the bridge', () => {
  assert.equal(neededAt(55, base), 12 * 20000 + 250000)
})

test('hand-worked case: earliest age is 63 (pot £330,000 = need £330,000)', () => {
  const r = calculateRetirementAge(base)
  assert.equal(r.ok, true)
  assert.equal(r.earliestAge, 63)
  assert.equal(r.yearsToGo, 23)
  const row = r.rows.find((x) => x.age === 63)
  assert.equal(row.pot, 330000)
  assert.equal(row.needed, 330000)
  assert.equal(r.rows.find((x) => x.age === 62).reached, false)
})

test('already funded: earliest age is the current age', () => {
  const r = calculateRetirementAge({ ...base, currentSavings: 2000000 })
  assert.equal(r.earliestAge, 40)
  assert.equal(r.yearsToGo, 0)
})

test('never reached: no earliest age and a shortfall at 75', () => {
  const r = calculateRetirementAge({ ...base, currentSavings: 0, annualContributions: 0 })
  assert.equal(r.earliestAge, null)
  assert.equal(r.yearsToGo, null)
  assert.equal(r.potAtMaxAge, 0)
  assert.equal(r.shortfallAtMaxAge, 250000)
})

test('a State Pension that covers the income needs no pot after State Pension age', () => {
  assert.equal(neededAt(67, { ...base, statePension: 25000 }), 0)
})

test('rows run from the current age to 75 inclusive', () => {
  const r = calculateRetirementAge(base)
  assert.equal(r.rows[0].age, 40)
  assert.equal(r.rows.at(-1).age, MAX_AGE)
  assert.equal(r.rows.length, MAX_AGE - 40 + 1)
})

test('more saving never delays retirement', () => {
  const a = calculateRetirementAge(base).earliestAge
  const b = calculateRetirementAge({ ...base, annualContributions: 20000 }).earliestAge
  assert.ok(b <= a)
})

test('a higher withdrawal rate never delays retirement', () => {
  const a = calculateRetirementAge(base).earliestAge
  const b = calculateRetirementAge({ ...base, withdrawalRate: 0.05 }).earliestAge
  assert.ok(b <= a)
})

test('validation rejects out-of-range and non-numeric inputs', () => {
  assert.deepEqual(validateInputs(base), [])
  assert.ok(validateInputs({ ...base, currentAge: 17 }).includes(ERRORS.AGE_RANGE))
  assert.ok(validateInputs({ ...base, currentAge: 75 }).includes(ERRORS.AGE_RANGE))
  assert.ok(validateInputs({ ...base, currentSavings: -1 }).includes(ERRORS.SAVINGS_NEGATIVE))
  assert.ok(validateInputs({ ...base, annualContributions: NaN }).includes(ERRORS.CONTRIBUTIONS_NEGATIVE))
  assert.ok(validateInputs({ ...base, annualReturn: 0.5 }).includes(ERRORS.RETURN_RANGE))
  assert.ok(validateInputs({ ...base, inflation: -0.01 }).includes(ERRORS.INFLATION_RANGE))
  assert.ok(validateInputs({ ...base, incomeWanted: 0 }).includes(ERRORS.INCOME_POSITIVE))
  assert.ok(validateInputs({ ...base, statePension: -5 }).includes(ERRORS.STATE_PENSION_NEGATIVE))
  assert.ok(validateInputs({ ...base, statePensionAge: 50 }).includes(ERRORS.STATE_PENSION_AGE_RANGE))
  assert.ok(validateInputs({ ...base, withdrawalRate: 0 }).includes(ERRORS.WITHDRAWAL_RATE_RANGE))
  const bad = calculateRetirementAge({ ...base, incomeWanted: 'abc' })
  assert.equal(bad.ok, false)
})

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
