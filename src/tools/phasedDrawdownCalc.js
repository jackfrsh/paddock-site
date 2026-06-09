/**
 * Phased (scalable) pension drawdown calculator — pure computation module.
 *
 * The distinctive idea: most drawdown tools assume a flat income for life.
 * This one models retirement in three spending phases, because real spending
 * often falls as people age:
 *
 *   Phase 1  retirement age → State Pension age   (the "bridge", funded entirely
 *                                                   from the private pot)
 *   Phase 2  State Pension age → age 75            (active years, State Pension
 *                                                   now offsets part of the need)
 *   Phase 3  age 75 onwards                        (typically lower spending)
 *
 * MODELLING BASIS — TODAY'S MONEY (real terms)
 * ---------------------------------------------
 * Everything is expressed in today's money. We convert the user's nominal
 * return and inflation assumptions into a single real return:
 *
 *     realReturn = (1 + nominalReturn) / (1 + inflation) - 1
 *
 * Because we work in real terms, the income targets and the State Pension are
 * held constant in today's-money terms across the projection (i.e. they are
 * assumed to rise broadly in line with inflation — a reasonable simplification
 * given the State Pension triple lock and the way people think about target
 * income). This keeps the output intuitive: "£40,000/year" means £40,000 of
 * today's spending power at every age.
 *
 * All monetary values are GBP (£). All rates are decimals (5% → 0.05) once
 * normalised. No side effects, no I/O — safe in browser or Node.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

// The boundary for the third spending phase. Fixed by the product brief.
export const LATE_PHASE_AGE = 75

export const PHASED_ERRORS = {
  CURRENT_AGE_RANGE: 'Current age must be between 18 and 80.',
  RETIREMENT_AGE_ORDER: 'Retirement age must be the same as or later than your current age.',
  RETIREMENT_AGE_MAX: 'Retirement age must be 90 or under.',
  PLANNING_AGE_ORDER: 'Planning age must be later than your retirement age.',
  PLANNING_AGE_MAX: 'Planning age must be 105 or under.',
  STATE_PENSION_AGE_RANGE: 'State Pension age must be between 60 and 75.',
  POT_NEGATIVE: 'Pension pot cannot be negative.',
  RETURN_RANGE: 'Expected annual return must be between 0% and 15%.',
  INFLATION_RANGE: 'Inflation assumption must be between 0% and 10%.',
  STATE_PENSION_NEGATIVE: 'State Pension amount cannot be negative.',
  INCOME_EARLY_NEGATIVE: 'Income from retirement to State Pension cannot be negative.',
  INCOME_MID_NEGATIVE: 'Income from State Pension to 75 cannot be negative.',
  INCOME_LATE_NEGATIVE: 'Income from 75 onwards cannot be negative.',
}

// ─── Input parsing ──────────────────────────────────────────────────────────

function num(value) {
  if (value === '' || value === null || value === undefined) return NaN
  const n = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(n) ? n : NaN
}

/**
 * Validate all inputs. Returns an array of error strings (empty = valid).
 * Note: a State Pension age earlier than retirement age is NOT an error — it
 * simply means there is no bridge period, which we handle gracefully.
 */
export function validatePhasedInputs(inputs) {
  const errors = []
  const ok = (v) => Number.isFinite(v)

  const currentAge = num(inputs.currentAge)
  const retirementAge = num(inputs.retirementAge)
  const planningAge = num(inputs.planningAge)
  const statePensionAge = num(inputs.statePensionAge)
  const pot = num(inputs.currentPot)
  const annualReturn = num(inputs.expectedReturn)
  const inflation = num(inputs.inflation)
  const statePension = num(inputs.statePensionAmount)
  const incomeEarly = num(inputs.incomeEarly)
  const incomeMid = num(inputs.incomeMid)
  const incomeLate = num(inputs.incomeLate)

  if (!ok(currentAge) || currentAge < 18 || currentAge > 80) errors.push(PHASED_ERRORS.CURRENT_AGE_RANGE)

  if (!ok(retirementAge) || (ok(currentAge) && retirementAge < currentAge)) {
    errors.push(PHASED_ERRORS.RETIREMENT_AGE_ORDER)
  }
  if (ok(retirementAge) && retirementAge > 90) errors.push(PHASED_ERRORS.RETIREMENT_AGE_MAX)

  if (!ok(planningAge) || (ok(retirementAge) && planningAge <= retirementAge)) {
    errors.push(PHASED_ERRORS.PLANNING_AGE_ORDER)
  }
  if (ok(planningAge) && planningAge > 105) errors.push(PHASED_ERRORS.PLANNING_AGE_MAX)

  if (!ok(statePensionAge) || statePensionAge < 60 || statePensionAge > 75) {
    errors.push(PHASED_ERRORS.STATE_PENSION_AGE_RANGE)
  }

  if (!ok(pot) || pot < 0) errors.push(PHASED_ERRORS.POT_NEGATIVE)
  if (!ok(annualReturn) || annualReturn < 0 || annualReturn > 15) errors.push(PHASED_ERRORS.RETURN_RANGE)
  if (!ok(inflation) || inflation < 0 || inflation > 10) errors.push(PHASED_ERRORS.INFLATION_RANGE)
  if (!ok(statePension) || statePension < 0) errors.push(PHASED_ERRORS.STATE_PENSION_NEGATIVE)
  if (!ok(incomeEarly) || incomeEarly < 0) errors.push(PHASED_ERRORS.INCOME_EARLY_NEGATIVE)
  if (!ok(incomeMid) || incomeMid < 0) errors.push(PHASED_ERRORS.INCOME_MID_NEGATIVE)
  if (!ok(incomeLate) || incomeLate < 0) errors.push(PHASED_ERRORS.INCOME_LATE_NEGATIVE)

  return errors
}

// ─── Core maths ───────────────────────────────────────────────────────────────

/** Real (today's-money) return derived from nominal return and inflation. */
export function realReturnRate(nominalReturn, inflation) {
  return (1 + nominalReturn) / (1 + inflation) - 1
}

/**
 * Income target for a given age under the phased plan.
 *
 * Boundaries are evaluated in order so the model stays sensible even when the
 * State Pension age sits above 75 or below the retirement age:
 *   - below State Pension age   → early (bridge) income
 *   - below 75                  → mid income
 *   - otherwise                 → late income
 */
function phasedIncomeForAge(age, statePensionAge, incomeEarly, incomeMid, incomeLate) {
  if (age < statePensionAge) return incomeEarly
  if (age < LATE_PHASE_AGE) return incomeMid
  return incomeLate
}

/**
 * Run a year-by-year drawdown from retirement age to planning age.
 *
 * Calculation order each year (documented, illustrative):
 *   1. Start with the pot at the beginning of the year.
 *   2. Receive State Pension if at/over State Pension age.
 *   3. Withdraw the private drawdown needed = max(incomeTarget − statePension, 0).
 *   4. Apply real investment growth to the remaining pot.
 *   5. Store the ending pot.
 *
 * @param incomeForAge  (age) => income target for that age (lets us reuse this
 *                      for both the phased plan and the flat comparison)
 * @returns { rows, exhaustedAge, remainingAtPlanning, totalPrivateDraw,
 *            highestDrawdownPct, averageDrawdownPct }
 */
function runDrawdown({ startPot, retirementAge, planningAge, statePensionAge, statePension, realReturn, incomeForAge }) {
  const rows = []
  let pot = startPot
  let exhaustedAge = null
  let totalPrivateDraw = 0
  let drawdownPctSum = 0
  let drawdownPctCount = 0
  let highestDrawdownPct = 0

  // One row per year of life from retirement age up to (but not including)
  // planning age. Each row's endingPot is the pot at the following birthday.
  for (let age = retirementAge; age < planningAge; age += 1) {
    const startingPot = Math.max(0, pot)
    const incomeTarget = incomeForAge(age)
    const statePensionReceived = age >= statePensionAge ? statePension : 0
    const privateDraw = Math.max(0, incomeTarget - statePensionReceived)

    // Drawdown percentage of the starting pot (only meaningful while solvent).
    const drawdownPct = startingPot > 0 ? privateDraw / startingPot : null
    if (drawdownPct !== null) {
      drawdownPctSum += drawdownPct
      drawdownPctCount += 1
      if (drawdownPct > highestDrawdownPct) highestDrawdownPct = drawdownPct
    }

    let afterWithdrawal = startingPot - privateDraw
    let shortfall = 0
    if (afterWithdrawal < 0) {
      // The pot could not fund the full private drawdown this year.
      shortfall = -afterWithdrawal
      afterWithdrawal = 0
      if (exhaustedAge === null) exhaustedAge = age
    }

    const actualPrivateDraw = privateDraw - shortfall
    totalPrivateDraw += actualPrivateDraw

    const endingPot = afterWithdrawal * (1 + realReturn)
    pot = endingPot

    rows.push({
      age,
      startingPot: Math.round(startingPot),
      incomeTarget: Math.round(incomeTarget),
      statePension: Math.round(statePensionReceived),
      privateDraw: Math.round(privateDraw),
      endingPot: Math.round(endingPot),
      drawdownPct,
      depleted: exhaustedAge !== null && age >= exhaustedAge,
    })
  }

  // Final point at the planning age itself (pot remaining after the last year).
  const remainingAtPlanning = Math.round(Math.max(0, pot))

  return {
    rows,
    exhaustedAge,
    remainingAtPlanning,
    totalPrivateDraw: Math.round(totalPrivateDraw),
    highestDrawdownPct,
    averageDrawdownPct: drawdownPctCount > 0 ? drawdownPctSum / drawdownPctCount : 0,
  }
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Main entry point. Validates, then runs both the phased plan and a flat-income
 * comparison, plus headline aggregates.
 *
 * Returns either { ok: false, errors } or a rich { ok: true, ... } result.
 */
export function calculatePhasedDrawdown(inputs) {
  const errors = validatePhasedInputs(inputs)
  if (errors.length > 0) return { ok: false, errors }

  const currentAge = num(inputs.currentAge)
  const retirementAge = num(inputs.retirementAge)
  const planningAge = num(inputs.planningAge)
  const statePensionAge = num(inputs.statePensionAge)
  const currentPot = num(inputs.currentPot)
  const nominalReturn = num(inputs.expectedReturn) / 100
  const inflation = num(inputs.inflation) / 100
  const statePension = num(inputs.statePensionAmount)
  const incomeEarly = num(inputs.incomeEarly)
  const incomeMid = num(inputs.incomeMid)
  const incomeLate = num(inputs.incomeLate)

  const realReturn = realReturnRate(nominalReturn, inflation)

  // ── Grow today's pot to the retirement date ──
  // Assumption: no further contributions between now and retirement (kept
  // deliberately simple and conservative). Growth is in real terms.
  const yearsToRetirement = Math.max(0, retirementAge - currentAge)
  const potAtRetirement = currentPot * Math.pow(1 + realReturn, yearsToRetirement)

  // ── Phased plan ──
  const phased = runDrawdown({
    startPot: potAtRetirement,
    retirementAge,
    planningAge,
    statePensionAge,
    statePension,
    realReturn,
    incomeForAge: (age) => phasedIncomeForAge(age, statePensionAge, incomeEarly, incomeMid, incomeLate),
  })

  // ── Flat comparison ──
  // A flat plan takes the early-phase income (the "£40k for life" assumption)
  // every single year from retirement to planning age.
  const flat = runDrawdown({
    startPot: potAtRetirement,
    retirementAge,
    planningAge,
    statePensionAge,
    statePension,
    realReturn,
    incomeForAge: () => incomeEarly,
  })

  // ── Bridge (phase 1) aggregates ──
  // The bridge runs from retirement age to the earlier of State Pension age and
  // planning age. During the bridge there is no State Pension, so the private
  // drawdown equals the full early income each year.
  const bridgeEndAge = Math.min(statePensionAge, planningAge)
  const bridgeYears = Math.max(0, bridgeEndAge - retirementAge)
  const bridgeFundingBeforeGrowth = bridgeYears * incomeEarly

  // Private income needed once the State Pension starts (mid phase).
  const privateIncomeAfterStatePension = Math.max(0, incomeMid - statePension)

  // ── Comparison summary ──
  // savings = how much less the phased plan draws from the pot over the whole
  // retirement vs a flat plan. extraAtPlanning = difference in pot left at the
  // planning age. yearsLonger = how many more years the phased pot lasts.
  const drawSavings = flat.totalPrivateDraw - phased.totalPrivateDraw
  const extraAtPlanning = phased.remainingAtPlanning - flat.remainingAtPlanning
  const phasedLastsTo = phased.exhaustedAge === null ? planningAge : phased.exhaustedAge
  const flatLastsTo = flat.exhaustedAge === null ? planningAge : flat.exhaustedAge
  const yearsLonger = phasedLastsTo - flatLastsTo

  // Chart series: pot balance at the start of each age, plus a final point at
  // the planning age. Also carry per-year income/draw for an optional overlay.
  const series = phased.rows.map((r) => ({
    age: r.age,
    pot: r.startingPot,
    incomeTarget: r.incomeTarget,
    privateDraw: r.privateDraw,
    statePension: r.statePension,
  }))
  series.push({
    age: planningAge,
    pot: phased.remainingAtPlanning,
    incomeTarget: phasedIncomeForAge(planningAge, statePensionAge, incomeEarly, incomeMid, incomeLate),
    privateDraw: Math.max(0, phasedIncomeForAge(planningAge, statePensionAge, incomeEarly, incomeMid, incomeLate) - (planningAge >= statePensionAge ? statePension : 0)),
    statePension: planningAge >= statePensionAge ? statePension : 0,
  })

  return {
    ok: true,

    // Setup / context
    realReturn,
    potAtRetirement: Math.round(potAtRetirement),
    yearsToRetirement,

    // Bridge
    bridgeYears,
    bridgeFundingBeforeGrowth: Math.round(bridgeFundingBeforeGrowth),
    privateIncomeAfterStatePension: Math.round(privateIncomeAfterStatePension),

    // Phased plan outcome
    exhaustedAge: phased.exhaustedAge,
    remainingAtPlanning: phased.remainingAtPlanning,
    highestDrawdownPct: phased.highestDrawdownPct,
    averageDrawdownPct: phased.averageDrawdownPct,
    totalPrivateDraw: phased.totalPrivateDraw,
    rows: phased.rows,
    series,

    // Flat plan outcome (for the comparison)
    flat: {
      exhaustedAge: flat.exhaustedAge,
      remainingAtPlanning: flat.remainingAtPlanning,
      totalPrivateDraw: flat.totalPrivateDraw,
    },

    // Comparison summary
    comparison: {
      drawSavings: Math.round(drawSavings),
      extraAtPlanning: Math.round(extraAtPlanning),
      yearsLonger,
      flatExhaustedAge: flat.exhaustedAge,
      phasedExhaustedAge: phased.exhaustedAge,
    },

    // Echo key inputs for copy
    inputs: {
      currentAge, retirementAge, planningAge, statePensionAge,
      statePension, incomeEarly, incomeMid, incomeLate,
    },
  }
}
