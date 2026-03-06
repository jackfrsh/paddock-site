import './App.css'

const SIGNIN_URL = 'https://app.getpaddock.com/auth?mode=signin'
const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'

function App() {
  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand">Paddock</div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#why">Why Paddock</a>
          <a href={SIGNIN_URL}>Sign in</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">Wealth OS for high performers</p>
            <h1>Know your number. Build your future.</h1>
            <p className="subcopy">
              A calm, premium net worth tracker for people who want clarity over chaos.
              Track your wealth across accounts and currencies, understand progress, and
              project your path forward.
            </p>

            <div className="hero-actions">
              <a className="btn btn-primary" href={SIGNUP_URL}>
                Get started
              </a>
              <a className="btn btn-secondary" href={SIGNIN_URL}>
                Sign in
              </a>
            </div>

            <p className="microcopy">
              No ads. No bank-linking dependency. Just a private, intentional wealth dashboard.
            </p>
          </div>

          <div className="hero-panel">
            <div className="stat-card">
              <span className="stat-label">Net worth</span>
              <span className="stat-value">£248,400</span>
              <span className="stat-delta positive">+£3,240 this month</span>
            </div>

            <div className="mini-grid">
              <div className="mini-card">
                <span className="mini-label">Projection</span>
                <span className="mini-value">On track</span>
              </div>
              <div className="mini-card">
                <span className="mini-label">Base currency</span>
                <span className="mini-value">GBP</span>
              </div>
              <div className="mini-card">
                <span className="mini-label">Accounts</span>
                <span className="mini-value">Multi-account</span>
              </div>
              <div className="mini-card">
                <span className="mini-label">Style</span>
                <span className="mini-value">Calm &amp; clear</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="section-heading">
            <p className="section-eyebrow">Features</p>
            <h2>Built for thoughtful wealth building</h2>
          </div>

          <div className="cards three-up">
            <article className="feature-card">
              <h3>Track your full net worth</h3>
              <p>
                See investments, cash, property and liabilities in one place with a
                clean, premium dashboard.
              </p>
            </article>

            <article className="feature-card">
              <h3>Multi-currency support</h3>
              <p>
                Monitor wealth across currencies with a clear base-currency view that
                keeps the big picture readable.
              </p>
            </article>

            <article className="feature-card">
              <h3>Long-term projections</h3>
              <p>
                Model the road ahead with manual assumptions, contribution planning and
                inflation-aware thinking.
              </p>
            </article>
          </div>
        </section>

        <section id="why" className="section">
          <div className="section-heading">
            <p className="section-eyebrow">Why Paddock</p>
            <h2>Private by design. Intentional by default.</h2>
          </div>

          <div className="cards two-up">
            <article className="feature-card">
              <h3>Less noise, more clarity</h3>
              <p>
                Paddock is designed to feel calm and premium, not cluttered and
                overwhelming.
              </p>
            </article>

            <article className="feature-card">
              <h3>Built for real progress</h3>
              <p>
                The goal is not just to show balances. It is to help you understand
                momentum and make better long-term decisions.
              </p>
            </article>
          </div>
        </section>

        <section className="cta">
          <div className="cta-card">
            <p className="section-eyebrow">Start now</p>
            <h2>A better way to track wealth.</h2>
            <p>
              Open the app and start building a clearer view of your financial future.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={SIGNUP_URL}>
                Create account
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>Paddock</div>
        <div className="footer-links">
          <a href={SIGNIN_URL}>Sign in</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/security">Security</a>
        </div>
      </footer>
    </div>
  )
}

export default App