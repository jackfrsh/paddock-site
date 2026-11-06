/**
 * Retirement age calculator: pure computation module.
 *
 * Finds the earliest age at which a projected pot covers the income wanted,
 * working in today's money (real terms). No side effects, no I/O, so it runs in
 * the browser and in Node tests, and nothing the user types leaves the page.
 *
 * Model (kept deliberately simple so it can be explained on the page):
 *  - Real return = (1 + nominal return) / (1 + inflation) - 1.
 *  - Contributions are paid at the end of each year and rise with inflation,
 *    so they are constant in today's money. They stop at retirement.
 *  - Pot at age a = savings and contributions grown at the real return.
 *  - Needed at age a = bridge + sustainable pot.
 *      bridge          = years from a to State Pension age x income wanted.
 *                        Drawn from the pot with no growth assumed, which is
 *                        deliberately cautious.
 *      sustainable pot = (income wanted - State Pension) / withdrawal rate,
 *                        needed from State Pension age onwards.
 *  - The earliest age is the first age (counting up from the current age) at
 *    which the pot is at least what is needed.
 *
 * All rates are decimals (4% = 0.04). All money is GBP in today's prices.
 */

export const MAX_AGE = 75

export const ERRORS = {
  AGE_RANGE: 'Current age must be between 18 and 74.',
  SAVINGS_NEGATIVE: 'Current savings cannot be negative.',
  CONTRIBUTIONS_NEGATIVE: 'Annual contributions cannot be negative.',
  RETURN_RANGE: 'Expected annual return must be between 0% and 20%.',
  INFLATION_RANGE: 'Inflation must be between 0% and 15%.',
  INCOME_POSITIVE: 'Income wanted must be more than zero.',
  STATE_PENSION_NEGATIVE: 'State Pension cannot be negative.',
  STATE_PENSION_AGE_RANGE: 'State Pension age must be between 55 and 75.',
  WITHDRAWAL_RATE_RANGE: 'Withdrawal rate must be between 0.5% and 20%.',
}

export function validateInputs(inputs) {
  const {
    currentAge, currentSavings, annualContributions, annualReturn, inflation,
    incomeWanted, statePension, statePensionAge, withdrawalRate,
  } = inputs
  const ok = (v) => typeof v === 'number' && Number.isFinite(v)
  const errors = []

  if (!ok(currentAge) || currentAge < 18 || currentAge >= MAX_AGE) errors.push(ERRORS.AGE_RANGE)
  if (!ok(currentSavings) || currentSavings < 0) errors.push(ERRORS.SAVINGS_NEGATIVE)
  if (!ok(annualContributions) || annualContributions < 0) errors.push(ERRORS.CONTRIBUTIONS_NEGATIVE)
  if (!ok(annualReturn) || annualReturn < 0 || annualReturn > 0.2) errors.push(ERRORS.RETURN_RANGE)
  if (!ok(inflation) || inflation < 0 || inflation > 0.15) errors.push(ERRORS.INFLATION_RANGE)
  if (!ok(incomeWanted) || incomeWanted <= 0) errors.push(ERRORS.INCOME_POSITIVE)
  if (!ok(statePension) || statePension < 0) errors.push(ERRORS.STATE_PENSION_NEGATIVE)
  if (!ok(statePensionAge) || statePensionAge < 55 || statePensionAge > 75) errors.push(ERRORS.STATE_PENSION_AGE_RANGE)
  if (!ok(withdrawalRate) || withdrawalRate < 0.005 || withdrawalRate > 0.2) errors.push(ERRORS.WITHDRAWAL_RATE_RANGE)

  return errors
}

export function realReturn(annualReturn, inflation) {
  return (1 + annualReturn) / (1 + inflation) - 1
}

/** Pot after `years` of growth at real rate g, with a contribution at each year end. */
export function potAfter(years, savings, contribution, g) {
  if (years <= 0) return savings
  if (Math.abs(g) < 1e-12) return savings + contribution * years
  const growth = (1 + g) ** years
  return savings * growth + contribution * ((growth - 1) / g)
}

/** What the pot must hold when stopping work at `age`. */
export function neededAt(age, { incomeWanted, statePension, statePensionAge, withdrawalRate }) {
  const bridgeYears = Math.max(statePensionAge - age, 0)
  const fromPotAfterSpa = Math.max(incomeWanted - statePension, 0)
  return bridgeYears * incomeWanted + fromPotAfterSpa / withdrawalRate
}

export function calculateRetirementAge(inputs) {
  const errors = validateInputs(inputs)
  if (errors.length) return { ok: false, errors }

  const g = realReturn(inputs.annualReturn, inputs.inflation)
  const rows = []
  let earliestAge = null

  for (let age = Math.floor(inputs.currentAge); age <= MAX_AGE; age++) {
    const years = age - Math.floor(inputs.currentAge)
    const pot = potAfter(years, inputs.currentSavings, inputs.annualContributions, g)
    const needed = neededAt(age, inputs)
    const reached = pot >= needed - 1e-9
    rows.push({ age, pot, needed, fundedPct: needed > 0 ? (pot / needed) * 100 : 100, reached })
    if (reached && earliestAge === null) earliestAge = age
  }

  const last = rows[rows.length - 1]
  return {
    ok: true,
    realReturn: g,
    earliestAge,
    yearsToGo: earliestAge === null ? null : earliestAge - Math.floor(inputs.currentAge),
    rows,
    potAtMaxAge: last.pot,
    neededAtMaxAge: last.needed,
    shortfallAtMaxAge: Math.max(last.needed - last.pot, 0),
    sustainablePotAfterSpa:
      Math.max(inputs.incomeWanted - inputs.statePension, 0) / inputs.withdrawalRate,
  }
}
