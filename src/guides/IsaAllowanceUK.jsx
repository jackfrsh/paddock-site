import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { ISA_RULES } from '../isaRules'
import { formatDate, gbp, lastCheckedFor, valueOn } from '../ukFigures'

export const ISA_ALLOWANCE_PUBLISHED = '2026-11-07'
export const ISA_ALLOWANCE_REVIEWED = '2026-11-07'

const ALLOWANCE = valueOn('isa.overall_allowance')
const LISA_LIMIT = valueOn('isa.lifetime_isa.annual_limit')
const JISA_LIMIT = valueOn('isa.junior_isa.annual_limit')

// Illustrative payments for the worked example (not a recommendation).
const EXAMPLE = [
  { label: 'Stocks and Shares ISA', paid: 8000 },
  { label: 'Cash ISA', paid: 6000 },
  { label: 'Lifetime ISA', paid: 2400 },
]
const EXAMPLE_TOTAL = EXAMPLE.reduce((sum, row) => sum + row.paid, 0)

export default function IsaAllowanceUK({ navigateTo, goTo }) {
  const sources = [
    { title: 'Individual Savings Accounts (ISAs)', org: 'GOV.UK', url: 'https://www.gov.uk/individual-savings-accounts' },
    { title: 'Lifetime ISA', org: 'GOV.UK', url: 'https://www.gov.uk/lifetime-isa' },
    { title: 'Junior Individual Savings Accounts', org: 'GOV.UK', url: 'https://www.gov.uk/junior-individual-savings-accounts' },
    { title: 'Tax-free savings newsletter 24 (October 2026)', org: 'HMRC', url: ISA_RULES.hmrcNewsletterUrl },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/isa-allowance-uk"
      heroLabel="ISAs and tax years"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">ISAs and tax years</div>
      <h1 className="guide-h1">ISA allowance {ISA_RULES.taxYear}: how much you can pay in</h1>
      <ArticleDates published={ISA_ALLOWANCE_PUBLISHED} reviewed={ISA_ALLOWANCE_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        You can pay up to {gbp(ALLOWANCE)} into ISAs in the {ISA_RULES.taxYear} tax year, which runs from{' '}
        {ISA_RULES.taxYearStart} to {ISA_RULES.taxYearEnd}. That is one total across all your adult ISAs, so money
        paid into a Cash ISA, a Stocks and Shares ISA and a Lifetime ISA all counts towards the same {gbp(ALLOWANCE)}.
        The allowance counts what you pay in, not what the accounts are worth, and it does not carry over: anything
        unused on {ISA_RULES.taxYearEnd} is lost.
      </QuickAnswerBox>

      <H2>What counts towards the allowance</H2>
      <UL>
        <li><strong>Payments in, across every adult ISA.</strong> Cash, Stocks and Shares, Innovative Finance and Lifetime ISAs share the one {gbp(ALLOWANCE)} limit.</li>
        <li><strong>Lifetime ISA payments.</strong> You can pay up to {gbp(LISA_LIMIT)} a year into a Lifetime ISA. That {gbp(LISA_LIMIT)} counts inside the {gbp(ALLOWANCE)}; it is not extra. The government bonus is added on top and does not use any allowance.</li>
        <li><strong>Not growth.</strong> Interest, dividends and rises in value do not use the allowance. An account that started the year with {gbp(100000)} can still take the full {gbp(ALLOWANCE)}.</li>
        <li><strong>Not Junior ISAs.</strong> A child&apos;s Junior ISA has its own separate limit, {gbp(JISA_LIMIT)} in {ISA_RULES.taxYear}. It does not reduce your own allowance.</li>
      </UL>

      <H2>Several ISAs in one year</H2>
      <P>
        Since 6 April 2024 you can pay into more than one ISA of the same type in the same tax year, for example two
        Stocks and Shares ISAs with different providers. Until then you could only pay into one of each type. The
        limit that matters is still the total across all of them. Having several accounts does not raise it.
      </P>

      <Example>
        In {ISA_RULES.taxYear} you pay {gbp(EXAMPLE[0].paid)} into a Stocks and Shares ISA, {gbp(EXAMPLE[1].paid)} into a
        Cash ISA and {gbp(EXAMPLE[2].paid)} into a Lifetime ISA. That is {gbp(EXAMPLE[0].paid)} + {gbp(EXAMPLE[1].paid)} +{' '}
        {gbp(EXAMPLE[2].paid)} = {gbp(EXAMPLE_TOTAL)} used, so {gbp(ALLOWANCE)} − {gbp(EXAMPLE_TOTAL)} ={' '}
        {gbp(ALLOWANCE - EXAMPLE_TOTAL)} is left until {ISA_RULES.taxYearEnd}. The Lifetime ISA bonus of{' '}
        {gbp(EXAMPLE[2].paid * 0.25)} (25% of {gbp(EXAMPLE[2].paid)}) is added by the government and is not counted.
      </Example>

      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Yearly limit in {ISA_RULES.taxYear}</th>
              <th>Counts towards your {gbp(ALLOWANCE)}?</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Cash ISA</td><td>Up to {gbp(ALLOWANCE)}</td><td>Yes</td></tr>
            <tr><td>Stocks and Shares ISA</td><td>Up to {gbp(ALLOWANCE)}</td><td>Yes</td></tr>
            <tr><td>Innovative Finance ISA</td><td>Up to {gbp(ALLOWANCE)}</td><td>Yes</td></tr>
            <tr><td>Lifetime ISA</td><td>Up to {gbp(LISA_LIMIT)}</td><td>Yes, it is part of the {gbp(ALLOWANCE)}</td></tr>
            <tr><td>Junior ISA (for a child)</td><td>Up to {gbp(JISA_LIMIT)}</td><td>No, separate</td></tr>
          </tbody>
        </table>
      </div>

      <H2>Taking money out and putting it back</H2>
      <P>
        Normally, money you take out of an ISA and later pay back in counts as a new payment, so it uses allowance again.
        Some providers offer a <strong>flexible ISA</strong>, which lets you replace money you withdrew in the same tax
        year without using more allowance. It is the provider&apos;s choice whether to offer it, the replacement generally has to go
        back into the same account, and Lifetime ISAs and Junior ISAs are not flexible. Check your provider&apos;s terms before
        relying on it.
      </P>
      <P>
        To move an ISA to a different provider, use the provider&apos;s ISA transfer process rather than withdrawing the
        money and paying it in yourself. A withdrawal-and-repayment can use up allowance and take the money out of the
        tax-free wrapper. GOV.UK&apos;s ISA page explains how transfers work.
      </P>

      <H2>The end of the tax year</H2>
      <P>
        The allowance resets on 6 April. Unused allowance cannot be carried forward, so {gbp(ALLOWANCE)} unused in{' '}
        {ISA_RULES.taxYear} does not become {gbp(ALLOWANCE * 2)} the year after. Our{' '}
        <a {...inlineLink(navigateTo, '/guides/end-of-tax-year-checklist-uk')}>end-of-tax-year checklist</a> lists what is worth
        checking before 5 April.
      </P>

      <H2>Is the Cash ISA limit changing in April 2027?</H2>
      <P>
        The cut to a {gbp(ISA_RULES.cancelledCashIsaLimit)} Cash ISA limit for under-65s, first announced in the November 2025
        Budget and planned for {ISA_RULES.cashIsaCapWouldHaveStarted}, was dropped in the Autumn Budget on{' '}
        {ISA_RULES.cashIsaCapDroppedOn}. HMRC says the {gbp(ALLOWANCE)} Cash ISA limit is retained and that the regulations
        that would have introduced the lower limit will be revoked. Provider articles written before then may still mention
        the old plan. For any tax year after {ISA_RULES.taxYear}, check GOV.UK before relying on a figure here.
      </P>

      <H2>What this guide leaves out</H2>
      <UL>
        <li>Which type of ISA suits you. Our guide to <a {...inlineLink(navigateTo, '/guides/cash-isa-vs-stocks-and-shares-isa')}>Cash ISA and Stocks and Shares ISA differences</a> explains the trade-offs without recommending one.</li>
        <li>Lifetime ISA conditions and charges, covered in the <a {...inlineLink(navigateTo, '/guides/lifetime-isa-rules-uk')}>Lifetime ISA rules guide</a>.</li>
        <li>Special cases such as the extra allowance a surviving spouse or civil partner can claim, ISAs for people who are not UK resident, and rules for Junior ISA holders turning 18. GOV.UK covers these.</li>
      </UL>

      <Callout>
        This is general information, not financial or tax advice. If you are unsure how the rules apply to you, MoneyHelper
        offers free guidance and HMRC publishes the official rules.
      </Callout>

      <H2>Keeping track of how much you have used</H2>
      <P>
        Your providers show what you paid in, but not across providers. A running total of payments by account makes it
        easier to stay inside {gbp(ALLOWANCE)}. See{' '}
        <a {...inlineLink(navigateTo, '/track-isas-pensions-savings')}>how to track ISAs, pensions and savings together</a>, or
        project what a yearly ISA payment could grow to with the{' '}
        <a {...inlineLink(navigateTo, '/tools/isa-growth-calculator')}>ISA growth calculator</a>, which runs in your browser and sends nothing anywhere.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Keep your ISA balances next to your pensions, savings and debts. You enter the numbers yourself, so no bank
        connection is needed.
      </GuideCTA>

      <SourceList sources={sources} checked={lastCheckedFor('isa.')} formatDate={formatDate} />
    </GuideShell>
  )
}
