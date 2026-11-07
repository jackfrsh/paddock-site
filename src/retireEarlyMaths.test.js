import assert from 'node:assert/strict'
import {
  monthlyRate, targetPot, potAfter, monthlySavingNeeded, totalPaidIn,
} from './retireEarlyMaths.js'

let passed = 0
let failed = 0
function test(name, fn) {
  try {
    fn()
    passed += 1
  } catch (err) {
    failed += 1
    console.error(`FAIL ${name}\n  ${err.message}`)
  }
}
const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} is not within ${tol} of ${b}`)

// Month-by-month simulation, independent of the closed-form formula.
function simulate({ startingPot, monthly, years, annualRate }) {
  const r = Math.pow(1 + annualRate, 1 / 12) - 1
  let pot = startingPot
  for (let m = 0; m < Math.round(years * 12); m += 1) pot = pot * (1 + r) + monthly
  return pot
}

test('target pot is the yearly spend divided by the withdrawal rate', () => {
  assert.equal(targetPot(30000, 0.04), 750000)
  close(targetPot(30000, 0.035), 857142.857, 0.001)
})

test('monthly rate compounds back to the annual rate', () => {
  close(Math.pow(1 + monthlyRate(0.04), 12), 1.04, 1e-12)
})

test('potAfter matches a month-by-month simulation', () => {
  for (const args of [
    { startingPot: 0, monthly: 500, years: 20, annualRate: 0.04 },
    { startingPot: 25000, monthly: 800, years: 25, annualRate: 0.03 },
    { startingPot: 10000, monthly: 250, years: 7.5, annualRate: 0.05 },
  ]) {
    close(potAfter(args), simulate(args), 1e-6)
  }
})

test('zero growth is simple addition', () => {
  assert.equal(potAfter({ startingPot: 1000, monthly: 100, years: 2, annualRate: 0 }), 3400)
  assert.equal(monthlySavingNeeded({ target: 3400, startingPot: 1000, years: 2, annualRate: 0 }), 100)
})

test('monthlySavingNeeded reaches the target when fed back in', () => {
  for (const args of [
    { target: 750000, startingPot: 0, years: 20, annualRate: 0.04 },
    { target: 1000000, startingPot: 50000, years: 30, annualRate: 0.03 },
    { target: 500000, startingPot: 100000, years: 10, annualRate: 0.05 },
  ]) {
    const monthly = monthlySavingNeeded(args)
    close(simulate({ ...args, monthly }), args.target, 1e-4)
  }
})

test('golden value: £1,000,000 in 20 years at 4% real from nothing', () => {
  // (1.04^20 - 1) / ((1.04^(1/12)) - 1) = 363.8..., so the payment is about £2,748.
  const monthly = monthlySavingNeeded({ target: 1000000, years: 20, annualRate: 0.04 })
  assert.equal(Math.round(monthly), 2748)
})

test('a starting pot that already grows past the target needs nothing', () => {
  assert.equal(monthlySavingNeeded({ target: 100000, startingPot: 100000, years: 10, annualRate: 0.04 }), 0)
})

test('more years or a higher return always lowers the payment', () => {
  const base = { target: 750000, startingPot: 20000, annualRate: 0.04 }
  const a = monthlySavingNeeded({ ...base, years: 20 })
  const b = monthlySavingNeeded({ ...base, years: 25 })
  const c = monthlySavingNeeded({ ...base, years: 20, annualRate: 0.05 })
  assert.ok(b < a && c < a)
})

test('total paid in excludes growth', () => {
  assert.equal(totalPaidIn({ startingPot: 5000, monthly: 100, years: 10 }), 17000)
})

console.log(`retireEarlyMaths: ${passed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
