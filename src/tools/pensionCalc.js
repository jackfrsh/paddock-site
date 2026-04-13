/**
 * Pension drawdown calculator — pure computation module.
 *
 * All rates are decimals (e.g. 5% → 0.05).
 * All monetary values in GBP (£).
 * No side effects. No I/O. Safe to call in browser or Node.
 */

// ─── Validation ──────────────────────────────────────────────────────────────

export const ERRORS = {
  POT_NEGATIVE: 'Pension pot cannot be negative.',
  CURRENT_AGE_RANGE: 'Current age must be between 18 and 80.',
  RETIREMENT_AGE_ORDER: 'Retirement age must be greater than current age.',
  RETIREMENT_AGE_MAX: 'Retirement age must be 90 or under.',
  TARGET_AGE_ORDER: 'Target end age must be greater than retirement age.',
  TARGET_AGE_MAX: 'Target end age must be 100 or under.',
  CONTRIBUTION_NEGATIVE: 'Monthly contribution cannot be negative.',
  RETURN_RANGE: 'Expected annual return must be between 0% and 20%.',
  FEE_RANGE: 'Annual fee rate must be between 0% and 5%.',
  INFLATION_RANGE: 'Inflation rate must be between 0% and 10%.',
  LUMP_SUM_NEGATIVE: 'Lump sum cannot be negative.',
  WITHDRAWAL_PCT_RANGE: 'Withdrawal rate must be between 0% and 20%.',
  FIXED_AMOUNT_NEGATIVE: 'Fixed monthly amount cannot be negative.',
  WITHDRAWAL_MODE_INVALID: 'Withdrawal mode must be "percentage" or "fixed".',
}

/**
 * Validate all inputs. Returns an array of error strings (empty = valid).
 *
 * @param {object} inputs
 * @returns {string[]}
 */
export function validateInputs(inputs) {
  const {
    pot,
    currentAge,
    retirementAge,
    targetEndAge,
    monthlyContribution,
    annualReturn,
    annualFee,
    inflationRate,
    lumpSum,
    withdrawalMode,
    annualWithdrawalPct,
    fixedMonthlyAmount,
  } = inputs

  const errors = []
  const ok = (v) => isFinite(v) && !isNaN(v)

  if (!ok(pot) || pot < 0) errors.push(ERRORS.POT_NEGATIVE)
  if (!ok(currentAge) || currentAge < 18 || currentAge > 80) errors.push(ERRORS.CURRENT_AGE_RANGE)

  const ageOk = ok(currentAge) && currentAge >= 18 && currentAge <= 80
  if (!ok(retirementAge) || (ageOk && retirementAge <= currentAge)) errors.push(ERRORS.RETIREMENT_AGE_ORDER)
  if (ok(retirementAge) && retirementAge > 90) errors.push(ERRORS.RETIREMENT_AGE_MAX)

  const retOk = ok(retirementAge) && retirementAge <= 90
  if (!ok(targetEndAge) || (retOk && targetEndAge <= retirementAge)) errors.push(ERRORS.TARGET_AGE_ORDER)
  if (ok(targetEndAge) && targetEndAge > 100) errors.push(ERRORS.TARGET_AGE_MAX)

  if (!ok(monthlyContribution) || monthlyContribution < 0) errors.push(ERRORS.CONTRIBUTION_NEGATIVE)
  if (!ok(annualReturn) || annualReturn < 0 || annualReturn > 0.2) errors.push(ERRORS.RETURN_RANGE)
  if (!ok(annualFee) || annualFee < 0 || annualFee > 0.05) errors.push(ERRORS.FEE_RANGE)
  if (!ok(inflationRate) || inflationRate < 0 || inflationRate > 0.1) errors.push(ERRORS.INFLATION_RANGE)
  if (!ok(lumpSum) || lumpSum < 0) errors.push(ERRORS.LUMP_SUM_NEGATIVE)

  if (withdrawalMode !== 'percentage' && withdrawalMode !== 'fixed') {
    errors.push(ERRORS.WITHDRAWAL_MODE_INVALID)
  } else if (withdrawalMode === 'percentage') {
    if (!ok(annualWithdrawalPct) || annualWithdrawalPct < 0 || annualWithdrawalPct > 0.2)
      errors.push(ERRORS.WITHDRAWAL_PCT_RANGE)
  } else {
    if (!ok(fixedMonthlyAmount) || fixedMonthlyAmount < 0)
      errors.push(ERRORS.FIXED_AMOUNT_NEGATIVE)
  }

  return errors
}

// ─── Core maths ──────────────────────────────────────────────────────────────

/**
 * Monthly equivalent of a net annual rate (gross return minus fee drag).
 * Uses geometric compounding, not simple division.
 */
function monthlyNetRate(annualReturn, annualFee) {
  const net = annualReturn - annualFee
  if (Math.abs(net) < 1e-12) return 0
  return Math.pow(1 + net, 1 / 12) - 1
}

/**
 * Future value of a present sum with regular end-of-period contributions.
 * Standard annuity formula.
 */
function futureValue(pv, monthlyContrib, rMonthly, months) {
  if (months <= 0) return pv
  if (Math.abs(rMonthly) < 1e-12) {
    return pv + monthlyContrib * months
  }
  const factor = Math.pow(1 + rMonthly, months)
  return pv * factor + monthlyContrib * (factor - 1) / rMonthly
}

/**
 * Month-by-month drawdown simulation.
 *
 * Returns the age at which the pot is exhausted (null if pot survives to
 * targetEndAge) and the pot balance remaining at targetEndAge.
 */
function simulateDrawdown({
  startPot,
  annualReturn,
  annualFee,
  withdrawalMode,
  annualWithdrawalPct,
  fixedMonthlyAmount,
  retirementAge,
  targetEndAge,
}) {
  const r = monthlyNetRate(annualReturn, annualFee)
  const totalMonths = Math.ceil((targetEndAge - retirementAge) * 12)
  let balance = startPot

  for (let m = 1; m <= totalMonths; m++) {
    // Growth applied first (end-of-period model)
    balance = balance * (1 + r)

    // Withdrawal
    const withdrawal =
      withdrawalMode === 'percentage'
        ? balance * (annualWithdrawalPct / 12)
        : fixedMonthlyAmount

    balance -= withdrawal

    // Treat < £1 as practically exhausted (percentage mode approaches but
    // never mathematically reaches zero when withdrawal_rate > net_return).
    if (balance <= 1) {
      const ageExhausted = retirementAge + m / 12
      return {
        exhaustedAge: Math.round(ageExhausted * 10) / 10,
        potAtTargetAge: 0,
      }
    }
  }

  return {
    exhaustedAge: null,
    potAtTargetAge: Math.round(balance),
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Main entry point. Validates inputs then runs the full projection.
 *
 * Returns:
 *   { ok: false, errors: string[] }
 *   { ok: true, potAtRetirement, lumpSumApplied, potAfterLumpSum,
 *     monthlyIncome, annualIncome,
 *     exhaustedAge (null = survives), potAtTargetAge,
 *     comparison: [{ rate, rateLabel, monthlyIncome, annualIncome, exhaustedAge, potAtTargetAge }] }
 *
 * @param {object} inputs
 * @returns {object}
 */
export function calculateDrawdown(inputs) {
  const errors = validateInputs(inputs)
  if (errors.length > 0) return { ok: false, errors }

  const {
    pot,
    currentAge,
    retirementAge,
    targetEndAge,
    monthlyContribution,
    annualReturn,
    annualFee,
    lumpSum,
    withdrawalMode,
    annualWithdrawalPct,
    fixedMonthlyAmount,
  } = inputs

  // ── Accumulation ──
  const r = monthlyNetRate(annualReturn, annualFee)
  const monthsToRetirement = Math.round((retirementAge - currentAge) * 12)
  const rawPotAtRetirement = futureValue(pot, monthlyContribution, r, monthsToRetirement)
  const potAtRetirement = Math.max(0, Math.round(rawPotAtRetirement))

  // Lump sum clamped to available pot
  const lumpSumApplied = Math.min(Math.max(0, lumpSum), potAtRetirement)
  const potAfterLumpSum = potAtRetirement - lumpSumApplied

  // ── Primary drawdown ──
  const monthlyIncome =
    withdrawalMode === 'percentage'
      ? Math.round(potAfterLumpSum * (annualWithdrawalPct / 12))
      : Math.round(fixedMonthlyAmount)

  const annualIncome = monthlyIncome * 12

  const primary = simulateDrawdown({
    startPot: potAfterLumpSum,
    annualReturn,
    annualFee,
    withdrawalMode,
    annualWithdrawalPct,
    fixedMonthlyAmount: monthlyIncome,
    retirementAge,
    targetEndAge,
  })

  // ── 3% / 4% / 5% comparison (always percentage mode) ──
  const comparison = [0.03, 0.04, 0.05].map((rate) => {
    const monthly = Math.round(potAfterLumpSum * (rate / 12))
    const sim = simulateDrawdown({
      startPot: potAfterLumpSum,
      annualReturn,
      annualFee,
      withdrawalMode: 'percentage',
      annualWithdrawalPct: rate,
      fixedMonthlyAmount: 0,
      retirementAge,
      targetEndAge,
    })
    return {
      rate,
      rateLabel: `${(rate * 100).toFixed(0)}%`,
      monthlyIncome: monthly,
      annualIncome: monthly * 12,
      exhaustedAge: sim.exhaustedAge,
      potAtTargetAge: sim.potAtTargetAge,
    }
  })

  return {
    ok: true,
    potAtRetirement,
    lumpSumApplied,
    potAfterLumpSum,
    monthlyIncome,
    annualIncome,
    exhaustedAge: primary.exhaustedAge,
    potAtTargetAge: primary.potAtTargetAge,
    comparison,
  }
}
