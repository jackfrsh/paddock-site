import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { figureOn, formatDate, gbp, lastCheckedFor, pensionAccessAge, taxYearOf, valueOn } from '../ukFigures'

export const HOW_MUCH_PUBLISHED = '2026-11-06'
export const HOW_MUCH_REVIEWED = '2026-11-06'

const TAX_YEAR = taxYearOf().label
const STATE_PENSION = valueOn('state_pension.new_full_rate_annual')
const STATE_PENSION_WEEKLY = valueOn('state_pension.new_full_rate_weekly')
const PERSONAL_ALLOWANCE = valueOn('income_tax.personal_allowance')
const LUMP_SUM_ALLOWANCE = valueOn('pension.lump_sum_allowance')
const NMPA = pensionAccessAge()

const INCOMES = [20000, 30000, 40000]
const potNeeded = (income, rate) => Math.max(income - STATE_PENSION, 0) / rate

function link(navigateTo, to) {
  return {
    href: to,
    className: 'guide-inline-link',
    onClick: (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      e.preventDefault()
      navigateTo(to)
    },
  }
}

export default function HowMuchToRetireUK({ navigateTo, goTo }) {
  const sources = [
    { title: 'New State Pension rates', org: figureOn('state_pension.new_full_rate_annual', new Date()).sourceName, url: figureOn('state_pension.new_full_rate_annual', new Date()).sourceUrl },
    { title: 'Income Tax rates and allowances', org: 'GOV.UK', url: figureOn('income_tax.personal_allowance', new Date()).sourceUrl },
    { title: 'Lump sum allowance', org: 'GOV.UK', url: figureOn('pension.lump_sum_allowance', new Date()).sourceUrl },
    { title: 'Check your State Pension forecast', org: 'GOV.UK', url: 'https://www.gov.uk/check-state-pension' },
    { title: 'Retirement Living Standards', org: 'Pensions and Lifetime Savings Association', url: 'https://www.retirementlivingstandards.org.uk' },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/how-much-do-i-need-to-retire-uk"
      heroLabel="Retirement planning"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Retirement planning</div>
      <h1 className="guide-h1">How much do I need to retire in the UK?</h1>
      <ArticleDates published={HOW_MUCH_PUBLISHED} reviewed={HOW_MUCH_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        Take the yearly income you want, subtract your State Pension, and divide what is left by a
        withdrawal rate such as 4%. For £30,000 a year that is about {gbp(potNeeded(30000, 0.04))}
        {' '}on top of the full new State Pension of {gbp(STATE_PENSION)} a year. If you stop work before
        State Pension age, add the years in between, because your savings must cover all of the income
        until the State Pension starts. This is a planning estimate, not a promise.
      </QuickAnswerBox>

      <H2>The sum, step by step</H2>
      <UL>
        <li><strong>1. Pick the income you want</strong>, in today&apos;s money. The Pensions and Lifetime Savings Association publishes Retirement Living Standards that show what different spending levels buy.</li>
        <li><strong>2. Subtract your State Pension.</strong> The full new State Pension is {gbp(STATE_PENSION_WEEKLY, { pence: true })} a week ({gbp(STATE_PENSION, { pence: true })} a year) in {TAX_YEAR}. Your own amount depends on your National Insurance record, so check your forecast on GOV.UK.</li>
        <li><strong>3. Divide by a withdrawal rate.</strong> At 4% the pot is 25 times the income it must provide. At 3.5% it is about 28.6 times. A lower rate is more cautious.</li>
        <li><strong>4. Add the gap if you retire early.</strong> Until State Pension age the pot has to pay the whole income, so each earlier year adds one more year of income to the pot you need.</li>
      </UL>

      <H2>What the sum gives for three incomes</H2>
      <P>
        These figures are for one person with the full new State Pension, in today&apos;s money, retiring at or after
        State Pension age. They are before tax and before any charges.
      </P>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr>
              <th>Income wanted</th>
              <th>From State Pension</th>
              <th>Needed from savings</th>
              <th>Pot at 4%</th>
              <th>Pot at 3.5%</th>
            </tr>
          </thead>
          <tbody>
            {INCOMES.map((income) => (
              <tr key={income}>
                <td>{gbp(income)}</td>
                <td>{gbp(STATE_PENSION)}</td>
                <td>{gbp(income - STATE_PENSION)}</td>
                <td>{gbp(potNeeded(income, 0.04))}</td>
                <td>{gbp(potNeeded(income, 0.035))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Example>
        You want {gbp(30000)} a year. The State Pension covers {gbp(STATE_PENSION)}, so savings must provide
        {' '}{gbp(30000 - STATE_PENSION)}. At a 4% withdrawal rate that needs {gbp(30000 - STATE_PENSION)} ÷ 0.04 ={' '}
        {gbp(potNeeded(30000, 0.04))}. If you stopped work five years before State Pension age, add 5 × {gbp(30000)} ={' '}
        {gbp(150000)} to cover the gap, giving {gbp(potNeeded(30000, 0.04) + 150000)}.
      </Example>

      <H2>Tax changes the picture</H2>
      <P>
        The State Pension is taxable income. The Personal Allowance is {gbp(PERSONAL_ALLOWANCE)} in {TAX_YEAR}, and a full
        State Pension is {gbp(STATE_PENSION, { pence: true })}, so only {gbp(PERSONAL_ALLOWANCE - STATE_PENSION, { pence: true })} of the
        allowance is left for other income. Pension withdrawals above any tax-free part are therefore likely to be taxed
        from the first pound. You can usually take up to 25% of a pension tax-free, up to a lump sum allowance of{' '}
        {gbp(LUMP_SUM_ALLOWANCE)} for most people. The figures in the table above are before tax, so the income you keep
        will be lower.
      </P>

      <H2>Retiring before State Pension age</H2>
      <P>
        You can usually take money from a private pension from age {NMPA.now}
        {NMPA.next ? `, rising to ${NMPA.next} on ${NMPA.nextFrom}` : ''}. If you stop work earlier than that, the money has to
        come from savings you can reach, such as ISAs. The{' '}
        <a {...link(navigateTo, '/tools/retirement-bridge-calculator')}>retirement bridge calculator</a> shows what a gap before
        pension age could cost, and the{' '}
        <a {...link(navigateTo, '/tools/retirement-age-calculator')}>retirement age calculator</a> finds the earliest age your
        savings could cover the income you want.
      </P>

      <H2>What this simple sum leaves out</H2>
      <UL>
        <li><strong>Inflation.</strong> The table is in today&apos;s money. Your savings need to grow faster than prices to keep up.</li>
        <li><strong>Investment returns and charges.</strong> The 4% rule comes from US research on past returns. It is a rule of thumb and not a guarantee.</li>
        <li><strong>Couples.</strong> Two people can each have a State Pension, but only if each has the National Insurance record for it.</li>
        <li><strong>Spending that changes.</strong> Many people spend more early in retirement and less later, and care costs can arrive late.</li>
        <li><strong>Other income.</strong> Workplace defined benefit pensions, rental income and part-time work all reduce the pot you need.</li>
      </UL>

      <Callout>
        The right figure for you depends on your own spending, health, tax position and appetite for risk. If you are close to
        retiring, free guidance is available from MoneyHelper, and regulated financial advice can look at your whole situation.
      </Callout>

      <P>
        Once you know the pot you are aiming for, the next question is how to take money from it. Our guide to{' '}
        <a {...link(navigateTo, '/guides/pension-drawdown-explained')}>pension drawdown</a> explains the main option.
      </P>

      <P>
        If you already know the pot you want, the next sum is how much to put away each month. Our guide to{' '}
        <a {...link(navigateTo, '/guides/monthly-investment-to-retire-early-uk')}>saving to retire early</a> works through it for
        retirement at 55, 60 and 65, and{' '}
        <a {...link(navigateTo, '/guides/net-worth-vs-investable-wealth')}>net worth versus investable wealth</a> explains which of
        your assets count towards the pot.
      </P>

      <H2>Try it with your own numbers</H2>
      <P>
        The <a {...link(navigateTo, '/tools/fire-number-calculator')}>FIRE number calculator</a> turns a yearly spending figure into a
        target pot, and the <a {...link(navigateTo, '/tools/pension-drawdown-calculator')}>pension drawdown calculator</a> shows how long
        a pot could last. Both run in your browser and send nothing anywhere.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Track your real progress against your target. Enter your actual balances in Paddock and see how you are doing over time.
        No bank access required.
      </GuideCTA>

      <SourceList sources={sources} checked={lastCheckedFor('state_pension.')} formatDate={formatDate} />
    </GuideShell>
  )
}
