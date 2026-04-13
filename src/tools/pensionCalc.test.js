/**
 * Unit tests for pensionCalc.js
 *
 * Run with Node.js (no test runner needed):
 *   node src/tools/pensionCalc.test.js
 *
 * Or add vitest and run normally once it is installed.
 */

import assert from 'node:assert/strict'
import { calculateDrawdown, validateInputs, ERRORS } from './pensionCalc.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓  ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗  ${name}`)
    console.error(`     ${err.message}`)
    failed++
  }
}

function happyBase(overrides = {}) {
  return {
    pot: 100_000,
    currentAge: 45,
    retirementAge: 65,
    targetEndAge: 90,
    monthlyContribution: 500,
    annualReturn: 0.05,
    annualFee: 0.005,
    inflationRate: 0.025,
    lumpSum: 0,
    withdrawalMode: 'percentage',
    annualWithdrawalPct: 0.04,
    fixedMonthlyAmount: 0,
    ...overrides,
  }
}

// ─── Validation tests ────────────────────────────────────────────────────────

console.log('\nValidation')

test('accepts valid percentage-mode inputs', () => {
  const errors = validateInputs(happyBase())
  assert.deepEqual(errors, [])
})

test('accepts valid fixed-mode inputs', () => {
  const errors = validateInputs(
    happyBase({ withdrawalMode: 'fixed', fixedMonthlyAmount: 1500 })
  )
  assert.deepEqual(errors, [])
})

test('rejects negative pot', () => {
  const errors = validateInputs(happyBase({ pot: -1 }))
  assert.ok(errors.includes(ERRORS.POT_NEGATIVE))
})

test('rejects NaN pot', () => {
  const errors = validateInputs(happyBase({ pot: NaN }))
  assert.ok(errors.includes(ERRORS.POT_NEGATIVE))
})

test('accepts zero pot', () => {
  const errors = validateInputs(happyBase({ pot: 0 }))
  assert.deepEqual(errors, [])
})

test('rejects currentAge below 18', () => {
  const errors = validateInputs(happyBase({ currentAge: 17 }))
  assert.ok(errors.includes(ERRORS.CURRENT_AGE_RANGE))
})

test('rejects currentAge above 80', () => {
  const errors = validateInputs(happyBase({ currentAge: 81 }))
  assert.ok(errors.includes(ERRORS.CURRENT_AGE_RANGE))
})

test('rejects retirementAge not greater than currentAge', () => {
  const errors = validateInputs(happyBase({ currentAge: 60, retirementAge: 60 }))
  assert.ok(errors.includes(ERRORS.RETIREMENT_AGE_ORDER))
})

test('rejects retirementAge > 90', () => {
  const errors = validateInputs(happyBase({ retirementAge: 91 }))
  assert.ok(errors.includes(ERRORS.RETIREMENT_AGE_MAX))
})

test('rejects targetEndAge not greater than retirementAge', () => {
  const errors = validateInputs(happyBase({ retirementAge: 65, targetEndAge: 65 }))
  assert.ok(errors.includes(ERRORS.TARGET_AGE_ORDER))
})

test('rejects targetEndAge > 100', () => {
  const errors = validateInputs(happyBase({ targetEndAge: 101 }))
  assert.ok(errors.includes(ERRORS.TARGET_AGE_MAX))
})

test('rejects negative monthly contribution', () => {
  const errors = validateInputs(happyBase({ monthlyContribution: -1 }))
  assert.ok(errors.includes(ERRORS.CONTRIBUTION_NEGATIVE))
})

test('accepts zero monthly contribution', () => {
  const errors = validateInputs(happyBase({ monthlyContribution: 0 }))
  assert.deepEqual(errors, [])
})

test('rejects annualReturn above 20%', () => {
  const errors = validateInputs(happyBase({ annualReturn: 0.21 }))
  assert.ok(errors.includes(ERRORS.RETURN_RANGE))
})

test('rejects annualFee above 5%', () => {
  const errors = validateInputs(happyBase({ annualFee: 0.051 }))
  assert.ok(errors.includes(ERRORS.FEE_RANGE))
})

test('rejects negative lump sum', () => {
  const errors = validateInputs(happyBase({ lumpSum: -100 }))
  assert.ok(errors.includes(ERRORS.LUMP_SUM_NEGATIVE))
})

test('rejects invalid withdrawalMode', () => {
  const errors = validateInputs(happyBase({ withdrawalMode: 'monthly' }))
  assert.ok(errors.includes(ERRORS.WITHDRAWAL_MODE_INVALID))
})

test('rejects withdrawal rate above 20%', () => {
  const errors = validateInputs(happyBase({ annualWithdrawalPct: 0.21 }))
  assert.ok(errors.includes(ERRORS.WITHDRAWAL_PCT_RANGE))
})

test('rejects negative fixedMonthlyAmount in fixed mode', () => {
  const errors = validateInputs(
    happyBase({ withdrawalMode: 'fixed', fixedMonthlyAmount: -50 })
  )
  assert.ok(errors.includes(ERRORS.FIXED_AMOUNT_NEGATIVE))
})

test('collects multiple errors', () => {
  const errors = validateInputs(
    happyBase({ pot: -1, currentAge: 10 })
  )
  assert.ok(errors.length >= 2)
})

// ─── Calculation: happy path ──────────────────────────────────────────────────

console.log('\nHappy path')

test('returns ok:true for valid inputs', () => {
  const result = calculateDrawdown(happyBase())
  assert.equal(result.ok, true)
})

test('potAtRetirement is a positive integer', () => {
  const result = calculateDrawdown(happyBase())
  assert.ok(result.ok)
  assert.ok(result.potAtRetirement > 0)
  assert.equal(result.potAtRetirement, Math.round(result.potAtRetirement))
})

test('potAtRetirement grows with contributions vs no contributions', () => {
  const with_ = calculateDrawdown(happyBase({ monthlyContribution: 500 }))
  const without = calculateDrawdown(happyBase({ monthlyContribution: 0 }))
  assert.ok(with_.potAtRetirement > without.potAtRetirement)
})

test('potAtRetirement is higher with higher return', () => {
  const hi = calculateDrawdown(happyBase({ annualReturn: 0.07 }))
  const lo = calculateDrawdown(happyBase({ annualReturn: 0.03 }))
  assert.ok(hi.potAtRetirement > lo.potAtRetirement)
})

test('higher fee reduces potAtRetirement', () => {
  const lo = calculateDrawdown(happyBase({ annualFee: 0.001 }))
  const hi = calculateDrawdown(happyBase({ annualFee: 0.02 }))
  assert.ok(lo.potAtRetirement > hi.potAtRetirement)
})

test('monthlyIncome and annualIncome are consistent', () => {
  const result = calculateDrawdown(happyBase())
  assert.equal(result.annualIncome, result.monthlyIncome * 12)
})

test('comparison has exactly 3 rows', () => {
  const result = calculateDrawdown(happyBase())
  assert.equal(result.comparison.length, 3)
})

test('comparison rates are 3%, 4%, 5%', () => {
  const result = calculateDrawdown(happyBase())
  assert.deepEqual(result.comparison.map((r) => r.rate), [0.03, 0.04, 0.05])
})

test('higher comparison rate gives higher monthly income', () => {
  const result = calculateDrawdown(happyBase())
  const [r3, r4, r5] = result.comparison
  assert.ok(r4.monthlyIncome > r3.monthlyIncome)
  assert.ok(r5.monthlyIncome > r4.monthlyIncome)
})

test('3% drawdown from pot with 4.5% net return lasts to target age', () => {
  // Net return: 5% - 0.5% = 4.5% > 3% withdrawal → pot should grow
  const result = calculateDrawdown(happyBase({ annualWithdrawalPct: 0.03 }))
  assert.ok(result.exhaustedAge === null)
})

// ─── Calculation: zero pot ────────────────────────────────────────────────────

console.log('\nZero pot')

test('zero pot with contributions accumulates correctly', () => {
  const result = calculateDrawdown(happyBase({ pot: 0, monthlyContribution: 500 }))
  assert.ok(result.ok)
  assert.ok(result.potAtRetirement > 0)
})

test('zero pot with no contributions gives zero potAtRetirement', () => {
  const result = calculateDrawdown(
    happyBase({ pot: 0, monthlyContribution: 0 })
  )
  assert.ok(result.ok)
  assert.equal(result.potAtRetirement, 0)
  assert.equal(result.monthlyIncome, 0)
})

// ─── Calculation: lump sum ────────────────────────────────────────────────────

console.log('\nLump sum')

test('lump sum reduces potAfterLumpSum by exact amount', () => {
  const noLump = calculateDrawdown(happyBase({ lumpSum: 0 }))
  const withLump = calculateDrawdown(happyBase({ lumpSum: 25_000 }))
  assert.ok(withLump.potAfterLumpSum < noLump.potAtRetirement)
  assert.equal(withLump.lumpSumApplied, 25_000)
  assert.equal(
    withLump.potAtRetirement - withLump.lumpSumApplied,
    withLump.potAfterLumpSum
  )
})

test('lump sum larger than pot is clamped to pot', () => {
  const result = calculateDrawdown(happyBase({ pot: 0, monthlyContribution: 0, lumpSum: 999_999 }))
  assert.ok(result.ok)
  assert.equal(result.lumpSumApplied, 0)
  assert.equal(result.potAfterLumpSum, 0)
})

// ─── Calculation: depletion ───────────────────────────────────────────────────

console.log('\nDepletion')

test('percentage mode: pot survives when net return exceeds withdrawal rate', () => {
  // 3% withdrawal, 4.5% net return → pot grows each month, never exhausts
  const result = calculateDrawdown(
    happyBase({ annualReturn: 0.05, annualFee: 0.005, annualWithdrawalPct: 0.03 })
  )
  assert.ok(result.ok)
  assert.ok(result.exhaustedAge === null, 'Expected pot to survive but got exhaustedAge')
})

test('fixed mode: very high withdrawal exhausts pot well before target end age', () => {
  // £5,000/month from a ~£74k pot (small pot, 0% return) exhausts in <2 years
  const result = calculateDrawdown(
    happyBase({
      pot: 50_000,
      monthlyContribution: 0,
      annualReturn: 0.02,
      annualFee: 0.0,
      withdrawalMode: 'fixed',
      fixedMonthlyAmount: 5_000,
    })
  )
  assert.ok(result.ok)
  assert.ok(result.exhaustedAge !== null, 'Expected pot to exhaust but got null')
  assert.ok(result.exhaustedAge < 90)
})

test('exhaustedAge is within retirement-to-target range', () => {
  const result = calculateDrawdown(happyBase({ annualWithdrawalPct: 0.15 }))
  assert.ok(result.ok)
  if (result.exhaustedAge !== null) {
    assert.ok(result.exhaustedAge > 65)
    assert.ok(result.exhaustedAge <= 90)
  }
})

test('fixed mode with unsustainable withdrawal exhausts pot', () => {
  // Very large fixed withdrawal relative to pot
  const result = calculateDrawdown(
    happyBase({
      withdrawalMode: 'fixed',
      fixedMonthlyAmount: 50_000,
    })
  )
  assert.ok(result.ok)
  assert.ok(result.exhaustedAge !== null)
})

test('fixed mode with small withdrawal survives', () => {
  const result = calculateDrawdown(
    happyBase({
      withdrawalMode: 'fixed',
      fixedMonthlyAmount: 100,
    })
  )
  assert.ok(result.ok)
  assert.ok(result.exhaustedAge === null)
})

// ─── Calculation: invalid inputs ─────────────────────────────────────────────

console.log('\nInvalid inputs return ok:false')

test('returns ok:false with errors for negative pot', () => {
  const result = calculateDrawdown(happyBase({ pot: -1 }))
  assert.equal(result.ok, false)
  assert.ok(Array.isArray(result.errors))
  assert.ok(result.errors.length > 0)
})

test('returns ok:false for impossible ages', () => {
  const result = calculateDrawdown(happyBase({ currentAge: 70, retirementAge: 65 }))
  assert.equal(result.ok, false)
})

// ─── Summary ─────────────────────────────────────────────────────────────────

const total = passed + failed
console.log(`\n${total} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
