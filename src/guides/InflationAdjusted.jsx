import React from 'react'
import {
  GuideShell,
  H2,
  P,
  UL,
  Example,
  Callout,
  GuideCTA,
  Divider,
  GuideLink,
} from '../components/GuideLayout'

export default function InflationAdjustedGuide({ navigateTo, goTo }) {
  return (
    <GuideShell
      seoTitle="Inflation-Adjusted Net Worth | Real vs Nominal Wealth Planning | Paddock"
      metaDescription="Learn why inflation-adjusted net worth matters, how real terms differ from nominal returns, and how to plan long-term wealth in today's money."
      canonicalPath="/guides/inflation-adjusted-net-worth"
      heroLabel="Inflation-adjusted net worth"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
      <div className="guide-kicker">Inflation-adjusted net worth</div>

      <h1 className="guide-h1">
        Inflation-adjusted net worth: why real terms matter
      </h1>

      <p className="guide-lead">
        A long-term projection can show your net worth reaching £500,000 in 20 years
        and make the plan feel on track. But if inflation averages 3% over that period,
        £500K in 2046 buys far less than £500K buys today. Inflation-adjusted planning —
        also called real-terms planning — strips away that illusion and shows what
        your future wealth can actually buy.
      </p>

      <H2>Nominal vs real: the core distinction</H2>
      <P>
        <strong>Nominal</strong> means the raw number on the statement. If your
        portfolio grows from £100,000 to £107,000 in a year, the nominal return
        is 7%.
      </P>
      <P>
        <strong>Real</strong> means adjusted for inflation. If inflation was 3%
        that year, your purchasing power only grew by roughly 4%. That 4% is
        what matters for long-term wealth planning — it reflects what your money
        can actually buy, not just the headline number.
      </P>

      <H2>The compounding illusion</H2>
      <P>
        The gap between nominal and real terms widens dramatically over long
        horizons because inflation compounds just like investment returns do. A
        small annual difference — 2% or 3% — becomes a large gap over 20 or
        30 years.
      </P>

      <Example>
        <strong>Starting balance:</strong> £100,000<br />
        <strong>Annual return:</strong> 7% nominal<br />
        <strong>Inflation:</strong> 3% per year<br />
        <strong>Time horizon:</strong> 20 years<br /><br />

        <strong>Nominal value after 20 years:</strong> ~£387,000<br />
        <strong>Real value (today's purchasing power):</strong> ~£214,000<br /><br />

        The nominal projection says nearly £400K. The real projection says
        roughly £214K. That gap is invisible if you only plan in nominal terms.
      </Example>

      <P>
        This is not an edge case. It is what long-term inflation does to every
        plan that ignores purchasing power.
      </P>

      <H2>Why this matters for goal setting</H2>
      <P>
        Many people set wealth targets in today's money: "I want £750,000 to retire."
        That is reasonable today. But if retirement is 25 years away and inflation
        averages 3%, you would need much more than £750,000 in nominal terms to
        have the same purchasing power.
      </P>

      <Example>
        <strong>Target in today's money:</strong> £750,000<br />
        <strong>Years to retirement:</strong> 25<br />
        <strong>Inflation assumption:</strong> 3%<br /><br />

        <strong>Nominal equivalent needed:</strong> ~£1,570,000<br /><br />

        If your projection shows you reaching £750K nominal in 25 years,
        you are not on track in real purchasing power terms.
      </Example>

      <P>
        This is why real-terms projections matter for any plan measured in decades.
        They answer the practical question: will this future wealth still support
        the life I want?
      </P>

      <Divider />

      <H2>Common inflation-related planning mistakes</H2>
      <UL>
        <li>
          <strong>Planning entirely in nominal terms.</strong> A plan that looks
          safe at 7% nominal can be much tighter once inflation is accounted for.
        </li>
        <li>
          <strong>Assuming today's prices hold for decades.</strong> Retirement
          spending targets need to rise with inflation too.
        </li>
        <li>
          <strong>Using the same target across different time horizons.</strong>
          A £500K target in 10 years is not the same as a £500K target in 30 years.
        </li>
        <li>
          <strong>Ignoring inflation on contributions.</strong> Flat nominal
          contributions gradually shrink in real terms over time.
        </li>
      </UL>

      <H2>How to think about inflation-adjusted planning</H2>
      <P>
        The practical approach is to look at both nominal and real terms and
        understand what each tells you:
      </P>
      <UL>
        <li>
          <strong>Nominal projections</strong> show the raw numbers likely to appear
          on statements and account balances.
        </li>
        <li>
          <strong>Real-terms projections</strong> show purchasing power — what your
          future wealth is worth in today's money.
        </li>
      </UL>
      <P>
        Neither view is wrong. But relying on nominal numbers alone can create
        false confidence in a long-term plan.
      </P>

      <Callout>
        A useful rule of thumb: under 5 years, the difference between nominal and
        real terms is usually modest. Beyond 10 years, it starts to change decisions.
        Beyond 20 years, ignoring inflation can seriously distort a plan.
      </Callout>

      <H2>How Paddock handles inflation-adjusted views</H2>
      <P>
        Paddock Pro includes an inflation-adjusted view so you can see your
        projection in real terms — what your future wealth would be worth in
        today's money. That makes it easier to compare headline growth with actual
        purchasing power.
      </P>
      <P>
        This sits alongside long-term planning, so the gap between nominal and
        real outcomes stays visible rather than hidden behind one optimistic number.
        See the{' '}
        <a
          href="/guides/long-term-wealth-projection"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/guides/long-term-wealth-projection')
            }
          }}
          className="guide-inline-link"
        >
          long-term wealth projection guide
        </a>.
      </P>
      <P>
        When you are ready to act on that plan, Paddock also helps with practical
        decisions like ISA strategy, mortgage overpayment, and where the next pounds
        should go.
      </P>
      <P>
        If you also hold assets across currencies, Paddock calculates projections
        in your chosen base currency using daily FX rates. See the{' '}
        <a
          href="/guides/multi-currency-net-worth-tracker"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/guides/multi-currency-net-worth-tracker')
            }
          }}
          className="guide-inline-link"
        >
          multi-currency net worth tracker guide
        </a>.
      </P>

      <GuideCTA onClick={() => goTo('signup')}>
        See your future wealth in real terms, then make clearer ISA, mortgage, and
        contribution decisions in Paddock.
      </GuideCTA>

      <H2>Next steps</H2>
      <div className="guide-links">
        <GuideLink to="/guides/long-term-wealth-projection" navigateTo={navigateTo}>
          Long-term wealth projection guide →
        </GuideLink>
        <GuideLink to="/guides/multi-currency-net-worth-tracker" navigateTo={navigateTo}>
          Multi-currency net worth tracker guide →
        </GuideLink>
      </div>
    </GuideShell>
  )
}