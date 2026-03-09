import React from 'react'
import { GuideShell, H2, P, UL, Example, Callout, GuideCTA, Divider, GuideLink } from '../components/GuideLayout'

export default function InflationAdjustedGuide({ navigateTo, goTo }) {
  return (
    <GuideShell title="Guide" onBack={() => navigateTo('/guides')} navigateTo={navigateTo}>
      <div className="guide-kicker">Inflation-adjusted net worth</div>

      <h1 className="guide-h1">Inflation-adjusted net worth: why real terms matter</h1>

      <p className="guide-lead">
        A long-term projection can show your net worth reaching £500,000 in 20 years
        and make the plan feel on track. But if inflation averages 3% over that period,
        £500K in 2046 buys roughly what £275K buys today. Inflation-adjusted planning —
        also called real-terms planning — strips away that illusion and shows what
        your future money can actually purchase.
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
        what actually matters for long-term planning — it is the growth in what
        your money can buy, not just the growth in the number itself.
      </P>

      <H2>The compounding illusion</H2>
      <P>
        The gap between nominal and real terms widens dramatically over long
        horizons because inflation compounds just like investment returns do. A
        small annual difference — 2% or 3% — accumulates into a large gap over
        20 or 30 years.
      </P>

      <Example>
        <strong>Starting balance:</strong> £100,000<br />
        <strong>Annual return:</strong> 7% nominal<br />
        <strong>Inflation:</strong> 3% per year<br />
        <strong>Time horizon:</strong> 20 years<br /><br />

        <strong>Nominal value after 20 years:</strong> ~£387,000<br />
        <strong>Real value (today's purchasing power):</strong> ~£214,000<br /><br />

        The nominal projection says nearly £400K. The real projection says
        roughly £215K. That is a 45% gap — and it is entirely invisible if
        you only plan in nominal terms.
      </Example>

      <P>
        This is not an edge case. This is what 3% inflation — the Bank of England's
        approximate long-term average — does to every long-term plan that ignores it.
      </P>

      <H2>Why this matters for goal setting</H2>
      <P>
        Many people set wealth targets in today's money: "I want £750,000 to retire."
        That is a reasonable target now. But if retirement is 25 years away and
        inflation averages 3%, you would need approximately £1,570,000 in nominal
        terms to have the same purchasing power as £750,000 today.
      </P>

      <Example>
        <strong>Target in today's money:</strong> £750,000<br />
        <strong>Years to retirement:</strong> 25<br />
        <strong>Inflation assumption:</strong> 3%<br /><br />

        <strong>Nominal equivalent needed:</strong> ~£1,570,000<br /><br />

        If your projection shows you reaching £750K nominal in 25 years,
        you are not on track — you are roughly halfway there in purchasing
        power terms.
      </Example>

      <P>
        This is why real-terms projections are essential for any plan measured in
        decades. They answer the question that actually matters: will I be able to
        afford the life I am planning for?
      </P>

      <Divider />

      <H2>Common inflation-related planning mistakes</H2>
      <UL>
        <li><strong>Planning entirely in nominal terms.</strong> The most common error. A plan that looks safe at 7% nominal can be marginal at 4% real — and dangerously tight if inflation runs higher than expected.</li>
        <li><strong>Assuming today's prices hold for decades.</strong> If you plan to spend £30,000 per year in retirement, that figure needs to grow with inflation. £30K today is £54K in 20 years at 3% inflation — and your portfolio needs to sustain the higher figure, not the lower one.</li>
        <li><strong>Using the same target across different time horizons.</strong> A £500K target at age 50 and a £500K target at age 65 are not the same goal. The later date means more inflation erosion, so it requires either a higher nominal target or lower real expectations.</li>
        <li><strong>Ignoring inflation on contributions.</strong> If your salary grows with inflation but your contributions stay flat, you are effectively contributing less each year in real terms. Keeping contributions constant in nominal terms means they gradually shrink in purchasing power.</li>
      </UL>

      <H2>How to think about inflation-adjusted planning</H2>
      <P>
        The practical approach is to model in both nominal and real terms, and
        understand what each tells you:
      </P>
      <UL>
        <li><strong>Nominal projections</strong> show the numbers that will appear on your statements. They are useful for comparing against nominal milestones and account balances.</li>
        <li><strong>Real-terms projections</strong> show purchasing power — what your future wealth can actually buy in today's terms. They are essential for retirement planning and lifestyle-based goals.</li>
      </UL>
      <P>
        Neither view is wrong. But relying on nominal projections alone gives an
        incomplete — and often dangerously optimistic — picture.
      </P>

      <Callout>
        A good rule of thumb: if your time horizon is under 5 years, nominal and
        real terms are close enough that the distinction is minor. Beyond 10 years,
        the gap becomes large enough to change decisions. Beyond 20 years, ignoring
        inflation can make a viable plan look safe and a marginal plan look comfortable.
      </Callout>

      <H2>How Paddock handles inflation-adjusted views</H2>
      <P>
        Paddock's Pro tier includes an inflation-adjusted toggle that shows your
        projection in real terms — what your future net worth would be worth in
        today's money. You can see both nominal and real projections side by side,
        so the gap between them is always visible. This works alongside
        the <a href="/guides/long-term-wealth-projection" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/long-term-wealth-projection') } }} className="guide-inline-link">long-term projection engine</a>,
        the Optimiser, and one-off deposit modelling to give you a complete picture
        of where you are heading and what it means in practice.
      </P>
      <P>
        If you hold assets in multiple currencies, projections are calculated in your base
        currency using daily FX rates — see
        the <a href="/guides/multi-currency-net-worth-tracker" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/multi-currency-net-worth-tracker') } }} className="guide-inline-link">multi-currency tracking guide</a>.
      </P>

      <GuideCTA onClick={() => goTo('signup')}>
        See your projection in real terms — what your future wealth is actually
        worth in today's money. Pro includes inflation-adjusted views, longer
        horizons, and the Optimiser.
      </GuideCTA>

      <H2>Next steps</H2>
      <div className="guide-links">
        <GuideLink to="/guides/long-term-wealth-projection" navigateTo={navigateTo}>
          How long-term wealth projections work →
        </GuideLink>
        <GuideLink to="/guides/multi-currency-net-worth-tracker" navigateTo={navigateTo}>
          Multi-currency net worth tracking explained →
        </GuideLink>
      </div>
    </GuideShell>
  )
}
