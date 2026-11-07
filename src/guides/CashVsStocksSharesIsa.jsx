import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { ISA_RULES } from '../isaRules'
import { figureOn, formatDate, gbp, lastCheckedFor, valueOn } from '../ukFigures'

export const CASH_VS_SS_PUBLISHED = '2026-11-07'
export const CASH_VS_SS_REVIEWED = '2026-11-07'

const ALLOWANCE = valueOn('isa.overall_allowance')
const PSA_BASIC = valueOn('income_tax.personal_savings_allowance_basic')
const PSA_HIGHER = valueOn('income_tax.personal_savings_allowance_higher')
const DIVIDEND_ALLOWANCE = valueOn('income_tax.dividend_allowance')
const FSCS_DEPOSITS = valueOn('fscs.deposit_protection_limit')
const SAVINGS_BASIC_NEXT = valueOn('income_tax.savings_rate_basic', '2027-05-01')
const SAVINGS_HIGHER_NEXT = valueOn('income_tax.savings_rate_higher', '2027-05-01')

const RATES = [0.03, 0.04, 0.05]
const grow = (amount, rate, years) => amount * Math.pow(1 + rate, years)

export default function CashVsStocksSharesIsa({ navigateTo, goTo }) {
  const sources = [
    { title: 'Individual Savings Accounts (ISAs)', org: 'GOV.UK', url: 'https://www.gov.uk/individual-savings-accounts' },
    { title: 'Changes to tax rates for property, savings and dividend income', org: 'GOV.UK', url: figureOn('income_tax.personal_savings_allowance_basic', new Date()).sourceUrl },
    { title: 'What is the Financial Services Compensation Scheme?', org: 'Bank of England', url: figureOn('fscs.deposit_protection_limit', new Date()).sourceUrl },
    { title: 'What FSCS protects: investments and the investment limit', org: 'Financial Services Compensation Scheme', url: 'https://www.fscs.org.uk' },
    { title: 'Free, impartial money guidance', org: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk' },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/cash-isa-vs-stocks-and-shares-isa"
      heroLabel="ISAs and tax years"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">ISAs and tax years</div>
      <h1 className="guide-h1">Cash ISA vs Stocks and Shares ISA: the differences</h1>
      <ArticleDates published={CASH_VS_SS_PUBLISHED} reviewed={CASH_VS_SS_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        Both are tax-free wrappers and both count towards the same {gbp(ALLOWANCE)} yearly ISA allowance. The difference is
        what sits inside. A Cash ISA holds savings that earn interest, and the balance does not fall because markets do. A
        Stocks and Shares ISA holds investments such as funds, whose value can rise or fall, so you can get back less than
        you paid in. Which one fits depends on when you need the money and how you would cope with a fall, and this guide
        does not recommend one.
      </QuickAnswerBox>

      <H2>The main differences</H2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th />
              <th>Cash ISA</th>
              <th>Stocks and Shares ISA</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>What it holds</td><td>Cash deposits earning interest</td><td>Investments such as funds, shares and bonds</td></tr>
            <tr><td>Can the value fall?</td><td>Not from market movements. Inflation can still reduce what the money buys.</td><td>Yes. You can get back less than you paid in.</td></tr>
            <tr><td>Tax on returns</td><td>Interest is tax-free</td><td>Dividends and gains are tax-free</td></tr>
            <tr><td>If the provider fails</td><td>Deposits are covered by the FSCS up to {gbp(FSCS_DEPOSITS)} per person per authorised firm</td><td>The FSCS can cover some losses if an investment firm fails, but not falls in investment value. It has a separate limit; check fscs.org.uk.</td></tr>
            <tr><td>Uses the ISA allowance?</td><td>Yes, shared {gbp(ALLOWANCE)}</td><td>Yes, shared {gbp(ALLOWANCE)}</td></tr>
          </tbody>
        </table>
      </div>

      <H2>Why the tax-free wrapper matters</H2>
      <P>
        Outside an ISA, savings interest is taxable once it passes your Personal Savings Allowance: {gbp(PSA_BASIC)} for
        basic-rate taxpayers and {gbp(PSA_HIGHER)} for higher-rate taxpayers. Dividends outside an ISA are taxable above a
        separate {gbp(DIVIDEND_ALLOWANCE)} dividend allowance. Inside an ISA, neither counts. The government plans to raise
        tax rates on savings income from April 2027 (basic rate to {SAVINGS_BASIC_NEXT}% and higher rate to {SAVINGS_HIGHER_NEXT}%),
        which would make the wrapper worth a little more to anyone over their allowance.
      </P>

      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Interest rate</th>
              <th>Cash that earns {gbp(PSA_BASIC)} a year</th>
              <th>Cash that earns {gbp(PSA_HIGHER)} a year</th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((rate) => (
              <tr key={rate}>
                <td>{Math.round(rate * 100)}%</td>
                <td>{gbp(Math.round(PSA_BASIC / rate))}</td>
                <td>{gbp(Math.round(PSA_HIGHER / rate))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Read the table as the cash balance at which a year&apos;s interest reaches the allowance, so interest on any balance
        above it would be taxable outside an ISA. Some people also have a starting rate for savings band on top, which
        depends on their other income.
      </P>

      <H2>What the outcomes could look like</H2>
      <Example>
        {gbp(10000)} left for 10 years grows to {gbp(Math.round(grow(10000, 0.03, 10)))} at 3% a year,{' '}
        {gbp(Math.round(grow(10000, 0.05, 10)))} at 5% and {gbp(Math.round(grow(10000, 0.07, 10)))} at 7%, before charges and
        inflation. Those are illustrations, not forecasts. A Cash ISA&apos;s rate is stated by the provider and can change; an
        investment has no guaranteed rate, and a 20% fall in value turns {gbp(10000)} into {gbp(8000)} until prices recover, if
        they do. Use the <a {...inlineLink(navigateTo, '/tools/isa-growth-calculator')}>ISA growth calculator</a> to try your
        own assumptions.
      </Example>

      <H2>Questions that decide which suits a given pot</H2>
      <UL>
        <li><strong>When will you need the money?</strong> The nearer the date, the less time there is to recover from a fall.</li>
        <li><strong>How would a fall feel?</strong> Seeing a balance drop is different from knowing it might.</li>
        <li><strong>What is it for?</strong> An emergency fund, a house deposit and retirement savings have different needs.</li>
        <li><strong>Is inflation a concern?</strong> Cash interest can be above or below inflation; check the current rate against it.</li>
        <li><strong>Do you need both?</strong> The {gbp(ALLOWANCE)} allowance can be split between types, and many people hold one of each.</li>
      </UL>

      <H2>Moving between types</H2>
      <P>
        Money already in an ISA can usually be moved from a Cash ISA to a Stocks and Shares ISA, or the reverse, using your
        provider&apos;s transfer process, and it keeps its tax-free status. The transfer does not use new allowance. Not every
        provider accepts every kind of transfer, so check before you start. See the{' '}
        <a {...inlineLink(navigateTo, '/guides/isa-allowance-uk')}>ISA allowance guide</a> for how payments and withdrawals count.
      </P>

      <H2>What this guide leaves out</H2>
      <UL>
        <li>Which provider, fund or product to choose. That is a regulated activity and depends on your situation.</li>
        <li>Fees, which vary a lot between platforms and funds and reduce returns.</li>
        <li>Lifetime ISAs, which come in cash and investment versions and have their own rules (see the <a {...inlineLink(navigateTo, '/guides/lifetime-isa-rules-uk')}>Lifetime ISA guide</a>).</li>
      </UL>

      <Callout>
        This is general information, not financial advice. For help deciding, MoneyHelper offers free guidance, and a
        regulated financial adviser can look at your whole situation.
      </Callout>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        See your Cash ISA, Stocks and Shares ISA and pension balances together, so the split is visible. You enter the
        balances yourself, with no bank connection.
      </GuideCTA>

      <SourceList sources={sources} checked={lastCheckedFor('income_tax.personal_savings')} formatDate={formatDate} />
    </GuideShell>
  )
}
