import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { inlineLink } from './inlineLink'
import { formatDate, gbp, pensionAccessAge } from '../ukFigures'

export const NW_INVESTABLE_PUBLISHED = '2026-11-07'
export const NW_INVESTABLE_REVIEWED = '2026-11-07'

// Illustrative household. None of these figures is a benchmark.
const ASSETS = [
  { label: 'Home', value: 420000, group: 'property' },
  { label: 'Workplace and personal pensions', value: 150000, group: 'pension' },
  { label: 'Stocks and Shares ISAs', value: 55000, group: 'accessible' },
  { label: 'Cash ISA and savings', value: 35000, group: 'accessible' },
  { label: 'Car', value: 9000, group: 'physical' },
]
const LIABILITIES = [
  { label: 'Mortgage', value: 260000 },
  { label: 'Credit card', value: 1800 },
]

const sum = (rows) => rows.reduce((total, row) => total + row.value, 0)
const TOTAL_ASSETS = sum(ASSETS)
const TOTAL_DEBTS = sum(LIABILITIES)
const NET_WORTH = TOTAL_ASSETS - TOTAL_DEBTS
const HOME_VALUE = ASSETS.find((row) => row.group === 'property').value
const MORTGAGE = LIABILITIES.find((row) => row.label === 'Mortgage').value
const CARD = LIABILITIES.find((row) => row.label === 'Credit card').value
const HOME_EQUITY = HOME_VALUE - MORTGAGE
const ACCESSIBLE_NET = sum(ASSETS.filter((row) => row.group === 'accessible')) - CARD
const PENSIONS = sum(ASSETS.filter((row) => row.group === 'pension'))
const NON_HOUSING_NET_WORTH = NET_WORTH - HOME_EQUITY

export default function NetWorthVsInvestableWealth({ navigateTo, goTo }) {
  const access = pensionAccessAge()
  const sources = [
    { title: 'Household total wealth in Great Britain: April 2020 to March 2022', org: 'Office for National Statistics', url: 'https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/bulletins/totalwealthingreatbritain/april2020tomarch2022' },
    { title: 'Measuring wealth on an individual level', org: 'Office for National Statistics', url: 'https://www.ons.gov.uk/peoplepopulationandcommunity/personalandhouseholdfinances/incomeandwealth/methodologies/measuringwealthonanindividuallevel' },
    { title: 'Increasing normal minimum pension age', org: 'GOV.UK', url: 'https://www.gov.uk/government/publications/increasing-normal-minimum-pension-age' },
  ]

  return (
    <GuideShell
      canonicalPath="/guides/net-worth-vs-investable-wealth"
      heroLabel="Net worth"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Net worth</div>
      <h1 className="guide-h1">Net worth vs investable wealth: what is the difference?</h1>
      <ArticleDates published={NW_INVESTABLE_PUBLISHED} reviewed={NW_INVESTABLE_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        Net worth is everything you own minus everything you owe, including your home and your pensions. Investable wealth
        is the part you could actually invest or spend, which usually leaves out your home, car and belongings, and which some
        people split further into money you can reach now and money locked in pensions. There is no single official
        definition of investable wealth, so state what you counted whenever you quote the number.
      </QuickAnswerBox>

      <H2>The two measures side by side</H2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr><th />
              <th>Net worth</th>
              <th>Investable wealth</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Counts</td><td>All assets minus all debts</td><td>Assets you could invest or draw on</td></tr>
            <tr><td>Your home</td><td>Yes, the value minus the mortgage</td><td>Usually no</td></tr>
            <tr><td>Pensions</td><td>Yes</td><td>Often yes, but they cannot be reached before the pension access age</td></tr>
            <tr><td>Car and belongings</td><td>Sometimes (ONS counts them as physical wealth)</td><td>No</td></tr>
            <tr><td>Debts</td><td>Subtracted</td><td>Usually subtracted if the money would repay them</td></tr>
            <tr><td>Best for</td><td>Seeing overall progress over the years</td><td>Planning income, retirement and early-retirement dates</td></tr>
          </tbody>
        </table>
      </div>
      <P>
        The Office for National Statistics measures household wealth as four parts: net property wealth, net financial
        wealth, private pension wealth and physical wealth such as vehicles and household contents, all net of debts. That is a
        net-worth measure. It is useful for comparing over time, but it is not the money you can spend.
      </P>

      <H2>A worked example</H2>
      <div className="guide-table-wrap">
        <table className="guide-table">
          <thead>
            <tr><th>Item</th><th>Value</th></tr>
          </thead>
          <tbody>
            {ASSETS.map((row) => (
              <tr key={row.label}><td>{row.label}</td><td>{gbp(row.value)}</td></tr>
            ))}
            <tr><td><strong>Total assets</strong></td><td><strong>{gbp(TOTAL_ASSETS)}</strong></td></tr>
            {LIABILITIES.map((row) => (
              <tr key={row.label}><td>{row.label}</td><td>−{gbp(row.value)}</td></tr>
            ))}
            <tr><td><strong>Net worth</strong></td><td><strong>{gbp(NET_WORTH)}</strong></td></tr>
          </tbody>
        </table>
      </div>
      <Example>
        This household&apos;s net worth is {gbp(TOTAL_ASSETS)} − {gbp(TOTAL_DEBTS)} = {gbp(NET_WORTH)}. Of that, {gbp(HOME_EQUITY)} is
        home equity ({gbp(HOME_VALUE)} less the {gbp(MORTGAGE)} mortgage). Leave the home and its mortgage out and the figure is{' '}
        {gbp(NON_HOUSING_NET_WORTH)}. Leave the pensions and the car out as well and what is available now is the ISAs and savings
        less the credit card: {gbp(ACCESSIBLE_NET)}, about {Math.round((ACCESSIBLE_NET / NET_WORTH) * 100)}% of the headline net
        worth. Adding the pensions gives {gbp(ACCESSIBLE_NET + PENSIONS)}, but the {gbp(PENSIONS)} of pensions cannot normally be
        reached before age {access.now}
        {access.next ? ` (rising to ${access.next} on ${access.nextFrom})` : ''}.
      </Example>

      <H2>Which number to use for which question</H2>
      <UL>
        <li><strong>&quot;Am I making progress?&quot;</strong> Net worth, tracked at the same date each year. It captures house price moves, mortgage repayment and saving together.</li>
        <li><strong>&quot;How much could I live off?&quot;</strong> Investable wealth, with the home left out unless you plan to sell it. The <a {...inlineLink(navigateTo, '/tools/fire-number-calculator')}>FIRE number calculator</a> and the <a {...inlineLink(navigateTo, '/guides/how-much-do-i-need-to-retire-uk')}>retirement pot guide</a> work from this figure.</li>
        <li><strong>&quot;Can I stop work before pension age?&quot;</strong> Only the part you can reach counts for the early years. The <a {...inlineLink(navigateTo, '/tools/retirement-bridge-calculator')}>retirement bridge calculator</a> shows the gap.</li>
      </UL>

      <H2>Common mistakes</H2>
      <UL>
        <li><strong>Counting the home as a retirement fund.</strong> It only becomes spendable if you sell or borrow against it.</li>
        <li><strong>Forgetting debts.</strong> Credit cards, loans and student loans belong in net worth. A mortgage belongs there too.</li>
        <li><strong>Mixing the two without saying.</strong> A figure of &quot;£250,000&quot; means very different things depending on what is inside it.</li>
        <li><strong>Treating valuations as certain.</strong> A home value is an estimate, and a car loses value. Update them on a schedule rather than daily.</li>
      </UL>

      <H2>What this guide leaves out</H2>
      <UL>
        <li><strong>An official definition.</strong> Surveys, wealth managers and tax rules each draw the line for &quot;investable&quot; in a different place.</li>
        <li><strong>Tax and costs.</strong> The totals above are before tax. Money taken from a pension is generally taxed, and selling a home has costs, so neither is the amount you would end up with.</li>
        <li><strong>Defined benefit pensions.</strong> A workplace pension that pays a set income has no pot to enter. Some people record an estimated value, others leave it out and treat the income separately.</li>
      </UL>

      <Callout>
        Everything in the example is illustrative and is not a benchmark for your own position. This is general information, not
        financial advice.
      </Callout>

      <P>
        To build your own version, start with the <a {...inlineLink(navigateTo, '/tools/net-worth-calculator')}>net worth calculator</a> or
        read <a {...inlineLink(navigateTo, '/how-to-track-your-net-worth')}>how to track your net worth</a>. If your money is spread across
        several pensions and ISAs, <a {...inlineLink(navigateTo, '/track-isas-pensions-savings')}>tracking ISAs, pensions and savings in one place</a> shows how
        to group them.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Keep one list of what you own and owe, grouped by account type, and see both your net worth and the part you can reach.
        You enter the balances yourself; no bank connection is needed.
      </GuideCTA>

      <SourceList sources={sources} checked="2026-11-07" formatDate={formatDate} />
    </GuideShell>
  )
}
