import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './App.css'

import outlookShot from '/src/assets/landing/paddock-plan.png'
import insightsShot from '/src/assets/landing/paddock-decisions.png'
import outlookShotWebp from '/src/assets/landing/paddock-plan.webp'
import insightsShotWebp from '/src/assets/landing/paddock-decisions.webp'

import HeroSlideshow from './components/HeroSlideshow'

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
import Support from './pages/Support'
import BestNetWorthAppsUK from './pages/BestNetWorthAppsUK'
import ManualTracking from './pages/ManualTracking'
import MoneyHubAlternative from './pages/MoneyHubAlternative'
import PensionDrawdownCalculator from './tools/PensionDrawdownCalculator'
import FireNumberCalculator from './tools/FireNumberCalculator'
import IsaGrowthCalculator from './tools/IsaGrowthCalculator'
import NetWorthCalculator from './tools/NetWorthCalculator'
import RetirementBridgeCalculator from './tools/RetirementBridgeCalculator'
import ToolsHub from './pages/ToolsHub'
import ToolsDropdown from './components/ToolsDropdown'
import { PAGE_META } from './meta'
import { PUBLIC_ROUTES } from './seoRoutes'
import SiteFooter from './components/SiteFooter'
import AppStoreBadgeLink from './components/AppStoreBadgeLink'

const SIGNIN_URL = 'https://app.getpaddock.com/auth?mode=signin'
const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'
const ROUTE_BY_PATH = Object.fromEntries(PUBLIC_ROUTES.map((route) => [route.path, route.key]))

function getRoute() {
  const rawPath = (window.location.pathname || '/').toLowerCase()
  const path = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath

  return ROUTE_BY_PATH[path] || 'not_found'
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
        transform: 'translateY(8px)',
        transition:
          'opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

function NotFound({ navigateTo }) {
  return (
    <div className="landing-shell page-shell is-visible">
      <Helmet>
        <title>Page not found | Paddock</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <button type="button" onClick={() => navigateTo('/')} className="brand">
            Paddock<span>.</span>
          </button>
        </div>
      </header>
      <main className="container section">
        <div className="hero-kicker">404</div>
        <h1>Page not found</h1>
        <p className="section-copy">The page you requested does not exist.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigateTo('/')}>
          Go to homepage
        </button>
      </main>
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
  const [toolsMobileOpen, setToolsMobileOpen] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)

  const goTo = (kind) => {
    if (pending) return
    setPending(kind)

    const url = kind === 'signup' ? SIGNUP_URL : SIGNIN_URL

    window.setTimeout(() => {
      window.location.href = url
    }, 180)
  }

  const navigateTo = (path) => {
    if (path === window.location.pathname) {
      setMenuOpen(false)
      return
    }
  
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
    const doNav = () => {
      window.history.pushState({}, '', path)
      setRoute(getRoute())
      setMenuOpen(false)
      window.scrollTo(0, 0)
    }
  
    if (reduceMotion) {
      doNav()
      return
    }

    setPageVisible(false)

    window.setTimeout(() => {
      doNav()

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPageVisible(true))
      })
    }, 180)
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
    const onPop = () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
      if (reduceMotion) {
        setRoute(getRoute())
        window.scrollTo(0, 0)
        return
      }
  
      setPageVisible(false)
  
      window.setTimeout(() => {
        setRoute(getRoute())
        window.scrollTo(0, 0)
  
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPageVisible(true))
        })
      }, 120)
    }
  
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
  if (route === 'support') return <Support navigateTo={navigateTo} />
  if (route === 'net_worth_tracker') return <NetWorthTracker navigateTo={navigateTo} />
  if (route === 'track_isas_pensions_savings') return <TrackISAsPensionsSavings navigateTo={navigateTo} />
  if (route === 'spreadsheet_alternative') return <SpreadsheetAlternative navigateTo={navigateTo} />
  if (route === 'how_to_track_net_worth') return <HowToTrackNetWorth navigateTo={navigateTo} />
  if (route === 'founder_manual_tracking') return <ManualTracking navigateTo={navigateTo} goTo={goTo} />
  if (route === 'moneyhub_alternative') return <MoneyHubAlternative navigateTo={navigateTo} goTo={goTo} />
  if (route === 'best_net_worth_apps_uk') return <BestNetWorthAppsUK navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_pension_drawdown') return <PensionDrawdownCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_retirement_bridge') return <RetirementBridgeCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_fire_number') return <FireNumberCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_isa_growth') return <IsaGrowthCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_net_worth') return <NetWorthCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_hub') return <ToolsHub navigateTo={navigateTo} goTo={goTo} />
  if (route === 'not_found') return <NotFound navigateTo={navigateTo} />

  return (
    <div className={`landing-shell page-shell ${pageVisible ? 'is-visible' : 'is-hidden'}`}>
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
            <ToolsDropdown navigateTo={navigateTo} />

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

            {/* Tools accordion */}
            <div className="mobile-tools-wrap">
              <button
                type="button"
                className="mobile-tools-trigger"
                onClick={() => setToolsMobileOpen((v) => !v)}
                aria-expanded={toolsMobileOpen}
              >
                <span>Tools</span>
                <svg
                  className={`tools-chevron${toolsMobileOpen ? ' is-open' : ''}`}
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>
              {toolsMobileOpen && (
                <div className="mobile-tools-items">
                  <a
                    href="/tools/pension-drawdown-calculator"
                    className="mobile-tools-item"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault()
                        navigateTo('/tools/pension-drawdown-calculator')
                        setMenuOpen(false)
                        setToolsMobileOpen(false)
                      }
                    }}
                  >
                    Pension drawdown calculator
                  </a>
                  <a
                    href="/tools/retirement-bridge-calculator"
                    className="mobile-tools-item"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault()
                        navigateTo('/tools/retirement-bridge-calculator')
                        setMenuOpen(false)
                        setToolsMobileOpen(false)
                      }
                    }}
                  >
                    Retirement bridge calculator
                  </a>
                  <a
                    href="/tools/fire-number-calculator"
                    className="mobile-tools-item"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault()
                        navigateTo('/tools/fire-number-calculator')
                        setMenuOpen(false)
                        setToolsMobileOpen(false)
                      }
                    }}
                  >
                    FIRE number calculator
                  </a>
                  <a
                    href="/tools/isa-growth-calculator"
                    className="mobile-tools-item"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault()
                        navigateTo('/tools/isa-growth-calculator')
                        setMenuOpen(false)
                        setToolsMobileOpen(false)
                      }
                    }}
                  >
                    ISA growth calculator
                  </a>
                  <a
                    href="/tools/net-worth-calculator"
                    className="mobile-tools-item"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault()
                        navigateTo('/tools/net-worth-calculator')
                        setMenuOpen(false)
                        setToolsMobileOpen(false)
                      }
                    }}
                  >
                    Net worth calculator
                  </a>
                  <a
                    href="/tools"
                    className="mobile-tools-item"
                    onClick={(e) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                        e.preventDefault()
                        navigateTo('/tools')
                        setMenuOpen(false)
                        setToolsMobileOpen(false)
                      }
                    }}
                  >
                    View all tools
                  </a>
                </div>
              )}
            </div>

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
          <div className="hero-kicker">Private wealth planning</div>

<h1>
  Your wealth.
  <br />
  Planned.
</h1>

<p className="hero-sub">
Track ISAs, pensions, savings, property and multi-currency accounts in one private dashboard — with long-term projections, decision support, and no bank linking.
</p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Start planning — it’s free'}
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

            <AppStoreBadgeLink className="app-store-badge-hero" />

            <p className="hero-foot">Free to start • No credit card required • Setup takes under 2 minutes</p>

            <div className="hero-tags">
  <span>ISA deadline awareness</span>
  <span>Mortgage trade-off modelling</span>
  <span>Long-term projections</span>
  <span>No bank linking</span>
  <span>Private by design</span>
</div>
          </div>
        </div>
      </section>

      <HeroSlideshow goTo={goTo} />


      <section className="section-border">
  <div className="container section">
    <Reveal>
      <SectionLabel>Use Paddock for</SectionLabel>
      <h2>Built for real wealth planning.</h2>
      <p className="section-copy">
        Paddock helps you track net worth clearly, bring UK wealth accounts into one place, replace fragile spreadsheets, and make better long-term decisions.
      </p>

      <div className="use-links-grid">
        <a
          href="/net-worth-tracker"
          className="use-link-item"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/net-worth-tracker')
            }
          }}
        >
          <h3>Net worth tracking</h3>
          <div className="line" />
          <p>See assets and liabilities together in one calm dashboard.</p>
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
          <p>Bring core UK wealth accounts into one clear long-term view.</p>
        </a>

        <a
          href="/spreadsheet-alternative-net-worth-tracking"
          className="use-link-item"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/spreadsheet-alternative-net-worth-tracking')
            }
          }}
        >
          <h3>Replace spreadsheets</h3>
          <div className="line" />
          <p>Move from fragile tabs and formulas to a cleaner structured workflow.</p>
        </a>

        <a
          href="/how-to-track-your-net-worth"
          className="use-link-item"
          onClick={(e) => {
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
              e.preventDefault()
              navigateTo('/how-to-track-your-net-worth')
            }
          }}
        >
          <h3>How to track your net worth</h3>
          <div className="line" />
          <p>Learn what to include, how often to update, and what matters most.</p>
        </a>
      </div>
    </Reveal>
  </div>
</section>

      <section id="product" className="container section">
        <Reveal>
        <SectionLabel>Why Paddock</SectionLabel>
<h2>From balances to decisions.</h2>
<p className="section-copy">
  Paddock is a manual-entry, privacy-first net worth tracker built for people who want more than balance checking — with clear projections, UK wealth context, and better next-step decisions.
</p>

          <div className="split-columns">
          <div>
  <h3>One plan, always visible.</h3>
  <div className="line" />
  <p>
    A named long-term goal anchors the model, so progress is measured against something real — not just a changing balance.
  </p>
</div>

<div>
  <h3>UK wealth context built in.</h3>
  <div className="line" />
  <p>
    ISAs, pensions, property and wrapper-aware decisions are part of the experience — not bolted on later.
  </p>
</div>

<div>
  <h3>See the impact before you move.</h3>
  <div className="line" />
  <p>
    Model contribution changes, compare paths, and understand trade-offs before you commit new money.
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
        <div className="container section two-col">
          <Reveal>
          <SectionLabel>Decisions</SectionLabel>
<h2>Know what the next pounds should do.</h2>
<p className="section-copy narrow">
  Use Paddock to model ISA timing, contribution changes, and long-term trade-offs before you make the next move.
</p>

            <div className="pill-links">
              <a
                href="/guides/long-term-wealth-projection"
                className="pill-link"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/long-term-wealth-projection') } }}
              >
                Long-term projections
              </a>
              <a
                href="/guides/multi-currency-net-worth-tracker"
                className="pill-link"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/multi-currency-net-worth-tracker') } }}
              >
                Multi-currency tracking
              </a>
              <a
                href="/guides/inflation-adjusted-net-worth"
                className="pill-link"
                onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides/inflation-adjusted-net-worth') } }}
              >
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
            <SectionLabel>Free tools</SectionLabel>
            <h2>Start planning before you sign up.</h2>
            <p className="section-copy">
              Free calculators for UK pension planning and financial independence. No account
              required. Your numbers stay in your browser.
            </p>
            <div className="tools-feature-cards">
              <a
                href="/tools/pension-drawdown-calculator"
                className="tools-feature-card"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault()
                    navigateTo('/tools/pension-drawdown-calculator')
                  }
                }}
              >
                <div className="tools-feature-card-body">
                  <h3 className="tools-feature-card-title">Pension drawdown calculator UK</h3>
                  <div className="line" />
                  <p className="tools-feature-card-desc">
                    Estimate retirement income and how long your pension may last under different
                    drawdown scenarios. Includes a 3% / 4% / 5% withdrawal comparison.
                  </p>
                  <span className="tools-feature-card-link">Try the calculator →</span>
                </div>
              </a>
              <a
                href="/tools/fire-number-calculator"
                className="tools-feature-card"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault()
                    navigateTo('/tools/fire-number-calculator')
                  }
                }}
              >
                <div className="tools-feature-card-body">
                  <h3 className="tools-feature-card-title">FIRE number calculator UK</h3>
                  <div className="line" />
                  <p className="tools-feature-card-desc">
                    Calculate your financial independence target based on annual spending and
                    withdrawal rate. Includes a 3.5% / 4% / 4.5% withdrawal comparison.
                  </p>
                  <span className="tools-feature-card-link">Try the calculator →</span>
                </div>
              </a>
            </div>
            <a
              href="/tools"
              className="tools-feature-all"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/tools') } }}
            >
              View all free tools
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <Reveal>
          <SectionLabel>Projection</SectionLabel>
<h2>See the path, not just the total.</h2>
<p className="section-copy">
  Project your current path, compare it to the pace required, and understand the gap long before it becomes a surprise.
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
        <div className="container section">
          <Reveal>
            <SectionLabel>Trust</SectionLabel>
            <h2>Private by design.</h2>
            <p className="section-copy">
  No ads. No trackers. No bank linking. Paddock is intentionally manual, so your data stays private and your numbers stay deliberate.
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
  <a href="/terms" className="pill-link">
    Terms
  </a>
  <a href="/privacy" className="pill-link">
    Privacy
  </a>
  <a href="/security" className="pill-link">
    Security
  </a>
</div>
            <p className="hero-foot">
              <a
                href="/why-i-track-wealth-manually-instead-of-using-open-banking-apps"
                className="guide-inline-link"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault()
                    navigateTo('/why-i-track-wealth-manually-instead-of-using-open-banking-apps')
                  }
                }}
              >
                Founder note: why we built Paddock this way →
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section id="pricing" className="section-border">
        <div className="container section">
          <Reveal>
          <SectionLabel>Pricing</SectionLabel>
<h2>Simple.</h2>
<p className="section-copy">
  Start free to track your wealth clearly. Upgrade when you want to plan years ahead and model what to do next.
</p>
          </Reveal>

          <Reveal className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free</div>
              <div className="price-value">£0</div>
              <p className="price-copy price-copy-strong">See your wealth clearly.</p>
<p className="price-copy price-copy-meta">Private by design. Most people update once after payday.</p>

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

              <p className="price-copy price-copy-meta">£60/year (2 months free) · Includes a 7-day trial</p>
              <p className="price-copy price-copy-strong">See the path, the gap, and what to do next.</p>
<p className="price-copy">
  Plan 5–40 years ahead, compare scenarios, and make clearer ISA, mortgage, and contribution decisions.
</p>

<div className="price-list">
  <p>Unlimited accounts</p>
  <p>5–40 year projections</p>
  <p>Full trajectory chart: projected vs required path</p>
  <p>Inflation-adjusted (real terms) view</p>
  <p>Scenario comparisons</p>
  <p>ISA strategy support</p>
  <p>Mortgage overpayment and next-pounds decision support</p>
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

            <AppStoreBadgeLink className="app-store-badge-final" />

            <p className="hero-foot">Free to start • No credit card required</p>
          </Reveal>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
