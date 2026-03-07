import React from 'react'

function TopBar({ title }) {
  return (
    <div className="guide-topbar">
      <div className="guide-topbar-inner">
        <div className="guide-topbar-spacer" />
        <div className="guide-topbar-title">{title}</div>
        <a href="/" className="guide-close" aria-label="Back to home" title="Back to home">
          <span aria-hidden="true">×</span>
        </a>
      </div>
    </div>
  )
}

function H2({ children }) {
  return <h2 className="guide-h2">{children}</h2>
}

function P({ children }) {
  return <p className="guide-p">{children}</p>
}

function Callout({ children }) {
  return (
    <div className="guide-callout">
      <div className="guide-callout-text">{children}</div>
    </div>
  )
}

export default function LongTermProjectionGuide() {
  return (
    <div className="guide-shell">
      <TopBar title="Guide" />

      <div className="guide-container">
        <article className="guide-card">
          <div className="guide-kicker">Long term wealth projection tool</div>

          <h1 className="guide-h1">How long-term wealth projections actually work</h1>

          <p className="guide-lead">
            A long-term projection is not a promise — it’s a model. The value is in making assumptions explicit so
            you can see what needs to be true for a target to be achievable.
          </p>

          <H2>The three drivers of a projection</H2>
          <P>
            Most long-horizon projections reduce to three inputs:
            <br />• your starting net worth
            <br />• your contributions over time
            <br />• the rate of return and drag
          </P>

          <H2>Why 1 year is useful — and why it’s limited</H2>
          <P>
            Short horizon projections are great for building the habit and understanding momentum. But the decisions
            that change outcomes — savings rate, risk, and time horizon — usually play out over 5–40 years.
          </P>

          <H2>Milestones make the plan feel real</H2>
          <P>
            Milestones are checkpoints that keep the plan grounded. Instead of someday I’ll have £X, you can track:
            <br />• first £10k / £50k / £100k
            <br />• halfway-to-target
            <br />• financial independence threshold
          </P>

          <H2>Optimisation vs guesswork</H2>
          <P>
            Most people try to hit a target by tweaking numbers randomly. A better approach is to ask one clear
            question: what contribution rate is required to reach my target, given my horizon and assumptions?
          </P>

          <Callout>
            Pro exists for this exact use case: longer horizons, inflation-adjusted views, one-off deposits, and an
            Optimiser that tells you the required contribution to hit your target.
          </Callout>

          <H2>Next steps</H2>
          <div className="guide-links">
            <a href="/guides/multi-currency-net-worth-tracker" className="guide-link-card">
              Multi-currency tracking explained →
            </a>
            <a href="/guides/inflation-adjusted-net-worth" className="guide-link-card">
              Inflation-adjusted net worth explained →
            </a>
          </div>
        </article>

        <div className="guide-footer-action">
          <a href="/" className="guide-done">
            Done
          </a>
        </div>
      </div>
    </div>
  )
}