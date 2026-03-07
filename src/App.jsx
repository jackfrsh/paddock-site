import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import homeShot from '/src/assets/landing/paddock-home.png'
import outlookShot from '/src/assets/landing/paddock-outlook.png'
import insightsShot from '/src/assets/landing/paddock-insights.png'
import homeShotWebp from '/src/assets/landing/paddock-home.webp'
import outlookShotWebp from '/src/assets/landing/paddock-outlook.webp'
import insightsShotWebp from '/src/assets/landing/paddock-insights.webp'

import MultiCurrency from './guides/MultiCurrency'
import LongTermProjection from './guides/LongTermProjection'
import InflationAdjusted from './guides/InflationAdjusted'
import Privacy from './pages/Privacy'
import Security from './pages/Security'
import Terms from './pages/Terms'

const SIGNIN_URL = 'https://app.getpaddock.com/auth?mode=signin'
const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'

const navigateTo = (path) => {
  window.history.pushState({}, '', path)
  setRoute(getRoute())
  window.scrollTo({ top: 0, behavior: 'instant' })
}

function getRoute() {
  const path = (window.location.pathname || '/').toLowerCase()

  if (path.startsWith('/guides/multi-currency-net-worth-tracker')) return 'guide_multi_currency'
  if (path.startsWith('/guides/long-term-wealth-projection')) return 'guide_long_term_projection'
  if (path.startsWith('/guides/inflation-adjusted-net-worth')) return 'guide_inflation_adjusted'

  if (path.startsWith('/privacy')) return 'privacy'
  if (path.startsWith('/security')) return 'security'
  if (path.startsWith('/terms')) return 'terms'

  return 'landing'
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function SectionLabel({ children }) {
  return <div className="section-label">{children}</div>
}

function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          obs.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return ref
}

function Reveal({ children, className = '' }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: 'translateY(16px)',
        transition:
          'opacity 0.6s cubic-bezier(0.2,0.8,0.2,1), transform 0.6s cubic-bezier(0.2,0.8,0.2,1)',
      }}
    >
      {children}
    </div>
  )
}

function Screenshot({ src, webp, alt, caption }) {
  return (
    <div className="shot-wrap">
      <div className="shot-frame">
        <picture>
          {webp ? <source srcSet={webp} type="image/webp" /> : null}
          <img src={src} alt={alt} className="shot-image" loading="lazy" />
        </picture>
      </div>
      {caption ? <p className="shot-caption">{caption}</p> : null}
    </div>
  )
}

export default function App() {
  const [pending, setPending] = useState(null)
  const [route, setRoute] = useState(getRoute)

  const goTo = (kind) => {
    if (pending) return
    setPending(kind)

    const url = kind === 'signup' ? SIGNUP_URL : SIGNIN_URL

    window.setTimeout(() => {
      window.location.href = url
    }, 180)
  }

  useEffect(() => {
    const resetPending = () => setPending(null)

    window.addEventListener('pageshow', resetPending)
    window.addEventListener('focus', resetPending)

    return () => {
      window.removeEventListener('pageshow', resetPending)
      window.removeEventListener('focus', resetPending)
    }
  }, [])

  useEffect(() => {
    const onPop = () => setRoute(getRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (route === 'guide_multi_currency') return <MultiCurrency />
  if (route === 'guide_long_term_projection') return <LongTermProjection />
  if (route === 'guide_inflation_adjusted') return <InflationAdjusted />
  if (route === 'privacy') return <Privacy />
  if (route === 'security') return <Security />
  if (route === 'terms') return <Terms />

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="brand"
          >
            Paddock<span>.</span>
          </button>

          <nav className="nav-actions">
            <button type="button" onClick={() => scrollToId('product')} className="nav-link subtle">
              Product
            </button>
            <button type="button" onClick={() => scrollToId('pricing')} className="nav-link subtle">
              Pricing
            </button>
            <a href="/guides/long-term-wealth-projection" className="nav-link subtle nav-guides">
              Guides
            </a>

            <div className="nav-divider" />

            <button
              type="button"
              onClick={() => goTo('signin')}
              className="nav-link"
              disabled={!!pending}
            >
              {pending === 'signin' ? 'Opening…' : 'Sign in'}
            </button>

            <button
              type="button"
              onClick={() => goTo('signup')}
              className="btn btn-primary nav-cta"
              disabled={!!pending}
            >
              {pending === 'signup' ? 'Opening…' : 'Create account'}
            </button>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-copy">
            <div className="hero-kicker">Personal wealth dashboard</div>

            <h1>
              Know your number.
              <br />
              Build your future.
            </h1>

            <p className="hero-sub">
              A clear model of your wealth, built around one long-term goal — with visible assumptions and
              projections that show the path ahead.
            </p>

            <p className="hero-meta">
              Multi-currency net worth tracking with visible assumptions, long-term projections, and a clearer
              view of the path ahead. No ads. No bank connections.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Get started'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => goTo('signin')}
                disabled={!!pending}
              >
                {pending === 'signin' ? 'Opening…' : 'Sign in'}
              </button>
            </div>

            <p className="hero-foot">Free to start • No credit card required • Setup takes under 2 minutes</p>

            <div className="hero-tags">
              <span>Multi-currency portfolios</span>
              <span>Snapshots</span>
              <span>Manual input</span>
              <span>No ads</span>
              <span>No bank linking</span>
              <span>Private by design</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-tight">
        <Reveal>
          <Screenshot
            src={homeShot}
            webp={homeShotWebp}
            alt="Paddock dashboard showing net worth, milestones and plan progress"
            caption="Net worth dashboard with milestones, trajectory and plan progress."
          />
        </Reveal>
      </section>

      <section id="product" className="container section">
        <Reveal>
          <SectionLabel>Product</SectionLabel>
          <h2>Everything that matters, in one place.</h2>
          <p className="section-copy">
            Built for clarity: one long-term goal, visible assumptions, and a dashboard you’ll actually check.
          </p>

          <div className="split-columns">
            <div>
              <h3>One target. Always visible.</h3>
              <div className="line" />
              <p>
                A single long-term goal anchors the model. Your projection evolves as your net worth and
                contributions change.
              </p>
            </div>

            <div>
              <h3>Multi-currency portfolios.</h3>
              <div className="line" />
              <p>
                Track ISAs, SIPPs, cash, property and more across currencies with a clear base-currency view.
              </p>
            </div>

            <div>
              <h3>Assumptions in plain sight.</h3>
              <div className="line" />
              <p>
                Contribution, return and time horizon sit next to the model — not buried in menus or hidden
                settings.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Projection</SectionLabel>
            <h2>See where your wealth is heading.</h2>
            <p className="section-copy">
              A long-horizon model that shows both the gap and the path — so your progress is easier to
              understand and easier to act on.
            </p>
          </Reveal>

          <Reveal className="section-top-gap">
            <Screenshot
              src={outlookShot}
              webp={outlookShotWebp}
              alt="Paddock outlook view showing long-term wealth projection"
              caption="Long-term projection with visible assumptions and trajectory."
            />
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col">
          <Reveal>
            <SectionLabel>Scenarios</SectionLabel>
            <h2>See the impact before you commit.</h2>
            <p className="section-copy narrow">
              Adjust contributions, compare timelines, and understand the trade-offs before you make the next
              move.
            </p>

            <div className="pill-links">
              <a href="/guides/long-term-wealth-projection" className="pill-link">
                Long-term projections
              </a>
              <a href="/guides/inflation-adjusted-net-worth" className="pill-link">
                Inflation-adjusted views
              </a>
            </div>
          </Reveal>

          <Reveal>
            <Screenshot
              src={insightsShot}
              webp={insightsShotWebp}
              alt="Paddock insights and scenario modelling view"
              caption="Scenario modelling and deeper planning views."
            />
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Trust</SectionLabel>
            <h2>Private by default.</h2>
            <p className="section-copy">
              No ads. No trackers. No bank linking. Just a deliberate, premium space to understand and build
              wealth.
            </p>

            <div className="trust-grid">
              <div>
                <h3>No ads. No ad tracking.</h3>
                <p>The product is designed to stay focused, private and free from ad clutter.</p>
              </div>
              <div>
                <h3>Secure sign-in.</h3>
                <p>Password reset and account access are handled through Supabase Auth.</p>
              </div>
              <div>
                <h3>Stripe billing.</h3>
                <p>Subscriptions are managed securely, with a clean upgrade path when needed.</p>
              </div>
            </div>

            <div className="pill-links section-top-gap-sm">
  <button type="button" onClick={() => navigateTo('/terms')} className="pill-link">
    Terms
  </button>
  <button type="button" onClick={() => navigateTo('/privacy')} className="pill-link">
    Privacy
  </button>
  <button type="button" onClick={() => navigateTo('/security')} className="pill-link">
    Security
  </button>
</div>
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Pricing</SectionLabel>
            <h2>Simple.</h2>
            <p className="section-copy">
              Start with structured tracking. Upgrade when you’re ready to plan decades ahead.
            </p>
          </Reveal>

          <Reveal className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free</div>
              <div className="price-value">£0</div>
              <p className="price-copy">Structured wealth tracking</p>

              <div className="price-list">
                <p>Net worth dashboard</p>
                <p>Snapshots + milestones</p>
                <p>Multi-currency accounts</p>
                <p>Daily FX checking</p>
                <p>Monthly what-if contribution modelling</p>
                <p>1-year projection</p>
                <p>Up to 3 accounts</p>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Create account'}
              </button>
            </div>

            <div className="price-card price-card-featured">
              <div className="price-toprow">
                <div className="price-tier feature">Pro</div>
                <div className="badge">Recommended</div>
              </div>

              <div className="price-row">
                <div className="price-value">£6</div>
                <div className="price-suffix">/month</div>
              </div>

              <p className="price-copy">or £60/year (2 months free) · Annual includes a 7-day trial</p>
              <p className="price-copy">For serious wealth planning — decades, not months.</p>

              <div className="price-list">
                <p>Unlimited accounts</p>
                <p>5–40 year projections</p>
                <p>Net-worth trajectory modelling</p>
                <p>Inflation-adjusted (real terms) view</p>
                <p>One-off deposit modelling</p>
                <p>Optimiser: required contribution to hit target</p>
                <p>Deeper insights</p>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Start free trial'}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container final-cta">
          <Reveal>
            <h2>Wealth isn’t built by accident.</h2>
            <p className="section-copy center narrow-center">
              It’s built with clarity, consistency and time. Paddock gives you a calmer way to see the
              numbers and keep moving.
            </p>

            <div className="hero-actions center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Create account'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => goTo('signin')}
                disabled={!!pending}
              >
                {pending === 'signin' ? 'Opening…' : 'Sign in'}
              </button>
            </div>

            <p className="hero-foot">Free to start • No credit card required</p>
          </Reveal>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-brand">
            Paddock<span>.</span>
          </div>

          <div className="footer-links">
  <button type="button" onClick={() => navigateTo('/guides/long-term-wealth-projection')}>
    Guides
  </button>
  <button type="button" onClick={() => navigateTo('/terms')}>
    Terms
  </button>
  <button type="button" onClick={() => navigateTo('/privacy')}>
    Privacy
  </button>
  <button type="button" onClick={() => navigateTo('/security')}>
    Security
  </button>
  <span>© 2026</span>
</div>
        </div>
      </footer>
    </div>
  )
}