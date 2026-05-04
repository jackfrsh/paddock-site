import assert from 'node:assert/strict'
import { calculateRetirementBridge } from './retirementBridgeCalc.js'

let passed = 0
let failed = 0

function test(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed += 1
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message}`)
    failed += 1
  }
}

function base(overrides = {}) {
  return {
    currentAge: 46,
    retirementAge: 55,
    privatePensionAccessAge: 57,
    statePensionAge: 67,
    annualSpendingToday: 30000,
    currentBridgeAssets: 40000,
    monthlyBridgeContribution: 500,
    expectedAnnualGrowth: 5,
    inflationAssumption: 2.5,
    partTimeAnnualIncome: 0,
    safetyBuffer: 10,
    ...overrides,
  }
}

console.log('\nRetirement bridge calculation')

test('returns no bridge needed when stop-work age is at pension access age', () => {
  const result = calculateRetirementBridge(base({
    retirementAge: 57,
    privatePensionAccessAge: 57,
  }))
  assert.strictEqual(result.ok, true)
  assert.strictEqual(result.status, 'no_bridge_needed')
  assert.strictEqual(result.bridgeYears, 0)
  assert.strictEqual(result.requiredBridgePot, 0)
})

test('returns on-track bridge when projected accessible assets exceed the need', () => {
  const result = calculateRetirementBridge(base({
    currentBridgeAssets: 100000,
    monthlyBridgeContribution: 1000,
  }))
  assert.strictEqual(result.ok, true)
  assert.ok(['on_track', 'close'].includes(result.status))
  assert.ok(result.projectedBridgePotAtRetirement >= result.requiredBridgePot)
})

test('returns shortfall bridge when accessible assets are too low', () => {
  const result = calculateRetirementBridge(base({
    currentBridgeAssets: 0,
    monthlyBridgeContribution: 0,
  }))
  assert.strictEqual(result.ok, true)
  assert.strictEqual(result.status, 'shortfall')
  assert.ok(result.surplusOrShortfall < 0)
  assert.ok(result.monthlyContributionNeeded > 0)
})

test('handles 0% growth safely', () => {
  const result = calculateRetirementBridge(base({
    expectedAnnualGrowth: 0,
  }))
  assert.strictEqual(result.ok, true)
  assert.ok(Number.isFinite(result.projectedBridgePotAtRetirement))
  assert.ok(Number.isFinite(result.requiredBridgePot))
  assert.ok(Number.isFinite(result.monthlyContributionNeeded))
})

test('handles high inflation safely', () => {
  const result = calculateRetirementBridge(base({
    inflationAssumption: 10,
  }))
  assert.strictEqual(result.ok, true)
  assert.ok(result.annualSpendingAtRetirement > base().annualSpendingToday)
  assert.ok(Number.isFinite(result.requiredBridgePot))
})

if (failed > 0) {
  console.error(`\n${failed} failed, ${passed} passed`)
  process.exit(1)
}

console.log(`\n${passed} passed`)
