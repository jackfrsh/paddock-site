import React from 'react'
import {
  GuideShell,
  H2,
  P,
  UL,
  Example,
  GuideCTA,
  Divider,
  GuideLink,
} from '../components/GuideLayout'

export default function LongTermProjectionGuide({ navigateTo, goTo }) {
  return (
    <GuideShell
      seoTitle="Long-Term Wealth Projection | How Wealth Projections Work | Paddock"
      metaDescription="Learn how long-term wealth projections work, what drives future net worth, and how to think about contributions, returns, and time horizon."
      canonicalPath="/guides/long-term-wealth-projection"
      heroLabel="Long-term wealth projection"
      onBack={() => navigateTo('/guides')}
      navigateTo={navigateTo}
    >
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
        <li><strong>Expected rate of return</strong> — the annual growth assumption. This is the most uncertain input.</li>
      </UL>
      <P>
        A common mistake is to focus entirely on returns. But for many people in
        the first decade of building wealth, contributions matter more. A modest
        increase in monthly contributions can move the outcome more than a slightly
        more optimistic return assumption.
      </P>

      <H2>Compound growth: a worked example</H2>
      <P>
        Suppose you start with £50,000 in savings and investments, and you contribute
        £500 per month. You assume a 6% annual return, compounded monthly. Here is
        what the model produces over 25 years:
      </P>

      <Example>
        <strong>Starting balance:</strong> £50,000<br />
        <strong>Monthly contribution:</strong> £500<br />
        <strong>Assumed annual return:</strong> 6%<br /><br />
        After 5 years: ~£134,000<br />
        After 10 years: ~£240,000<br />
        After 15 years: ~£376,000<br />
        After 20 years: ~£553,000<br />
        After 25 years: ~£783,000
      </Example>

      <P>
        The gap between what you put in and where you end up is the effect of
        compound growth over time. In the early years, most of your wealth comes
        from saving. Later, growth starts to do more of the work.
      </P>

      <H2>Why a 1-year projection is useful — but limited</H2>
      <P>
        Short-term projections are useful for understanding near-term momentum.
        They can show whether you are on pace for a milestone. But the decisions
        that change long-term outcomes — savings rate, allocation, and time horizon —
        play out over many years. A 1-year window cannot tell you whether a
        retirement target is viable or whether raising contributions changes your
        target date meaningfully.
      </P>

      <H2>Common projection mistakes</H2>
      <P>
        Long-term projections are only useful if the assumptions are honest. The most
        common errors are:
      </P>
      <UL>
        <li><strong>Unrealistic return assumptions.</strong> Using very high long-run returns can make a weak plan look safe.</li>
        <li><strong>Ignoring inflation.</strong> A nominal future value can look reassuring while hiding weaker real purchasing power.</li>
        <li><strong>Treating the model as a promise.</strong> A projection is a scenario, not a guarantee.</li>
        <li><strong>Never updating assumptions.</strong> Contributions, goals, and life plans change. The model should change too.</li>
      </UL>

      <P>
        For a deeper look at why nominal projections can mislead, see the{' '}
        <a
          href="/guides/inflation-adjusted-net-worth"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/guides/inflation-adjusted-net-worth')
            }
          }}
          className="guide-inline-link"
        >
          inflation-adjusted net worth guide
        </a>.
      </P>

      <Divider />

      <H2>Milestones keep the plan grounded</H2>
      <P>
        A 25-year target can feel abstract. Milestones make the plan more tangible:
      </P>
      <UL>
        <li>First £10K, £50K, £100K</li>
        <li>Halfway to target</li>
        <li>A meaningful financial independence threshold</li>
      </UL>
      <P>
        Tracking milestones turns a distant projection into visible progress.
      </P>

      <H2>The contribution question</H2>
      <P>
        A better way to use a projection is to ask: <em>what contribution level would
        get me closer to my target, given my current wealth, time horizon, and assumptions?</em>
      </P>

      <Example>
        <strong>Target:</strong> £750,000 by age 60<br />
        <strong>Current net worth:</strong> £120,000<br />
        <strong>Years remaining:</strong> 28<br />
        <strong>Assumed return:</strong> 6%<br /><br />
        A higher monthly contribution can materially change the outcome or bring the
        target date forward.
      </Example>

      <P>
        This is what makes a projection useful. It stops being a passive chart and
        becomes an active planning tool.
      </P>

      <H2>How Paddock handles long-term projections</H2>
      <P>
        Paddock is built around one primary goal with visible assumptions. Your
        projection updates as your net worth and contributions change, so you can
        see whether you are on track and how your current pace affects the outcome
        over time.
      </P>
      <P>
        The aim is not to present one perfect answer. It is to make the path legible:
        what you have today, what you are adding, and where that could lead over the
        long term.
      </P>
      <P>
        When you want to turn that projection into action, Paddock also includes
        decision support around ISA strategy, mortgage overpayment, and where the next
        pounds should go, so planning and action stay connected.
      </P>
      <P>
        If you track accounts in multiple currencies, Paddock converts everything
        into your base currency so the projection stays coherent. Read the{' '}
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
        Model your future wealth with clear assumptions, then decide what to do next
        with ISA, mortgage, and contribution tools inside Paddock.
      </GuideCTA>

      <H2>Next steps</H2>
      <div className="guide-links">
        <GuideLink to="/guides/multi-currency-net-worth-tracker" navigateTo={navigateTo}>
          Multi-currency net worth tracker guide →
        </GuideLink>
        <GuideLink to="/guides/inflation-adjusted-net-worth" navigateTo={navigateTo}>
          Inflation-adjusted net worth guide →
        </GuideLink>
      </div>
    </GuideShell>
  )
}