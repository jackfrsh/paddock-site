import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { ISA_RULES } from '../isaRules'
import { figureOn, formatDate, gbp, lastCheckedFor, taxYearOf, valueOn } from '../ukFigures'

export const END_OF_YEAR_PUBLISHED = '2026-11-07'
export const END_OF_YEAR_REVIEWED = '2026-11-07'

const YEAR = taxYearOf()
const ALLOWANCE = valueOn('isa.overall_allowance')
const LISA_LIMIT = valueOn('isa.lifetime_isa.annual_limit')
const LISA_BONUS = valueOn('isa.lifetime_isa.bonus_rate')
const ANNUAL_ALLOWANCE = valueOn('pension.annual_allowance')
const MPAA = valueOn('pension.money_purchase_annual_allowance')
const PSA_BASIC = valueOn('income_tax.personal_savings_allowance_basic')
const PSA_HIGHER = valueOn('income_tax.personal_savings_allowance_higher')
const DIVIDEND_ALLOWANCE = valueOn('income_tax.dividend_allowance')

// Illustrative balances for the year-on-year example.
const START = 184000
const PAID_IN = 9000
const END = 201500

export default function EndOfTaxYearChecklistUK({ navigateTo, goTo }) {
  const sources = [
    { title: 'Individual Savings Accounts (ISAs)', org: 'GOV.UK', url: 'https://www.gov.uk/individual-savings-accounts' },
    { title: 'Lifetime ISA', org: 'GOV.UK', url: 'https://www.gov.uk/lifetime-isa' },
    { title: 'Pension schemes rates and allowances', org: 'GOV.UK', url: figureOn('pension.annual_allowance', new Date()).sourceUrl },
    { title: 'Changes to tax rates for property, savings and dividend income', org: 'GOV.UK', url: figureOn('income_tax.personal_savings_allowance_basic', new Date()).sourceUrl },
    { title: 'Check your State Pension forecast', org: 'GOV.UK', url: 'https://www.gov.uk/check-state-pension' },
    { title: 'Tax-free savings newsletter 24 (October 2026)', org: 'HMRC', url: ISA_RULES.hmrcNewsletterUrl },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/end-of-tax-year-checklist-uk"
      heroLabel="ISAs and tax years"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">ISAs and tax years</div>
      <h1 className="guide-h1">End of the tax year checklist for savers and investors</h1>
      <ArticleDates published={END_OF_YEAR_PUBLISHED} reviewed={END_OF_YEAR_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        The {YEAR.label} tax year ends on {formatDate(YEAR.end)} and the next one starts on{' '}
        {formatDate(taxYearOf(`${Number(YEAR.end.slice(0, 4))}-04-06`).start)}. Allowances that reset on 6 April, such as the {gbp(ALLOWANCE)} ISA
        allowance, are lost if you do not use them. Before the year ends, check how much ISA allowance you have used, whether
        you want to claim the full Lifetime ISA bonus, how much pension annual allowance you have used, and record your
        balances so you can compare year on year.
      </QuickAnswerBox>

      <H2>The checklist</H2>
      <UL>
        <li><strong>1. ISA allowance.</strong> Add up what you have paid in across every ISA this year. The limit is {gbp(ALLOWANCE)} in total and it does not carry over. See the <a {...inlineLink(navigateTo, '/guides/isa-allowance-uk')}>ISA allowance guide</a>.</li>
        <li><strong>2. Lifetime ISA bonus.</strong> The government adds {LISA_BONUS}% of what you pay in, on up to {gbp(LISA_LIMIT)} a year. Payments for this year must be made by the end of the tax year. Details are in the <a {...inlineLink(navigateTo, '/guides/lifetime-isa-rules-uk')}>Lifetime ISA guide</a>.</li>
        <li><strong>3. Pension contributions.</strong> The pension annual allowance is {gbp(ANNUAL_ALLOWANCE)} for most people, limited by your earnings and reduced for very high earners. If you have taken flexible money from a defined contribution pension, the money purchase annual allowance of {gbp(MPAA)} may apply instead. GOV.UK explains how unused allowance from earlier years can sometimes be carried forward.</li>
        <li><strong>4. Savings interest and dividends outside ISAs.</strong> Interest above the Personal Savings Allowance ({gbp(PSA_BASIC)} for basic-rate and {gbp(PSA_HIGHER)} for higher-rate taxpayers) and dividends above {gbp(DIVIDEND_ALLOWANCE)} can be taxable. Interest and dividends earned inside an ISA are tax-free, so some people move savings into an ISA before the year ends.</li>
        <li><strong>5. Your State Pension record.</strong> GOV.UK lets you check your State Pension forecast and National Insurance record. It is worth a look if you have had gaps in work.</li>
        <li><strong>6. A year-end balance snapshot.</strong> Write down the value of every account on or near 5 April. Without it, it is hard to tell next year how much of the change was your payments and how much was growth.</li>
      </UL>

      <Example>
        Your accounts total {gbp(START)} on 5 April last year and {gbp(END)} this year, a rise of {gbp(END - START)}. You paid in{' '}
        {gbp(PAID_IN)} over the year, so {gbp(END - START - PAID_IN)} came from investment growth and interest. Without both
        figures, the whole {gbp(END - START)} could look like performance or like saving.
      </Example>

      <H2>What changes on 6 April</H2>
      <UL>
        <li>The ISA allowance resets. HMRC says the {gbp(ALLOWANCE)} Cash ISA limit is retained for {taxYearOf(`${Number(YEAR.end.slice(0, 4))}-04-06`).label} and that the planned cut to {gbp(ISA_RULES.cancelledCashIsaLimit)} will be revoked. Check GOV.UK for the final position.</li>
        <li>The government plans to raise tax rates on savings income by two percentage points from April 2027. This applies to interest outside an ISA.</li>
        <li>Allowances are reviewed each year. Check the figures on GOV.UK before relying on a number from a previous year.</li>
      </UL>

      <H2>What this checklist leaves out</H2>
      <UL>
        <li>Capital Gains Tax, Self Assessment deadlines and other reporting duties, which depend on your circumstances. HMRC publishes them.</li>
        <li>Whether you should use your allowances at all. That depends on your cash flow and goals.</li>
        <li>Rules for Scottish taxpayers, which differ for income tax rates and bands.</li>
      </UL>

      <Callout>
        This is general information, not financial or tax advice. If a deadline matters to you, confirm it with your provider
        and HMRC, because providers can have earlier cut-off dates for processing payments and transfers.
      </Callout>

      <P>
        If you track your wealth over time, the year-end balance is the best point to compare. See{' '}
        <a {...inlineLink(navigateTo, '/how-to-track-your-net-worth')}>how to track your net worth</a> for a simple routine, and{' '}
        <a {...inlineLink(navigateTo, '/guides/net-worth-vs-investable-wealth')}>net worth versus investable wealth</a> for what to
        include.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Record your balances before 5 April and keep them in one place, so next year&apos;s comparison is a glance rather than a
        hunt through statements. No bank connection needed.
      </GuideCTA>

      <SourceList sources={sources} checked={[lastCheckedFor('isa.'), lastCheckedFor('income_tax.personal_savings'), lastCheckedFor('pension.annual')].sort()[0]} formatDate={formatDate} />
    </GuideShell>
  )
}
