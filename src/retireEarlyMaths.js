/* The arithmetic behind /guides/monthly-investment-to-retire-early-uk.

   One pot, level monthly payments, a constant annual growth rate written in
   TODAY'S MONEY (after inflation), no tax, no charges and no tax relief. That
   keeps the answer simple and keeps every number on the page reproducible.
   Plain JavaScript so the tests and the prerender can import it directly. */

/** Monthly rate that compounds to the annual rate over twelve payments. */
export function monthlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1
}

/** Pot needed to fund a yearly spend at a withdrawal rate (0.04 = 4%). */
export function targetPot(yearlySpend, withdrawalRate) {
  return yearlySpend / withdrawalRate
}

/** Value after `years` of level monthly payments (paid at the end of each
    month) on top of a starting pot. */
export function potAfter({ startingPot = 0, monthly, years, annualRate }) {
  const n = Math.round(years * 12)
  if (annualRate === 0) return startingPot + monthly * n
  const r = monthlyRate(annualRate)
  const growth = Math.pow(1 + r, n)
  return startingPot * growth + monthly * ((growth - 1) / r)
}

/** Level monthly payment that reaches `target` after `years`. Returns 0 when
    the starting pot already grows past the target on its own. */
export function monthlySavingNeeded({ target, startingPot = 0, years, annualRate }) {
  const n = Math.round(years * 12)
  if (n <= 0) return Math.max(target - startingPot, 0)
  if (annualRate === 0) return Math.max((target - startingPot) / n, 0)
  const r = monthlyRate(annualRate)
  const growth = Math.pow(1 + r, n)
  const gap = target - startingPot * growth
  if (gap <= 0) return 0
  return (gap * r) / (growth - 1)
}

/** Total paid in (not including growth). */
export function totalPaidIn({ startingPot = 0, monthly, years }) {
  return startingPot + monthly * Math.round(years * 12)
}
