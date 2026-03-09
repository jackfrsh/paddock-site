import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import homeShot from '/src/assets/landing/paddock-home.png'
import outlookShot from '/src/assets/landing/paddock-outlook.png'
import insightsShot from '/src/assets/landing/paddock-insights.png'
import homeShotWebp from '/src/assets/landing/paddock-home.webp'
import outlookShotWebp from '/src/assets/landing/paddock-outlook.webp'
import insightsShotWebp from '/src/assets/landing/paddock-insights.webp'

import GuideIndex from './guides/GuideIndex'
import MultiCurrency from './guides/MultiCurrency'
import LongTermProjection from './guides/LongTermProjection'
import InflationAdjusted from './guides/InflationAdjusted'
import Privacy from './pages/Privacy'
import Security from './pages/Security'
import Terms from './pages/Terms'
import NetWorthTracker from './pages/NetWorthTracker'
import TrackISAsPensionsSavings from './pages/TrackISAsPensionsSavings'
import SpreadsheetAlternative from './pages/SpreadsheetAlternative'
import HowToTrackNetWorth from './pages/HowToTrackNetWorth'
import { PAGE_META } from './meta'
import SiteFooter from './components/SiteFooter'

const SIGNIN_URL = 'https://app.getpaddock.com/auth?mode=signin'
const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'

function getRoute() {
  const path = (window.location.pathname || '/').toLowerCase()

  if (path.startsWith('/guides/multi-currency-net-worth-tracker')) return 'guide_multi_currency'
  if (path.startsWith('/guides/long-term-wealth-projection')) return 'guide_long_term_projection'
  if (path.startsWith('/guides/inflation-adjusted-net-worth')) return 'guide_inflation_adjusted'
  if (path === '/guides' || path === '/guides/') return 'guides_index'

  if (path.startsWith('/privacy')) return 'privacy'
  if (path.startsWith('/security')) return 'security'
  if (path.startsWith('/terms')) return 'terms'

  if (path.startsWith('/net-worth-tracker')) return 'net_worth_tracker'
  if (path.startsWith('/track-isas-pensions-savings')) return 'track_isas_pensions_savings'
  if (path.startsWith('/spreadsheet-alternative-net-worth-tracking')) return 'spreadsheet_alternative'
  if (path.startsWith('/how-to-track-your-net-worth')) return 'how_to_track_net_worth'

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      el.style.opacity = '1'
      el.style.transform = 'none'
      return
    }

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

function Screenshot({ src, webp, alt, caption, loading = 'lazy' }) {
  return (
    <div className="shot-wrap">
      <div className="shot-frame">
        <picture>
          {webp ? <source srcSet={webp} type="image/webp" /> : null}
          <img src={src} alt={alt} className="shot-image" loading={loading} />
        </picture>
      </div>
      {caption ? <p className="shot-caption">{caption}</p> : null}
    </div>
  )
}

export default function App() {
  const [pending, setPending] = useState(null)
  const [route, setRoute] = useState(getRoute)
  const [menuOpen, setMenuOpen] = useState(false)

  const goTo = (kind) => {
    if (pending) return
    setPending(kind)

    const url = kind === 'signup' ? SIGNUP_URL : SIGNIN_URL

    window.setTimeout(() => {
      window.location.href = url
    }, 180)
  }

  const navigateTo = (path) => {
    window.history.pushState({}, '', path)
    setRoute(getRoute())
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  // Per-route metadata: title, description, canonical, OG, Twitter, JSON-LD
  useEffect(() => {
    const meta = PAGE_META[route] || PAGE_META.landing
    document.title = meta.title

    const setMeta = (selector, attr, value) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute(attr, value)
    }

    setMeta('meta[name="description"]', 'content', meta.description)
    setMeta('link[rel="canonical"]', 'href', meta.canonical)
    setMeta('meta[property="og:title"]', 'content', meta.title)
    setMeta('meta[property="og:description"]', 'content', meta.description)
    setMeta('meta[property="og:url"]', 'content', meta.canonical)
    setMeta('meta[property="og:type"]', 'content', meta.ogType || 'website')
    setMeta('meta[name="twitter:title"]', 'content', meta.title)
    setMeta('meta[name="twitter:description"]', 'content', meta.description)

    const existingLd = document.getElementById('paddock-jsonld')
    if (existingLd) existingLd.remove()

    if (meta.jsonLd) {
      const script = document.createElement('script')
      script.id = 'paddock-jsonld'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(meta.jsonLd)
      document.head.appendChild(script)
    }

    return () => {
      const ld = document.getElementById('paddock-jsonld')
      if (ld) ld.remove()
    }
  }, [route])

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

  if (route === 'guides_index') return <GuideIndex navigateTo={navigateTo} />
  if (route === 'guide_multi_currency') return <MultiCurrency navigateTo={navigateTo} goTo={goTo} />
  if (route === 'guide_long_term_projection') return <LongTermProjection navigateTo={navigateTo} goTo={goTo} />
  if (route === 'guide_inflation_adjusted') return <InflationAdjusted navigateTo={navigateTo} goTo={goTo} />
  if (route === 'privacy') return <Privacy navigateTo={navigateTo} />
  if (route === 'security') return <Security navigateTo={navigateTo} />
  if (route === 'terms') return <Terms navigateTo={navigateTo} />
  if (route === 'net_worth_tracker') return <NetWorthTracker navigateTo={navigateTo} />
  if (route === 'track_isas_pensions_savings') return <TrackISAsPensionsSavings navigateTo={navigateTo} />
  if (route === 'spreadsheet_alternative') return <SpreadsheetAlternative navigateTo={navigateTo} />
  if (route === 'how_to_track_net_worth') return <HowToTrackNetWorth navigateTo={navigateTo} />

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="landing-nav-inner">
        <button
  type="button"
  onClick={() => navigateTo('/')}
  className="brand"
>
  Paddock<span>.</span>
</button>

          <nav className="nav-actions nav-desktop">
            <button type="button" onClick={() => scrollToId('product')} className="nav-link subtle">
              Product
            </button>
            <button type="button" onClick={() => scrollToId('pricing')} className="nav-link subtle">
              Pricing
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/guides')}
              className="nav-link subtle"
            >
              Guides
            </button>

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

          <div className="nav-mobile">
            <button
              type="button"
              onClick={() => goTo('signup')}
              className="btn btn-primary nav-cta"
              disabled={!!pending}
            >
              {pending === 'signup' ? 'Opening…' : 'Create account'}
            </button>

            <button
              type="button"
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 2l14 14M16 2L2 16" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 4h14M2 9h14M2 14h14" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-menu">
            <button type="button" onClick={() => { scrollToId('product'); setMenuOpen(false) }}>
              Product
            </button>
            <button type="button" onClick={() => { scrollToId('pricing'); setMenuOpen(false) }}>
              Pricing
            </button>
            <button type="button" onClick={() => { navigateTo('/guides'); setMenuOpen(false) }}>
              Guides
            </button>
            <button
              type="button"
              onClick={() => { goTo('signin'); setMenuOpen(false) }}
              disabled={!!pending}
            >
              {pending === 'signin' ? 'Opening…' : 'Sign in'}
            </button>
          </nav>
        )}
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-copy">
            <div className="hero-kicker">Personal wealth dashboard</div>

            <h1>
              A net worth tracker.
              <br />
              For long-term wealth.
            </h1>

            <p className="hero-sub">
              Track cash, investments, pensions and property in one calm dashboard — with multi-currency support, long-term projections, and privacy-first manual tracking.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Get started — it’s free'}
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
              <button
                type="button"
                className="hero-tag-link"
                onClick={() => navigateTo('/net-worth-tracker')}
              >
                Net worth tracking
              </button>

              <button
                type="button"
                className="hero-tag-link"
                onClick={() => navigateTo('/guides/multi-currency-net-worth-tracker')}
              >
                Multi-currency support
              </button>

              <button
                type="button"
                className="hero-tag-link"
                onClick={() => navigateTo('/track-isas-pensions-savings')}
              >
                Track ISAs and pensions
              </button>

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
            loading="eager"
          />
        </Reveal>
      </section>

      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Use Paddock for</SectionLabel>
            <h2>Built for real wealth tracking.</h2>
            <p className="section-copy">
              Explore the core ways people use Paddock to track wealth more clearly and stay focused
              on long-term progress.
            </p>

            <div className="use-links-grid">
              <button
                type="button"
                className="use-link-item"
                onClick={() => navigateTo('/net-worth-tracker')}
              >
                <h3>Net worth tracking</h3>
                <div className="line" />
                <p>See assets and liabilities together in one calm dashboard.</p>
              </button>

              <button
                type="button"
                className="use-link-item"
                onClick={() => navigateTo('/track-isas-pensions-savings')}
              >
                <h3>Track ISAs and pensions</h3>
                <div className="line" />
                <p>Bring core UK wealth accounts into one clear long-term view.</p>
              </button>

              <button
                type="button"
                className="use-link-item"
                onClick={() => navigateTo('/spreadsheet-alternative-net-worth-tracking')}
              >
                <h3>Replace spreadsheets</h3>
                <div className="line" />
                <p>Move from fragile tabs and formulas to a cleaner structured workflow.</p>
              </button>

              <button
                type="button"
                className="use-link-item"
                onClick={() => navigateTo('/how-to-track-your-net-worth')}
              >
                <h3>How to track your net worth</h3>
                <div className="line" />
                <p>Learn what to include, how often to update, and what matters most.</p>
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="product" className="container section">
        <Reveal>
          <SectionLabel>Product</SectionLabel>
          <h2>Everything that matters, in one place.</h2>
          <p className="section-copy">
            Built for clarity: one long-term goal, visible assumptions, and a dashboard you'll actually check.
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
              <button
                type="button"
                onClick={() => navigateTo('/guides/long-term-wealth-projection')}
                className="pill-link"
              >
                Long-term projections
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/guides/multi-currency-net-worth-tracker')}
                className="pill-link"
              >
                Multi-currency tracking
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/guides/inflation-adjusted-net-worth')}
                className="pill-link"
              >
                Inflation-adjusted views
              </button>
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
            <h2>Private by design.</h2>
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
                <h3>Secure authentication.</h3>
                <p>Industry-standard sign-in with protected sessions and secure password management.</p>
              </div>
              <div>
                <h3>Payments by Stripe.</h3>
                <p>Card details are handled entirely by Stripe — they never touch our servers.</p>
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
              Start with structured tracking. Upgrade when you're ready to plan decades ahead.
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
                <p>Full trajectory chart: projected vs required path</p>
                <p>Inflation-adjusted (real terms) view</p>
                <p>One-off deposit modelling</p>
                <p>Optimiser: calculates required monthly contribution</p>
                <p>What-if scenario comparisons</p>
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
            <h2>Wealth isn't built by accident.</h2>
            <p className="section-copy center narrow-center">
              It's built with clarity, consistency and time. Paddock gives you a calmer way to see the
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

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}