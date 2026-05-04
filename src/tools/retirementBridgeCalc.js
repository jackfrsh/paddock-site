export const BRIDGE_ERRORS = {
  CURRENT_AGE_REQUIRED: 'Current age is required',
  CURRENT_AGE_RANGE: 'Current age must be between 18 and 80',
  RETIREMENT_AGE_REQUIRED: 'Stop-work age is required',
  RETIREMENT_AGE_RANGE: 'Stop-work age must be between current age and 80',
  PENSION_ACCESS_AGE_REQUIRED: 'Private pension access age is required',
  PENSION_ACCESS_AGE_RANGE: 'Private pension access age must be between 55 and 75',
  STATE_PENSION_AGE_REQUIRED: 'State Pension age is required',
  STATE_PENSION_AGE_RANGE: 'State Pension age must be between 66 and 70',
  ANNUAL_SPENDING_REQUIRED: 'Annual bridge spending is required',
  ANNUAL_SPENDING_NEGATIVE: 'Annual bridge spending cannot be negative',
  CURRENT_ASSETS_NEGATIVE: 'Current bridge assets cannot be negative',
  MONTHLY_CONTRIBUTION_NEGATIVE: 'Monthly bridge contribution cannot be negative',
  GROWTH_RATE_RANGE: 'Expected annual growth must be between 0% and 12%',
  INFLATION_RATE_RANGE: 'Inflation assumption must be between 0% and 10%',
  PART_TIME_INCOME_NEGATIVE: 'Part-time annual income cannot be negative',
  SAFETY_BUFFER_RANGE: 'Safety buffer must be between 0% and 50%',
}

function toNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback
  const number = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(number) ? number : NaN
}

function requiredNumber(value) {
  if (value === '' || value === null || value === undefined) return NaN
  const number = Number(String(value).replace(/,/g, ''))
  return Number.isFinite(number) ? number : NaN
}

function monthlyRate(annualRate) {
  if (!Number.isFinite(annualRate) || Math.abs(annualRate) < 1e-12) return 0
  return Math.pow(1 + annualRate, 1 / 12) - 1
}

function futureValue(presentValue, monthlyContribution, monthlyGrowthRate, months) {
  if (months <= 0) return Math.max(0, presentValue)
  if (Math.abs(monthlyGrowthRate) < 1e-12) {
    return Math.max(0, presentValue + monthlyContribution * months)
  }

  const factor = Math.pow(1 + monthlyGrowthRate, months)
  return Math.max(
    0,
    presentValue * factor + monthlyContribution * ((factor - 1) / monthlyGrowthRate)
  )
}

function simulateBridgePot(startingPot, {
  bridgeMonths,
  monthlyGrowthRate,
  monthlyInflationRate,
  monthlySpendingAtRetirement,
  monthlyIncomeAtRetirement,
}) {
  let pot = Math.max(0, startingPot)
  let spending = Math.max(0, monthlySpendingAtRetirement)
  let income = Math.max(0, monthlyIncomeAtRetirement)
  let totalWithdrawals = 0

  for (let month = 0; month < bridgeMonths; month += 1) {
    pot *= 1 + monthlyGrowthRate
    const withdrawal = Math.max(0, spending - income)
    pot -= withdrawal
    totalWithdrawals += withdrawal
    spending *= 1 + monthlyInflationRate
    income *= 1 + monthlyInflationRate
  }

  return { endingPot: pot, totalWithdrawals }
}

function solveRequiredPot(params) {
  const { bridgeMonths } = params
  if (bridgeMonths <= 0) return { requiredPot: 0, totalWithdrawals: 0 }

  let high = Math.max(1, params.monthlySpendingAtRetirement * bridgeMonths * 1.5)
  let highRun = simulateBridgePot(high, params)

  while (highRun.endingPot < 0 && high < 1_000_000_000) {
    high *= 2
    highRun = simulateBridgePot(high, params)
  }

  let low = 0
  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2
    const run = simulateBridgePot(mid, params)
    if (run.endingPot >= 0) high = mid
    else low = mid
  }

  const requiredRun = simulateBridgePot(high, params)
  return { requiredPot: high, totalWithdrawals: requiredRun.totalWithdrawals }
}

function solveMonthlyContribution(shortfall, months, monthlyGrowthRate) {
  if (shortfall <= 0) return 0
  if (months <= 0) return shortfall
  if (Math.abs(monthlyGrowthRate) < 1e-12) return shortfall / months

  const factor = Math.pow(1 + monthlyGrowthRate, months)
  return shortfall / ((factor - 1) / monthlyGrowthRate)
}

function estimateBufferMonths(surplus, params) {
  if (surplus <= 0) return 0

  let pot = surplus
  let spending = params.monthlySpendingAtRetirement
  let income = params.monthlyIncomeAtRetirement

  for (let month = 0; month < 1200; month += 1) {
    pot *= 1 + params.monthlyGrowthRate
    pot -= Math.max(0, spending - income)
    if (pot < 0) return month
    spending *= 1 + params.monthlyInflationRate
    income *= 1 + params.monthlyInflationRate
  }

  return 1200
}

export function validateRetirementBridgeInputs(inputs) {
  const errors = []

  const currentAge = requiredNumber(inputs.currentAge)
  const retirementAge = requiredNumber(inputs.retirementAge)
  const privatePensionAccessAge = requiredNumber(inputs.privatePensionAccessAge)
  const statePensionAge = requiredNumber(inputs.statePensionAge)
  const annualSpendingToday = requiredNumber(inputs.annualSpendingToday)
  const currentBridgeAssets = toNumber(inputs.currentBridgeAssets)
  const monthlyBridgeContribution = toNumber(inputs.monthlyBridgeContribution)
  const expectedAnnualGrowth = requiredNumber(inputs.expectedAnnualGrowth)
  const inflationAssumption = requiredNumber(inputs.inflationAssumption)
  const partTimeAnnualIncome = toNumber(inputs.partTimeAnnualIncome)
  const safetyBuffer = toNumber(inputs.safetyBuffer)

  if (!Number.isFinite(currentAge)) errors.push(BRIDGE_ERRORS.CURRENT_AGE_REQUIRED)
  else if (currentAge < 18 || currentAge > 80) errors.push(BRIDGE_ERRORS.CURRENT_AGE_RANGE)

  if (!Number.isFinite(retirementAge)) errors.push(BRIDGE_ERRORS.RETIREMENT_AGE_REQUIRED)
  else if (Number.isFinite(currentAge) && (retirementAge < currentAge || retirementAge > 80)) {
    errors.push(BRIDGE_ERRORS.RETIREMENT_AGE_RANGE)
  }

  if (!Number.isFinite(privatePensionAccessAge)) {
    errors.push(BRIDGE_ERRORS.PENSION_ACCESS_AGE_REQUIRED)
  } else if (privatePensionAccessAge < 55 || privatePensionAccessAge > 75) {
    errors.push(BRIDGE_ERRORS.PENSION_ACCESS_AGE_RANGE)
  }

  if (!Number.isFinite(statePensionAge)) errors.push(BRIDGE_ERRORS.STATE_PENSION_AGE_REQUIRED)
  else if (statePensionAge < 66 || statePensionAge > 70) errors.push(BRIDGE_ERRORS.STATE_PENSION_AGE_RANGE)

  if (!Number.isFinite(annualSpendingToday)) errors.push(BRIDGE_ERRORS.ANNUAL_SPENDING_REQUIRED)
  else if (annualSpendingToday < 0) errors.push(BRIDGE_ERRORS.ANNUAL_SPENDING_NEGATIVE)

  if (!Number.isFinite(currentBridgeAssets) || currentBridgeAssets < 0) {
    errors.push(BRIDGE_ERRORS.CURRENT_ASSETS_NEGATIVE)
  }
  if (!Number.isFinite(monthlyBridgeContribution) || monthlyBridgeContribution < 0) {
    errors.push(BRIDGE_ERRORS.MONTHLY_CONTRIBUTION_NEGATIVE)
  }
  if (!Number.isFinite(expectedAnnualGrowth) || expectedAnnualGrowth < 0 || expectedAnnualGrowth > 12) {
    errors.push(BRIDGE_ERRORS.GROWTH_RATE_RANGE)
  }
  if (!Number.isFinite(inflationAssumption) || inflationAssumption < 0 || inflationAssumption > 10) {
    errors.push(BRIDGE_ERRORS.INFLATION_RATE_RANGE)
  }
  if (!Number.isFinite(partTimeAnnualIncome) || partTimeAnnualIncome < 0) {
    errors.push(BRIDGE_ERRORS.PART_TIME_INCOME_NEGATIVE)
  }
  if (!Number.isFinite(safetyBuffer) || safetyBuffer < 0 || safetyBuffer > 50) {
    errors.push(BRIDGE_ERRORS.SAFETY_BUFFER_RANGE)
  }

  return errors
}

export function calculateRetirementBridge(inputs) {
  const errors = validateRetirementBridgeInputs(inputs)
  if (errors.length > 0) return { ok: false, errors }

  const currentAge = Number(inputs.currentAge)
  const retirementAge = Number(inputs.retirementAge)
  const privatePensionAccessAge = Number(inputs.privatePensionAccessAge)
  const statePensionAge = Number(inputs.statePensionAge)
  const annualSpendingToday = Number(inputs.annualSpendingToday)
  const currentBridgeAssets = toNumber(inputs.currentBridgeAssets)
  const monthlyBridgeContribution = toNumber(inputs.monthlyBridgeContribution)
  const growthRate = Number(inputs.expectedAnnualGrowth) / 100
  const inflationRate = Number(inputs.inflationAssumption) / 100
  const partTimeAnnualIncome = toNumber(inputs.partTimeAnnualIncome)
  const safetyBufferRate = toNumber(inputs.safetyBuffer) / 100

  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge)
  const bridgeYears = Math.max(0, privatePensionAccessAge - retirementAge)
  const monthsUntilRetirement = Math.round(yearsUntilRetirement * 12)
  const bridgeMonths = Math.round(bridgeYears * 12)
  const monthlyGrowthRate = monthlyRate(growthRate)
  const monthlyInflationRate = monthlyRate(inflationRate)

  const projectedBridgePotAtRetirement = futureValue(
    currentBridgeAssets,
    monthlyBridgeContribution,
    monthlyGrowthRate,
    monthsUntilRetirement
  )

  const annualSpendingAtRetirement =
    annualSpendingToday * Math.pow(1 + inflationRate, yearsUntilRetirement)
  const annualIncomeAtRetirement =
    partTimeAnnualIncome * Math.pow(1 + inflationRate, yearsUntilRetirement)

  if (bridgeMonths <= 0) {
    return {
      ok: true,
      bridgeYears,
      yearsUntilRetirement,
      projectedBridgePotAtRetirement,
      requiredBridgePot: 0,
      surplusOrShortfall: projectedBridgePotAtRetirement,
      status: 'no_bridge_needed',
      monthlyContributionNeeded: 0,
      monthsOfBuffer: 0,
      annualSpendingAtRetirement,
      totalBridgeWithdrawals: 0,
      statePensionAge,
    }
  }

  const simulationParams = {
    bridgeMonths,
    monthlyGrowthRate,
    monthlyInflationRate,
    monthlySpendingAtRetirement: annualSpendingAtRetirement / 12,
    monthlyIncomeAtRetirement: annualIncomeAtRetirement / 12,
  }

  const { requiredPot: baseRequiredBridgePot, totalWithdrawals } =
    solveRequiredPot(simulationParams)
  const requiredBridgePot = baseRequiredBridgePot * (1 + safetyBufferRate)
  const surplusOrShortfall = projectedBridgePotAtRetirement - requiredBridgePot
  const monthlyContributionNeeded = surplusOrShortfall < 0
    ? solveMonthlyContribution(Math.abs(surplusOrShortfall), monthsUntilRetirement, monthlyGrowthRate)
    : 0
  const monthsOfBuffer = surplusOrShortfall > 0
    ? estimateBufferMonths(surplusOrShortfall, simulationParams)
    : 0

  let status = 'shortfall'
  if (surplusOrShortfall >= 0) {
    status = requiredBridgePot > 0 && surplusOrShortfall / requiredBridgePot <= 0.1
      ? 'close'
      : 'on_track'
  }

  return {
    ok: true,
    bridgeYears,
    yearsUntilRetirement,
    projectedBridgePotAtRetirement,
    requiredBridgePot,
    surplusOrShortfall,
    status,
    monthlyContributionNeeded,
    monthsOfBuffer,
    annualSpendingAtRetirement,
    totalBridgeWithdrawals: totalWithdrawals,
    statePensionAge,
  }
}
