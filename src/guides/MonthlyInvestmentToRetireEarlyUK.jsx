import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { figureOn, formatDate, gbp, lastCheckedFor, pensionAccessAge, valueOn } from '../ukFigures'
import { monthlySavingNeeded, targetPot, totalPaidIn } from '../retireEarlyMaths'

export const RETIRE_EARLY_PUBLISHED = '2026-11-07'
export const RETIRE_EARLY_REVIEWED = '2026-11-07'

// The scenario: someone aged 35 who wants a yearly income in today's money.
const START_AGE = 35
const SPEND = 30000
const WITHDRAWAL_RATE = 0.04
const RETIRE_AGES = [55, 60, 65]
const RETURNS = [0.03, 0.04, 0.05]
const HEAD_START = 30000
const TARGET = targetPot(SPEND, WITHDRAWAL_RATE)
const STATE_PENSION = valueOn('state_pension.new_full_rate_annual')

const need = (retireAge, annualRate, startingPot = 0, startAge = START_AGE) =>
  Math.round(monthlySavingNeeded({ target: TARGET, startingPot, years: retireAge - startAge, annualRate }))

export default function MonthlyInvestmentToRetireEarlyUK({ navigateTo, goTo }) {
  const access = pensionAccessAge()
  const at55 = need(55, 0.04)
  const at60 = need(60, 0.04)
  const at65 = need(65, 0.04)
  const bridgeYears = Math.max((access.next ?? access.now) - 55, 0)
  const sources = [
    { title: 'New State Pension rates', org: 'GOV.UK', url: figureOn('state_pension.new_full_rate_annual', new Date()).sourceUrl },
    { title: 'Increasing normal minimum pension age', org: 'GOV.UK', url: 'https://www.gov.uk/government/publications/increasing-normal-minimum-pension-age' },
    { title: 'Check your State Pension forecast', org: 'GOV.UK', url: 'https://www.gov.uk/check-state-pension' },
    { title: 'Retirement Living Standards', org: 'Pensions and Lifetime Savings Association', url: 'https://www.retirementlivingstandards.org.uk' },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/monthly-investment-to-retire-early-uk"
      heroLabel="Retirement planning"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Retirement planning</div>
      <h1 className="guide-h1">How much to invest each month to retire early in the UK</h1>
      <ArticleDates published={RETIRE_EARLY_PUBLISHED} reviewed={RETIRE_EARLY_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        Work out the pot you need (yearly spending ÷ a withdrawal rate such as 4%), then find the level monthly payment that
        grows to it by your retirement date. For {gbp(SPEND)} a year in today&apos;s money the pot is {gbp(TARGET)}. Starting
        from nothing at {START_AGE}, with growth of 4% a year after inflation, that takes about {gbp(at55)} a month to retire at
        55, {gbp(at60)} at 60 and {gbp(at65)} at 65. These are illustrations, not forecasts, and they ignore tax, charges and the
        State Pension.
      </QuickAnswerBox>

      <H2>The method</H2>
      <UL>
        <li><strong>1. Choose the yearly income you want</strong>, in today&apos;s money.</li>
        <li><strong>2. Convert it to a pot.</strong> At a 4% withdrawal rate the pot is 25 times the income. At 3.5% it is about 28.6 times, which is more cautious. Our <a {...inlineLink(navigateTo, '/guides/how-much-do-i-need-to-retire-uk')}>retirement pot guide</a> explains the rate.</li>
        <li><strong>3. Count the years</strong> between now and the date you stop work.</li>
        <li><strong>4. Assume a growth rate after inflation.</strong> For example, 6.5% a year with 2.5% inflation is about 3.9% in today&apos;s money. Working in today&apos;s money means the monthly payments below also rise with prices.</li>
        <li><strong>5. Solve for the monthly payment</strong> that compounds to the pot over those years.</li>
      </UL>

      <H2>Monthly payment needed, starting from nothing at {START_AGE}</H2>
      <P>
        Target pot {gbp(TARGET)} ({gbp(SPEND)} a year at a {WITHDRAWAL_RATE * 100}% withdrawal rate). Growth rates are after
        inflation. Payments are level and made at the end of each month.
      </P>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Retire at</th>
              <th>Years saving</th>
              {RETURNS.map((r) => <th key={r}>{Math.round(r * 100)}% growth</th>)}
            </tr>
          </thead>
          <tbody>
            {RETIRE_AGES.map((age) => (
              <tr key={age}>
                <td>{age}</td>
                <td>{age - START_AGE}</td>
                {RETURNS.map((r) => <td key={r}>{gbp(need(age, r))} a month</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>The same, with {gbp(HEAD_START)} already saved</H2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Retire at</th>
              <th>Years saving</th>
              {RETURNS.map((r) => <th key={r}>{Math.round(r * 100)}% growth</th>)}
            </tr>
          </thead>
          <tbody>
            {RETIRE_AGES.map((age) => (
              <tr key={age}>
                <td>{age}</td>
                <td>{age - START_AGE}</td>
                {RETURNS.map((r) => <td key={r}>{gbp(need(age, r, HEAD_START))} a month</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Example>
        Retiring at 55 with 4% growth from nothing needs {gbp(at55)} a month for 20 years. That is {gbp(totalPaidIn({ monthly: at55, years: 20 }))} paid
        in, and {gbp(TARGET - totalPaidIn({ monthly: at55, years: 20 }))} of the {gbp(TARGET)} pot comes from growth. Starting
        five years later (age 40) for the same date of 55 needs {gbp(need(55, 0.04, 0, 40))} a month, which is{' '}
        {gbp(need(55, 0.04, 0, 40) - at55)} more each month. Time does more of the work than the amount does, which is why
        the early years of saving matter.
      </Example>

      <H2>What changes the answer most</H2>
      <UL>
        <li><strong>The date you stop.</strong> Moving from 55 to 60 cuts the monthly payment in the first table by more than a quarter at 4% growth.</li>
        <li><strong>The income you want.</strong> The pot, and so the payment, scales directly with it: half the spending needs about half the pot.</li>
        <li><strong>Returns.</strong> Higher assumed growth lowers the payment, but nobody knows future returns. Compare the 3%, 4% and 5% columns rather than relying on one.</li>
        <li><strong>The State Pension.</strong> This page ignores it, which is deliberately cautious. The full new State Pension is {gbp(STATE_PENSION)} a year in today&apos;s money. When it starts it reduces the income your pot must provide.</li>
      </UL>

      <H2>The gap before you can reach a pension</H2>
      <P>
        The pension access age is currently {access.now}
        {access.next ? `, rising to ${access.next} on ${access.nextFrom}` : ''}, and the State Pension age is later still. If you stop
        work at 55, the first {bridgeYears} {bridgeYears === 1 ? 'year' : 'years'} on today&apos;s rules have to be paid for from money outside your
        pension, such as ISAs. At {gbp(SPEND)} a year that is {gbp(SPEND * bridgeYears)} that must already be reachable on the day you stop. The{' '}
        <a {...inlineLink(navigateTo, '/tools/retirement-bridge-calculator')}>retirement bridge calculator</a> shows how large the
        gap could be, and the <a {...inlineLink(navigateTo, '/tools/retirement-age-calculator')}>retirement age calculator</a> finds
        the earliest age your current savings and payments could support. A Lifetime ISA has its own age limit; see the{' '}
        <a {...inlineLink(navigateTo, '/guides/lifetime-isa-rules-uk')}>Lifetime ISA rules guide</a>.
      </P>

      <H2>What this guide leaves out</H2>
      <UL>
        <li><strong>Tax and tax relief.</strong> Pension contributions can get tax relief and ISA contributions do not. Withdrawals from pensions are taxed differently from ISA withdrawals. None of that is modelled.</li>
        <li><strong>Charges.</strong> Fund and platform fees reduce growth; deduct them from the growth rate if you know them.</li>
        <li><strong>Uneven returns.</strong> Real markets do not grow by a fixed amount each year, and a fall just before you retire matters more than one earlier. The 4% rule is a rule of thumb from past US data, not a guarantee.</li>
        <li><strong>Pay rises, breaks and one-off sums.</strong> Real saving is rarely level. The method works for a rough number, then needs updating as life changes.</li>
        <li><strong>Where to invest.</strong> This page does not say which investments or accounts to use.</li>
      </UL>

      <Callout>
        These calculations are illustrations of arithmetic, not a plan for you and not financial advice. If you are close to
        retiring, or the sums are large, MoneyHelper offers free guidance and a regulated adviser can look at your whole situation.
      </Callout>

      <P>
        To see where you stand today, enter your balances in the{' '}
        <a {...inlineLink(navigateTo, '/tools/net-worth-calculator')}>net worth calculator</a>, then compare your total with the pot you need
        using the <a {...inlineLink(navigateTo, '/tools/fire-number-calculator')}>FIRE number calculator</a>. For the difference between your
        net worth and the part you can actually spend, read{' '}
        <a {...inlineLink(navigateTo, '/guides/net-worth-vs-investable-wealth')}>net worth versus investable wealth</a>.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Track the real balances against the pot you are aiming for. Paddock Pro adds long-term projections and a required
        contribution tool, and the free plan lets you record your accounts. You enter the numbers yourself, so no bank
        connection is needed.
      </GuideCTA>

      <SourceList sources={sources} checked={lastCheckedFor('state_pension.')} formatDate={formatDate} />
    </GuideShell>
  )
}
