/**
 * FIRE number calculator — pure computation module.
 *
 * All rates are decimals (e.g. 4% → 0.04).
 * All monetary values in GBP (£).
 * No side effects. No I/O. Safe to call in browser or Node.
 */

// ─── Validation ──────────────────────────────────────────────────────────────

export const ERRORS = {
  SPENDING_NEGATIVE: 'Annual spending cannot be negative.',
  PASSIVE_INCOME_NEGATIVE: 'Passive income cannot be negative.',
  WITHDRAWAL_RATE_RANGE: 'Withdrawal rate must be between 0.5% and 20%.',
  ASSETS_NEGATIVE: 'Current invested assets cannot be negative.',
  CONTRIBUTIONS_NEGATIVE: 'Annual contributions cannot be negative.',
  RETURN_RANGE: 'Expected annual return must be between 0% and 20%.',
}

/**
 * Validate all inputs. Returns an array of error strings (empty = valid).
 *
 * @param {object} inputs
 * @returns {string[]}
 */
export function validateInputs(inputs) {
  const {
    annualSpending,
    passiveIncome,
    withdrawalRate,
    currentAssets,
    annualContributions,
    annualReturn,
  } = inputs

  const errors = []
  const ok = (v) => isFinite(v) && !isNaN(v)

  if (!ok(annualSpending) || annualSpending < 0) errors.push(ERRORS.SPENDING_NEGATIVE)
  if (!ok(passiveIncome) || passiveIncome < 0) errors.push(ERRORS.PASSIVE_INCOME_NEGATIVE)
  if (!ok(withdrawalRate) || withdrawalRate < 0.005 || withdrawalRate > 0.2)
    errors.push(ERRORS.WITHDRAWAL_RATE_RANGE)
  if (!ok(currentAssets) || currentAssets < 0) errors.push(ERRORS.ASSETS_NEGATIVE)
  if (!ok(annualContributions) || annualContributions < 0)
    errors.push(ERRORS.CONTRIBUTIONS_NEGATIVE)
  if (!ok(annualReturn) || annualReturn < 0 || annualReturn > 0.2)
    errors.push(ERRORS.RETURN_RANGE)

  return errors
}

// ─── Core maths ──────────────────────────────────────────────────────────────

/**
 * Required portfolio for financial independence at a given withdrawal rate.
 * = max(annual_needed, 0) / withdrawal_rate
 */
function fireTarget(annualSpending, passiveIncome, rate) {
  const annualNeeded = Math.max(annualSpending - passiveIncome, 0)
  if (rate <= 0) return Infinity
  return Math.round(annualNeeded / rate)
}

/**
 * Simple deterministic years-to-FI estimate using annual compounding.
 *
 * Grows currentAssets at annualReturn and adds annualContributions each year
 * until balance >= target or maxYears is reached.
 *
 * Returns the integer year count, or null if not reachable within maxYears.
 */
function yearsToFIEstimate({
  currentAssets,
  annualContributions,
  annualReturn,
  target,
  maxYears = 60,
}) {
  if (target <= 0 || currentAssets >= target) return 0
  if (annualContributions <= 0 && annualReturn <= 0) return null

  let balance = currentAssets
  for (let year = 1; year <= maxYears; year++) {
    balance = balance * (1 + annualReturn) + annualContributions
    if (balance >= target) return year
  }
  return null // not reachable within model horizon
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Main entry point. Validates inputs then computes FIRE metrics.
 *
 * Returns:
 *   { ok: false, errors: string[] }
 *   { ok: true,
 *     annualNeeded, fireNumber, currentAssets, gap,
 *     progressPct, yearsToFI,
 *     comparison: [{ rate, rateLabel, fireNumber, gap, yearsToFI }] }
 *
 * yearsToFI is:
 *   0    — already FI (currentAssets >= fireNumber)
 *   N    — estimated years to reach target
 *   null — not meaningful (no growth) or not reachable within 60 years
 *
 * @param {object} inputs
 * @returns {object}
 */
export function calculateFire(inputs) {
  const errors = validateInputs(inputs)
  if (errors.length > 0) return { ok: false, errors }

  const {
    annualSpending,
    passiveIncome,
    withdrawalRate,
    currentAssets,
    annualContributions,
    annualReturn,
  } = inputs

  const annualNeeded = Math.max(annualSpending - passiveIncome, 0)
  const fireNumber = fireTarget(annualSpending, passiveIncome, withdrawalRate)
  const gap = Math.max(fireNumber - currentAssets, 0)

  // Progress: percentage of the way to FIRE target, capped at 100%
  const progressPct =
    fireNumber > 0
      ? Math.min(Math.round((currentAssets / fireNumber) * 1000) / 10, 100)
      : 100

  // Years-to-FI: only when portfolio is actually growing
  const portfolioGrowing =
    annualContributions > 0 || (annualReturn > 0 && currentAssets > 0)

  const yearsToFI =
    gap === 0
      ? 0
      : portfolioGrowing
      ? yearsToFIEstimate({
          currentAssets,
          annualContributions,
          annualReturn,
          target: fireNumber,
        })
      : null

  // 3.5% / 4% / 4.5% comparison
  const comparison = [0.035, 0.04, 0.045].map((rate) => {
    const target = fireTarget(annualSpending, passiveIncome, rate)
    const rowGap = Math.max(target - currentAssets, 0)
    const rowYears =
      rowGap === 0
        ? 0
        : portfolioGrowing
        ? yearsToFIEstimate({
            currentAssets,
            annualContributions,
            annualReturn,
            target,
          })
        : null
    return {
      rate,
      rateLabel: `${(rate * 100).toFixed(1)}%`,
      fireNumber: target,
      gap: rowGap,
      yearsToFI: rowYears,
    }
  })

  return {
    ok: true,
    annualNeeded,
    fireNumber,
    currentAssets: Math.round(currentAssets),
    gap,
    progressPct,
    yearsToFI,
    comparison,
  }
}
