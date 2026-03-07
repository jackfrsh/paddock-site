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

function Divider() {
  return <div className="guide-divider" />
}

export default function InflationAdjustedGuide() {
  return (
    <div className="guide-shell">
      <TopBar title="Guide" />

      <div className="guide-container">
        <article className="guide-card">
          <div className="guide-kicker">Inflation adjusted net worth</div>

          <h1 className="guide-h1">Inflation-adjusted net worth: real terms vs nominal</h1>

          <p className="guide-lead">
            A projection can look great in nominal money while quietly losing purchasing power. Inflation-adjusted
            modelling keeps your plan grounded in what your future money can actually buy.
          </p>

          <H2>Nominal: the number on the statement</H2>
          <P>
            Nominal returns describe the growth of your balance in raw currency terms. If your portfolio grows by
            7%, nominally you have more money.
          </P>

          <H2>Real terms: purchasing power after inflation</H2>
          <P>
            Real returns adjust for inflation. If inflation is 3% and your portfolio returns 7%, your real return
            is roughly 4%. That 4% is what matters for long-term planning.
          </P>

          <Divider />

          <H2>Why this matters for long horizons</H2>
          <P>
            Over 20–40 years, small differences compound. A plan that looks safe in nominal terms can be borderline
            in real terms — especially if your target is lifestyle-based.
          </P>

          <H2>Where Pro fits</H2>
          <P>
            Pro adds inflation-adjusted views so you can see your trajectory in today’s money, alongside one-off
            deposits and longer horizons. It is built for planning decades ahead with fewer illusions.
          </P>

          <H2>Next steps</H2>
          <div className="guide-links">
            <a href="/guides/multi-currency-net-worth-tracker" className="guide-link-card">
              Multi-currency tracking explained →
            </a>
            <a href="/guides/long-term-wealth-projection" className="guide-link-card">
              How long-term wealth projections work →
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