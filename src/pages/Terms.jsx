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

export default function Terms() {
  return (
    <div className="guide-shell">
      <TopBar title="Terms" />

      <div className="guide-container">
        <article className="guide-card">
          <div className="guide-kicker">Terms</div>
          <h1 className="guide-h1">Terms of use</h1>

          <p className="guide-lead">
            Paddock is designed to help you track wealth, model progress, and plan more deliberately. It is an
            informational tool, not personal financial advice, regulated investment advice, or a guarantee of
            future outcomes.
          </p>

          <H2>Nature of the product</H2>
          <P>
            Paddock provides dashboards, projections, milestones, and planning tools based on the information
            you enter and the assumptions used in the model. Outputs are intended to support understanding and
            planning, not to replace professional judgement.
          </P>

          <H2>No guarantee of outcomes</H2>
          <P>
            Projections are estimates only. Markets move, inflation changes, exchange rates vary, and personal
            circumstances evolve. A projection should be understood as a model, not a promise.
          </P>

          <H2>User responsibility</H2>
          <P>
            You are responsible for the accuracy of the information you enter and for how you use the output.
            Decisions about saving, investing, borrowing, tax, retirement, or financial planning remain your
            responsibility.
          </P>

          <H2>Accounts and subscriptions</H2>
          <P>
            Access, authentication, and subscriptions may rely on third-party providers such as Supabase Auth
            and Stripe. Paid plans, trial terms, and cancellation mechanics should be presented clearly in the
            product experience.
          </P>

          <H2>Future legal version</H2>
          <P>
            This page is a product-level terms summary suitable for a pre-launch marketing site. Before broader
            public launch, it should be replaced or supplemented with a fuller legal terms document tailored to
            your operating jurisdiction and business setup.
          </P>
        </article>

        <div className="guide-footer-action">
          <a href="/" className="guide-done">Done</a>
        </div>
      </div>
    </div>
  )
}