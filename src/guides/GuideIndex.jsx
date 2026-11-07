import React from 'react'
import { GuideShell, GuideLink } from '../components/GuideLayout'

export default function GuideIndex({ navigateTo }) {
  return (
    <GuideShell
  canonicalPath="/guides"
  heroLabel="Library"
  onBack={() => navigateTo('/')}
  navigateTo={navigateTo}
  backLabel="Back to Paddock"
>
      <div className="guide-kicker">Wealth tracking guides</div>

      <h1 className="guide-h1">
        Guides to wealth tracking, multi-currency net worth, and long-term planning
      </h1>

      <p className="guide-lead">
        Clear, practical guides for people who want to track wealth properly —
        across accounts, currencies, and long-term goals. Learn how multi-currency
        net worth tracking works, how long-term wealth projections work, and how
        to think about inflation in real terms rather than headline numbers. The
        retirement and ISA guides use figures from GOV.UK and HMRC, with the
        sources and the date we checked them shown on each page.
      </p>

      <div className="guide-links" style={{ marginTop: 24 }}>
        <GuideLink to="/guides/how-much-do-i-need-to-retire-uk" navigateTo={navigateTo}>
          How much do I need to retire in the UK? →
        </GuideLink>

        <GuideLink to="/guides/pension-drawdown-explained" navigateTo={navigateTo}>
          Pension drawdown explained →
        </GuideLink>

        <GuideLink to="/guides/monthly-investment-to-retire-early-uk" navigateTo={navigateTo}>
          How much to invest each month to retire early →
        </GuideLink>

        <GuideLink to="/guides/net-worth-vs-investable-wealth" navigateTo={navigateTo}>
          Net worth vs investable wealth →
        </GuideLink>

        <GuideLink to="/guides/isa-allowance-uk" navigateTo={navigateTo}>
          ISA allowance: how much you can pay in →
        </GuideLink>

        <GuideLink to="/guides/cash-isa-vs-stocks-and-shares-isa" navigateTo={navigateTo}>
          Cash ISA vs Stocks and Shares ISA →
        </GuideLink>

        <GuideLink to="/guides/lifetime-isa-rules-uk" navigateTo={navigateTo}>
          Lifetime ISA rules: bonus, limits and charges →
        </GuideLink>

        <GuideLink to="/guides/end-of-tax-year-checklist-uk" navigateTo={navigateTo}>
          End of the tax year checklist →
        </GuideLink>

        <GuideLink to="/guides/multi-currency-net-worth-tracker" navigateTo={navigateTo}>
          Multi-currency net worth tracker guide →
        </GuideLink>

        <GuideLink to="/guides/long-term-wealth-projection" navigateTo={navigateTo}>
          Long-term wealth projection guide →
        </GuideLink>

        <GuideLink to="/guides/inflation-adjusted-net-worth" navigateTo={navigateTo}>
          Inflation-adjusted net worth guide →
        </GuideLink>
      </div>
    </GuideShell>
  )
}