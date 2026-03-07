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

export default function Privacy() {
  return (
    <div className="guide-shell">
      <TopBar title="Privacy" />

      <div className="guide-container">
        <article className="guide-card">
          <div className="guide-kicker">Privacy</div>
          <h1 className="guide-h1">Privacy at Paddock</h1>

          <p className="guide-lead">
            Paddock is designed to help you understand your wealth without turning your data into a product.
            We aim to keep data collection minimal, keep product decisions straightforward, and avoid the
            ad-driven patterns common in consumer finance tools.
          </p>

          <H2>What Paddock is built around</H2>
          <P>
            Paddock is designed around manual input, clear modelling, and a private dashboard experience.
            The goal is to help you track and plan with intention, not to maximise engagement through
            advertising or unnecessary data extraction.
          </P>

          <H2>No ad network model</H2>
          <P>
            The product is not designed around third-party advertising. We do not position Paddock as an
            ad-supported finance product, and the experience is intended to remain focused, calm, and free
            from ad clutter.
          </P>

          <H2>No bank linking by default</H2>
          <P>
            Paddock does not rely on mandatory bank connections to function. That means you can build and
            maintain your model without handing over unnecessary access to financial accounts just to get
            started.
          </P>

          <H2>Account and billing providers</H2>
          <P>
            Authentication and account access are handled through Supabase Auth. Billing and subscription
            management are handled through Stripe. These services are used to support secure access and paid
            plans, not to create an advertising profile.
          </P>

          <H2>How to read this page</H2>
          <P>
            This page is a product-level explanation of how Paddock approaches privacy. If you need formal
            legal wording or policy terms for launch, that should sit alongside this page or replace it with
            a fuller legal policy.
          </P>
        </article>

        <div className="guide-footer-action">
          <a href="/" className="guide-done">Done</a>
        </div>
      </div>
    </div>
  )
}