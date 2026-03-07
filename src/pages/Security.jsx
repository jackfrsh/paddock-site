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

export default function Security() {
  return (
    <div className="guide-shell">
      <TopBar title="Security" />

      <div className="guide-container">
        <article className="guide-card">
          <div className="guide-kicker">Security</div>
          <h1 className="guide-h1">Security at Paddock</h1>

          <p className="guide-lead">
            Paddock is intended to feel calm and simple on the surface, but that only works if the foundations
            are trustworthy. Security is treated as part of the product, not an afterthought.
          </p>

          <H2>Secure sign-in</H2>
          <P>
            Authentication and password reset flows are handled through Supabase Auth. This gives Paddock a
            modern account system without building custom login infrastructure from scratch.
          </P>

          <H2>Payments and subscriptions</H2>
          <P>
            Subscription handling is managed through Stripe. That keeps card and billing workflows within a
            specialist payments platform rather than pushing that complexity into the core app.
          </P>

          <H2>Manual input reduces exposure</H2>
          <P>
            Because Paddock is designed around manual input rather than mandatory bank linking, the product can
            remain simpler and more deliberate. That lowers the amount of connected financial surface area you
            need to trust just to use the dashboard.
          </P>

          <H2>Practical product posture</H2>
          <P>
            The goal is a product that is calm, understandable, and conservative in its design choices. That
            means fewer moving parts, fewer unnecessary integrations, and fewer places where trust can be
            eroded.
          </P>

          <H2>Ongoing improvement</H2>
          <P>
            Security is not a box to tick once. As the product grows, controls, monitoring, and policies should
            grow with it. This page should be treated as part of that ongoing trust posture.
          </P>
        </article>

        <div className="guide-footer-action">
          <a href="/" className="guide-done">Done</a>
        </div>
      </div>
    </div>
  )
}