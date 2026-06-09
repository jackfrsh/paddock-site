import React from 'react'
import { Helmet } from 'react-helmet-async'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

function ToolCard({ title, description, tags, ctaText, href, onClick }) {
  return (
    <a
      href={href}
      className="tool-card"
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="tool-card-header">
        <h2 className="tool-card-title">{title}</h2>
        {tags && tags.length > 0 && (
          <div className="tool-card-tags">
            {tags.map((tag) => (
              <span key={tag} className="tool-card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <p className="tool-card-desc">{description}</p>
      <span className="tool-card-cta">{ctaText || 'Try the tool'} →</span>
    </a>
  )
}

export default function ToolsHub({ navigateTo, goTo }) {
  return (
    <div className="landing-shell">
      <Helmet>
        <title>UK Wealth Calculators | Pension, FIRE & Net Worth | Paddock</title>
        <meta
          name="description"
          content="Free UK wealth calculators for pension drawdown, FIRE, ISA growth and net worth tracking. No login required; numbers stay in your browser."
        />
        <link rel="canonical" href="https://getpaddock.com/tools" />
        <meta property="og:title" content="UK Wealth Calculators | Pension, FIRE & Net Worth | Paddock" />
        <meta
          property="og:description"
          content="Free UK wealth calculators for pension drawdown, FIRE, ISA growth and net worth tracking. No login required; numbers stay in your browser."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://getpaddock.com/tools" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UK Wealth Calculators | Pension, FIRE & Net Worth | Paddock" />
        <meta
          name="twitter:description"
          content="Free UK financial planning tools from Paddock. No login required."
        />
      </Helmet>

      <SiteHeader navigateTo={navigateTo} goTo={goTo} />

      {/* Hero */}
      <section className="calc-hero">
        <div className="container">
          <div className="hero-kicker">Free tools</div>
          <h1 className="calc-h1">Free planning tools.</h1>
          <p className="calc-subhead">
            Calculators for UK pension drawdown, retirement income, and long-term wealth planning.
            No account required.
          </p>
          <p className="calc-trust">
            Your numbers are calculated in your browser and never sent anywhere.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section className="section-border">
        <div className="container section">
          <div className="tools-hub-grid">
            <ToolCard
              href="/tools/pension-drawdown-calculator"
              onClick={() => navigateTo('/tools/pension-drawdown-calculator')}
              title="Pension drawdown calculator UK"
              description="Enter your pension pot, retirement age, and assumptions to project how far your pension could go in drawdown. Includes a 3% / 4% / 5% withdrawal rate comparison."
              tags={['Free', 'No login required', 'UK']}
              ctaText="Try the calculator"
            />
            <ToolCard
              href="/tools/phased-drawdown-calculator"
              onClick={() => navigateTo('/tools/phased-drawdown-calculator')}
              title="Phased pension drawdown calculator UK"
              description="Can you retire before State Pension? Model phased retirement income — more in your active early years, less later — and your bridge to State Pension. Compares phased vs flat income for life."
              tags={['Free', 'No login required', 'UK']}
              ctaText="See if you can retire early"
            />
            <ToolCard
              href="/tools/retirement-bridge-calculator"
              onClick={() => navigateTo('/tools/retirement-bridge-calculator')}
              title="ISA retirement bridge calculator UK"
              description="Estimate how much you may need in ISA, cash or other accessible savings to bridge the gap between stopping work and private pension access."
              tags={['Free', 'No login required', 'UK']}
              ctaText="Estimate my bridge"
            />
            <ToolCard
              href="/tools/fire-number-calculator"
              onClick={() => navigateTo('/tools/fire-number-calculator')}
              title="FIRE number calculator UK"
              description="Find your financial independence target based on your annual spending and withdrawal rate. Includes a 3.5% / 4% / 4.5% comparison and an estimated timeline to FI."
              tags={['Free', 'No login required', 'UK']}
              ctaText="Calculate my FIRE number"
            />
            <ToolCard
              href="/tools/isa-growth-calculator"
              onClick={() => navigateTo('/tools/isa-growth-calculator')}
              title="ISA growth calculator UK"
              description="Project your Stocks and Shares ISA over 5, 10, 20 or 30 years. Enter your balance, monthly contributions, and return assumption. Includes a 3% / 5% / 7% return comparison."
              tags={['Free', 'No login required', 'UK']}
              ctaText="Project my ISA"
            />
            <ToolCard
              href="/tools/net-worth-calculator"
              onClick={() => navigateTo('/tools/net-worth-calculator')}
              title="Net worth calculator UK"
              description="Total your assets and liabilities to see your net worth instantly — cash, investments, pensions, property, and debts. Results update as you type. Optional multi-currency support."
              tags={['Free', 'No login required', 'Multi-currency']}
              ctaText="Calculate my net worth"
            />
          </div>
          <p className="tools-hub-note">
            More tools are in development. Use{' '}
            <a
              href="/guides"
              className="guide-inline-link"
              onClick={(e) => {
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                  e.preventDefault()
                  navigateTo('/guides')
                }
              }}
            >
              the guides
            </a>{' '}
            for in-depth explanations in the meantime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-border">
        <div className="container section">
          <div className="calc-cta-block">
            <h2 className="calc-cta-h2">Save your projections and track your full wealth.</h2>
            <p className="calc-cta-sub">
              Paddock gives you a private dashboard for ISAs, pensions, savings, property and
              multi-currency accounts — with long-term projections and decision support.
              No bank connection required.
            </p>
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
              >
                Start planning — it&apos;s free
              </button>
              <a
                href="/guides"
                className="btn btn-secondary"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides') } }}
              >
                Read the guides
              </a>
            </div>
            <p className="hero-foot">Free to start · No credit card required · Setup in under 2 minutes</p>
          </div>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
