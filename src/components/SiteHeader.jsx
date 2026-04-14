import React, { useState, useEffect } from 'react'
import ToolsDropdown from './ToolsDropdown'

const SIGNIN_URL = 'https://app.getpaddock.com/auth?mode=signin'
const SIGNUP_URL = 'https://app.getpaddock.com/auth?mode=signup'

/**
 * Shared sticky header for non-landing pages (tool pages, hub pages).
 *
 * The landing page has its own inline nav (with Product/Pricing scroll anchors)
 * so it does not use this component.
 *
 * Props:
 *   navigateTo — internal SPA navigation function
 *   goTo — external auth navigation function (optional: SiteHeader can stand alone)
 */
export default function SiteHeader({ navigateTo, goTo: parentGoTo }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [toolsMobileOpen, setToolsMobileOpen] = useState(false)
  const [pending, setPending] = useState(null)

  // Collapse mobile Tools when mobile menu closes
  useEffect(() => {
    if (!menuOpen) setToolsMobileOpen(false)
  }, [menuOpen])

  // Reset pending on back-navigation or focus return
  useEffect(() => {
    const reset = () => setPending(null)
    window.addEventListener('pageshow', reset)
    window.addEventListener('focus', reset)
    return () => {
      window.removeEventListener('pageshow', reset)
      window.removeEventListener('focus', reset)
    }
  }, [])

  function goTo(kind) {
    if (pending) return
    setPending(kind)
    // Delegate to parent handler if provided, otherwise navigate directly
    if (parentGoTo) {
      parentGoTo(kind)
    } else {
      window.setTimeout(() => {
        window.location.href = kind === 'signup' ? SIGNUP_URL : SIGNIN_URL
      }, 180)
    }
  }

  function go(path) {
    setMenuOpen(false)
    setToolsMobileOpen(false)
    navigateTo(path)
  }

  return (
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
          <ToolsDropdown navigateTo={navigateTo} />
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
            onClick={() => setMenuOpen((v) => !v)}
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
                      go('/tools/pension-drawdown-calculator')
                    }
                  }}
                >
                  Pension drawdown calculator
                </a>
                <a
                  href="/tools/fire-number-calculator"
                  className="mobile-tools-item"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault()
                      go('/tools/fire-number-calculator')
                    }
                  }}
                >
                  FIRE number calculator
                </a>
                <a
                  href="/tools"
                  className="mobile-tools-item"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault()
                      go('/tools')
                    }
                  }}
                >
                  View all tools
                </a>
              </div>
            )}
          </div>

          <button type="button" onClick={() => go('/guides')}>
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
  )
}
