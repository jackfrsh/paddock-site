import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { formatDate, gbp, valueOn } from '../ukFigures'
import { simulate } from '../tools/mortgageCalc'

export const OVERPAY_PUBLISHED = '2026-11-15'
export const OVERPAY_REVIEWED = '2026-11-15'

// The worked example: an illustrative repayment mortgage, not anyone's own.
const BALANCE = 200000
const YEARS = 20
const EXTRA = 200
const RATES = [4, 5, 6]
const GROWTH_RATES = [3, 4, 5, 6, 7]
const SUM = 10000
const ALLOWANCE = valueOn('isa.overall_allowance')

const savedBy = (rate) => {
  const base = simulate({ balance: BALANCE, annualRatePct: rate, years: YEARS })
  const over = simulate({ balance: BALANCE, annualRatePct: rate, years: YEARS, monthly: EXTRA })
  const months = base.months - over.months
  return {
    interest: base.interest - over.interest,
    years: Math.floor(months / 12),
    months: months % 12,
    paidIn: EXTRA * over.months,
  }
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const grown = (rate, years = 10) => Math.round(SUM * Math.pow(1 + rate / 100, years))

export default function OverpayMortgageOrInvestUK({ navigateTo, goTo }) {
  const sources = [
    { title: 'Should you pay off your mortgage early?', org: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/should-you-pay-off-your-mortgage-early' },
    { title: 'Understanding mortgages and interest rates', org: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-interest-rate-options' },
    { title: 'How much does the average mortgage cost?', org: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk/en/blog/buy-or-rent-a-home/how-much-does-the-average-mortgage-cost' },
    { title: 'Individual Savings Accounts (ISAs)', org: 'GOV.UK', url: 'https://www.gov.uk/individual-savings-accounts' },
  ]
  const mid = savedBy(5)

  return (
    <GuideShell
      canonicalPath="/guides/overpay-mortgage-or-invest-uk"
      heroLabel="Mortgages and investing"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Mortgages and investing</div>
      <h1 className="guide-h1">Should you overpay your mortgage or invest? A UK guide</h1>
      <ArticleDates published={OVERPAY_PUBLISHED} reviewed={OVERPAY_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        Every pound you overpay stops costing you your mortgage rate, so overpaying works like a guaranteed return equal to that
        rate, before any early repayment charge. Investing could earn more or less, is not guaranteed, and may be taxed or
        charged. The comparison is your mortgage rate against what you could realistically earn after tax and fees, plus how much
        risk you can accept and how much cash you want to keep reachable. On a {gbp(BALANCE)} mortgage with {YEARS} years left at 5%,
        an extra {gbp(EXTRA)} a month saves about {gbp(Math.round(mid.interest / 100) * 100)} of interest. This is an explanation, not advice.
      </QuickAnswerBox>

      <H2>What overpaying actually does</H2>
      <P>
        On a repayment mortgage you owe interest on the balance. Paying more than the required amount cuts the balance sooner, so
        every later month&apos;s interest is calculated on less. MoneyHelper says overpaying means you pay less interest in future and
        pay off the mortgage sooner. Usually the payment stays the same and the term shortens; some lenders let you lower the
        payment instead.
      </P>
      <P>
        The table uses an example mortgage of {gbp(BALANCE)} with {YEARS} years left and an extra {gbp(EXTRA)} every month. The
        higher the rate, the more each overpaid pound saves.
      </P>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr><th>Mortgage rate</th><th>Interest saved</th><th>Mortgage-free sooner by</th><th>Extra paid in</th></tr>
          </thead>
          <tbody>
            {RATES.map((rate) => {
              const s = savedBy(rate)
              return (
                <tr key={rate}>
                  <td>{rate}%</td>
                  <td>{gbp(Math.round(s.interest / 100) * 100)}</td>
                  <td>{plural(s.years, 'year')} {plural(s.months, 'month')}</td>
                  <td>{gbp(Math.round(s.paidIn / 100) * 100)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <P>
        Try your own figures in the{' '}
        <a {...inlineLink(navigateTo, '/tools/mortgage-overpayment-calculator')}>mortgage overpayment calculator</a>.
      </P>

      <H2>The comparison that matters: rate against rate</H2>
      <P>
        Overpaying has no market risk. The saving is your mortgage rate, applied to the money you overpay, for as long as that
        rate applies. Investing, or putting money in savings, has a different shape: the return is uncertain, may be taxed,
        and fees come off it. So the fair question is whether you expect to beat your mortgage rate after tax and charges, by
        enough to justify the risk. MoneyHelper frames the savings side the same way: a savings or investment product needs to
        give a better return than the rate on your mortgage.
      </P>
      <P>
        The table shows what {gbp(SUM)} becomes after 10 years at a steady yearly rate. Read it either way: as the value of
        interest avoided by overpaying at that mortgage rate, or as growth from investing at that return. Real investment returns
        are not steady, and a mortgage rate may change when your deal ends.
      </P>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr><th>Yearly rate</th>{GROWTH_RATES.map((r) => <th key={r}>{r}%</th>)}</tr>
          </thead>
          <tbody>
            <tr><td>{gbp(SUM)} after 10 years</td>{GROWTH_RATES.map((r) => <td key={r}>{gbp(grown(r))}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <Example>
        If your mortgage costs 5%, overpaying {gbp(SUM)} is comparable to a steady 5% a year, with no tax on the saving. An investment
        would need to beat that after fees, and after tax if it sits outside an ISA or pension, to come out ahead, and it could
        also fall in value. Neither choice is right for everyone.
      </Example>

      <H2>Things that change the answer</H2>
      <UL>
        <li><strong>The overpayment limit.</strong> Many lenders let you overpay up to 10% a year without a charge, MoneyHelper says, but the limit is set by your deal. Going over it can mean an early repayment charge.</li>
        <li><strong>When your deal ends.</strong> If you want to pay more than the limit, MoneyHelper notes you can save up and pay it off in one go at the end of a fixed deal, which helps avoid extra fees. A new deal also changes the rate that matters for the comparison.</li>
        <li><strong>Access.</strong> Money paid into a standard mortgage is hard to get back. Flexible and offset mortgages let you overpay and draw the money back; savings and ISAs keep it reachable.</li>
        <li><strong>Pension contributions.</strong> MoneyHelper points out that employer contributions and tax relief can mean a pension gets you more than the mortgage interest you would save. That is worth checking before overpaying.</li>
        <li><strong>The ISA allowance.</strong> You can put up to {gbp(ALLOWANCE)} a tax year into ISAs, where growth and withdrawals are tax-free, so tax is less of a drag on the investing side inside that limit.</li>
        <li><strong>Timing within the year.</strong> If your lender charges interest daily, an earlier overpayment saves more; if it charges yearly, time it so it counts for that year&apos;s calculation.</li>
        <li><strong>Other debts.</strong> MoneyHelper advises clearing debts with higher interest rates, such as credit cards, before reducing a mortgage.</li>
        <li><strong>Peace of mind.</strong> Some people value owing less for its own sake. That is a legitimate reason, and it is not in the numbers.</li>
      </UL>

      <H2>What this guide leaves out</H2>
      <UL>
        <li><strong>Your own mortgage terms.</strong> Rates, fees, overpayment rules and charges vary by lender and deal.</li>
        <li><strong>Tax on your savings and investments.</strong> Outside an ISA or pension, interest, dividends and gains can be taxed. The table above ignores tax and fees.</li>
        <li><strong>Future rates and returns.</strong> The tables use steady rates for arithmetic. Nobody knows what rates or markets will do.</li>
        <li><strong>Which investment or account to use.</strong> This page does not recommend any.</li>
        <li><strong>Your whole situation.</strong> Job security, dependants, emergency savings and retirement plans all matter.</li>
      </UL>

      <Callout>
        This guide explains how the numbers work. It is not financial advice and does not tell you whether to overpay or invest.
        MoneyHelper offers free, impartial guidance, and a regulated mortgage or financial adviser can look at your whole
        situation.
      </Callout>

      <P>
        If you track your mortgage as a liability next to your savings, ISAs and pensions, you can see how paying it down changes
        your net worth. The{' '}
        <a {...inlineLink(navigateTo, '/tools/net-worth-calculator')}>net worth calculator</a> shows the total, and{' '}
        <a {...inlineLink(navigateTo, '/guides/net-worth-vs-investable-wealth')}>net worth versus investable wealth</a> explains
        why a home and its mortgage are treated differently from money you can invest. For the account side, see the{' '}
        <a {...inlineLink(navigateTo, '/guides/isa-allowance-uk')}>ISA allowance guide</a>.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Record your mortgage balance, savings and investments in one private place and watch your net worth over time. You enter
        the numbers yourself, so no bank connection is needed.
      </GuideCTA>

      <SourceList sources={sources} checked="2026-11-15" formatDate={formatDate} />
    </GuideShell>
  )
}
