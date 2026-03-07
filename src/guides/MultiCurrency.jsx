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

function ProTip({ children }) {
  return (
    <div className="guide-protip">
      <div className="guide-protip-label">Pro tip</div>
      <div className="guide-protip-text">{children}</div>
    </div>
  )
}

function H2({ children }) {
  return <h2 className="guide-h2">{children}</h2>
}

function P({ children }) {
  return <p className="guide-p">{children}</p>
}

export default function MultiCurrencyGuide() {
  return (
    <div className="guide-shell">
      <TopBar title="Guide" />

      <div className="guide-container">
        <article className="guide-card">
          <div className="guide-kicker">Multi currency net worth tracker</div>

          <h1 className="guide-h1">Multi-currency net worth tracking explained</h1>

          <p className="guide-lead">
            If you hold assets in more than one currency — a USD brokerage, EUR cash, overseas property, or crypto —
            a normal single-currency tracker quickly becomes misleading. A multi-currency net worth tracker keeps
            your totals consistent by converting everything into one base currency using up-to-date exchange rates.
          </p>

          <ProTip>
            The goal is not to predict FX perfectly — it is to keep your dashboard and projections internally
            consistent so you can make decisions with clarity.
          </ProTip>

          <H2>Why multi-currency totals go wrong</H2>
          <P>
            Without conversion, totals are not totals — they are a pile of numbers in different units. Even if you
            convert manually once, your net worth can drift simply because FX rates move daily. That makes
            month-to-month progress hard to trust.
          </P>

          <H2>What a good multi-currency tracker should do</H2>
          <P>
            A solid approach is simple:
            <br />• pick a base currency, for example GBP
            <br />• convert each account balance into that base using a daily rate
            <br />• keep your totals, milestones, and projections in the same base currency
          </P>

          <H2>Who this matters for</H2>
          <P>
            Multi-currency tracking is especially valuable if you:
            <br />• get paid in a foreign currency
            <br />• invest via US platforms
            <br />• hold overseas cash or property
            <br />• plan to relocate in the next 5–10 years
          </P>

          <H2>How Paddock handles it</H2>
          <P>
            Paddock is designed for deliberate planning: manual input, multi-currency accounts, and daily FX
            checking so your dashboard totals and projection remain coherent. Pro expands this into long-horizon
            modelling with inflation adjustment and optimisation.
          </P>

          <H2>Next steps</H2>
          <div className="guide-links">
            <a href="/guides/long-term-wealth-projection" className="guide-link-card">
              How long-term wealth projections work →
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