/* UK ISA rules quoted on the site (homepage, /track-isas-pensions-savings and
   their FAQ structured data). One place to edit each April.

   Last reviewed: 6 November 2026 against HMRC's Tax-free savings newsletter 24
   (published 29 October 2026) and GOV.UK.
   The £12,000 Cash ISA limit for under-65s announced in the November 2025 Budget
   was dropped in the Autumn Budget on 28 October 2026. HMRC says the £20,000
   cash ISA limit is retained from 6 April 2027 and that the regulations that
   would have introduced the £12,000 limit will be revoked. Re-check that the
   revocation has happened, and re-check the allowance after each Budget and
   every April. */

export const ISA_RULES = {
  taxYear: '2026/27',
  taxYearStart: '6 April 2026',
  taxYearEnd: '5 April 2027',
  overallAllowance: 20000,
  nextTaxYear: '2027/28',
  nextTaxYearStart: '6 April 2027',
  cancelledCashIsaLimit: 12000,
  cashIsaCapDroppedOn: '28 October 2026',
  hmrcNewsletterUrl:
    'https://www.gov.uk/government/publications/tax-free-savings-newsletter-24/tax-free-savings-newsletter-24-october-2026',
  reviewed: '6 November 2026',
  govUkUrl: 'https://www.gov.uk/individual-savings-accounts',
}

export function gbp(amount) {
  return `£${String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

const r = ISA_RULES

export const ISA_FAQS = [
  {
    q: `How much is the ISA allowance for ${r.taxYear}?`,
    a: `You can pay up to ${gbp(r.overallAllowance)} into ISAs in the ${r.taxYear} tax year, which runs from ${r.taxYearStart} to ${r.taxYearEnd}. The ${gbp(r.overallAllowance)} is a total across all your adult ISAs (Cash, Stocks and Shares, Innovative Finance and Lifetime ISAs), and unused allowance does not carry over to the next tax year.`,
  },
  {
    q: `Is the Cash ISA limit changing in April 2027?`,
    a: `No. The plan announced in the November 2025 Budget to cut the Cash ISA limit to ${gbp(r.cancelledCashIsaLimit)} for people under 65 from ${r.nextTaxYearStart} was dropped in the Autumn Budget on ${r.cashIsaCapDroppedOn}. HMRC says the annual Cash ISA limit of ${gbp(r.overallAllowance)} will be retained from ${r.nextTaxYearStart}, and that the regulations that would have introduced the ${gbp(r.cancelledCashIsaLimit)} limit will be revoked. You can still pay the full ${gbp(r.overallAllowance)} allowance into a Cash ISA, whatever your age. Some provider pages written before ${r.cashIsaCapDroppedOn} may still describe the old plan.`,
  },
]
