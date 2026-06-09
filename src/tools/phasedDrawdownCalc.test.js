/**
 * Tests for the phased drawdown calculator.
 * Run with: node src/tools/phasedDrawdownCalc.test.js
 */

import {
  calculatePhasedDrawdown,
  validatePhasedInputs,
  realReturnRate,
  PHASED_ERRORS,
  LATE_PHASE_AGE,
} from './phasedDrawdownCalc.js'

let passed = 0
let failed = 0

function assert(label, cond) {
  if (cond) {
    passed += 1
  } else {
    failed += 1
    console.error(`✗ FAIL: ${label}`)
  }
}

function approx(a, b, tol = 1) {
  return Math.abs(a - b) <= tol
}

const BASE = {
  currentAge: '46',
  retirementAge: '62',
  statePensionAge: '68',
  planningAge: '95',
  currentPot: '500000',
  expectedReturn: '5',
  inflation: '2.5',
  statePensionAmount: '12548',
  incomeEarly: '40000',
  incomeMid: '40000',
  incomeLate: '30000',
}

// ─── realReturnRate ─────────────────────────────────────────────────────────
assert('real return of 5% nominal / 2.5% inflation ≈ 2.44%',
  approx(realReturnRate(0.05, 0.025), 0.02439, 0.0001))
assert('real return with zero inflation equals nominal',
  approx(realReturnRate(0.05, 0), 0.05, 0.0001))

// ─── Validation ───────────────────────────────────────────────────────────
assert('base inputs are valid', validatePhasedInputs(BASE).length === 0)

assert('current age out of range flagged',
  validatePhasedInputs({ ...BASE, currentAge: '12' }).includes(PHASED_ERRORS.CURRENT_AGE_RANGE))

assert('retirement before current age flagged',
  validatePhasedInputs({ ...BASE, currentAge: '60', retirementAge: '55' })
    .includes(PHASED_ERRORS.RETIREMENT_AGE_ORDER))

assert('planning age not after retirement flagged',
  validatePhasedInputs({ ...BASE, retirementAge: '62', planningAge: '60' })
    .includes(PHASED_ERRORS.PLANNING_AGE_ORDER))

assert('state pension age out of range flagged',
  validatePhasedInputs({ ...BASE, statePensionAge: '50' })
    .includes(PHASED_ERRORS.STATE_PENSION_AGE_RANGE))

assert('negative pot flagged',
  validatePhasedInputs({ ...BASE, currentPot: '-1' }).includes(PHASED_ERRORS.POT_NEGATIVE))

assert('return over 15% flagged',
  validatePhasedInputs({ ...BASE, expectedReturn: '20' }).includes(PHASED_ERRORS.RETURN_RANGE))

assert('negative late income flagged',
  validatePhasedInputs({ ...BASE, incomeLate: '-5' }).includes(PHASED_ERRORS.INCOME_LATE_NEGATIVE))

assert('SP age earlier than retirement is NOT an error',
  validatePhasedInputs({ ...BASE, statePensionAge: '60', retirementAge: '62' }).length === 0)

// ─── Base scenario ──────────────────────────────────────────────────────────
const r = calculatePhasedDrawdown(BASE)
assert('base scenario computes ok', r.ok === true)
assert('bridge is 6 years (62→68)', r.bridgeYears === 6)
assert('bridge funding before growth = 6 × £40k = £240k',
  r.bridgeFundingBeforeGrowth === 240000)
assert('private income after SP = £40k − £12,548 = £27,452',
  r.privateIncomeAfterStatePension === 27452)
assert('pot at retirement grew above starting pot (positive real return)',
  r.potAtRetirement > 500000)
assert('series starts at retirement age', r.series[0].age === 62)
assert('series ends at planning age', r.series[r.series.length - 1].age === 95)
assert('rows cover 62..94 inclusive (33 years)', r.rows.length === 33)
assert('first row income target is early income', r.rows[0].incomeTarget === 40000)
assert('first row has no state pension', r.rows[0].statePension === 0)
assert('first row private draw equals full early income', r.rows[0].privateDraw === 40000)

// Row at exactly State Pension age (68) should receive State Pension.
const rowAtSP = r.rows.find((x) => x.age === 68)
assert('row at SP age receives state pension', rowAtSP.statePension === 12548)
assert('row at SP age private draw drops to ~£27,452', rowAtSP.privateDraw === 27452)

// Row at the late-phase boundary (75) should use late income.
const rowAt75 = r.rows.find((x) => x.age === LATE_PHASE_AGE)
assert('row at 75 uses late income target', rowAt75.incomeTarget === 30000)
assert('row at 75 private draw = £30k − £12,548 = £17,452', rowAt75.privateDraw === 17452)

// ─── Phased vs flat comparison ────────────────────────────────────────────
assert('phased draws less in total than flat (lower late income)',
  r.comparison.drawSavings > 0)
assert('phased leaves at least as much at planning age as flat OR lasts longer',
  r.comparison.extraAtPlanning >= 0 || r.comparison.yearsLonger >= 0)

// With identical incomes in every phase, phased == flat exactly.
const equalPhases = calculatePhasedDrawdown({
  ...BASE, incomeEarly: '30000', incomeMid: '30000', incomeLate: '30000',
})
assert('equal phases → zero draw savings vs flat',
  equalPhases.comparison.drawSavings === 0)
assert('equal phases → same remaining pot as flat',
  equalPhases.remainingAtPlanning === equalPhases.flat.remainingAtPlanning)

// ─── Pot exhaustion ───────────────────────────────────────────────────────
const broke = calculatePhasedDrawdown({
  ...BASE, currentPot: '150000', incomeEarly: '50000', incomeMid: '50000', incomeLate: '45000',
})
assert('aggressive plan exhausts the pot', broke.exhaustedAge !== null)
assert('exhausted age is within the projection window',
  broke.exhaustedAge >= 62 && broke.exhaustedAge <= 95)
assert('remaining at planning is zero when exhausted', broke.remainingAtPlanning === 0)

// A very large pot with modest income should survive to planning age.
const comfy = calculatePhasedDrawdown({ ...BASE, currentPot: '2000000', incomeEarly: '30000', incomeMid: '30000', incomeLate: '25000' })
assert('large pot survives to planning age', comfy.exhaustedAge === null)
assert('large pot leaves money at planning age', comfy.remainingAtPlanning > 0)

// ─── No-bridge case (SP age <= retirement age) ────────────────────────────
const noBridge = calculatePhasedDrawdown({ ...BASE, statePensionAge: '62', retirementAge: '62' })
assert('no bridge years when SP age equals retirement age', noBridge.bridgeYears === 0)
assert('no bridge funding required', noBridge.bridgeFundingBeforeGrowth === 0)
assert('first row already receives state pension when no bridge',
  noBridge.rows[0].statePension === 12548)

// ─── Drawdown percentage stats ──────────────────────────────────────────────
assert('highest drawdown pct is a fraction between 0 and 1',
  r.highestDrawdownPct > 0 && r.highestDrawdownPct < 1)
assert('average drawdown pct ≤ highest drawdown pct',
  r.averageDrawdownPct <= r.highestDrawdownPct + 1e-9)

// ─── Summary ────────────────────────────────────────────────────────────────
console.log(`\nphasedDrawdownCalc: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
