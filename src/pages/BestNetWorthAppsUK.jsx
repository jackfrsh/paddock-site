import React from 'react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

export default function BestNetWorthAppsUK({ navigateTo, goTo }) {
  return (
    <div className="landing-shell">
      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-section hero-section-guide">
        <div className="container">
          <div className="hero-copy">
            <div className="hero-kicker">UK comparison</div>
            <h1>
              Best net worth tracking<br />
              apps UK
            </h1>
            <p className="hero-sub">
              A practical comparison for UK users who want to track wealth across ISAs,
              pensions, savings, property, and multiple currencies — not just their spending.
            </p>
            <p className="hero-foot" style={{ marginTop: 16 }}>
              This comparison focuses on long-term wealth tracking, not day-to-day budgeting.
              The tools listed are the most relevant options for UK users building a durable
              picture of their total wealth.
            </p>
            <div className="hero-tags" style={{ marginTop: 24 }}>
              <span>ISAs &amp; pensions</span>
              <span>Multi-currency</span>
              <span>Long-term planning</span>
              <span>Privacy &amp; bank linking</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Comparison</SectionLabel>
          <h2>How the main options compare</h2>
          <p className="section-copy narrow">
            Each tool takes a meaningfully different approach. The right choice depends on
            whether automatic syncing or deliberate, private tracking is a better fit
            for how you manage your finances.
          </p>

          <div className="cmp-table-wrap">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th></th>
                  <th className="cmp-col-paddock">Paddock</th>
                  <th>Emma</th>
                  <th>Moneyhub</th>
                  <th>Spreadsheet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Entry method</td>
                  <td className="cmp-col-paddock">Manual — you enter balances</td>
                  <td>Automatic via open banking</td>
                  <td>Automatic via open banking</td>
                  <td>Manual — you build it yourself</td>
                </tr>
                <tr>
                  <td>Primary focus</td>
                  <td className="cmp-col-paddock">Total wealth &amp; long-term planning</td>
                  <td>Budgeting &amp; spending tracking</td>
                  <td>Broad account aggregation</td>
                  <td>Whatever you design it for</td>
                </tr>
                <tr>
                  <td>ISAs, SIPPs &amp; UK wrappers</td>
                  <td className="cmp-col-paddock">Yes — designed for UK wealth accounts</td>
                  <td>Bank &amp; card accounts primarily</td>
                  <td>Broad account types supported</td>
                  <td>Manual — any account you add</td>
                </tr>
                <tr>
                  <td>Multi-currency</td>
                  <td className="cmp-col-paddock">Yes — daily FX rates built in</td>
                  <td>UK-focused</td>
                  <td>Yes</td>
                  <td>Manual FX setup required</td>
                </tr>
                <tr>
                  <td>Long-term projections</td>
                  <td className="cmp-col-paddock">Yes — 5–40 year outlook</td>
                  <td>No</td>
                  <td>Limited</td>
                  <td>Build your own</td>
                </tr>
                <tr>
                  <td>Privacy / bank linking</td>
                  <td className="cmp-col-paddock">No bank credentials shared</td>
                  <td>Open banking required</td>
                  <td>Open banking required</td>
                  <td>Local — you control everything</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td className="cmp-col-paddock">Private, deliberate wealth tracking</td>
                  <td>Automatic spending overview</td>
                  <td>Broad aggregation or adviser users</td>
                  <td>Spreadsheet-native users</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="cmp-note">
            Comparison reflects each product's primary positioning and public feature set.
            Individual plans and features may vary. Not financial advice.
          </p>
        </div>
      </section>

      {/* ── Who is each best for ──────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Self-selection</SectionLabel>
          <h2>Which is best for you?</h2>
          <p className="section-copy narrow">
            The best tool depends on what you are trying to do — and how much you value
            privacy versus convenience.
          </p>

          <div className="faq-grid">
            <div className="faq-card">
              <h3>Paddock — best for private wealth tracking</h3>
              <p>
                If you want to track ISAs, pensions, savings, property, and multi-currency
                accounts in one deliberate view — without sharing bank credentials — Paddock
                is built for that. It is designed for people who want total wealth visibility
                over the long term, not a live feed of transactions. No open banking required.
              </p>
            </div>

            <div className="faq-card">
              <h3>Emma — best for automatic spending overview</h3>
              <p>
                If your primary goal is to see spending, subscriptions, and bank balances
                automatically without manual entry, Emma is designed around that need.
                It uses open banking to sync your accounts and focuses on budgeting and
                spending awareness rather than long-term wealth tracking.
              </p>
            </div>

            <div className="faq-card">
              <h3>Moneyhub — best for broad automatic aggregation</h3>
              <p>
                If you want a wider range of accounts aggregated automatically, or if you
                work with a financial adviser who uses Moneyhub's platform, it may be a
                better fit. It is more aggregation-focused than planning-focused, and
                primarily relies on open banking connections.
              </p>
            </div>

            <div className="faq-card">
              <h3>Spreadsheet — best for full manual control</h3>
              <p>
                If you are technically comfortable and already have your own models,
                a spreadsheet gives you maximum flexibility at zero cost. The main
                drawbacks are maintaining FX rates manually, no built-in projections,
                and no mobile view — which is where dedicated apps add the most value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Paddock is different ──────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Paddock</SectionLabel>
          <h2>Why Paddock takes a different approach.</h2>
          <p className="section-copy narrow">
            Most wealth tracking apps are built around automatic bank syncing. Paddock
            starts from a different premise: that deliberate, private tracking of total
            wealth is a more durable foundation than a live feed you share with a third party.
          </p>

          <div className="split-columns">
            <div>
              <h3>Manual entry is a feature.</h3>
              <div className="line" />
              <p>
                Entering your own numbers once a month keeps the experience intentional.
                Most serious wealth trackers do not need a live sync — they need an
                accurate, consistent picture they can trust over years, not minutes.
              </p>
            </div>

            <div>
              <h3>Built for UK wealth accounts.</h3>
              <div className="line" />
              <p>
                ISAs, SIPPs, savings, property, and multi-currency accounts are
                first-class in Paddock. The product is designed around the accounts
                UK investors actually use — not bolted on as an afterthought.
              </p>
            </div>

            <div>
              <h3>Private by design.</h3>
              <div className="line" />
              <p>
                No bank credentials are shared with Paddock. No third-party aggregator
                sits between you and your accounts. For wealth tracking — where the
                numbers are larger and more sensitive — that matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Honest trade-offs ─────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Honest trade-offs</SectionLabel>
          <h2>When Paddock might not be the right fit.</h2>
          <p className="section-copy narrow">
            No single tool is right for everyone. Here is where Paddock is weaker.
          </p>

          <div className="cmp-tradeoff">
            <p>
              <strong>If you want automatic syncing above all else,</strong> Paddock is not
              the right choice. Emma and Moneyhub are better-designed for users who want
              accounts to update without any manual input. Paddock requires you to enter
              your own numbers — typically once a month.
            </p>
            <p>
              <strong>If day-to-day spending visibility is the main goal,</strong> a
              budgeting-first tool will serve you better. Paddock is built around total
              wealth and long-term progress, not transaction-level spending awareness.
            </p>
            <p>
              <strong>If you already have a working spreadsheet model</strong> and are
              comfortable maintaining it, that may be the right tool for you. Paddock
              adds the most value when a spreadsheet has become unreliable, hard to access
              on mobile, or difficult to extend across multiple currencies and wrappers.
            </p>
          </div>
        </div>
      </section>

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>Related</SectionLabel>
          <h2>Explore Paddock more closely.</h2>
          <p className="section-copy">
            If any of these fit what you are looking for, they go deeper.
          </p>

          <div className="use-links-grid use-links-grid-3">
            <a
              href="/guides/multi-currency-net-worth-tracker"
              className="use-link-item"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/guides/multi-currency-net-worth-tracker')
                }
              }}
            >
              <h3>Multi-currency portfolio tracker</h3>
              <div className="line" />
              <p>How Paddock handles accounts in different currencies with a single base-currency view.</p>
            </a>

            <a
              href="/tools/pension-drawdown-calculator"
              className="use-link-item"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/tools/pension-drawdown-calculator')
                }
              }}
            >
              <h3>Pension drawdown calculator</h3>
              <div className="line" />
              <p>Free tool to project how long your pension could last across different withdrawal rates.</p>
            </a>

            <a
              href="/track-isas-pensions-savings"
              className="use-link-item"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/track-isas-pensions-savings')
                }
              }}
            >
              <h3>Track ISAs and pensions</h3>
              <div className="line" />
              <p>How Paddock handles UK wrappers — ISAs, SIPPs, and savings — in one place.</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <SectionLabel>FAQ</SectionLabel>
          <h2>Common questions.</h2>

          <div className="faq-grid">
            <div className="faq-card">
              <h3>What is the best net worth tracking app in the UK?</h3>
              <p>
                It depends on what you are trying to do. If you want automatic syncing and
                spending insights, Emma or Moneyhub are strong options. If you want a
                private, deliberate view of total wealth — ISAs, pensions, savings,
                property, and multi-currency accounts — with long-term projections and no
                bank linking, Paddock is built for that.
              </p>
            </div>

            <div className="faq-card">
              <h3>Can I track pensions and ISAs in one place?</h3>
              <p>
                Yes — Paddock is specifically designed to hold UK wealth accounts together.
                You can add a Stocks &amp; Shares ISA, a SIPP, cash savings, and other
                accounts side by side, with everything converted into one base-currency
                net worth figure. You update the balances manually, typically once a month.
              </p>
            </div>

            <div className="faq-card">
              <h3>Do I need open banking to track my net worth?</h3>
              <p>
                No. Paddock is entirely manual-entry — there is no open banking, no bank
                credential sharing, and no third-party sync. You enter your own balances.
                This is slower than automatic syncing but more private, more deliberate,
                and less fragile — especially for overseas accounts that open banking
                connections often cannot reach.
              </p>
            </div>

            <div className="faq-card">
              <h3>Are manual net worth trackers better for privacy?</h3>
              <p>
                Generally, yes. Open banking tools require you to share credentials or
                grant access to your financial accounts, which means a third party can
                see your transaction history. With a manual tracker like Paddock,
                nothing is shared — you enter numbers yourself, and the data stays
                in the app. For wealth tracking, where balances and account types are
                sensitive, that is a meaningful difference.
              </p>
            </div>

            <div className="faq-card">
              <h3>What if I already use a spreadsheet?</h3>
              <p>
                Spreadsheets work well until they do not — usually when the number of
                accounts grows, FX rates need to be maintained, projections become
                complicated, or mobile access matters. Paddock handles those parts
                automatically, while keeping the deliberate manual-entry approach that
                makes spreadsheets reliable in the first place. There is a free tier,
                so you can run both in parallel before committing to either.
              </p>
            </div>

            <div className="faq-card">
              <h3>Is there a UK net worth tracker that works without bank linking?</h3>
              <p>
                Paddock is built specifically for this. It is a manual-entry, privacy-first
                wealth tracker with UK account types — ISAs, SIPPs, savings, property —
                multi-currency support with daily FX rates, and long-term projections.
                No bank connection is required at any point.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container final-cta">
          <h2>Track your wealth privately,<br />clearly, without bank linking.</h2>
          <p className="section-copy center narrow-center">
            Paddock gives you one premium place to see ISAs, pensions, savings, property,
            and multi-currency accounts together — with long-term projections and no
            open banking required.
          </p>

          <div className="hero-actions center">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goTo('signup')}
            >
              Create your free account
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigateTo('/net-worth-tracker')}
            >
              See how Paddock works
            </button>
          </div>

          <p className="hero-foot">Free to start · No credit card required · No bank linking</p>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
