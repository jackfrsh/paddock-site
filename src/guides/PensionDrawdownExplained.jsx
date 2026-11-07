import React from 'react'
import {
  GuideShell, H2, P, UL, Example, Callout, GuideCTA, ArticleDates, QuickAnswerBox, SourceList,
} from '../components/GuideLayout'
import { figureOn, formatDate, gbp, lastCheckedFor, pensionAccessAge, valueOn } from '../ukFigures'

export const DRAWDOWN_PUBLISHED = '2026-11-06'
export const DRAWDOWN_REVIEWED = '2026-11-06'

const NMPA = pensionAccessAge()
const ANNUAL_ALLOWANCE = valueOn('pension.annual_allowance')
const MPAA = valueOn('pension.money_purchase_annual_allowance')
const LUMP_SUM_ALLOWANCE = valueOn('pension.lump_sum_allowance')
const TAX_FREE_SHARE = valueOn('pension.tax_free_lump_sum_share')

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

export default function PensionDrawdownExplained({ navigateTo, goTo }) {
  const sources = [
    { title: 'Pension drawdown explained', org: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/what-is-flexible-retirement-income-pension-drawdown' },
    { title: 'The money purchase annual allowance (MPAA)', org: 'MoneyHelper', url: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement/tax-and-pensions/money-purchase-annual-allowance-mpaa' },
    { title: 'Personal pensions: how you can take your pension', org: 'GOV.UK', url: 'https://www.gov.uk/personal-pensions-your-rights/how-you-can-take-pension' },
    { title: 'Lump sum allowance', org: 'GOV.UK', url: figureOn('pension.lump_sum_allowance', new Date()).sourceUrl },
    { title: 'Pension schemes rates and allowances', org: 'GOV.UK', url: figureOn('pension.annual_allowance', new Date()).sourceUrl },
    { title: 'Pension Wise: free pension guidance', org: 'MoneyHelper', url: 'https://www.pensionwise.gov.uk' },
  ]

  const pot = 400000
  const taxFree = (pot * TAX_FREE_SHARE) / 100

  return (
    <GuideShell
      canonicalPath="/guides/pension-drawdown-explained"
      heroLabel="Pensions"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Pensions</div>
      <h1 className="guide-h1">Pension drawdown explained</h1>
      <ArticleDates published={DRAWDOWN_PUBLISHED} reviewed={DRAWDOWN_REVIEWED} formatDate={formatDate} />

      <QuickAnswerBox>
        Pension drawdown lets you leave a defined contribution pension invested and take money from it when you choose. You can
        usually take up to {TAX_FREE_SHARE}% tax-free, and what you take beyond that is taxed as income. You can start from age {NMPA.now}
        {NMPA.next ? ` (rising to ${NMPA.next} on ${NMPA.nextFrom})` : ''}. The trade-offs are that your money stays exposed to
        investment risk and can run out, and that taking taxable money cuts the amount you can pay into a pension with tax relief
        from {gbp(ANNUAL_ALLOWANCE)} to {gbp(MPAA)} a year.
      </QuickAnswerBox>

      <H2>How drawdown works</H2>
      <P>
        With flexi-access drawdown, you move some or all of a defined contribution pension into a drawdown fund. You can
        take up to {TAX_FREE_SHARE}% of the amount you move as a tax-free lump sum, leave the rest invested, and then take
        money as regular income or as lump sums whenever you like. You do not have to take the full tax-free amount. The
        more you take at the start, the less is left to produce income later.
      </P>

      <Example>
        You move a {gbp(pot)} pension into drawdown. Up to {TAX_FREE_SHARE}% of it, which is {gbp(taxFree)}, can be taken
        tax-free. The other {gbp(pot - taxFree)} stays invested, and anything you take from it is added to your income for the
        tax year and taxed at your rates. The tax-free total is also capped by the lump sum allowance of {gbp(LUMP_SUM_ALLOWANCE)}
        {' '}for most people.
      </Example>

      <H2>The rules that matter</H2>
      <UL>
        <li><strong>Minimum age.</strong> The normal minimum pension age is {NMPA.now}
          {NMPA.next ? ` and rises to ${NMPA.next} on ${NMPA.nextFrom}` : ''}. Some people have a protected earlier age.</li>
        <li><strong>Tax.</strong> The tax-free part is up to {TAX_FREE_SHARE}%. Other withdrawals are taxed as income, so large
          withdrawals in one year can push you into a higher tax band.</li>
        <li><strong>Money purchase annual allowance.</strong> Taking taxable money from a defined contribution pension, for example
          from a drawdown fund, usually reduces the yearly limit for tax-relieved pension saving from {gbp(ANNUAL_ALLOWANCE)} to
          {' '}{gbp(MPAA)}. Taking only the tax-free lump sum usually does not trigger it.</li>
        <li><strong>Lump sum allowance.</strong> Tax-free lump sums are capped at {gbp(LUMP_SUM_ALLOWANCE)} for most people.</li>
      </UL>

      <H2>The main risks</H2>
      <UL>
        <li><strong>Running out.</strong> There is no guaranteed income. Withdrawing too much, or living longer than planned, can leave the pot empty.</li>
        <li><strong>Poor returns early on.</strong> If markets fall soon after you start, withdrawals take a larger share of a smaller pot, which is hard to recover from.</li>
        <li><strong>Tax surprises.</strong> Taking a large lump sum in a single year can cost more tax than the same money spread over several years.</li>
        <li><strong>Charges.</strong> Platform and fund charges reduce what is left every year.</li>
      </UL>

      <H2>The alternatives</H2>
      <P>
        Drawdown is one of several ways to take a defined contribution pension. You can also take it as cash in one or more lump
        sums, or buy an annuity, which gives a guaranteed income for life. Some people combine them, for example using an annuity
        for essential spending and drawdown for the rest. Each choice has trade-offs between flexibility, certainty and tax, and
        the right mix depends on your circumstances.
      </P>

      <Callout>
        Free, impartial guidance on your options is available from Pension Wise if you are 50 or over with a defined contribution
        pension. It explains how each option works and what tax you could pay. It cannot recommend products. For a recommendation,
        speak to a regulated financial adviser.
      </Callout>

      <P>
        Not sure how big a pot you need before drawdown makes sense? Our guide on{' '}
        <a {...link(navigateTo, '/guides/how-much-do-i-need-to-retire-uk')}>how much you need to retire in the UK</a> walks through
        the sum with worked examples.
      </P>

      <H2>See how it could play out</H2>
      <P>
        The <a {...link(navigateTo, '/tools/pension-drawdown-calculator')}>pension drawdown calculator</a> shows how long a pot could last
        at a given withdrawal, and the <a {...link(navigateTo, '/tools/phased-drawdown-calculator')}>phased drawdown calculator</a> lets you
        take a higher income early and a lower one later. Both run in your browser and send nothing anywhere. Illustrations are not
        predictions, because returns are not guaranteed.
      </P>

      <GuideCTA onClick={() => goTo('signup', 'bottom')} buttonText="Create a free account">
        Keep your pensions, ISAs and savings in one private place and watch your balances over time. No bank access required.
      </GuideCTA>

      <SourceList sources={sources} checked={lastCheckedFor('pension.')} formatDate={formatDate} />
    </GuideShell>
  )
}
