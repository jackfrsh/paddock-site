import assert from 'node:assert/strict'
import { ERRORS, validateInputs, calculateIsa } from './isaCalc.js'

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

function happyBase(overrides = {}) {
  return {
    initialAmount: '10000',
    monthlyContribution: '500',
    years: '20',
    annualReturn: '5',
    annualFee: '0',
    targetValue: '',
    ...overrides,
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

console.log('\nValidation — initialAmount')

test('missing initialAmount returns error', () => {
  const e = validateInputs(happyBase({ initialAmount: '' }))
  assert.ok(e.includes(ERRORS.INITIAL_AMOUNT_REQUIRED))
})

test('null initialAmount returns error', () => {
  const e = validateInputs(happyBase({ initialAmount: null }))
  assert.ok(e.includes(ERRORS.INITIAL_AMOUNT_REQUIRED))
})

test('non-numeric initialAmount returns error', () => {
  const e = validateInputs(happyBase({ initialAmount: 'abc' }))
  assert.ok(e.includes(ERRORS.INITIAL_AMOUNT_INVALID))
})

test('negative initialAmount returns error', () => {
  const e = validateInputs(happyBase({ initialAmount: '-1' }))
  assert.ok(e.includes(ERRORS.INITIAL_AMOUNT_NEGATIVE))
})

test('zero initialAmount is valid', () => {
  const e = validateInputs(happyBase({ initialAmount: '0' }))
  assert.strictEqual(e.length, 0)
})

console.log('\nValidation — monthlyContribution')

test('omitted monthlyContribution is valid', () => {
  const e = validateInputs(happyBase({ monthlyContribution: '' }))
  assert.strictEqual(e.length, 0)
})

test('non-numeric monthlyContribution returns error', () => {
  const e = validateInputs(happyBase({ monthlyContribution: 'abc' }))
  assert.ok(e.includes(ERRORS.MONTHLY_CONTRIBUTION_INVALID))
})

test('negative monthlyContribution returns error', () => {
  const e = validateInputs(happyBase({ monthlyContribution: '-100' }))
  assert.ok(e.includes(ERRORS.MONTHLY_CONTRIBUTION_NEGATIVE))
})

test('zero monthlyContribution is valid', () => {
  const e = validateInputs(happyBase({ monthlyContribution: '0' }))
  assert.strictEqual(e.length, 0)
})

console.log('\nValidation — years')

test('missing years returns error', () => {
  const e = validateInputs(happyBase({ years: '' }))
  assert.ok(e.includes(ERRORS.YEARS_REQUIRED))
})

test('non-numeric years returns error', () => {
  const e = validateInputs(happyBase({ years: 'abc' }))
  assert.ok(e.includes(ERRORS.YEARS_INVALID))
})

test('years = 0 returns range error', () => {
  const e = validateInputs(happyBase({ years: '0' }))
  assert.ok(e.includes(ERRORS.YEARS_OUT_OF_RANGE))
})

test('years = 51 returns range error', () => {
  const e = validateInputs(happyBase({ years: '51' }))
  assert.ok(e.includes(ERRORS.YEARS_OUT_OF_RANGE))
})

test('years = 1 is valid', () => {
  const e = validateInputs(happyBase({ years: '1' }))
  assert.strictEqual(e.length, 0)
})

test('years = 50 is valid', () => {
  const e = validateInputs(happyBase({ years: '50' }))
  assert.strictEqual(e.length, 0)
})

console.log('\nValidation — annualReturn')

test('missing annualReturn returns error', () => {
  const e = validateInputs(happyBase({ annualReturn: '' }))
  assert.ok(e.includes(ERRORS.ANNUAL_RETURN_REQUIRED))
})

test('non-numeric annualReturn returns error', () => {
  const e = validateInputs(happyBase({ annualReturn: 'abc' }))
  assert.ok(e.includes(ERRORS.ANNUAL_RETURN_INVALID))
})

test('annualReturn = -1 returns range error', () => {
  const e = validateInputs(happyBase({ annualReturn: '-1' }))
  assert.ok(e.includes(ERRORS.ANNUAL_RETURN_OUT_OF_RANGE))
})

test('annualReturn = 21 returns range error', () => {
  const e = validateInputs(happyBase({ annualReturn: '21' }))
  assert.ok(e.includes(ERRORS.ANNUAL_RETURN_OUT_OF_RANGE))
})

test('annualReturn = 0 is valid', () => {
  const e = validateInputs(happyBase({ annualReturn: '0' }))
  assert.strictEqual(e.length, 0)
})

test('annualReturn = 20 is valid', () => {
  const e = validateInputs(happyBase({ annualReturn: '20' }))
  assert.strictEqual(e.length, 0)
})

console.log('\nValidation — annualFee')

test('omitted annualFee is valid', () => {
  const e = validateInputs(happyBase({ annualFee: '' }))
  assert.strictEqual(e.length, 0)
})

test('non-numeric annualFee returns error', () => {
  const e = validateInputs(happyBase({ annualFee: 'abc' }))
  assert.ok(e.includes(ERRORS.ANNUAL_FEE_INVALID))
})

test('annualFee = -0.1 returns range error', () => {
  const e = validateInputs(happyBase({ annualFee: '-0.1' }))
  assert.ok(e.includes(ERRORS.ANNUAL_FEE_OUT_OF_RANGE))
})

test('annualFee = 5.1 returns range error', () => {
  const e = validateInputs(happyBase({ annualFee: '5.1' }))
  assert.ok(e.includes(ERRORS.ANNUAL_FEE_OUT_OF_RANGE))
})

test('annualFee = 5 is valid', () => {
  const e = validateInputs(happyBase({ annualFee: '5' }))
  assert.strictEqual(e.length, 0)
})

console.log('\nValidation — targetValue')

test('omitted targetValue is valid', () => {
  const e = validateInputs(happyBase({ targetValue: '' }))
  assert.strictEqual(e.length, 0)
})

test('non-numeric targetValue returns error', () => {
  const e = validateInputs(happyBase({ targetValue: 'abc' }))
  assert.ok(e.includes(ERRORS.TARGET_VALUE_INVALID))
})

test('targetValue = 0 returns error', () => {
  const e = validateInputs(happyBase({ targetValue: '0' }))
  assert.ok(e.includes(ERRORS.TARGET_VALUE_NEGATIVE))
})

test('targetValue = -1 returns error', () => {
  const e = validateInputs(happyBase({ targetValue: '-1' }))
  assert.ok(e.includes(ERRORS.TARGET_VALUE_NEGATIVE))
})

test('targetValue = 100000 is valid', () => {
  const e = validateInputs(happyBase({ targetValue: '100000' }))
  assert.strictEqual(e.length, 0)
})

// ─── ISA calculation ──────────────────────────────────────────────────────────

console.log('\nISA calculation — basic shape')

test('returns ok:true on valid inputs', () => {
  const r = calculateIsa(happyBase())
  assert.strictEqual(r.ok, true)
})

test('returns all expected fields', () => {
  const r = calculateIsa(happyBase())
  assert.ok('projectedValue' in r)
  assert.ok('totalContributed' in r)
  assert.ok('totalGrowth' in r)
  assert.ok('targetProgressPct' in r)
  assert.ok('comparison' in r)
})

test('returns ok:false on invalid inputs', () => {
  const r = calculateIsa(happyBase({ years: '' }))
  assert.strictEqual(r.ok, false)
  assert.ok(r.errors.length > 0)
})

console.log('\nISA calculation — projectedValue')

test('projectedValue > totalContributed when return > 0', () => {
  const r = calculateIsa(happyBase({ annualReturn: '5' }))
  assert.ok(r.projectedValue > r.totalContributed)
})

test('projectedValue = totalContributed when return = 0 and fee = 0', () => {
  const r = calculateIsa(happyBase({ annualReturn: '0', annualFee: '0' }))
  assert.ok(Math.abs(r.projectedValue - r.totalContributed) < 1)
})

test('higher return gives higher projectedValue', () => {
  const lo = calculateIsa(happyBase({ annualReturn: '3' }))
  const hi = calculateIsa(happyBase({ annualReturn: '7' }))
  assert.ok(hi.projectedValue > lo.projectedValue)
})

test('longer horizon gives higher projectedValue', () => {
  const short = calculateIsa(happyBase({ years: '10' }))
  const long = calculateIsa(happyBase({ years: '30' }))
  assert.ok(long.projectedValue > short.projectedValue)
})

test('higher fee reduces projectedValue', () => {
  const noFee = calculateIsa(happyBase({ annualFee: '0' }))
  const withFee = calculateIsa(happyBase({ annualFee: '1' }))
  assert.ok(noFee.projectedValue > withFee.projectedValue)
})

test('higher monthlyContribution gives higher projectedValue', () => {
  const lo = calculateIsa(happyBase({ monthlyContribution: '200' }))
  const hi = calculateIsa(happyBase({ monthlyContribution: '1000' }))
  assert.ok(hi.projectedValue > lo.projectedValue)
})

console.log('\nISA calculation — totalContributed')

test('totalContributed = initialAmount + monthlyContribution * months', () => {
  const r = calculateIsa(happyBase({ initialAmount: '10000', monthlyContribution: '500', years: '20' }))
  const expected = 10000 + 500 * 20 * 12
  assert.ok(Math.abs(r.totalContributed - expected) < 1)
})

test('totalContributed with zero monthlyContribution equals initialAmount', () => {
  const r = calculateIsa(happyBase({ monthlyContribution: '0', initialAmount: '20000' }))
  assert.ok(Math.abs(r.totalContributed - 20000) < 1)
})

test('totalContributed with omitted monthlyContribution equals initialAmount', () => {
  const r = calculateIsa(happyBase({ monthlyContribution: '', initialAmount: '15000' }))
  assert.ok(Math.abs(r.totalContributed - 15000) < 1)
})

console.log('\nISA calculation — totalGrowth')

test('totalGrowth = projectedValue - totalContributed', () => {
  const r = calculateIsa(happyBase())
  assert.ok(Math.abs(r.totalGrowth - (r.projectedValue - r.totalContributed)) < 0.01)
})

test('totalGrowth >= 0 when return >= fee', () => {
  const r = calculateIsa(happyBase({ annualReturn: '5', annualFee: '1' }))
  assert.ok(r.totalGrowth >= 0)
})

console.log('\nISA calculation — targetProgressPct')

test('targetProgressPct is null when targetValue is empty', () => {
  const r = calculateIsa(happyBase({ targetValue: '' }))
  assert.strictEqual(r.targetProgressPct, null)
})

test('targetProgressPct is 100 when projectedValue equals target', () => {
  const r = calculateIsa(happyBase())
  const target = r.projectedValue
  const r2 = calculateIsa(happyBase({ targetValue: String(target) }))
  assert.ok(Math.abs(r2.targetProgressPct - 100) < 0.01)
})

test('targetProgressPct < 100 when projectedValue is less than target', () => {
  const r = calculateIsa(happyBase({ targetValue: '9999999' }))
  assert.ok(r.targetProgressPct < 100)
})

test('targetProgressPct is capped at 100', () => {
  const r = calculateIsa(happyBase({ targetValue: '1' }))
  assert.strictEqual(r.targetProgressPct, 100)
})

console.log('\nISA calculation — comparison')

test('comparison has 3 rows', () => {
  const r = calculateIsa(happyBase())
  assert.strictEqual(r.comparison.length, 3)
})

test('comparison rates are 3%, 5%, 7%', () => {
  const r = calculateIsa(happyBase())
  assert.deepEqual(r.comparison.map((c) => c.rate), [0.03, 0.05, 0.07])
})

test('comparison rateLabels are 3%, 5%, 7%', () => {
  const r = calculateIsa(happyBase())
  assert.deepEqual(r.comparison.map((c) => c.rateLabel), ['3%', '5%', '7%'])
})

test('comparison rows have projectedValue, totalContributed, totalGrowth', () => {
  const r = calculateIsa(happyBase())
  for (const row of r.comparison) {
    assert.ok('projectedValue' in row)
    assert.ok('totalContributed' in row)
    assert.ok('totalGrowth' in row)
  }
})

test('comparison projectedValues are in ascending order', () => {
  const r = calculateIsa(happyBase())
  const [low, mid, high] = r.comparison
  assert.ok(low.projectedValue < mid.projectedValue)
  assert.ok(mid.projectedValue < high.projectedValue)
})

test('comparison totalContributed is same for all rows', () => {
  const r = calculateIsa(happyBase())
  const ref = r.comparison[0].totalContributed
  for (const row of r.comparison) {
    assert.ok(Math.abs(row.totalContributed - ref) < 1)
  }
})

// ─── Edge cases ───────────────────────────────────────────────────────────────

console.log('\nEdge cases')

test('zero initial amount, zero contribution returns zero growth', () => {
  const r = calculateIsa(happyBase({ initialAmount: '0', monthlyContribution: '0' }))
  assert.ok(r.projectedValue < 1)
  assert.ok(r.totalGrowth < 1)
})

test('large values do not throw', () => {
  const r = calculateIsa(happyBase({ initialAmount: '1000000', monthlyContribution: '5000', years: '40', annualReturn: '10' }))
  assert.strictEqual(r.ok, true)
  assert.ok(r.projectedValue > 1000000)
})

test('1 year horizon works', () => {
  const r = calculateIsa(happyBase({ years: '1' }))
  assert.strictEqual(r.ok, true)
  assert.ok(r.projectedValue > 0)
})

test('numeric inputs (not strings) work', () => {
  const r = calculateIsa({
    initialAmount: 10000,
    monthlyContribution: 500,
    years: 20,
    annualReturn: 5,
    annualFee: 0,
    targetValue: '',
  })
  assert.strictEqual(r.ok, true)
})

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
