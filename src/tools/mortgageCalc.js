/* Mortgage overpayment arithmetic for /tools/mortgage-overpayment-calculator
   and the examples in /guides/overpay-mortgage-or-invest-uk.

   A repayment mortgage with one rate for the whole remaining term. Interest is
   worked out each month on the balance (annual rate ÷ 12) and the payment is
   made at the end of the month. A lump sum is paid at the start, before the
   first month's interest. Real lenders differ: some charge interest daily, some
   annually, and fixed deals end and reset. Plain JavaScript so the tests and
   the prerender can import it directly. */

export const ERRORS = {
  BALANCE_REQUIRED: 'Mortgage balance is required',
  BALANCE_INVALID: 'Mortgage balance must be a number',
  BALANCE_OUT_OF_RANGE: 'Mortgage balance must be between £1 and £10,000,000',
  RATE_REQUIRED: 'Interest rate is required',
  RATE_INVALID: 'Interest rate must be a number',
  RATE_OUT_OF_RANGE: 'Interest rate must be between 0% and 15%',
  YEARS_REQUIRED: 'Remaining term is required',
  YEARS_INVALID: 'Remaining term must be a number',
  YEARS_OUT_OF_RANGE: 'Remaining term must be between 1 and 40 years',
  MONTHLY_INVALID: 'Monthly overpayment must be a number',
  MONTHLY_NEGATIVE: 'Monthly overpayment cannot be negative',
  LUMP_INVALID: 'One-off overpayment must be a number',
  LUMP_NEGATIVE: 'One-off overpayment cannot be negative',
  LUMP_TOO_LARGE: 'One-off overpayment must be less than the mortgage balance',
  ALLOWANCE_INVALID: 'Overpayment allowance must be a number',
  ALLOWANCE_OUT_OF_RANGE: 'Overpayment allowance must be between 0% and 100%',
}

const blank = (v) => v === '' || v === null || v === undefined
const num = (v) => (typeof v === 'number' ? v : Number(String(v).replace(/,/g, '').trim()))

export function validateInputs(inputs) {
  const errors = []
  const { balance, rate, years, monthlyOverpayment, lumpSum, allowancePct } = inputs

  if (blank(balance)) errors.push(ERRORS.BALANCE_REQUIRED)
  else if (!Number.isFinite(num(balance))) errors.push(ERRORS.BALANCE_INVALID)
  else if (num(balance) < 1 || num(balance) > 10000000) errors.push(ERRORS.BALANCE_OUT_OF_RANGE)

  if (blank(rate)) errors.push(ERRORS.RATE_REQUIRED)
  else if (!Number.isFinite(num(rate))) errors.push(ERRORS.RATE_INVALID)
  else if (num(rate) < 0 || num(rate) > 15) errors.push(ERRORS.RATE_OUT_OF_RANGE)

  if (blank(years)) errors.push(ERRORS.YEARS_REQUIRED)
  else if (!Number.isFinite(num(years))) errors.push(ERRORS.YEARS_INVALID)
  else if (num(years) < 1 || num(years) > 40) errors.push(ERRORS.YEARS_OUT_OF_RANGE)

  if (!blank(monthlyOverpayment)) {
    if (!Number.isFinite(num(monthlyOverpayment))) errors.push(ERRORS.MONTHLY_INVALID)
    else if (num(monthlyOverpayment) < 0) errors.push(ERRORS.MONTHLY_NEGATIVE)
  }
  if (!blank(lumpSum)) {
    if (!Number.isFinite(num(lumpSum))) errors.push(ERRORS.LUMP_INVALID)
    else if (num(lumpSum) < 0) errors.push(ERRORS.LUMP_NEGATIVE)
    else if (Number.isFinite(num(balance)) && num(lumpSum) >= num(balance)) errors.push(ERRORS.LUMP_TOO_LARGE)
  }
  if (!blank(allowancePct)) {
    if (!Number.isFinite(num(allowancePct))) errors.push(ERRORS.ALLOWANCE_INVALID)
    else if (num(allowancePct) < 0 || num(allowancePct) > 100) errors.push(ERRORS.ALLOWANCE_OUT_OF_RANGE)
  }
  return errors
}

/** The contractual monthly payment that clears the balance over the term. */
export function monthlyPayment(balance, annualRatePct, years) {
  const n = Math.round(years * 12)
  const r = annualRatePct / 100 / 12
  if (r === 0) return balance / n
  return (balance * r) / (1 - Math.pow(1 + r, -n))
}

/** Month-by-month run. Returns months taken and the interest and total paid. */
export function simulate({ balance, annualRatePct, years, monthly = 0, lump = 0 }) {
  const n = Math.round(years * 12)
  const r = annualRatePct / 100 / 12
  const payment = monthlyPayment(balance, annualRatePct, years)
  let owed = balance - lump
  let months = 0
  let interest = 0
  let paid = lump
  while (owed > 0.005 && months < n) {
    const charge = owed * r
    interest += charge
    const due = owed + charge
    const pay = Math.min(payment + monthly, due)
    paid += pay
    owed = due - pay
    months += 1
  }
  return { months, interest, paid, payment }
}

/** @returns {{ok:false, errors:string[]} | {ok:true, ...}} */
export function calculateOverpayment(inputs) {
  const errors = validateInputs(inputs)
  if (errors.length) return { ok: false, errors }

  const balance = num(inputs.balance)
  const annualRatePct = num(inputs.rate)
  const years = num(inputs.years)
  const monthly = blank(inputs.monthlyOverpayment) ? 0 : num(inputs.monthlyOverpayment)
  const lump = blank(inputs.lumpSum) ? 0 : num(inputs.lumpSum)
  const allowancePct = blank(inputs.allowancePct) ? 10 : num(inputs.allowancePct)

  const base = simulate({ balance, annualRatePct, years })
  const over = simulate({ balance, annualRatePct, years, monthly, lump })

  const monthsSaved = Math.max(base.months - over.months, 0)
  const firstYearOverpayment = lump + monthly * 12
  const allowanceAmount = (balance * allowancePct) / 100

  const comparison = [100, 250, 500].map((extra) => {
    const run = simulate({ balance, annualRatePct, years, monthly: extra })
    return {
      monthly: extra,
      months: run.months,
      monthsSaved: Math.max(base.months - run.months, 0),
      interestSaved: Math.max(base.interest - run.interest, 0),
    }
  })

  return {
    ok: true,
    monthlyPayment: base.payment,
    baseline: { months: base.months, interest: base.interest, paid: base.paid },
    withOverpayment: { months: over.months, interest: over.interest, paid: over.paid },
    interestSaved: Math.max(base.interest - over.interest, 0),
    monthsSaved,
    yearsSavedPart: Math.floor(monthsSaved / 12),
    monthsSavedPart: monthsSaved % 12,
    firstYearOverpayment,
    allowancePct,
    allowanceAmount,
    overAllowance: firstYearOverpayment > allowanceAmount + 0.005,
    hasOverpayment: monthly > 0 || lump > 0,
    comparison,
  }
}
