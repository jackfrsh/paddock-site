import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import './App.css'

import homeShot from '/src/assets/landing/paddock-home.png'
import homeShotWebp from '/src/assets/landing/paddock-home.webp'
import accountsShot from '/src/assets/landing/paddock-accounts.png'
import accountsShotWebp from '/src/assets/landing/paddock-accounts.webp'
import outlookShot from '/src/assets/landing/paddock-plan.png'
import outlookShotWebp from '/src/assets/landing/paddock-plan.webp'
import appStoreQr from './assets/appstore-qr.svg'

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
import PhasedDrawdownCalculator from './tools/PhasedDrawdownCalculator'
import FireNumberCalculator from './tools/FireNumberCalculator'
import IsaGrowthCalculator from './tools/IsaGrowthCalculator'
import NetWorthCalculator from './tools/NetWorthCalculator'
import RetirementBridgeCalculator from './tools/RetirementBridgeCalculator'
import ToolsHub from './pages/ToolsHub'
import ToolsDropdown from './components/ToolsDropdown'
import { PAGE_META } from './meta'
import { PUBLIC_ROUTES } from './seoRoutes'
import { HOME_FAQS } from './homeFaqs'
import SiteFooter from './components/SiteFooter'
import AppStoreBadgeLink from './components/AppStoreBadgeLink'
import SkipLink from './components/SkipLink'

const SIGNIN_URL = 'https://app.getpaddock.com/auth?mode=signin'
const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'
const APP_STORE_URL = 'https://apps.apple.com/gb/app/paddock-wealth/id6761938898'
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
          <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }} className="brand">
            Paddock<span>.</span>
          </a>
        </div>
      </header>
      <main className="container section">
        <div className="hero-kicker">404</div>
        <h1>Page not found</h1>
        <p className="section-copy">The page you requested does not exist.</p>
        <a href="/" className="btn btn-primary" onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}>
          Go to homepage
        </a>
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

/* Internal link that uses client-side navigation for plain left clicks. */
function InternalLink({ to, navigateTo, className, children }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
          e.preventDefault()
          navigateTo(to)
        }
      }}
    >
      {children}
    </a>
  )
}

/* Product-led hero visual: a realistic UK wealth dashboard, rendered in
   HTML/CSS so the hero LCP stays text-fast and the mockup scales cleanly. */
const MOCK_ACCOUNTS = [
  { name: 'Stocks & Shares ISA', tag: 'ISA', value: '£84,300' },
  { name: 'SIPP', tag: 'Pension', value: '£112,650' },
  { name: 'Workplace pension', tag: 'Pension', value: '£38,900' },
  { name: 'Premium Bonds', tag: 'NS&I', value: '£21,550' },
  { name: 'Home', tag: 'Property', value: '£342,000' },
  { name: 'Mortgage', tag: 'Liability', value: '−£287,000', negative: true },
]

function HeroMockup() {
  return (
    <div
      className="hero-mock"
      role="img"
      aria-label="Illustrative Paddock dashboard showing a net worth of £312,400 across a Stocks and Shares ISA, SIPP, workplace pension, Premium Bonds, property and a mortgage"
    >
      <div className="hero-mock-top">
        <span className="hero-mock-brand">Paddock<span>.</span></span>
        <span className="hero-mock-status">
          <span className="hero-mock-status-dot" />
          On track
        </span>
      </div>

      <div className="hero-mock-label">Net worth</div>
      <div className="hero-mock-value">£312,400</div>
      <div className="hero-mock-delta">▲ £4,120 this month</div>

      <svg className="hero-mock-spark" viewBox="0 0 320 60" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 52 C 42 49, 74 44, 106 39 S 168 28, 208 22 S 284 10, 320 6 L 320 60 L 0 60 Z"
          fill="url(#heroSparkFill)"
          stroke="none"
        />
        <path
          d="M0 52 C 42 49, 74 44, 106 39 S 168 28, 208 22 S 284 10, 320 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <ul className="hero-mock-rows">
        {MOCK_ACCOUNTS.map((row) => (
          <li key={row.name} className="hero-mock-row">
            <span className="hero-mock-row-name">
              {row.name}
              <span className="hero-mock-row-tag">{row.tag}</span>
            </span>
            <span className={`hero-mock-row-value${row.negative ? ' is-negative' : ''}`}>
              {row.value}
            </span>
          </li>
        ))}
      </ul>

      <div className="hero-mock-foot">Illustrative figures · Updated by you, monthly</div>
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
  if (route === 'tools_phased_drawdown') return <PhasedDrawdownCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_retirement_bridge') return <RetirementBridgeCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_fire_number') return <FireNumberCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_isa_growth') return <IsaGrowthCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_net_worth') return <NetWorthCalculator navigateTo={navigateTo} goTo={goTo} />
  if (route === 'tools_hub') return <ToolsHub navigateTo={navigateTo} goTo={goTo} />
  if (route === 'not_found') return <NotFound navigateTo={navigateTo} />

  return (
    <div className={`landing-shell page-shell ${pageVisible ? 'is-visible' : 'is-hidden'}`}>
      <header className="landing-nav">
        <SkipLink />
        <div className="landing-nav-inner">
        <a
  href="/"
  onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/') } }}
  className="brand"
>
  Paddock<span>.</span>
</a>

          <nav className="nav-actions nav-desktop">
            <button type="button" onClick={() => scrollToId('product')} className="nav-link subtle">
              Product
            </button>
            <button type="button" onClick={() => scrollToId('pricing')} className="nav-link subtle">
              Pricing
            </button>
            <a
              href="/guides"
              className="nav-link subtle"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides') } }}
            >
              Guides
            </a>
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
            <a
              href="/guides"
              onClick={(e) => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) { e.preventDefault(); navigateTo('/guides'); setMenuOpen(false) } }}
            >
              Guides
            </a>

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

      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">Private UK wealth tracker</div>

            <h1>
              Know where you stand.
              <br />
              See where you&apos;re going.
            </h1>

            <p className="hero-sub">
              Paddock brings your ISAs, SIPPs, pensions, savings, property and investments into
              one calm, private dashboard. You update it. You own it. We never ask for your bank
              login — and we never sell your data.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Start free on the web'}
              </button>

              <a className="btn btn-secondary" href={APP_STORE_URL} target="_blank" rel="noreferrer">
                Download on the App Store
              </a>
            </div>

            <ul className="hero-trust-strip" aria-label="Paddock trust points">
              <li>No bank linking</li>
              <li>Built for UK wrappers</li>
              <li>No data selling</li>
              <li>Web + iOS</li>
            </ul>
          </div>

          <div className="hero-visual">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ── 2. Trust ────────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Trust</SectionLabel>
            <h2>Why Paddock never asks for your bank login</h2>
            <p className="section-copy">
              Most finance apps need your bank credentials to exist. Paddock doesn&apos;t. You
              enter your balances, we do the maths, and your bank details never leave your bank.
              It takes a few minutes a month — and it means there is nothing to leak, nothing to
              sell, and nothing to reconnect.
            </p>

            <div className="trust-grid">
              <div>
                <h3>Nothing to breach</h3>
                <div className="line" />
                <p>
                  We never hold your bank credentials. Paddock is designed so your bank logins
                  never enter the product.
                </p>
              </div>
              <div>
                <h3>Nothing to sell</h3>
                <div className="line" />
                <p>
                  Paddock is a paid product, not an ads or data business. You are the customer,
                  not the inventory.
                </p>
              </div>
              <div>
                <h3>Nothing to break</h3>
                <div className="line" />
                <p>
                  No flaky connections. No re-authenticating every 90 days. No accounts silently
                  dropping off. Manual entry keeps the picture controlled and reliable.
                </p>
              </div>
            </div>

            <p className="trust-honest">
              Yes, you update balances yourself. Most users can do it once a month in under five
              minutes. That&apos;s the trade: a few minutes for total privacy and control.
            </p>

            <div className="pill-links section-top-gap-sm">
              <InternalLink to="/security" navigateTo={navigateTo} className="pill-link">
                Security
              </InternalLink>
              <InternalLink to="/privacy" navigateTo={navigateTo} className="pill-link">
                Privacy
              </InternalLink>
              <InternalLink
                to="/why-i-track-wealth-manually-instead-of-using-open-banking-apps"
                navigateTo={navigateTo}
                className="pill-link"
              >
                Why manual entry? →
              </InternalLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3. Product tour ─────────────────────────────────────────────── */}
      <section id="product" className="section-border">
        <div className="container section two-col">
          <Reveal>
            <SectionLabel>The full picture</SectionLabel>
            <h2>Your full net worth, finally in one place.</h2>
            <p className="section-copy narrow">
              The ISA in one app, the pension in another, the mortgage in a letter somewhere.
              Paddock puts everything you own and everything you owe on one calm screen — wrappers,
              pensions, property and liabilities — with one number at the top: where you stand.
            </p>
            <div className="pill-links section-top-gap-sm">
              <span className="pill-link pill-link-static">Total wealth</span>
              <span className="pill-link pill-link-static">Assets and liabilities</span>
              <span className="pill-link pill-link-static">Multi-currency</span>
              <InternalLink to="/net-worth-tracker" navigateTo={navigateTo} className="pill-link">
                More on net worth tracking →
              </InternalLink>
            </div>
          </Reveal>

          <Reveal>
            <Screenshot
              src={homeShot}
              webp={homeShotWebp}
              alt="Paddock dashboard showing total net worth, milestones and account mix"
              caption="One calm dashboard: total wealth, milestones and progress."
              loading="eager"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col two-col-flip">
          <Reveal>
            <SectionLabel>Always current</SectionLabel>
            <h2>Keep every account fresh.</h2>
            <p className="section-copy narrow">
              The old workplace pension. The savings account you opened for the rate. The ISA you
              stopped checking. Paddock shows you which balances are going stale and makes each
              update a ten-second job — so the picture stays true without a spreadsheet to
              maintain.
            </p>
            <div className="pill-links section-top-gap-sm">
              <span className="pill-link pill-link-static">Stale account review</span>
              <span className="pill-link pill-link-static">Quick balance updates</span>
              <InternalLink to="/how-to-track-your-net-worth" navigateTo={navigateTo} className="pill-link">
                How to track your net worth →
              </InternalLink>
            </div>
          </Reveal>

          <Reveal>
            <Screenshot
              src={accountsShot}
              webp={accountsShotWebp}
              alt="Paddock accounts view showing ISAs, pensions, property and liabilities kept up to date"
              caption="Every account in one structured view, updated on your terms."
            />
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section two-col">
          <Reveal>
            <SectionLabel>Trajectory</SectionLabel>
            <h2>See where you&apos;re heading.</h2>
            <p className="section-copy narrow">
              Project your current path 5–40 years ahead and compare it with the pace your goal
              requires. Projections are illustrative and based on assumptions you control — no
              black box, no advice, just your numbers carried forward so you can see the gap
              before it becomes a surprise.
            </p>
            <div className="pill-links section-top-gap-sm">
              <span className="pill-link pill-link-static">Freedom trajectory</span>
              <span className="pill-link pill-link-static">Scenario comparisons</span>
              <InternalLink
                to="/guides/long-term-wealth-projection"
                navigateTo={navigateTo}
                className="pill-link"
              >
                How projections work →
              </InternalLink>
            </div>
          </Reveal>

          <Reveal>
            <Screenshot
              src={outlookShot}
              webp={outlookShotWebp}
              alt="Paddock projection view showing long-term wealth trajectory against a target path"
              caption="Illustrative projections with visible assumptions — projected path vs required path."
            />
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <Reveal>
            <div className="carry-banner">
              <div>
                <SectionLabel>Web + iOS</SectionLabel>
                <h2>Carry the number with you.</h2>
                <p className="section-copy">
                  Paddock lives on the web and on your iPhone. Check your position from your
                  pocket, update a balance the moment a statement arrives, and keep your progress
                  in view wherever the month takes you.
                </p>
              </div>
              <div className="carry-banner-actions">
                <AppStoreBadgeLink className="app-store-badge-carry" />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => goTo('signup')}
                  disabled={!!pending}
                >
                  {pending === 'signup' ? 'Opening…' : 'Start free on the web'}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4. Comparison ───────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Compare</SectionLabel>
            <h2>Spreadsheet, open-banking app, or Paddock?</h2>
            <p className="section-copy">
              Three honest ways to track your wealth — and what each one really costs you.
            </p>

            <div className="cmp-table-wrap">
              <table className="cmp-table">
                <thead>
                  <tr>
                    <th scope="col"><span className="sr-only">Feature</span></th>
                    <th scope="col">Spreadsheet</th>
                    <th scope="col">Open-banking apps</th>
                    <th scope="col" className="cmp-col-paddock">Paddock</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bank credentials needed</td>
                    <td>Never</td>
                    <td>Required</td>
                    <td className="cmp-col-paddock">Never</td>
                  </tr>
                  <tr>
                    <td>UK wrappers supported</td>
                    <td>DIY labels and formulas</td>
                    <td>Often weak on ISA / SIPP / LISA</td>
                    <td className="cmp-col-paddock">Native — ISA, SIPP, LISA, GIA</td>
                  </tr>
                  <tr>
                    <td>Pensions and property</td>
                    <td>Manual handling</td>
                    <td>Patchy or missing</td>
                    <td className="cmp-col-paddock">Built in, with liabilities</td>
                  </tr>
                  <tr>
                    <td>FI projection / trajectory</td>
                    <td>Build it yourself</td>
                    <td>Rare — built for transactions</td>
                    <td className="cmp-col-paddock">Built in, 5–40 years</td>
                  </tr>
                  <tr>
                    <td>Works well on phone</td>
                    <td>Poor</td>
                    <td>Yes</td>
                    <td className="cmp-col-paddock">Yes — web + iOS</td>
                  </tr>
                  <tr>
                    <td>Spending nags</td>
                    <td>None</td>
                    <td>Often — budgeting noise</td>
                    <td className="cmp-col-paddock">None</td>
                  </tr>
                  <tr>
                    <td>Business model</td>
                    <td>Free, high maintenance</td>
                    <td>Data, ads or referrals</td>
                    <td className="cmp-col-paddock">Paid, privacy-first</td>
                  </tr>
                  <tr>
                    <td>Monthly update ritual</td>
                    <td>Yours to maintain</td>
                    <td>Automatic, until it breaks</td>
                    <td className="cmp-col-paddock">A few minutes, guided</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cmp-tradeoff section-top-gap-sm">
              <p>
                If you already track your wealth in a spreadsheet, Paddock is built for you. Keep
                the monthly ritual, lose the maintenance: no broken formulas, no charts to
                rebuild, and no bank logins to hand over.
              </p>
            </div>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Replace your spreadsheet'}
              </button>
            </div>

            <div className="pill-links section-top-gap-sm">
              <InternalLink
                to="/spreadsheet-alternative-net-worth-tracking"
                navigateTo={navigateTo}
                className="pill-link"
              >
                The spreadsheet alternative →
              </InternalLink>
              <InternalLink to="/moneyhub-alternative" navigateTo={navigateTo} className="pill-link">
                Coming from Moneyhub?
              </InternalLink>
              <InternalLink
                to="/best-net-worth-tracking-apps-uk"
                navigateTo={navigateTo}
                className="pill-link"
              >
                Compare UK tracking apps
              </InternalLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 5. Built for UK wealth ──────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>UK-first</SectionLabel>
            <h2>Built for UK wealth, not generic finance.</h2>
            <p className="section-copy">
              Paddock understands the way UK wealth is actually built: across tax wrappers,
              pensions, property, savings, investments and liabilities.
            </p>

            <ul className="wrapper-grid" aria-label="Account types Paddock supports">
              <li><strong>S&amp;S ISA</strong><span>Tax wrapper</span></li>
              <li><strong>Cash ISA</strong><span>Tax wrapper</span></li>
              <li><strong>Lifetime ISA</strong><span>Tax wrapper</span></li>
              <li><strong>GIA</strong><span>Investments</span></li>
              <li><strong>SIPP</strong><span>Pension</span></li>
              <li><strong>Workplace pension</strong><span>Pension</span></li>
              <li><strong>Premium Bonds</strong><span>NS&amp;I</span></li>
              <li><strong>Savings</strong><span>Cash</span></li>
              <li><strong>Property</strong><span>Asset</span></li>
              <li><strong>Mortgage</strong><span>Liability</span></li>
              <li><strong>Credit cards</strong><span>Liability</span></li>
              <li><strong>Other liabilities</strong><span>Liability</span></li>
            </ul>

            <div className="pill-links section-top-gap-sm">
              <InternalLink to="/track-isas-pensions-savings" navigateTo={navigateTo} className="pill-link">
                Track ISAs, pensions and savings together →
              </InternalLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-border">
        <div className="container section">
          <Reveal>
            <div className="contrast-block">
              <p>Not a budgeting app.</p>
              <p>Not a trading app.</p>
              <p>Not another bank-linking aggregator.</p>
              <h2>Paddock is a private wealth dashboard for people thinking long term.</h2>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 6. Founder note ─────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>From the founder</SectionLabel>
            <h2>Built because spreadsheets and bank-linking apps both felt wrong.</h2>

            <div className="founder-note">
              <p>
                I built Paddock because I wanted to really know my financial position — without
                handing my bank logins to a third party, and without babysitting a spreadsheet
                that broke a little more every month.
              </p>
              <p>
                Paddock is for long-term wealth, not daily spending noise. It tracks the things
                that actually decide your future: the ISA, the pensions collected across jobs,
                the house, the mortgage — and whether the whole picture is moving in the right
                direction.
              </p>
              <p>
                The philosophy is simple: calm, private, and yours. You enter the numbers. You
                own the data. We do the maths.
              </p>

              <p className="founder-sig">
                Martyn
                <span>Founder, Paddock</span>
              </p>

              <InternalLink
                to="/why-i-track-wealth-manually-instead-of-using-open-banking-apps"
                navigateTo={navigateTo}
                className="guide-inline-link"
              >
                Read the full founder note →
              </InternalLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. Pricing ──────────────────────────────────────────────────── */}
      <section id="pricing" className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Pricing</SectionLabel>
            <h2>Simple pricing. No hidden business model.</h2>
            <p className="section-copy">
              Paddock is paid because privacy has to be the product, not the promise. We do not
              sell your data, run ads, or make money from referrals. Start free — upgrade when
              you want to plan years ahead.
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
                Plan 5–40 years ahead, compare scenarios, and make clearer ISA, mortgage, and
                contribution decisions.
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

          <Reveal>
            <p className="pricing-trust">
              Unlike free finance apps, Paddock&apos;s business model is simple: you pay for the
              product, and your data stays yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 8. FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" className="section-border">
        <div className="container section">
          <Reveal>
            <SectionLabel>Questions</SectionLabel>
            <h2>Fair questions, honest answers.</h2>

            <div className="faq-list">
              {HOME_FAQS.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>

            <p className="faq-compliance">
              Paddock is a tracking and planning tool. It does not provide financial advice,
              investment recommendations, or guaranteed outcomes. Projections are illustrative
              and based on assumptions controlled by the user.
            </p>

            <div className="pill-links section-top-gap-sm">
              <InternalLink to="/tools" navigateTo={navigateTo} className="pill-link">
                Free UK planning tools
              </InternalLink>
              <InternalLink to="/guides" navigateTo={navigateTo} className="pill-link">
                Guides
              </InternalLink>
              <InternalLink to="/support" navigateTo={navigateTo} className="pill-link">
                Support
              </InternalLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 9. Final CTA ────────────────────────────────────────────────── */}
      <section className="section-border">
        <div className="container final-cta">
          <Reveal>
            <h2>Start with one account. Build the full picture.</h2>
            <p className="section-copy center narrow-center">
              Add your first balance in minutes and see your wealth, wrappers, pensions, property
              and progress in one private dashboard.
            </p>

            <div className="hero-actions center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => goTo('signup')}
                disabled={!!pending}
              >
                {pending === 'signup' ? 'Opening…' : 'Start free on the web'}
              </button>

              <a className="btn btn-secondary" href={APP_STORE_URL} target="_blank" rel="noreferrer">
                Download on the App Store
              </a>
            </div>

            <div className="final-qr">
              <img src={appStoreQr} alt="QR code linking to Paddock on the App Store" width="96" height="96" loading="lazy" />
              <span>On desktop? Scan with your iPhone to get the iOS app.</span>
            </div>

            <p className="hero-foot">No bank linking. No ads. No data selling. Manual entry, always.</p>
          </Reveal>
        </div>
      </section>

      <SiteFooter navigateTo={navigateTo} />
    </div>
  )
}
