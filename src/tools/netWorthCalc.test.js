import assert from 'node:assert/strict'
import {
  CURRENCIES,
  APPROX_RATES_TO_GBP,
  ASSET_ROWS,
  LIABILITY_ROWS,
  convertToBase,
  parseAmount,
  isInvalidAmount,
  calculateNetWorth,
} from './netWorthCalc.js'

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

function emptyRows(baseCurrency = 'GBP') {
  const rows = {}
  for (const { key } of [...ASSET_ROWS, ...LIABILITY_ROWS]) {
    rows[key] = { amount: '', currency: baseCurrency }
  }
  return rows
}

function singleRow(key, amount, currency = 'GBP') {
  const rows = emptyRows()
  rows[key] = { amount: String(amount), currency }
  return rows
}

// ─── convertToBase ────────────────────────────────────────────────────────────

console.log('\nconvertToBase')

test('same currency returns original amount', () => {
  assert.strictEqual(convertToBase(1000, 'GBP', 'GBP'), 1000)
  assert.strictEqual(convertToBase(1000, 'USD', 'USD'), 1000)
})

test('USD to GBP conversion', () => {
  const result = convertToBase(1000, 'USD', 'GBP')
  assert.ok(Math.abs(result - 790) < 1, `Expected ~790, got ${result}`)
})

test('EUR to GBP conversion', () => {
  const result = convertToBase(1000, 'EUR', 'GBP')
  assert.ok(Math.abs(result - 850) < 1, `Expected ~850, got ${result}`)
})

test('GBP to USD conversion', () => {
  const result = convertToBase(100, 'GBP', 'USD')
  const expected = 100 / APPROX_RATES_TO_GBP['USD']
  assert.ok(Math.abs(result - expected) < 0.1, `Expected ~${expected.toFixed(1)}, got ${result}`)
})

test('GBP to EUR conversion', () => {
  const result = convertToBase(100, 'GBP', 'EUR')
  const expected = 100 / APPROX_RATES_TO_GBP['EUR']
  assert.ok(Math.abs(result - expected) < 0.1)
})

test('USD to EUR conversion via GBP pivot', () => {
  const usdToGbp = 1000 * APPROX_RATES_TO_GBP['USD']
  const gbpToEur = usdToGbp / APPROX_RATES_TO_GBP['EUR']
  const result = convertToBase(1000, 'USD', 'EUR')
  assert.ok(Math.abs(result - gbpToEur) < 0.01)
})

test('JPY to GBP gives small value', () => {
  const result = convertToBase(1000000, 'JPY', 'GBP')
  assert.ok(result > 0 && result < 10000, `Expected a small value, got ${result}`)
})

// ─── parseAmount ──────────────────────────────────────────────────────────────

console.log('\nparseAmount')

test('empty string returns 0', () => {
  assert.strictEqual(parseAmount(''), 0)
})

test('null returns 0', () => {
  assert.strictEqual(parseAmount(null), 0)
})

test('undefined returns 0', () => {
  assert.strictEqual(parseAmount(undefined), 0)
})

test('valid number string returns float', () => {
  assert.strictEqual(parseAmount('12345'), 12345)
})

test('decimal string returns float', () => {
  assert.ok(Math.abs(parseAmount('1234.56') - 1234.56) < 0.001)
})

test('comma-formatted string parsed correctly', () => {
  assert.strictEqual(parseAmount('12,345'), 12345)
})

test('negative string returns 0', () => {
  assert.strictEqual(parseAmount('-100'), 0)
})

test('non-numeric string returns 0', () => {
  assert.strictEqual(parseAmount('abc'), 0)
})

test('zero returns 0', () => {
  assert.strictEqual(parseAmount('0'), 0)
})

test('numeric (non-string) value works', () => {
  assert.strictEqual(parseAmount(50000), 50000)
})

// ─── isInvalidAmount ─────────────────────────────────────────────────────────

console.log('\nisInvalidAmount')

test('empty string is not invalid', () => {
  assert.strictEqual(isInvalidAmount(''), false)
})

test('valid number is not invalid', () => {
  assert.strictEqual(isInvalidAmount('1000'), false)
})

test('alphabetic string is invalid', () => {
  assert.strictEqual(isInvalidAmount('abc'), true)
})

test('negative number is invalid', () => {
  assert.strictEqual(isInvalidAmount('-100'), true)
})

test('null is not invalid', () => {
  assert.strictEqual(isInvalidAmount(null), false)
})

// ─── calculateNetWorth — zero state ──────────────────────────────────────────

console.log('\ncalculateNetWorth — zero state')

test('all empty rows returns ok:true', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows() })
  assert.strictEqual(r.ok, true)
})

test('all empty rows returns isEmpty:true', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows() })
  assert.strictEqual(r.isEmpty, true)
})

test('all empty rows returns 0 totals', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows() })
  assert.strictEqual(r.totalAssets, 0)
  assert.strictEqual(r.totalLiabilities, 0)
  assert.strictEqual(r.netWorth, 0)
})

// ─── calculateNetWorth — assets only ─────────────────────────────────────────

console.log('\ncalculateNetWorth — assets only')

test('single cash row: totalAssets = amount', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: singleRow('cash', '25000') })
  assert.ok(Math.abs(r.totalAssets - 25000) < 1)
  assert.strictEqual(r.totalLiabilities, 0)
  assert.ok(Math.abs(r.netWorth - 25000) < 1)
})

test('multiple asset rows summed correctly', () => {
  const rows = emptyRows()
  rows.cash = { amount: '10000', currency: 'GBP' }
  rows.investments = { amount: '20000', currency: 'GBP' }
  rows.pensions = { amount: '30000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(Math.abs(r.totalAssets - 60000) < 1)
  assert.ok(Math.abs(r.netWorth - 60000) < 1)
})

test('isEmpty false when assets present', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: singleRow('cash', '1000') })
  assert.strictEqual(r.isEmpty, false)
})

// ─── calculateNetWorth — liabilities only ────────────────────────────────────

console.log('\ncalculateNetWorth — liabilities only')

test('single mortgage row: negative net worth', () => {
  const rows = emptyRows()
  rows.mortgage = { amount: '200000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.totalAssets, 0)
  assert.ok(Math.abs(r.totalLiabilities - 200000) < 1)
  assert.ok(Math.abs(r.netWorth - (-200000)) < 1)
})

test('liabilities only: isEmpty is false', () => {
  const rows = emptyRows()
  rows.loans = { amount: '5000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.isEmpty, false)
})

// ─── calculateNetWorth — mixed ────────────────────────────────────────────────

console.log('\ncalculateNetWorth — mixed assets and liabilities')

test('net worth = totalAssets - totalLiabilities', () => {
  const rows = emptyRows()
  rows.cash = { amount: '50000', currency: 'GBP' }
  rows.property = { amount: '300000', currency: 'GBP' }
  rows.mortgage = { amount: '180000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(Math.abs(r.totalAssets - 350000) < 1)
  assert.ok(Math.abs(r.totalLiabilities - 180000) < 1)
  assert.ok(Math.abs(r.netWorth - 170000) < 1)
})

test('netWorth + totalLiabilities = totalAssets', () => {
  const rows = emptyRows()
  rows.investments = { amount: '75000', currency: 'GBP' }
  rows.loans = { amount: '12000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(Math.abs(r.netWorth + r.totalLiabilities - r.totalAssets) < 0.01)
})

// ─── calculateNetWorth — breakdown ───────────────────────────────────────────

console.log('\ncalculateNetWorth — breakdown')

test('assetBreakdown contains all asset keys', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows() })
  for (const { key } of ASSET_ROWS) {
    assert.ok(key in r.assetBreakdown, `Missing asset key: ${key}`)
  }
})

test('liabilityBreakdown contains all liability keys', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows() })
  for (const { key } of LIABILITY_ROWS) {
    assert.ok(key in r.liabilityBreakdown, `Missing liability key: ${key}`)
  }
})

test('breakdown pct sums to ~100 for non-zero totals', () => {
  const rows = emptyRows()
  rows.cash = { amount: '20000', currency: 'GBP' }
  rows.investments = { amount: '30000', currency: 'GBP' }
  rows.pensions = { amount: '50000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  const total = Object.values(r.assetBreakdown).reduce((s, v) => s + v.pct, 0)
  assert.ok(Math.abs(total - 100) < 0.01, `Pcts sum to ${total}`)
})

test('breakdown pct is 0 when group total is 0', () => {
  const rows = emptyRows()
  rows.cash = { amount: '10000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  for (const { key } of LIABILITY_ROWS) {
    assert.strictEqual(r.liabilityBreakdown[key].pct, 0)
  }
})

test('cash = 100% when only asset', () => {
  const rows = emptyRows()
  rows.cash = { amount: '50000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(Math.abs(r.assetBreakdown.cash.pct - 100) < 0.01)
})

test('breakdown amountBase matches converted amount', () => {
  const rows = emptyRows()
  rows.investments = { amount: '40000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(Math.abs(r.assetBreakdown.investments.amountBase - 40000) < 1)
})

// ─── calculateNetWorth — multi-currency ──────────────────────────────────────

console.log('\ncalculateNetWorth — multi-currency')

test('hasMultiCurrency false when all rows use base currency', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows('GBP') })
  assert.strictEqual(r.hasMultiCurrency, false)
})

test('hasMultiCurrency true when any row differs from base', () => {
  const rows = emptyRows('GBP')
  rows.investments = { amount: '10000', currency: 'USD' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.hasMultiCurrency, true)
})

test('USD amount converted to GBP correctly', () => {
  const rows = emptyRows('GBP')
  rows.cash = { amount: '10000', currency: 'USD' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  const expected = convertToBase(10000, 'USD', 'GBP')
  assert.ok(Math.abs(r.totalAssets - expected) < 1)
})

test('EUR base currency: GBP row converted to EUR', () => {
  const rows = emptyRows('EUR')
  rows.cash = { amount: '1000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'EUR', rows })
  const expected = convertToBase(1000, 'GBP', 'EUR')
  assert.ok(Math.abs(r.totalAssets - expected) < 0.1)
})

test('multiple currencies summed in base currency', () => {
  const rows = emptyRows('GBP')
  rows.cash = { amount: '10000', currency: 'GBP' }
  rows.investments = { amount: '10000', currency: 'USD' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  const expectedGbp = 10000
  const expectedUsd = convertToBase(10000, 'USD', 'GBP')
  assert.ok(Math.abs(r.totalAssets - (expectedGbp + expectedUsd)) < 1)
})

// ─── calculateNetWorth — invalid inputs ───────────────────────────────────────

console.log('\ncalculateNetWorth — invalid inputs')

test('invalid amount treated as 0', () => {
  const rows = emptyRows()
  rows.cash = { amount: 'abc', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.totalAssets, 0)
})

test('negative amount treated as 0', () => {
  const rows = emptyRows()
  rows.investments = { amount: '-500', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.totalAssets, 0)
})

test('invalid row key tracked in invalidRows', () => {
  const rows = emptyRows()
  rows.cash = { amount: 'xyz', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(r.invalidRows.includes('cash'))
})

test('negative input tracked in invalidRows', () => {
  const rows = emptyRows()
  rows.mortgage = { amount: '-1000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.ok(r.invalidRows.includes('mortgage'))
})

test('empty rows have no invalid entries', () => {
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows: emptyRows() })
  assert.strictEqual(r.invalidRows.length, 0)
})

// ─── calculateNetWorth — edge cases ──────────────────────────────────────────

console.log('\ncalculateNetWorth — edge cases')

test('large values do not throw', () => {
  const rows = emptyRows()
  rows.property = { amount: '10000000', currency: 'GBP' }
  rows.mortgage = { amount: '8000000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.ok, true)
  assert.ok(r.netWorth > 0)
})

test('unrecognised base currency falls back to GBP', () => {
  const rows = emptyRows()
  rows.cash = { amount: '1000', currency: 'GBP' }
  const r = calculateNetWorth({ baseCurrency: 'XYZ', rows })
  assert.strictEqual(r.ok, true)
  // Should not throw; falls back to GBP treatment
  assert.ok(r.totalAssets >= 0)
})

test('unrecognised row currency falls back to base', () => {
  const rows = emptyRows()
  rows.cash = { amount: '1000', currency: 'ZZZ' }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.ok, true)
})

test('missing row handled gracefully', () => {
  // Provide only some rows
  const rows = { cash: { amount: '5000', currency: 'GBP' } }
  const r = calculateNetWorth({ baseCurrency: 'GBP', rows })
  assert.strictEqual(r.ok, true)
  assert.ok(r.totalAssets >= 5000)
})

test('all currency codes are in APPROX_RATES_TO_GBP', () => {
  for (const c of CURRENCIES) {
    assert.ok(c in APPROX_RATES_TO_GBP, `Missing rate for ${c}`)
  }
})

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
