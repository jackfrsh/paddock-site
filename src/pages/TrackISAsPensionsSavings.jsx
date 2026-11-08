import React from 'react'
import SignupLink from '../components/SignupLink'
import Breadcrumbs from '../components/Breadcrumbs'
import SiteFooter from '../components/SiteFooter'
import SkipLink from '../components/SkipLink'
import IsaAllowanceCard from '../components/IsaAllowanceCard'
import { ISA_RULES, gbp } from '../isaRules'
import { ExampleSection, FaqSection, QuickAnswer, TableSection } from '../components/PageSections'
import {
  ISA_PAGE_EXAMPLE,
  ISA_PAGE_QUICK_ANSWER,
  ISA_PAGE_TABLE,
  TRACK_ISAS_FAQS,
} from '../pageContent/trackIsas.js'

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

export default function TrackISAsPensionsSavings({ navigateTo }) {
  return (
    <div className="landing-shell">
      <SkipLink />
      <main id="main-content" tabIndex={-1}>
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
          <Breadcrumbs />
          <div className="hero-copy">
          <div className="hero-kicker">Track ISAs, pensions and savings</div>

<h1>
  Track ISAs, pensions and savings.
  <br />
  In one place.
</h1>

<p className="hero-sub">
  Bring your core UK wealth accounts into one private dashboard, so you can see how savings,
  investments and retirement wealth are moving together over time.
</p>

            <div className="hero-actions">
              <SignupLink location="hero">
                Start tracking
              </SignupLink>
              <a
                href="/"
                className="btn btn-secondary"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}
              >
                Back to home
              </a>
            </div>

            <div className="hero-tags">
              <span>ISAs</span>
              <span>Pensions</span>
              <span>Savings accounts</span>
              <span>Manual and private</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <QuickAnswer>{ISA_PAGE_QUICK_ANSWER}</QuickAnswer>
        <SectionLabel>Overview</SectionLabel>
        <h2>UK wealth is often spread across too many places.</h2>
        <p className="section-copy narrow">
          It is common to hold cash in one bank, long-term savings elsewhere, an ISA with one
          provider, and a workplace or personal pension in another portal entirely. Each account
          shows one slice of the picture. Very few show how the whole system is progressing.
        </p>

        <div className="split-columns">
          <div>
            <h3>See core accounts together.</h3>
            <div className="line" />
            <p>
              Keep your main savings, ISA balances and pension values in one structure rather than
              relying on separate provider logins and a rough mental total.
            </p>
          </div>

          <div>
            <h3>Understand the bigger picture.</h3>
            <div className="line" />
            <p>
              The goal is not to stare at isolated balances. It is to understand whether your
              overall wealth is strengthening and whether your long-term plan is moving in the right
              direction.
            </p>
          </div>

          <div>
            <h3>Review with more confidence.</h3>
            <div className="line" />
            <p>
              When pensions, cash and investments sit together, progress becomes easier to read and
              easier to review calmly.
            </p>
          </div>
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col">
          <div>
            <SectionLabel>Why this matters</SectionLabel>
            <h2>Separate provider views are never the full view.</h2>
            <p className="section-copy narrow">
              Each provider is good at showing its own balance. None of them show how your ISA
              compares with your cash position, how your pension fits into the total, or whether the
              wider picture is compounding in the way you want.
            </p>
            <p className="section-copy narrow">
              That is the gap Paddock is designed to fill. It gives you one calm surface for
              tracking long-term wealth across the accounts that matter most.
            </p>
          </div>

          <div>
            <SectionLabel>Who it is for</SectionLabel>
            <h2>Built for people already saving and investing.</h2>
            <p className="section-copy narrow">
              This is for people who already have momentum, but do not have one clear view across
              all of it. It is especially useful when pensions, cash and investments live across
              multiple providers and the total feels harder to see than it should.
            </p>
            <p className="section-copy narrow">
              It is not about hyperactive account checking. It is about staying oriented around the
              total and reviewing progress with more confidence.
            </p>
          </div>
        </div>
      </section>

      <TableSection {...ISA_PAGE_TABLE} />

      <section className="section-border">
        <div className="container section two-col">
          <div>
            <SectionLabel>ISA allowance</SectionLabel>
            <h2>Keep an eye on your ISA allowance as you track.</h2>
            <p className="section-copy narrow">
              Tracking ISA balances is one job; knowing how much allowance you have left is
              another. The ISA allowance is {gbp(ISA_RULES.overallAllowance)} for the{' '}
              {ISA_RULES.taxYear} tax year ({ISA_RULES.taxYearStart} to {ISA_RULES.taxYearEnd}),
              shared across every adult ISA you hold. Paddock’s planner works out how much is
              left from what you have already paid in this tax year, and whether your current
              monthly saving would use it before the year ends.
            </p>
            <p className="section-copy narrow">
              The planned cut to the Cash ISA limit, to {gbp(ISA_RULES.cancelledCashIsaLimit)} for
              people under 65 from {ISA_RULES.cashIsaCapWouldHaveStarted}, was dropped in the Autumn Budget
              on {ISA_RULES.cashIsaCapDroppedOn}. HMRC says the {gbp(ISA_RULES.overallAllowance)}{' '}
              Cash ISA limit is retained from that date (see{' '}
              <a href={ISA_RULES.hmrcNewsletterUrl} target="_blank" rel="noreferrer">
                HMRC’s October 2026 newsletter
              </a>
              ). Seeing your Cash and Stocks and Shares ISAs side by side still makes it easier to
              plan the split.
            </p>
            <p className="isa-rules-note">
              General information, not financial or tax advice. Rules checked {ISA_RULES.reviewed};
              confirm the latest on{' '}
              <a href={ISA_RULES.govUkUrl} target="_blank" rel="noreferrer">
                GOV.UK
              </a>
              .
            </p>
          </div>

          <div className="isa-card-wrap">
            <IsaAllowanceCard />
          </div>
        </div>
      </section>

      <ExampleSection {...ISA_PAGE_EXAMPLE} />

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
              <p>Bring assets and liabilities together in one clear long-term view.</p>
            </a>

            <a
              href="/spreadsheet-alternative-net-worth-tracking"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/spreadsheet-alternative-net-worth-tracking') } }}
            >
              <h3>Replace spreadsheets</h3>
              <div className="line" />
              <p>Move from fragile tabs and formulas to a cleaner structured workflow.</p>
            </a>

            <a
              href="/how-to-track-your-net-worth"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/how-to-track-your-net-worth') } }}
            >
              <h3>How to track your net worth</h3>
              <div className="line" />
              <p>Learn what to include, how often to update, and what matters most.</p>
            </a>

            <a
              href="/guides/isa-allowance-uk"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/isa-allowance-uk') } }}
            >
              <h3>ISA allowance</h3>
              <div className="line" />
              <p>How much can be paid in this tax year, what counts, and how several ISAs share it.</p>
            </a>

            <a
              href="/guides/lifetime-isa-rules-uk"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/lifetime-isa-rules-uk') } }}
            >
              <h3>Lifetime ISA rules</h3>
              <div className="line" />
              <p>The bonus, the yearly limit, penalty-free withdrawals and the charge on the rest.</p>
            </a>

            <a
              href="/guides/end-of-tax-year-checklist-uk"
              className="use-link-item"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/end-of-tax-year-checklist-uk') } }}
            >
              <h3>End of tax year checklist</h3>
              <div className="line" />
              <p>What is worth checking before 5 April, and what changes on 6 April.</p>
            </a>
          </div>
        </div>
      </section>

      <FaqSection faqs={TRACK_ISAS_FAQS} />


      <section className="section-border">
        <div className="container final-cta">
          <h2>See your UK wealth accounts together.</h2>
          <p className="section-copy center narrow-center">
            Bring savings, ISAs and pensions into one premium dashboard and keep your long-term
            direction easier to read.
          </p>

          <div className="hero-actions center">
            <SignupLink location="bottom">
              Start tracking
            </SignupLink>
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

      </main>
      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
