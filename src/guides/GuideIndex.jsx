import React from 'react'
import { GuideShell, GuideLink } from '../components/GuideLayout'

export default function GuideIndex({ navigateTo }) {
  return (
    <GuideShell
  seoTitle="Wealth Tracking Guides | Multi-Currency, Projections, Inflation | Paddock"
  metaDescription="Practical guides to multi-currency net worth tracking, long-term wealth projections, and inflation-adjusted planning."
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
        to think about inflation in real terms rather than headline numbers.
      </p>

      <div className="guide-links" style={{ marginTop: 24 }}>
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