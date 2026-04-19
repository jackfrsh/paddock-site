export const ERRORS = {
  INITIAL_AMOUNT_REQUIRED: 'Initial amount is required',
  INITIAL_AMOUNT_INVALID: 'Initial amount must be a number',
  INITIAL_AMOUNT_NEGATIVE: 'Initial amount cannot be negative',
  MONTHLY_CONTRIBUTION_INVALID: 'Monthly contribution must be a number',
  MONTHLY_CONTRIBUTION_NEGATIVE: 'Monthly contribution cannot be negative',
  YEARS_REQUIRED: 'Number of years is required',
  YEARS_INVALID: 'Number of years must be a number',
  YEARS_OUT_OF_RANGE: 'Years must be between 1 and 50',
  ANNUAL_RETURN_REQUIRED: 'Annual return is required',
  ANNUAL_RETURN_INVALID: 'Annual return must be a number',
  ANNUAL_RETURN_OUT_OF_RANGE: 'Annual return must be between 0% and 20%',
  ANNUAL_FEE_INVALID: 'Annual fee must be a number',
  ANNUAL_FEE_OUT_OF_RANGE: 'Annual fee must be between 0% and 5%',
  TARGET_VALUE_INVALID: 'Target value must be a number',
  TARGET_VALUE_NEGATIVE: 'Target value must be greater than zero',
}

/**
 * @param {object} inputs
 * @param {number|string} inputs.initialAmount   - Starting ISA balance (£)
 * @param {number|string} inputs.monthlyContribution - Monthly contribution (£), default 0
 * @param {number|string} inputs.years           - Projection horizon (1–50)
 * @param {number|string} inputs.annualReturn    - Annual return rate (0–20, as %)
 * @param {number|string} [inputs.annualFee]     - Annual platform fee (0–5, as %), default 0
 * @param {number|string} [inputs.targetValue]   - Optional target portfolio value (£)
 */
export function validateInputs(inputs) {
  const errors = []

  // initialAmount
  const rawInit = inputs.initialAmount
  if (rawInit === '' || rawInit === null || rawInit === undefined) {
    errors.push(ERRORS.INITIAL_AMOUNT_REQUIRED)
  } else {
    const v = Number(rawInit)
    if (isNaN(v)) errors.push(ERRORS.INITIAL_AMOUNT_INVALID)
    else if (v < 0) errors.push(ERRORS.INITIAL_AMOUNT_NEGATIVE)
  }

  // monthlyContribution (optional, default 0)
  const rawContrib = inputs.monthlyContribution
  if (rawContrib !== '' && rawContrib !== null && rawContrib !== undefined) {
    const v = Number(rawContrib)
    if (isNaN(v)) errors.push(ERRORS.MONTHLY_CONTRIBUTION_INVALID)
    else if (v < 0) errors.push(ERRORS.MONTHLY_CONTRIBUTION_NEGATIVE)
  }

  // years
  const rawYears = inputs.years
  if (rawYears === '' || rawYears === null || rawYears === undefined) {
    errors.push(ERRORS.YEARS_REQUIRED)
  } else {
    const v = Number(rawYears)
    if (isNaN(v)) errors.push(ERRORS.YEARS_INVALID)
    else if (v < 1 || v > 50) errors.push(ERRORS.YEARS_OUT_OF_RANGE)
  }

  // annualReturn
  const rawReturn = inputs.annualReturn
  if (rawReturn === '' || rawReturn === null || rawReturn === undefined) {
    errors.push(ERRORS.ANNUAL_RETURN_REQUIRED)
  } else {
    const v = Number(rawReturn)
    if (isNaN(v)) errors.push(ERRORS.ANNUAL_RETURN_INVALID)
    else if (v < 0 || v > 20) errors.push(ERRORS.ANNUAL_RETURN_OUT_OF_RANGE)
  }

  // annualFee (optional, default 0)
  const rawFee = inputs.annualFee
  if (rawFee !== '' && rawFee !== null && rawFee !== undefined) {
    const v = Number(rawFee)
    if (isNaN(v)) errors.push(ERRORS.ANNUAL_FEE_INVALID)
    else if (v < 0 || v > 5) errors.push(ERRORS.ANNUAL_FEE_OUT_OF_RANGE)
  }

  // targetValue (optional)
  const rawTarget = inputs.targetValue
  if (rawTarget !== '' && rawTarget !== null && rawTarget !== undefined) {
    const v = Number(rawTarget)
    if (isNaN(v)) errors.push(ERRORS.TARGET_VALUE_INVALID)
    else if (v <= 0) errors.push(ERRORS.TARGET_VALUE_NEGATIVE)
  }

  return errors
}

function monthlyNetRate(annualReturn, annualFee) {
  const net = (annualReturn - annualFee) / 100
  if (Math.abs(net) < 1e-12) return 0
  return Math.pow(1 + net, 1 / 12) - 1
}

function futureValue(pv, monthlyContrib, rMonthly, months) {
  if (months <= 0) return pv
  if (Math.abs(rMonthly) < 1e-12) {
    return pv + monthlyContrib * months
  }
  const factor = Math.pow(1 + rMonthly, months)
  return pv * factor + monthlyContrib * (factor - 1) / rMonthly
}

function projectIsa({ initialAmount, monthlyContribution, years, annualReturn, annualFee }) {
  const months = Math.round(years * 12)
  const rMonthly = monthlyNetRate(annualReturn, annualFee)
  const projectedValue = futureValue(initialAmount, monthlyContribution, rMonthly, months)
  const totalContributed = initialAmount + monthlyContribution * months
  const totalGrowth = projectedValue - totalContributed
  return { projectedValue, totalContributed, totalGrowth }
}

/**
 * Calculate ISA growth projection.
 * @param {object} inputs
 * @returns {{ ok: false, errors: string[] } | { ok: true, projectedValue: number, totalContributed: number, totalGrowth: number, targetProgressPct: number|null, comparison: Array }}
 */
export function calculateIsa(inputs) {
  const errors = validateInputs(inputs)
  if (errors.length > 0) return { ok: false, errors }

  const initialAmount = Number(inputs.initialAmount)
  const monthlyContribution = inputs.monthlyContribution !== '' && inputs.monthlyContribution !== null && inputs.monthlyContribution !== undefined
    ? Number(inputs.monthlyContribution)
    : 0
  const years = Number(inputs.years)
  const annualReturn = Number(inputs.annualReturn)
  const annualFee = inputs.annualFee !== '' && inputs.annualFee !== null && inputs.annualFee !== undefined
    ? Number(inputs.annualFee)
    : 0

  const { projectedValue, totalContributed, totalGrowth } = projectIsa({
    initialAmount,
    monthlyContribution,
    years,
    annualReturn,
    annualFee,
  })

  // Target progress
  let targetProgressPct = null
  const rawTarget = inputs.targetValue
  if (rawTarget !== '' && rawTarget !== null && rawTarget !== undefined) {
    const target = Number(rawTarget)
    if (target > 0) {
      targetProgressPct = Math.min(100, (projectedValue / target) * 100)
    }
  }

  // Comparison at 3%, 5%, 7% (always using annualFee from user inputs)
  const compRates = [0.03, 0.05, 0.07]
  const comparison = compRates.map((rate) => {
    const annualReturnPct = rate * 100
    const result = projectIsa({
      initialAmount,
      monthlyContribution,
      years,
      annualReturn: annualReturnPct,
      annualFee,
    })
    return {
      rate,
      rateLabel: `${(rate * 100).toFixed(0)}%`,
      projectedValue: result.projectedValue,
      totalContributed: result.totalContributed,
      totalGrowth: result.totalGrowth,
    }
  })

  return {
    ok: true,
    projectedValue,
    totalContributed,
    totalGrowth,
    targetProgressPct,
    comparison,
  }
}
