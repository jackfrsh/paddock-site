import React from 'react'
import { GuideShell, H2, P, UL, Example, Callout, GuideCTA, Divider, GuideLink } from '../components/GuideLayout'

export default function LongTermProjectionGuide({ navigateTo, goTo }) {
  return (
    <GuideShell title="Guide" onClose={() => navigateTo('/')}>
      <div className="guide-kicker">Long-term wealth projection</div>

      <h1 className="guide-h1">How long-term wealth projections actually work</h1>

      <p className="guide-lead">
        A long-term wealth projection is not a prediction. It is a model — a structured way
        of asking: given my current net worth, my contributions, and a set of assumptions
        about returns, where could I end up in 10, 20, or 30 years? The value is in making
        those assumptions visible, not in pretending to know the future.
      </p>

      <H2>The three drivers of any projection</H2>
      <P>
        Every long-horizon wealth projection reduces to three inputs. Change any
        one and the outcome shifts significantly:
      </P>
      <UL>
        <li><strong>Starting net worth</strong> — the base you are compounding from today.</li>
        <li><strong>Contributions over time</strong> — how much new money you add each month or year, and where it goes.</li>
        <li><strong>Expected rate of return</strong> — the annual growth assumption, net of fees and drag. This is the most uncertain input.</li>
      </UL>
      <P>
        A common mistake is to focus entirely on returns. But for most people in
        the first decade of building wealth, contributions dominate. A 1% difference
        in return rate matters less than an extra £200 per month in contributions
        — until the portfolio is large enough for compounding to take over.
      </P>

      <H2>Compound growth: a worked example</H2>
      <P>
        Suppose you start with £50,000 in savings and investments, and you contribute
        £500 per month. You assume a 6% annualised return, compounded monthly. Here is
        what the model produces over 25 years:
      </P>

      <Example>
        <strong>Starting balance:</strong> £50,000<br />
        <strong>Monthly contribution:</strong> £500<br />
        <strong>Assumed annual return:</strong> 6%<br /><br />
        After 5 years: ~£134,000 (you contributed £80K of that)<br />
        After 10 years: ~£240,000 (you contributed £110K)<br />
        After 15 years: ~£376,000 (you contributed £140K)<br />
        After 20 years: ~£553,000 (you contributed £170K)<br />
        After 25 years: ~£783,000 (you contributed £200K)
      </Example>

      <P>
        The gap between what you put in (£200K) and where you end up (£783K) is the
        effect of compound growth over time. In the early years, most of your net worth
        is money you saved. In the later years, growth contributes more than your deposits.
        This is why time horizon matters so much.
      </P>

      <H2>Why a 1-year projection is useful — but limited</H2>
      <P>
        Short-term projections are valuable for building the habit and understanding
        near-term momentum. If your next milestone is £100K, a 1-year model shows
        whether you are on pace. But the decisions that genuinely change long-term
        outcomes — savings rate, risk allocation, and time horizon — play out
        over 5 to 40 years. A 1-year window cannot show you whether your retirement
        plan is viable or whether increasing your monthly ISA contribution by £100
        shaves two years off your target date.
      </P>

      <H2>Common projection mistakes</H2>
      <P>
        Long-term projections are only useful if the assumptions are honest. The most
        common errors:
      </P>
      <UL>
        <li><strong>Unrealistic return assumptions.</strong> Using 10–12% annual returns for a diversified portfolio overstates the likely outcome. A global equity index has historically returned roughly 7–9% nominal. After fees and tax drag, 5–7% is more realistic for planning purposes.</li>
        <li><strong>Ignoring inflation.</strong> A projection that says £750K in 25 years sounds reassuring — until you realise that £750K in 2051 may only buy what £420K buys today. Real-terms (inflation-adjusted) projections solve this.</li>
        <li><strong>Treating the model as a promise.</strong> A projection is a scenario, not a guarantee. Returns vary year to year. The purpose is to understand the range of plausible outcomes, not to commit to one line on a chart.</li>
        <li><strong>Never updating assumptions.</strong> Contributions change. Life changes. A projection only stays useful if you revisit it periodically — at least once or twice a year.</li>
      </UL>

      <P>
        For a deeper look at why nominal projections can mislead, see
        the <a href="/guides/inflation-adjusted-net-worth" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/inflation-adjusted-net-worth') } }} className="guide-inline-link">inflation-adjusted net worth guide</a>.
      </P>

      <Divider />

      <H2>Milestones keep the plan grounded</H2>
      <P>
        A 25-year target can feel abstract. Milestones — intermediate checkpoints — make
        the plan tangible and keep motivation visible:
      </P>
      <UL>
        <li>First £10K, £50K, £100K — each one compound-accelerates the next.</li>
        <li>Halfway to target — the psychological turning point where growth starts outpacing contributions.</li>
        <li>Financial independence threshold — the point where your portfolio could sustain your lifestyle without employment income.</li>
      </UL>
      <P>
        Tracking milestones turns a projection from a distant number into a series of
        achievable steps.
      </P>

      <H2>The optimisation question</H2>
      <P>
        Instead of guessing at a contribution and hoping it works, a better approach
        is to ask the model directly: <em>what monthly contribution would I need to
        reach my target, given my current net worth, my time horizon, and my return
        assumptions?</em>
      </P>

      <Example>
        <strong>Target:</strong> £750,000 by age 60<br />
        <strong>Current net worth:</strong> £120,000<br />
        <strong>Years remaining:</strong> 28<br />
        <strong>Assumed return:</strong> 6%<br /><br />
        Required monthly contribution: ~£325/month<br /><br />
        If you can contribute £500/month instead, you reach the target approximately
        4 years early — or overshoot it by ~£180K at 60.
      </Example>

      <P>
        This kind of reverse-engineering turns the projection from a passive
        forecast into an active planning tool.
      </P>

      <H2>How Paddock handles long-term projections</H2>
      <P>
        Paddock is built around one primary goal with visible assumptions. Your
        projection updates as your net worth and contributions change. The free
        tier includes a 1-year projection with monthly what-if modelling. Pro
        extends this to 5–40 year horizons, adds the Optimiser (which calculates
        the required contribution to hit your target), and includes one-off deposit
        modelling and inflation-adjusted views.
      </P>
      <P>
        If you track accounts in multiple currencies, Paddock converts everything
        to your base currency using daily FX rates — so your projection
        stays coherent. More on this in
        the <a href="/guides/multi-currency-net-worth-tracker" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/multi-currency-net-worth-tracker') } }} className="guide-inline-link">multi-currency tracking guide</a>.
      </P>

      <GuideCTA onClick={() => goTo('signup')}>
        Model your wealth 5–40 years ahead with visible assumptions and
        an Optimiser that tells you exactly what you need to contribute.
      </GuideCTA>

      <H2>Next steps</H2>
      <div className="guide-links">
        <GuideLink to="/guides/multi-currency-net-worth-tracker" navigateTo={navigateTo}>
          Multi-currency net worth tracking explained →
        </GuideLink>
        <GuideLink to="/guides/inflation-adjusted-net-worth" navigateTo={navigateTo}>
          Inflation-adjusted net worth: real vs nominal →
        </GuideLink>
      </div>
    </GuideShell>
  )
}
