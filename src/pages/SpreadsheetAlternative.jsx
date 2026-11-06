import React from 'react'
import SiteFooter from '../components/SiteFooter'
import { FaqSection, QuickAnswer, TableSection } from '../components/PageSections'
import {
  SHEET_COMPARISON,
  SHEET_FAQS,
  SHEET_MAPPING,
  SHEET_QUICK_ANSWER,
} from '../pageContent/spreadsheetAlternative.js'

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

export default function NetWorthTracker({ navigateTo }) {
  return (
    <div className="landing-shell">
      <section className="hero-section hero-section-guide">
        <div className="container">
          <div className="page-topbar">
            <a
              href="/"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}
              className="brand page-brand page-brand-lg"
            >
              Paddock<span>.</span>
            </a>

            <a
              href="/"
              className="guide-back-link"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}
            >
              Back to home
            </a>
          </div>
          <div className="hero-copy">
            <div className="hero-kicker">Spreadsheet alternative</div>

            <h1>
              A cleaner alternative to spreadsheets.
              <br />
              For tracking net worth.
            </h1>

            <p className="hero-sub">
              Keep the control of manual tracking, without relying on scattered tabs, fragile
              formulas and a process that gets harder to maintain as your financial life grows.
            </p>

            <div className="hero-actions">
              <a href="https://app.getpaddock.com/auth?mode=signup" className="btn btn-primary">
                Get started
              </a>
              <a
                href="/"
                className="btn btn-secondary"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}
              >
                Back to home
              </a>
            </div>

            <div className="hero-tags">
              <span>Still manual</span>
              <span>More structured</span>
              <span>Long-term focused</span>
              <span>Private by design</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <QuickAnswer>{SHEET_QUICK_ANSWER}</QuickAnswer>
        <SectionLabel>Overview</SectionLabel>
        <h2>Spreadsheets are powerful, until they become maintenance.</h2>
        <p className="section-copy narrow">
          A spreadsheet can be a good starting point. It is flexible, familiar and easy to open.
          But once wealth is spread across multiple account types, currencies or liabilities, the
          sheet often becomes a system you have to maintain rather than a tool that gives you
          clarity.
        </p>

        <div className="split-columns">
          <div>
            <h3>Tabs multiply.</h3>
            <div className="line" />
            <p>
              What starts as a simple workbook often grows into something harder to review at a
              glance, especially once categories, formulas and historic snapshots start to build up.
            </p>
          </div>

          <div>
            <h3>Confidence gets weaker.</h3>
            <div className="line" />
            <p>
              The bigger problem is not the file itself. It is how difficult it becomes to trust the
              structure quickly and stay consistent with updates over time.
            </p>
          </div>

          <div>
            <h3>Review becomes admin.</h3>
            <div className="line" />
            <p>
              The process slowly shifts from understanding your wealth to maintaining the machinery
              around it. That is the point where the tool starts working against the outcome.
            </p>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col">
          <div>
            <SectionLabel>Why Paddock</SectionLabel>
            <h2>What Paddock does differently.</h2>
            <p className="section-copy narrow">
              Paddock keeps the discipline of manual tracking, but gives it a more structured home.
              Accounts, asset types and liabilities live in a clearer framework rather than a custom
              spreadsheet layout you have to build and maintain yourself.
            </p>
            <p className="section-copy narrow">
              The goal is to make your total wealth obvious, not bury it inside formulas, tabs and
              worksheet logic.
            </p>
          </div>

          <div>
            <SectionLabel>Positioning</SectionLabel>
            <h2>This is not an attack on spreadsheets.</h2>
            <p className="section-copy narrow">
              Many people begin in a spreadsheet, and that makes sense. The question is not whether
              spreadsheets are good or bad. The question is whether they are still the right tool
              once your wealth picture becomes broader, more valuable and more important to review
              consistently.
            </p>
            <p className="section-copy narrow">
              Paddock is for the point where a spreadsheet still works, but no longer feels elegant.
            </p>
          </div>
        </div>
      </section>

      <TableSection {...SHEET_COMPARISON} />

      <TableSection {...SHEET_MAPPING} />

      <section className="section-border">
        <div className="container section">
          <SectionLabel>Related pages</SectionLabel>
          <h2>Explore related guides and pages.</h2>
          <p className="section-copy">
            Keep moving through the core ideas behind structured wealth tracking.
          </p>

          <div className="use-links-grid use-links-grid-3">
            <a
              href="/net-worth-tracker"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/net-worth-tracker') } }}
            >
              <h3>Net worth tracking</h3>
              <div className="line" />
              <p>See assets and liabilities together in one premium wealth dashboard.</p>
            </a>

            <a
              href="/track-isas-pensions-savings"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/track-isas-pensions-savings') } }}
            >
              <h3>Track ISAs and pensions</h3>
              <div className="line" />
              <p>Bring core UK wealth accounts into one clear long-term view.</p>
            </a>

            <a
              href="/how-to-track-your-net-worth"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/how-to-track-your-net-worth') } }}
            >
              <h3>How to track your net worth</h3>
              <div className="line" />
              <p>A practical guide to what to include and what matters most.</p>
            </a>
          </div>
        </div>
      </section>

      <FaqSection faqs={SHEET_FAQS} />


      <section className="section-border">
        <div className="container final-cta">
          <h2>Move beyond spreadsheet maintenance.</h2>
          <p className="section-copy center narrow-center">
            Keep the control of manual tracking, with a product designed to make wealth easier to
            review and easier to trust.
          </p>

          <div className="hero-actions center">
            <a href="https://app.getpaddock.com/auth?mode=signup" className="btn btn-primary">
              Create account
            </a>
            <a
              href="/net-worth-tracker"
              className="btn btn-secondary"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/net-worth-tracker') } }}
            >
              View net worth page
            </a>
          </div>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
