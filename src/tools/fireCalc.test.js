/**
 * Unit tests for fireCalc.js
 *
 * Run with Node.js (no test runner needed):
 *   node src/tools/fireCalc.test.js
 */

import assert from 'node:assert/strict'
import { calculateFire, validateInputs, ERRORS } from './fireCalc.js'

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
    annualSpending: 30_000,
    passiveIncome: 0,
    withdrawalRate: 0.04,
    currentAssets: 100_000,
    annualContributions: 12_000,
    annualReturn: 0.05,
    ...overrides,
  }
}

// ─── Validation ──────────────────────────────────────────────────────────────

console.log('\nValidation')

test('accepts valid inputs', () => {
  assert.deepEqual(validateInputs(happyBase()), [])
})

test('accepts zero spending', () => {
  assert.deepEqual(validateInputs(happyBase({ annualSpending: 0 })), [])
})

test('accepts zero assets', () => {
  assert.deepEqual(validateInputs(happyBase({ currentAssets: 0 })), [])
})

test('accepts zero contributions', () => {
  assert.deepEqual(validateInputs(happyBase({ annualContributions: 0 })), [])
})

test('accepts zero passive income', () => {
  assert.deepEqual(validateInputs(happyBase({ passiveIncome: 0 })), [])
})

test('rejects negative annual spending', () => {
  const errors = validateInputs(happyBase({ annualSpending: -1 }))
  assert.ok(errors.includes(ERRORS.SPENDING_NEGATIVE))
})

test('rejects NaN spending', () => {
  const errors = validateInputs(happyBase({ annualSpending: NaN }))
  assert.ok(errors.includes(ERRORS.SPENDING_NEGATIVE))
})

test('rejects negative passive income', () => {
  const errors = validateInputs(happyBase({ passiveIncome: -1 }))
  assert.ok(errors.includes(ERRORS.PASSIVE_INCOME_NEGATIVE))
})

test('rejects withdrawal rate below 0.5%', () => {
  const errors = validateInputs(happyBase({ withdrawalRate: 0.004 }))
  assert.ok(errors.includes(ERRORS.WITHDRAWAL_RATE_RANGE))
})

test('rejects withdrawal rate above 20%', () => {
  const errors = validateInputs(happyBase({ withdrawalRate: 0.21 }))
  assert.ok(errors.includes(ERRORS.WITHDRAWAL_RATE_RANGE))
})

test('rejects negative current assets', () => {
  const errors = validateInputs(happyBase({ currentAssets: -1 }))
  assert.ok(errors.includes(ERRORS.ASSETS_NEGATIVE))
})

test('rejects negative annual contributions', () => {
  const errors = validateInputs(happyBase({ annualContributions: -1 }))
  assert.ok(errors.includes(ERRORS.CONTRIBUTIONS_NEGATIVE))
})

test('rejects annual return above 20%', () => {
  const errors = validateInputs(happyBase({ annualReturn: 0.21 }))
  assert.ok(errors.includes(ERRORS.RETURN_RANGE))
})

test('accepts zero annual return', () => {
  assert.deepEqual(validateInputs(happyBase({ annualReturn: 0 })), [])
})

test('collects multiple errors', () => {
  const errors = validateInputs(happyBase({ annualSpending: -1, currentAssets: -1 }))
  assert.ok(errors.length >= 2)
})

// ─── FIRE number ─────────────────────────────────────────────────────────────

console.log('\nFIRE number')

test('returns ok:true for valid inputs', () => {
  assert.equal(calculateFire(happyBase()).ok, true)
})

test('FIRE number at 4% is 25x annual spending', () => {
  const result = calculateFire(happyBase({ annualSpending: 40_000, passiveIncome: 0 }))
  assert.ok(result.ok)
  assert.equal(result.fireNumber, 1_000_000) // 40000 / 0.04
})

test('FIRE number at 3.5% is ~28.6x annual spending', () => {
  const result = calculateFire(
    happyBase({ annualSpending: 35_000, passiveIncome: 0, withdrawalRate: 0.035 })
  )
  assert.ok(result.ok)
  assert.equal(result.fireNumber, 1_000_000) // 35000 / 0.035
})

test('passive income reduces annual needed', () => {
  const withIncome = calculateFire(
    happyBase({ annualSpending: 40_000, passiveIncome: 10_000 })
  )
  const noIncome = calculateFire(happyBase({ annualSpending: 40_000, passiveIncome: 0 }))
  assert.ok(withIncome.ok && noIncome.ok)
  assert.ok(withIncome.fireNumber < noIncome.fireNumber)
  assert.equal(withIncome.annualNeeded, 30_000)
})

test('passive income >= spending gives fireNumber 0, gap 0, progress 100', () => {
  const result = calculateFire(
    happyBase({ annualSpending: 20_000, passiveIncome: 25_000 })
  )
  assert.ok(result.ok)
  assert.equal(result.fireNumber, 0)
  assert.equal(result.gap, 0)
  assert.equal(result.progressPct, 100)
})

test('higher withdrawal rate gives lower FIRE number', () => {
  const r35 = calculateFire(happyBase({ withdrawalRate: 0.035 }))
  const r40 = calculateFire(happyBase({ withdrawalRate: 0.04 }))
  const r45 = calculateFire(happyBase({ withdrawalRate: 0.045 }))
  assert.ok(r35.fireNumber > r40.fireNumber)
  assert.ok(r40.fireNumber > r45.fireNumber)
})

test('zero spending gives zero FIRE number and zero gap', () => {
  const result = calculateFire(happyBase({ annualSpending: 0 }))
  assert.ok(result.ok)
  assert.equal(result.fireNumber, 0)
  assert.equal(result.gap, 0)
})

// ─── Gap & progress ───────────────────────────────────────────────────────────

console.log('\nGap & progress')

test('gap is fireNumber minus currentAssets', () => {
  const result = calculateFire(
    happyBase({ annualSpending: 40_000, currentAssets: 100_000, withdrawalRate: 0.04 })
  )
  assert.ok(result.ok)
  assert.equal(result.gap, 900_000) // 1_000_000 - 100_000
})

test('gap is zero when already at or above FIRE number', () => {
  const result = calculateFire(
    happyBase({ annualSpending: 20_000, currentAssets: 600_000, withdrawalRate: 0.04 })
  )
  assert.ok(result.ok)
  assert.equal(result.gap, 0) // 500_000 target, 600_000 assets
})

test('progress is 100 when already FI', () => {
  const result = calculateFire(
    happyBase({ annualSpending: 20_000, currentAssets: 600_000 })
  )
  assert.ok(result.ok)
  assert.equal(result.progressPct, 100)
})

test('progress is between 0 and 100', () => {
  const result = calculateFire(happyBase())
  assert.ok(result.ok)
  assert.ok(result.progressPct >= 0 && result.progressPct <= 100)
})

test('higher assets gives higher progress', () => {
  const lo = calculateFire(happyBase({ currentAssets: 50_000 }))
  const hi = calculateFire(happyBase({ currentAssets: 200_000 }))
  assert.ok(lo.ok && hi.ok)
  assert.ok(hi.progressPct > lo.progressPct)
})

// ─── Comparison table ────────────────────────────────────────────────────────

console.log('\nComparison table')

test('comparison has exactly 3 rows', () => {
  const result = calculateFire(happyBase())
  assert.equal(result.comparison.length, 3)
})

test('comparison rates are 3.5%, 4%, 4.5%', () => {
  const result = calculateFire(happyBase())
  assert.deepEqual(result.comparison.map((r) => r.rate), [0.035, 0.04, 0.045])
})

test('higher rate gives lower FIRE number in comparison', () => {
  const result = calculateFire(happyBase())
  const [r35, r40, r45] = result.comparison
  assert.ok(r35.fireNumber > r40.fireNumber)
  assert.ok(r40.fireNumber > r45.fireNumber)
})

test('comparison gap is non-negative for all rows', () => {
  const result = calculateFire(happyBase())
  result.comparison.forEach((row) => assert.ok(row.gap >= 0))
})

test('comparison row rateLabels are formatted correctly', () => {
  const result = calculateFire(happyBase())
  assert.deepEqual(
    result.comparison.map((r) => r.rateLabel),
    ['3.5%', '4.0%', '4.5%']
  )
})

// ─── Years to FI ─────────────────────────────────────────────────────────────

console.log('\nYears to FI')

test('returns a positive yearsToFI when contributions > 0', () => {
  const result = calculateFire(happyBase({ annualContributions: 12_000 }))
  assert.ok(result.ok)
  assert.ok(result.yearsToFI !== null)
  assert.ok(result.yearsToFI > 0)
})

test('returns yearsToFI when portfolio grows via return alone', () => {
  const result = calculateFire(
    happyBase({ currentAssets: 200_000, annualContributions: 0, annualReturn: 0.07 })
  )
  assert.ok(result.ok)
  assert.ok(result.yearsToFI !== null)
})

test('yearsToFI is null when no contributions and no return', () => {
  const result = calculateFire(
    happyBase({ annualContributions: 0, annualReturn: 0, currentAssets: 10_000 })
  )
  assert.ok(result.ok)
  assert.equal(result.yearsToFI, null)
})

test('yearsToFI is null when not reachable within 60 years', () => {
  const result = calculateFire(
    happyBase({
      annualSpending: 500_000,
      currentAssets: 1_000,
      annualContributions: 100,
      annualReturn: 0.001,
    })
  )
  assert.ok(result.ok)
  assert.equal(result.yearsToFI, null)
})

test('yearsToFI is 0 when already FI', () => {
  const result = calculateFire(
    happyBase({ annualSpending: 20_000, currentAssets: 2_000_000 })
  )
  assert.ok(result.ok)
  assert.equal(result.yearsToFI, 0)
})

test('higher contributions reduce years to FI', () => {
  const lo = calculateFire(happyBase({ annualContributions: 6_000 }))
  const hi = calculateFire(happyBase({ annualContributions: 24_000 }))
  assert.ok(lo.ok && hi.ok)
  if (lo.yearsToFI !== null && hi.yearsToFI !== null) {
    assert.ok(hi.yearsToFI <= lo.yearsToFI)
  }
})

// ─── Invalid inputs ───────────────────────────────────────────────────────────

console.log('\nInvalid inputs return ok:false')

test('returns ok:false for negative spending', () => {
  const result = calculateFire(happyBase({ annualSpending: -1 }))
  assert.equal(result.ok, false)
  assert.ok(Array.isArray(result.errors) && result.errors.length > 0)
})

test('returns ok:false for NaN assets', () => {
  const result = calculateFire(happyBase({ currentAssets: NaN }))
  assert.equal(result.ok, false)
})

test('returns ok:false for withdrawal rate of zero', () => {
  const result = calculateFire(happyBase({ withdrawalRate: 0 }))
  assert.equal(result.ok, false)
})

// ─── Summary ─────────────────────────────────────────────────────────────────

const total = passed + failed
console.log(`\n${total} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
