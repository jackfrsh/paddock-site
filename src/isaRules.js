/* ISA rules quoted on the site (homepage, /track-isas-pensions-savings and
   their FAQ structured data).

   The numbers and dates are not typed here: they are read from src/ukFigures.js,
   which holds each figure's source, effective dates, status and review date.
   Edit that file (see the rules at its top), not this one.

   Background, reviewed 6 November 2026 against HMRC's Tax-free savings
   newsletter 24 (published 29 October 2026) and GOV.UK: the £12,000 Cash ISA
   limit for under-65s announced in the November 2025 Budget was dropped in the
   Autumn Budget on 28 October 2026. HMRC says the £20,000 cash ISA limit is
   retained from 6 April 2027 and that the regulations that would have
   introduced the £12,000 limit will be revoked. */

import {
  figureHistory,
  figureOn,
  formatDate,
  gbp,
  lastCheckedFor,
  taxYearOf,
  valueOn,
} from './ukFigures.js'

export { gbp }

const asOf = new Date()
const thisYear = taxYearOf(asOf)
const nextYear = taxYearOf(`${Number(thisYear.end.slice(0, 4))}-04-06`)
const dropped = figureHistory('isa.cash_isa_limit_under_65').find((f) => f.status === 'abandoned')

export const ISA_RULES = {
  taxYear: thisYear.label,
  taxYearStart: formatDate(thisYear.start),
  taxYearEnd: formatDate(thisYear.end),
  overallAllowance: valueOn('isa.overall_allowance', asOf),
  nextTaxYear: nextYear.label,
  nextTaxYearStart: formatDate(nextYear.start),
  cancelledCashIsaLimit: dropped.value,
  cashIsaCapWouldHaveStarted: formatDate(dropped.effectiveFrom),
  cashIsaCapDroppedOn: formatDate(dropped.statusChangedOn),
  hmrcNewsletterUrl: dropped.sourceUrl,
  reviewed: formatDate(lastCheckedFor('isa.')),
  govUkUrl: figureOn('isa.overall_allowance', asOf).sourceUrl,
}

const r = ISA_RULES

export const ISA_FAQS = [
  {
    q: `How much is the ISA allowance for ${r.taxYear}?`,
    a: `You can pay up to ${gbp(r.overallAllowance)} into ISAs in the ${r.taxYear} tax year, which runs from ${r.taxYearStart} to ${r.taxYearEnd}. The ${gbp(r.overallAllowance)} is a total across all your adult ISAs (Cash, Stocks and Shares, Innovative Finance and Lifetime ISAs), and unused allowance does not carry over to the next tax year.`,
  },
  {
    q: `Is the Cash ISA limit changing in April 2027?`,
    a: `No. The plan announced in the November 2025 Budget to cut the Cash ISA limit to ${gbp(r.cancelledCashIsaLimit)} for people under 65 from ${r.cashIsaCapWouldHaveStarted} was dropped in the Autumn Budget on ${r.cashIsaCapDroppedOn}. HMRC says the annual Cash ISA limit of ${gbp(r.overallAllowance)} will be retained from ${r.cashIsaCapWouldHaveStarted}, and that the regulations that would have introduced the ${gbp(r.cancelledCashIsaLimit)} limit will be revoked. You can still pay the full ${gbp(r.overallAllowance)} allowance into a Cash ISA, whatever your age. Some provider pages written before ${r.cashIsaCapDroppedOn} may still describe the old plan.`,
  },
]
